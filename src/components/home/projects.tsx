"use client";

import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import info from "@/lib/info.json";
import { cn } from "@/lib/utils";

const PROJECTS = info.projects;

const CARD_WIDTH_VW = 66;
const GAP_VW = 5;
const SCROLL_PER_CARD_VH = 48;

const GRAIN_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function hostnameOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <title>Open project</title>
      <path
        d="M2 14L14 2M14 2H6M14 2V10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Cursor-reactive tilt + spotlight, shared by the pinned filmstrip cards.
 * Disabled entirely for touch input and reduced-motion so it never fights
 * native scrolling or fires for pointers that can't hover.
 */
function useCardPointerEffects(enabled: boolean) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 24, mass: 0.4 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);

  const rotateX = useTransform(sy, [0, 1], [7, -7]);
  const rotateY = useTransform(sx, [0, 1], [-8, 8]);
  const xPercent = useTransform(sx, (v) => v * 100);
  const yPercent = useTransform(sy, (v) => v * 100);
  const spotlight = useMotionTemplate`radial-gradient(480px circle at ${xPercent}% ${yPercent}%, rgba(255,255,255,0.14), transparent 65%)`;
  const pillLeft = useMotionTemplate`${xPercent}%`;
  const pillTop = useMotionTemplate`${yPercent}%`;

  function onPointerMove(e: React.PointerEvent<HTMLElement>) {
    if (!enabled || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return {
    rotateX,
    rotateY,
    spotlight,
    pillLeft,
    pillTop,
    onPointerMove,
    onPointerLeave,
  };
}

function ProjectSlide({
  index,
  title,
  description,
  url,
  image,
  skills,
  widthVw,
  className,
  activeIndex,
  hovered,
  onHoverChange,
  showCornerIcon = true,
  enableDepthFx = false,
}: {
  index: number;
  title: string;
  description: string;
  url: string;
  image: string;
  skills: string[];
  widthVw?: number;
  className?: string;
  activeIndex?: MotionValue<number>;
  hovered?: boolean;
  onHoverChange?: (hovered: boolean) => void;
  showCornerIcon?: boolean;
  enableDepthFx?: boolean;
}) {
  const prefersReducedMotion = useReducedMotion();
  const fx = useCardPointerEffects(!!enableDepthFx && !prefersReducedMotion);

  // Hooks must run unconditionally: fall back to a static motion value
  // (distance always 0) when this slide isn't part of the depth-effect track.
  const fallbackActive = useMotionValue(index);
  const distance = useTransform(activeIndex ?? fallbackActive, (v) =>
    Math.abs(v - index),
  );
  const depthScale = useTransform(distance, [0, 1, 2], [1, 0.91, 0.84]);
  const depthOpacity = useTransform(distance, [0, 1, 2], [1, 0.55, 0.32]);
  const depthBlur = useTransform(distance, [0, 1, 2], [0, 1.5, 3.5]);
  const depthFilter = useMotionTemplate`blur(${depthBlur}px)`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        ...(widthVw ? { width: `${widthVw}vw` } : undefined),
        ...(enableDepthFx
          ? {
              scale: depthScale,
              opacity: depthOpacity,
              filter: depthFilter,
              rotateX: fx.rotateX,
              rotateY: fx.rotateY,
              transformPerspective: 1400,
            }
          : undefined),
      }}
      whileTap={enableDepthFx ? undefined : { scale: 0.97 }}
      onPointerMove={enableDepthFx ? fx.onPointerMove : undefined}
      onPointerLeave={
        enableDepthFx
          ? () => {
              fx.onPointerLeave();
              onHoverChange?.(false);
            }
          : undefined
      }
      onPointerEnter={enableDepthFx ? () => onHoverChange?.(true) : undefined}
      className={cn(
        "group relative flex h-[68vh] shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-near-black/10 bg-near-black shadow-[0_30px_80px_-30px_rgba(12,12,20,0.5)] will-change-transform",
        className,
      )}
    >
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          sizes="70vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-9xl font-black text-white/5 select-none">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 mix-blend-overlay opacity-10"
            style={{
              backgroundImage: GRAIN_TEXTURE,
              backgroundSize: "200px 200px",
            }}
            animate={
              prefersReducedMotion
                ? undefined
                : { backgroundPosition: ["0px 0px", "60px 40px"] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : {
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: "mirror",
                    ease: "linear",
                  }
            }
          />
        </>
      )}

      {enableDepthFx && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ backgroundImage: fx.spotlight }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      <div className="relative z-10 p-8 sm:p-10">
        <span className="text-xs font-semibold tracking-widest text-white/50 uppercase">
          {String(index + 1).padStart(2, "0")} · {hostnameOf(url)}
        </span>
        <p className="mt-2 max-w-lg font-heading text-2xl font-black text-white sm:text-3xl">
          {title}
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/65">
          {description}
        </p>
        {skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/20 px-3 py-1 text-[10px] font-semibold tracking-widest text-white/70 uppercase"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {showCornerIcon && (
        <span className="absolute top-6 right-6 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowIcon />
        </span>
      )}

      {enableDepthFx && (
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25, ease: EASE }}
              style={{ left: fx.pillLeft, top: fx.pillTop }}
              className="pointer-events-none absolute z-20 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[11px] font-semibold tracking-wide text-near-black uppercase shadow-lg"
            >
              View project
              <ArrowIcon />
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </motion.a>
  );
}

function ProjectsFallbackRow() {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
      {PROJECTS.map((project, index) => (
        <ProjectSlide
          key={project.url}
          index={index}
          {...project}
          className="w-[85vw] snap-center sm:w-[420px]"
        />
      ))}
    </div>
  );
}

function TrackReadout({
  active,
  scrollYProgress,
}: {
  active: number;
  scrollYProgress: MotionValue<number>;
}) {
  const progressWidth = useTransform(
    scrollYProgress,
    (value) => `${Math.min(Math.max(value, 0), 1) * 100}%`,
  );
  const project = PROJECTS[active];

  return (
    <div className="mx-auto flex max-w-7xl items-end justify-between gap-8 px-6 lg:px-8">
      <div className="flex items-end gap-4 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={active}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="font-heading text-4xl leading-none font-black text-near-black sm:text-5xl dark:text-white"
          >
            {String(active + 1).padStart(2, "0")}
          </motion.span>
        </AnimatePresence>
        <span className="mb-1 text-xs font-semibold text-near-black/30 dark:text-white/30">
          / {String(PROJECTS.length).padStart(2, "0")}
        </span>
        <span className="mb-1.5 hidden h-4 w-px bg-near-black/15 sm:block dark:bg-white/15" />
        <div className="mb-1 hidden overflow-hidden sm:block">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={active}
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="block max-w-xs truncate font-serif text-lg text-cobalt italic"
            >
              {project.title}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="mb-2.5 h-1 w-full max-w-56 flex-1 overflow-hidden rounded-full bg-near-black/10 dark:bg-white/10">
        <motion.div
          className="h-full rounded-full bg-cobalt"
          style={{ width: progressWidth }}
        />
      </div>
    </div>
  );
}

function PinnedFilmstrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const trackWidthVw =
    PROJECTS.length * CARD_WIDTH_VW + (PROJECTS.length - 1) * GAP_VW;
  const maxTranslateVw = -(trackWidthVw - 100);
  const rawX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `${maxTranslateVw}vw`],
  );
  const x = useSpring(rawX, { stiffness: 300, damping: 40, mass: 0.4 });
  const activeIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, PROJECTS.length - 1],
  );

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useEffect(() => {
    const unsubscribe = activeIndex.on("change", (v) =>
      setActive(Math.round(v)),
    );
    return unsubscribe;
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className="relative hidden lg:block"
      style={{
        height: `${100 + (PROJECTS.length - 1) * SCROLL_PER_CARD_VH}vh`,
      }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.span
          style={{ opacity: hintOpacity }}
          className="pointer-events-none absolute top-8 left-1/2 z-10 -translate-x-1/2 text-xs font-semibold tracking-widest text-near-black/35 uppercase dark:text-white/35"
        >
          Scroll to explore →
        </motion.span>

        <div className="flex h-full items-center [perspective:1600px]">
          <motion.div className="flex gap-[5vw] pl-[6vw]" style={{ x }}>
            {PROJECTS.map((project, index) => (
              <ProjectSlide
                key={project.url}
                index={index}
                {...project}
                widthVw={CARD_WIDTH_VW}
                activeIndex={activeIndex}
                enableDepthFx
                showCornerIcon={false}
                hovered={hoveredIndex === index}
                onHoverChange={(isHovered) =>
                  setHoveredIndex(isHovered ? index : null)
                }
              />
            ))}
          </motion.div>
        </div>

        <div className="absolute right-0 bottom-8 left-0">
          <TrackReadout active={active} scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      id="projects"
      className="bg-white py-20 lg:py-28 dark:bg-near-black"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-6 text-xs font-semibold tracking-widest text-cobalt uppercase"
          >
            Selected Work
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="max-w-3xl font-heading text-[clamp(36px,5.5vw,64px)] leading-[1.05] font-black tracking-tight text-near-black dark:text-white"
          >
            {PROJECTS.length} projects, from concept to{" "}
            <span className="font-serif text-cobalt italic">launch.</span>
          </motion.h2>
        </motion.div>
      </div>

      {prefersReducedMotion ? (
        <div className="mt-14 px-6 lg:px-8">
          <ProjectsFallbackRow />
        </div>
      ) : (
        <>
          <div className="mt-14">
            <PinnedFilmstrip />
          </div>
          <div className="mt-14 px-6 lg:hidden">
            <ProjectsFallbackRow />
          </div>
        </>
      )}
    </section>
  );
}
