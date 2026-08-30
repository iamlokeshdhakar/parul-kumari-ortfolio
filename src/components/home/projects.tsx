"use client";

import {
  motion,
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

const CARD_WIDTH_VW = 68;
const GAP_VW = 4;
const SCROLL_PER_CARD_VH = 45;

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

function ProjectSlide({
  index,
  title,
  description,
  url,
  image,
  skills,
  widthVw,
  className,
}: {
  index: number;
  title: string;
  description: string;
  url: string;
  image: string;
  skills: string[];
  widthVw?: number;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={widthVw ? { width: `${widthVw}vw` } : undefined}
      className={cn(
        "group relative flex h-[68vh] shrink-0 flex-col justify-end overflow-hidden rounded-3xl border border-near-black/10 bg-near-black shadow-[0_30px_80px_-30px_rgba(12,12,20,0.5)]",
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

      <span className="absolute top-6 right-6 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <ArrowIcon />
      </span>
    </a>
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

function PinnedFilmstrip() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

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
        <div className="flex h-full items-center">
          <motion.div className="flex gap-[4vw] pl-[6vw]" style={{ x }}>
            {PROJECTS.map((project, index) => (
              <ProjectSlide
                key={project.url}
                index={index}
                {...project}
                widthVw={CARD_WIDTH_VW}
              />
            ))}
          </motion.div>
        </div>

        <div
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2"
          aria-hidden="true"
        >
          {PROJECTS.map((project, index) => (
            <span
              key={project.url}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                active === index
                  ? "w-6 bg-cobalt"
                  : "w-1.5 bg-near-black/15 dark:bg-white/20",
              )}
            />
          ))}
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
