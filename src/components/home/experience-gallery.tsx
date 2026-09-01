"use client";

import { Html, Line, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTheme } from "next-themes";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import info from "@/lib/info.json";

type Experience = (typeof info.experience)[number];

const EXPERIENCE: Experience[] = info.experience;
const COUNT = EXPERIENCE.length;

/** Curve/path tuning — a gentle serpentine the camera and panels both follow. */
const CURVE_FREQUENCY = 0.55;
const CURVE_AMPLITUDE = 3;
const DEPTH_SPACING = 11;
const SIDE_PUSH = 3.4;
const SIDE_ROTATION = 0.62;
const CAMERA_FOLLOW = 0.4;
const CAMERA_HEIGHT = 0.35;
const CAMERA_BACK = 6.2;
const LOOKAHEAD = 0.9;
const DAMP_LAMBDA = 3.4;
const PANEL_DISTANCE_FACTOR = 6.4;
/** Extra path length before panel 0 so the journey opens with it small and distant, approaching like every other panel. */
const LEAD_IN = 1.4;
const TOTAL_T = COUNT - 1 + LEAD_IN;

const PANEL_SCROLL_VH = 62;
const CONTAINER_HEIGHT_VH = 100 + TOTAL_T * PANEL_SCROLL_VH;

function centerline(t: number) {
  return {
    x: Math.sin(t * CURVE_FREQUENCY) * CURVE_AMPLITUDE,
    z: -t * DEPTH_SPACING,
  };
}

function panelPlacement(index: number) {
  const { x: cx, z } = centerline(index);
  const side = index % 2 === 0 ? 1 : -1;
  return {
    x: cx + side * SIDE_PUSH,
    z,
    baseRotationY:
      -side * SIDE_ROTATION - Math.cos(index * CURVE_FREQUENCY) * 0.18,
  };
}

function usePathPoints() {
  return useMemo(() => {
    const segments = Math.round(TOTAL_T * 14);
    const points: [number, number, number][] = [];
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * TOTAL_T - LEAD_IN;
      const p = centerline(t);
      points.push([p.x, -0.6, p.z + 0.6]);
    }
    return points;
  }, []);
}

/** Drives the camera along the path each frame, damped for cinematic inertia. */
function CameraRig({
  progress,
  activeRef,
}: {
  progress: MotionValue<number>;
  activeRef: React.MutableRefObject<number>;
}) {
  const smoothed = useRef(-LEAD_IN);

  useFrame((state, delta) => {
    const targetT = progress.get() * TOTAL_T - LEAD_IN;
    smoothed.current = THREE.MathUtils.damp(
      smoothed.current,
      targetT,
      DAMP_LAMBDA,
      delta,
    );
    activeRef.current = smoothed.current;

    const here = centerline(smoothed.current);
    const ahead = centerline(smoothed.current + LOOKAHEAD);

    state.camera.position.set(
      here.x * CAMERA_FOLLOW,
      CAMERA_HEIGHT,
      here.z + CAMERA_BACK,
    );
    state.camera.lookAt(ahead.x * CAMERA_FOLLOW, 0, ahead.z);
  });

  return null;
}

/** A small light traveling along the path, marking scroll progress in-scene. */
function TravelingOrb({
  activeRef,
}: {
  activeRef: React.MutableRefObject<number>;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!ref.current) return;
    const p = centerline(activeRef.current);
    ref.current.position.set(p.x, -0.55, p.z + 0.6);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color="#2857ff"
        emissive="#2857ff"
        emissiveIntensity={2.4}
        toneMapped={false}
      />
    </mesh>
  );
}

function Panel({
  index,
  experience,
  activeRef,
}: {
  index: number;
  experience: Experience;
  activeRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const { x, z, baseRotationY } = useMemo(() => panelPlacement(index), [index]);
  const isCurrentRole = experience.duration.toLowerCase().includes("present");

  useFrame(() => {
    const delta = index - activeRef.current;
    const absDelta = Math.abs(delta);
    const scale = THREE.MathUtils.clamp(1 - absDelta * 0.16, 0.45, 1.08);
    const rotationBlend = THREE.MathUtils.clamp(absDelta / 1.25, 0, 1);
    const forwardNudge = THREE.MathUtils.clamp(1 - absDelta, 0, 1) * 0.6;

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
      groupRef.current.rotation.y = baseRotationY * rotationBlend;
      groupRef.current.position.z = z + forwardNudge;
    }
    const focus = THREE.MathUtils.clamp(1 - absDelta * 0.85, 0, 1);
    if (detailRef.current) detailRef.current.style.opacity = String(focus);
    if (indicatorRef.current) {
      indicatorRef.current.style.opacity = String(
        THREE.MathUtils.clamp(1 - absDelta * 1.4, 0, 1),
      );
    }
  });

  return (
    <group ref={groupRef} position={[x, 0, z]}>
      <Html transform distanceFactor={PANEL_DISTANCE_FACTOR} center>
        <div className="relative w-[280px] overflow-hidden rounded-[1.75rem] border border-near-black/10 bg-white/95 p-6 shadow-[0_40px_90px_-40px_rgba(12,12,20,0.45)] backdrop-blur-md sm:w-[340px] sm:p-7 dark:border-white/10 dark:bg-near-black/85">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-5 -right-2 font-heading text-7xl font-black text-near-black/[0.05] select-none sm:text-8xl dark:text-white/[0.07]"
          >
            {String(index + 1).padStart(2, "0")}
          </span>

          <div className="relative flex items-center gap-2">
            {isCurrentRole && (
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
              </span>
            )}
            <span className="text-[10px] font-semibold tracking-widest text-near-black/40 uppercase dark:text-white/40">
              {experience.duration}
            </span>
          </div>

          <p className="relative mt-4 font-heading text-lg font-black text-near-black sm:text-2xl dark:text-white">
            {experience.company}
          </p>
          <p className="relative mt-1 font-serif text-cobalt italic">
            {experience.role}
          </p>

          <div ref={detailRef} className="relative mt-4" style={{ opacity: 0 }}>
            <p className="line-clamp-5 text-sm leading-relaxed text-near-black/60 dark:text-white/60">
              {experience.description}
            </p>
            <span
              ref={indicatorRef}
              style={{ opacity: 0 }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-cobalt/10 px-3 py-1 text-[10px] font-semibold tracking-widest text-cobalt uppercase"
            >
              <span className="size-1.5 rounded-full bg-cobalt" />
              Now viewing
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function GalleryPath({
  activeRef,
}: {
  activeRef: React.MutableRefObject<number>;
}) {
  const points = usePathPoints();
  return (
    <>
      <Line
        points={points}
        color="#2857ff"
        lineWidth={1.1}
        transparent
        opacity={0.28}
      />
      <TravelingOrb activeRef={activeRef} />
    </>
  );
}

function GalleryScene({ progress }: { progress: MotionValue<number> }) {
  const activeRef = useRef(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const fogColor = isDark ? "#0c0c14" : "#fbfaf6";
  const sparkleColor = isDark ? "#7d9dff" : "#2857ff";

  return (
    <>
      <fog attach="fog" args={[fogColor, 8, 32]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 5]} intensity={0.45} />
      <pointLight
        position={[0, 2, 3]}
        intensity={0.5}
        color="#2857ff"
        distance={14}
      />

      <Sparkles
        count={60}
        scale={[14, 5, COUNT * DEPTH_SPACING]}
        size={1.3}
        speed={0.15}
        opacity={0.3}
        color={sparkleColor}
        position={[0, 1.2, -(COUNT * DEPTH_SPACING) / 2]}
      />

      <CameraRig progress={progress} activeRef={activeRef} />
      <GalleryPath activeRef={activeRef} />

      {EXPERIENCE.map((experience, index) => (
        <Panel
          key={experience.company + experience.duration}
          index={index}
          experience={experience}
          activeRef={activeRef}
        />
      ))}
    </>
  );
}

export function ExperienceGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(
      COUNT - 1,
      Math.max(0, Math.round(value * (COUNT - 1))),
    );
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const headingOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const headingY = useTransform(scrollYProgress, [0, 0.06], [0, -20]);
  const progressWidth = useTransform(
    scrollYProgress,
    (value) => `${Math.min(Math.max(value, 0), 1) * 100}%`,
  );

  return (
    <section id="experience" className="relative bg-canvas dark:bg-near-black">
      <div
        ref={containerRef}
        style={{ height: `${CONTAINER_HEIGHT_VH}vh` }}
        className="relative"
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <Canvas
            dpr={[1, 1.75]}
            gl={{ alpha: true, antialias: true }}
            camera={{
              fov: 42,
              near: 0.1,
              far: 60,
              position: [0, CAMERA_HEIGHT, CAMERA_BACK],
            }}
          >
            <GalleryScene progress={scrollYProgress} />
          </Canvas>

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 lg:p-12">
            <motion.div style={{ opacity: headingOpacity, y: headingY }}>
              <p className="mb-4 text-xs font-semibold tracking-widest text-cobalt uppercase">
                Experience
              </p>
              <h2 className="font-heading text-[clamp(30px,5vw,56px)] leading-[1.05] font-black tracking-tight text-near-black dark:text-white">
                {COUNT} roles.{" "}
                <span className="font-serif text-cobalt italic">
                  One obsession.
                </span>
              </h2>
              <p className="mt-3 max-w-xs text-sm text-near-black/50 dark:text-white/50">
                Scroll to walk through the gallery.
              </p>
            </motion.div>

            <div className="flex items-end justify-between gap-6">
              <span className="text-xs font-semibold tracking-widest text-near-black/40 uppercase dark:text-white/40">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(COUNT).padStart(2, "0")}
              </span>
              <div className="h-1 max-w-40 flex-1 overflow-hidden rounded-full bg-near-black/10 dark:bg-white/10">
                <motion.div
                  className="h-full rounded-full bg-cobalt"
                  style={{ width: progressWidth }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
