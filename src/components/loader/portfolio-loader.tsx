"use client";

import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

// Timeline (ms), tuned to land within a ~2.5s cinematic window.
const MARK_DELAY = 100;
const RING_DELAY = 150;
const LABEL_START = 350;
const LABEL_STAGGER = 90;
const PROGRESS_START = 550;
const PROGRESS_DURATION = 1250; // ends 1800
const SHUTTER_START = 1850;
const SHUTTER_DURATION = 500; // ends 2350
const FADE_OUT_START = SHUTTER_START + SHUTTER_DURATION; // 2350
const FADE_OUT_DURATION = 200; // ends 2550
const TOTAL_MS = FADE_OUT_START + FADE_OUT_DURATION + 50; // small safety buffer

const REDUCED_TOTAL_MS = 650;

const GRAIN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
  </filter>
  <rect width="100%" height="100%" filter="url(#n)" />
</svg>`;
const GRAIN_URL = `data:image/svg+xml,${encodeURIComponent(GRAIN_SVG)}`;

const EDITORIAL_LABELS = [
  { text: "CREATIVE DESIGN", className: "top-0 left-0" },
  { text: "UI / UX", className: "top-0 right-0 text-right" },
  { text: "GRAPHIC DESIGN", className: "bottom-0 left-0" },
  { text: "SELECTED WORK · 2026", className: "bottom-0 right-0 text-right" },
];

const ORBIT_RINGS = [
  {
    key: "inner",
    size: 200,
    tilt: 55,
    duration: 22,
    opacity: 0.35,
    dash: "3 9",
    reverse: false,
  },
  {
    key: "outer",
    size: 264,
    tilt: -50,
    duration: 34,
    opacity: 0.16,
    dash: "1 7",
    reverse: true,
  },
] as const;

const FLOATING_SHAPES = [
  {
    key: "square",
    className: "top-16 left-16",
    from: { x: -60, y: -50, rotate: -30, rotateY: 70 },
    node: (
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
      >
        <title>Decorative square</title>
        <rect
          x="4"
          y="4"
          width="22"
          height="22"
          stroke="#2857ff"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    key: "circle",
    className: "bottom-16 right-20",
    from: { x: 70, y: 50, rotate: 20, rotateY: -70 },
    node: (
      <svg
        width="26"
        height="26"
        viewBox="0 0 26 26"
        fill="none"
        aria-hidden="true"
      >
        <title>Decorative circle</title>
        <circle
          cx="13"
          cy="13"
          r="10"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    key: "triangle",
    className: "top-20 right-12",
    from: { x: 60, y: -40, rotate: 25, rotateY: 60 },
    node: (
      <svg
        width="28"
        height="26"
        viewBox="0 0 28 26"
        fill="none"
        aria-hidden="true"
      >
        <title>Decorative triangle</title>
        <path
          d="M14 2L26 24H2L14 2Z"
          stroke="#2857ff"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
] as const;

const SHARD_COUNT = 12;
const SHARD_ANGLES = Array.from(
  { length: SHARD_COUNT },
  (_, i) => (360 / SHARD_COUNT) * i,
);

function Grain() {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
      style={{
        backgroundImage: `url("${GRAIN_URL}")`,
        backgroundSize: "180px 180px",
      }}
      animate={{ backgroundPosition: ["0px 0px", "180px 120px"] }}
      transition={{
        duration: 8,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
      }}
    />
  );
}

/** Gives the whole construction stack real 3D perspective and a gentle pointer-driven tilt. */
function FrameTilt({ children }: { children: ReactNode }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springConfig = { stiffness: 60, damping: 14 };
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), springConfig);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <div
      className="relative flex h-[min(70vh,560px)] w-[min(90vw,680px)] items-center justify-center"
      style={{ perspective: 1200 }}
      onPointerMove={handlePointerMove}
    >
      <motion.div
        className="relative flex h-full w-full items-center justify-center"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Two tilted, counter-rotating rings orbiting the mark, like a saturn-ring build-out. */
function OrbitRings() {
  return (
    <>
      {ORBIT_RINGS.map((ring, i) => (
        <motion.div
          key={ring.key}
          className="pointer-events-none absolute"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: ring.opacity, scale: 1 }}
          transition={{
            duration: 0.7,
            delay: (RING_DELAY + i * 100) / 1000,
            ease: EASE,
          }}
        >
          <motion.svg
            width={ring.size}
            height={ring.size}
            viewBox={`0 0 ${ring.size} ${ring.size}`}
            fill="none"
            style={{ rotateX: `${ring.tilt}deg` }}
            initial={{ rotateZ: 0 }}
            animate={{ rotateZ: ring.reverse ? -360 : 360 }}
            transition={{
              duration: ring.duration,
              delay: (RING_DELAY + i * 100) / 1000,
              ease: "linear",
              repeat: Number.POSITIVE_INFINITY,
            }}
          >
            <title>Orbit ring</title>
            <circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.size / 2 - 4}
              stroke="#2857ff"
              strokeWidth="1"
              strokeDasharray={ring.dash}
            />
          </motion.svg>
        </motion.div>
      ))}
    </>
  );
}

/** Small geometric shapes flying in from off-screen with spring physics, as if assembling the design. */
function FloatingShapes() {
  return (
    <>
      {FLOATING_SHAPES.map((shape, i) => (
        <motion.div
          key={shape.key}
          className={`pointer-events-none absolute hidden md:block ${shape.className}`}
          style={{ transformPerspective: 700 }}
          initial={{ opacity: 0, ...shape.from }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, rotateY: 0 }}
          transition={{
            type: "spring",
            stiffness: 90,
            damping: 15,
            delay: (LABEL_START + i * 70) / 1000,
          }}
        >
          {shape.node}
        </motion.div>
      ))}
    </>
  );
}

function CornerMarks() {
  const positions = [
    "top-4 left-4",
    "top-4 right-4",
    "bottom-4 left-4",
    "bottom-4 right-4",
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <motion.svg
          // biome-ignore lint/suspicious/noArrayIndexKey: static, never reordered
          key={i}
          aria-hidden="true"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className={`pointer-events-none absolute hidden md:block ${pos}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: (RING_DELAY + i * 60) / 1000,
            ease: EASE,
          }}
        >
          <title>Registration mark</title>
          <path
            d="M7 0V14M0 7H14"
            stroke="white"
            strokeOpacity="0.3"
            strokeWidth="1"
          />
        </motion.svg>
      ))}
    </>
  );
}

function EditorialLabels() {
  return (
    <>
      {EDITORIAL_LABELS.map((label, i) => (
        <div
          key={label.text}
          className={`absolute hidden overflow-hidden md:block ${label.className}`}
        >
          <motion.span
            className="block text-[10px] font-semibold tracking-[0.2em] text-white/40 uppercase"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.6,
              delay: (LABEL_START + i * LABEL_STAGGER) / 1000,
              ease: EASE,
            }}
          >
            {label.text}
          </motion.span>
        </div>
      ))}
    </>
  );
}

/** The PK mark flips open in 3D like a card, driven by spring physics rather than a plain fade. */
function CenterMark() {
  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      style={{ transformPerspective: 900 }}
      initial={{ opacity: 0, rotateX: -70, y: 16 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 15,
        delay: MARK_DELAY / 1000,
      }}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-[0_20px_60px_-20px_rgba(40,87,255,0.4)]">
        <span className="font-heading text-2xl font-bold text-near-black">
          PK
        </span>
      </div>
      <span className="mt-3 text-[10px] font-semibold tracking-[0.3em] text-white/50 uppercase">
        Parul Kumari
      </span>
    </motion.div>
  );
}

function ProgressLine() {
  const count = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(count, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  useEffect(() => {
    const controls = animate(count, 100, {
      duration: PROGRESS_DURATION / 1000,
      delay: PROGRESS_START / 1000,
      ease: EASE,
    });
    return () => controls.stop();
  }, [count]);

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="h-px w-48 overflow-hidden bg-white/10 sm:w-56">
        <motion.div
          className="h-full bg-cobalt"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{
            duration: PROGRESS_DURATION / 1000,
            delay: PROGRESS_START / 1000,
            ease: EASE,
          }}
        />
      </div>
      <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-white/40 tabular-nums">
        <span>01</span>
        <span className="text-white/20">—</span>
        <span className="text-cobalt">{String(display).padStart(2, "0")}</span>
        <span className="text-white/20">/</span>
        <span>100</span>
      </div>
    </div>
  );
}

/** The reveal: a dozen cobalt shards burst outward from the mark's center, well past the viewport edge. */
function ShatterBurst() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {SHARD_ANGLES.map((angle, i) => (
        <motion.div
          key={angle}
          className="absolute top-1/2 left-1/2 h-[80vmax] w-[60vmax] origin-top bg-cobalt"
          style={{
            clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
            rotate: `${angle}deg`,
            x: "-50%",
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: SHUTTER_DURATION / 1000,
            delay: (SHUTTER_START + (i % 3) * 20) / 1000,
            ease: EASE,
          }}
        />
      ))}
    </div>
  );
}

function FullLoader() {
  return (
    // biome-ignore lint/a11y/useSemanticElements: <output> is for calculation results, not a full-screen status overlay
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-near-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{
        duration: FADE_OUT_DURATION / 1000,
        delay: FADE_OUT_START / 1000,
        ease: EASE,
      }}
    >
      <span className="sr-only">Loading…</span>
      <Grain />
      <FrameTilt>
        <CornerMarks />
        <EditorialLabels />
        <OrbitRings />
        <FloatingShapes />
        <div
          className="relative z-10 flex flex-col items-center"
          style={{ transform: "translateZ(40px)" }}
        >
          <CenterMark />
          <ProgressLine />
        </div>
      </FrameTilt>
      <ShatterBurst />
    </motion.div>
  );
}

function ReducedLoader() {
  return (
    // biome-ignore lint/a11y/useSemanticElements: <output> is for calculation results, not a full-screen status overlay
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-near-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        duration: REDUCED_TOTAL_MS / 1000,
        times: [0, 0.25, 0.7, 1],
        ease: "easeInOut",
      }}
    >
      <span className="sr-only">Loading…</span>
      <div className="flex size-16 items-center justify-center rounded-2xl bg-white">
        <span className="font-heading text-2xl font-bold text-near-black">
          PK
        </span>
      </div>
    </motion.div>
  );
}

export function PortfolioLoader({ children }: { children: ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const duration = prefersReducedMotion ? REDUCED_TOTAL_MS : TOTAL_MS;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
    }, duration);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <div className="contents" inert={visible || undefined}>
        {children}
      </div>
      {visible && (prefersReducedMotion ? <ReducedLoader /> : <FullLoader />)}
    </>
  );
}
