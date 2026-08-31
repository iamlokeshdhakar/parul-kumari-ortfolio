"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { LightRays } from "@/components/ui/light-rays";

const EASE = [0.16, 1, 0.3, 1] as const;

const lineVariants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.9, ease: EASE } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/** Outer positioning layer: places a corner accent and tilts it, with pointer-driven parallax depth. */
function ParallaxLayer({
  mx,
  my,
  depthX,
  depthY,
  rotate = 0,
  className,
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  depthX: number;
  depthY: number;
  rotate?: number;
  className?: string;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  const springConfig = { stiffness: 60, damping: 16, mass: 0.4 };
  const x = useSpring(
    useTransform(mx, [-0.5, 0.5], [-depthX, depthX]),
    springConfig,
  );
  const y = useSpring(
    useTransform(my, [-0.5, 0.5], [-depthY, depthY]),
    springConfig,
  );

  return (
    <motion.div
      style={
        prefersReducedMotion
          ? { rotate: `${rotate}deg` }
          : { x, y, rotate: `${rotate}deg` }
      }
      className={`pointer-events-none absolute hidden select-none lg:block ${className ?? ""}`}
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}

/** Inner motion: a slow vertical bob. */
function Bob({
  duration,
  delay,
  children,
}: {
  duration: number;
  delay: number;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
      transition={
        prefersReducedMotion
          ? undefined
          : {
              duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay,
            }
      }
    >
      {children}
    </motion.div>
  );
}

/** Inner motion: continuous rotation, for purely abstract/decorative marks. */
function Spin({
  duration,
  reverse,
  children,
}: {
  duration: number;
  reverse?: boolean;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      animate={
        prefersReducedMotion ? undefined : { rotate: reverse ? -360 : 360 }
      }
      transition={
        prefersReducedMotion
          ? undefined
          : { duration, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
      }
    >
      {children}
    </motion.div>
  );
}

function SwatchCard() {
  return (
    <div className="rounded-2xl border border-near-black/10 bg-white px-3.5 py-3 shadow-[0_20px_45px_-20px_rgba(12,12,20,0.3)] dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center gap-2">
        <span className="size-4 rounded-full bg-cobalt" />
        <span className="size-4 rounded-full bg-near-black dark:bg-white" />
        <span className="size-4 rounded-full bg-[#f4b13f]" />
        <span className="size-4 rounded-full border border-near-black/10 dark:border-white/20" />
      </div>
      <p className="mt-2 text-[9px] font-semibold tracking-widest text-near-black/40 uppercase dark:text-white/40">
        Brand Palette
      </p>
    </div>
  );
}

function CursorChip() {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-near-black/10 bg-white px-3 py-2 shadow-[0_16px_40px_-20px_rgba(12,12,20,0.35)] dark:border-white/10 dark:bg-white/5">
      <svg
        width="13"
        height="13"
        viewBox="0 0 13 13"
        fill="none"
        aria-hidden="true"
      >
        <title>Cursor</title>
        <path
          d="M1.5 1L11 5.2L6.4 6.6L5 11.2L1.5 1Z"
          className="fill-near-black dark:fill-white"
        />
      </svg>
      <span className="text-[10px] font-semibold tracking-widest text-near-black/50 uppercase dark:text-white/50">
        click
      </span>
    </div>
  );
}

function DashedRing() {
  return (
    <svg
      width="140"
      height="140"
      viewBox="0 0 140 140"
      fill="none"
      aria-hidden="true"
    >
      <title>Decorative ring</title>
      <circle
        cx="70"
        cy="70"
        r="64"
        stroke="#2857ff"
        strokeOpacity="0.25"
        strokeWidth="1.5"
        strokeDasharray="4 8"
      />
    </svg>
  );
}

function Sparkle() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <title>Decorative sparkle</title>
      <path
        d="M14 0C14 8 20 14 28 14C20 14 14 20 14 28C14 20 8 14 0 14C8 14 14 8 14 0Z"
        fill="#2857ff"
      />
    </svg>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const handlePointerMove = (e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="home"
      onPointerMove={handlePointerMove}
      className="relative overflow-hidden bg-canvas pt-32 pb-24 lg:pt-44 lg:pb-32 dark:bg-near-black"
    >
      {!prefersReducedMotion && (
        <LightRays
          raysOrigin="top-center"
          raysColor="#2857ff"
          raysSpeed={1}
          lightSpread={0.9}
          rayLength={1.4}
          followMouse
          mouseInfluence={0.15}
          noiseAmount={0.04}
          distortion={0.03}
          className="z-0"
        />
      )}

      {/* Corner accents */}
      <ParallaxLayer
        mx={mx}
        my={my}
        depthX={10}
        depthY={8}
        className="top-[12%] left-[6%]"
      >
        <Spin duration={9}>
          <Sparkle />
        </Spin>
      </ParallaxLayer>
      <ParallaxLayer
        mx={mx}
        my={my}
        depthX={12}
        depthY={10}
        className="top-[14%] right-[7%]"
      >
        <Spin duration={22} reverse>
          <DashedRing />
        </Spin>
      </ParallaxLayer>
      <ParallaxLayer
        mx={mx}
        my={my}
        depthX={14}
        depthY={10}
        rotate={6}
        className="bottom-[18%] left-[9%]"
      >
        <Bob duration={4.6} delay={0.3}>
          <SwatchCard />
        </Bob>
      </ParallaxLayer>
      <ParallaxLayer
        mx={mx}
        my={my}
        depthX={16}
        depthY={12}
        rotate={-4}
        className="right-[8%] bottom-[16%]"
      >
        <Bob duration={4} delay={0.8}>
          <CursorChip />
        </Bob>
      </ParallaxLayer>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
          },
        }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center lg:px-8"
      >
        {/* Availability badge */}
        <motion.div
          variants={fadeUp}
          className="mb-10 inline-flex items-center gap-2 rounded-full border border-near-black/10 bg-white/70 px-4 py-1.5 backdrop-blur-sm dark:border-white/10 dark:bg-white/5"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold whitespace-nowrap text-near-black/70 dark:text-white/70">
            <span className="sm:hidden">Available for new projects</span>
            <span className="hidden sm:inline">
              Available for new projects — booking Q1 2027
            </span>
          </span>
        </motion.div>

        {/* Headline, with a giant faint echo word bleeding behind it */}
        <div className="relative flex flex-col items-center gap-1 lg:gap-2">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center"
          >
            <span className="font-heading text-[clamp(72px,24vw,380px)] leading-none font-black whitespace-nowrap text-transparent uppercase [-webkit-text-stroke:1.5px_rgba(12,12,20,0.06)] dark:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.08)]">
              Design
            </span>
          </span>

          <div className="relative z-10 overflow-hidden">
            <motion.h1
              variants={lineVariants}
              className="font-heading text-[clamp(52px,8.5vw,108px)] leading-none font-black tracking-tight text-near-black dark:text-white"
            >
              Designing
            </motion.h1>
          </div>

          <div className="relative z-10 overflow-hidden">
            <motion.h1
              variants={lineVariants}
              className="font-serif text-[clamp(52px,8.5vw,108px)] leading-none font-light text-cobalt italic tracking-tight"
            >
              Interfaces
            </motion.h1>
          </div>

          <div className="relative z-10 overflow-hidden">
            <motion.h1
              variants={lineVariants}
              className="font-heading text-[clamp(52px,8.5vw,108px)] leading-none font-black tracking-tight text-near-black dark:text-white"
            >
              People Love
            </motion.h1>
          </div>
        </div>

        {/* Subcopy */}
        <motion.p
          variants={fadeUp}
          className="mt-10 max-w-lg text-base leading-relaxed text-near-black/55 dark:text-white/55"
        >
          I&apos;m a UI/UX and graphic designer crafting interfaces and visual
          identities for ambitious product teams.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#contact"
            className="flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cobalt-dark"
          >
            Start a Project
            <svg
              width="13"
              height="13"
              viewBox="0 0 13 13"
              fill="none"
              aria-hidden="true"
            >
              <title>Arrow</title>
              <path
                d="M2 11L11 2M11 2H5M11 2V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="#projects"
            className="rounded-full border border-near-black/15 px-6 py-3 text-sm font-semibold text-near-black transition-colors hover:bg-near-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
          >
            See My Work
          </a>
        </motion.div>

        {/* Rotating circular badge */}
        <motion.div
          variants={fadeUp}
          className="relative pointer-events-none mt-14 select-none"
          style={{
            width: "clamp(90px,8vw,116px)",
            height: "clamp(90px,8vw,116px)",
          }}
          aria-hidden="true"
        >
          <svg className="size-full animate-badge-spin" viewBox="0 0 120 120">
            <title>Decorative rotating badge</title>
            <defs>
              <path
                id="badge-circle"
                d="M 60,60 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0"
              />
            </defs>
            <text
              fill="currentColor"
              className="text-near-black dark:text-white"
              style={{
                fontSize: "9.5px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                fontFamily: "var(--font-heading)",
              }}
            >
              <textPath href="#badge-circle">
                UI/UX DESIGN · GRAPHIC DESIGN · PARUL KUMARI ·
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl leading-none text-cobalt">✦</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
