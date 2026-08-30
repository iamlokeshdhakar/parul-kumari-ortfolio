"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import Image from "next/image";
import type { PointerEvent, ReactNode } from "react";

const GRAIN_TEXTURE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const FACTS = [
  {
    num: "01",
    title: "Education",
    desc: "Bachelor of Design (B.Des), National Institute of Fashion Technology — in progress.",
  },
  {
    num: "02",
    title: "Freelance",
    desc: "Working independently across multiple clients, from concept to final delivery.",
  },
  {
    num: "03",
    title: "Collaborations",
    desc: "Design Koktail, Simmi Foundation, and Bharat Tex — across graphic design, video editing, and visual merchandising.",
  },
];

const SKILLS = [
  { label: "UI/UX Design", rotate: -3 },
  { label: "Graphic Design", rotate: 2 },
  { label: "Video Editing", rotate: -2 },
  { label: "Visual Merchandising", rotate: 3 },
  { label: "Brand Identity", rotate: -1 },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function Bob({
  duration,
  children,
}: {
  duration: number;
  children: ReactNode;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.div
      animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
      transition={
        prefersReducedMotion
          ? undefined
          : { duration, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
      }
    >
      {children}
    </motion.div>
  );
}

function SignatureSquiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      preserveAspectRatio="none"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <title>Signature underline</title>
      <path
        d="M2 8C20 2 40 10 60 6C80 2 100 10 120 6C140 2 160 10 180 6C190 4 195 6 198 4"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      className={className}
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

/** Portrait card with a cursor-driven 3D tilt, an animated film-grain texture, and a cobalt duotone wash. */
function PhotoCard() {
  const prefersReducedMotion = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 150, damping: 15 });
  const rotateY = useSpring(ry, { stiffness: 150, damping: 15 });

  const handleTilt = (e: PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 16);
    rx.set(py * -16);
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="relative" style={{ perspective: 1200 }}>
      <motion.div
        onPointerMove={handleTilt}
        onPointerLeave={resetTilt}
        style={prefersReducedMotion ? undefined : { rotateX, rotateY }}
        className="relative aspect-3/4 w-[min(75vw,320px)] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-30px_rgba(12,12,20,0.35)] lg:w-105"
      >
        <Image
          src="/pp.png"
          alt="Parul Kumari"
          fill
          sizes="(min-width: 1024px) 420px, 75vw"
          className="object-contain"
        />

        {/* Cobalt duotone wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt/25 via-transparent to-near-black/50 mix-blend-multiply" />

        {/* Animated film-grain texture */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 mix-blend-overlay opacity-[0.18]"
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

        {/* Caption */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          <p className="font-heading text-base font-bold text-white">
            Parul Kumari
          </p>
          <p className="text-sm text-white/70">
            UI/UX Designer &amp; Visual Artist
          </p>
        </div>
      </motion.div>

      <Sparkle className="absolute -top-3 -right-3 size-6 lg:-top-4 lg:-right-4 lg:size-8" />
      <Bob duration={5}>
        <div className="absolute -bottom-3 -left-3 flex items-center gap-1.5 rounded-xl border border-near-black/10 bg-white px-2.5 py-2 shadow-lg lg:-bottom-5 lg:-left-5 lg:px-3.5 lg:py-2.5 dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-near-black/60 uppercase dark:text-white/60">
            Available for work
          </span>
        </div>
      </Bob>
    </div>
  );
}

function FactCard({
  num,
  title,
  desc,
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border border-near-black/10 bg-white p-6 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(12,12,20,0.25)] dark:border-white/10 dark:bg-white/5"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 -right-2 font-heading text-8xl font-black text-near-black/[0.04] select-none dark:text-white/[0.06]"
      >
        {num}
      </span>
      <p className="relative font-heading text-sm font-bold text-cobalt">
        {title}
      </p>
      <p className="relative mt-2 text-sm leading-relaxed text-near-black/55 dark:text-white/55">
        {desc}
      </p>
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28 dark:bg-near-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-15%" }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-start lg:gap-20">
            {/* Intro */}
            <div className="max-w-xl">
              <motion.p
                variants={fadeUp}
                className="mb-6 text-xs font-semibold tracking-widest text-cobalt uppercase"
              >
                About Me
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="font-heading text-[clamp(40px,6vw,72px)] leading-[0.95] font-black tracking-tight text-near-black dark:text-white"
              >
                Hi, I&apos;m
                <br />
                <span className="relative inline-block font-serif text-cobalt italic">
                  Parul Kumari
                  <SignatureSquiggle className="absolute -bottom-3 left-0 h-3 w-full text-cobalt/40" />
                </span>
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="relative mt-10 max-w-lg font-serif text-2xl leading-snug text-near-black/70 italic lg:text-[28px] dark:text-white/70"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-7 -left-4 font-heading text-6xl text-cobalt/15 not-italic select-none"
                >
                  &ldquo;
                </span>
                I love creating things that exist on the internet.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="mt-6 text-base leading-relaxed text-near-black/55 dark:text-white/55"
              >
                With a passion for detail and creativity, I specialize in
                crafting user-centered designs that deliver impactful visual
                solutions. I&apos;m currently working on exciting new projects,
                having previously collaborated with Design Koktail, Simmi
                Foundation, and Bharat Tex — across graphic design, video
                editing, and visual merchandising.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3"
              >
                {SKILLS.map(({ label, rotate }) => (
                  <motion.span
                    key={label}
                    style={{ rotate: `${rotate}deg` }}
                    whileHover={{ rotate: 0, scale: 1.06 }}
                    className="rounded-full border border-near-black/10 bg-white px-4 py-2 text-xs font-semibold text-near-black/60 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-white/60"
                  >
                    {label}
                  </motion.span>
                ))}
              </motion.div>

              <motion.a
                variants={fadeUp}
                href="#contact"
                className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cobalt"
              >
                Let&apos;s Work Together
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                >
                  <title>Arrow</title>
                  <path
                    d="M2 12L12 2M12 2H5M12 2V9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.a>
            </div>

            {/* Photo */}
            <motion.div variants={fadeUp} className="mx-auto shrink-0 lg:mx-0">
              <PhotoCard />
            </motion.div>
          </div>

          {/* Facts */}
          <div className="mt-20 grid gap-5 sm:grid-cols-3">
            {FACTS.map((fact) => (
              <FactCard key={fact.num} {...fact} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
