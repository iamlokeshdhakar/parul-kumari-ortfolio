"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import info from "@/lib/info.json";

const ExperienceGallery = dynamic(
  () => import("./experience-gallery").then((mod) => mod.ExperienceGallery),
  { ssr: false },
);

type Experience = (typeof info.experience)[number];

const EXPERIENCE: Experience[] = info.experience;

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

class GalleryErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

function ExperienceCard({
  index,
  experience,
  className,
}: {
  index: number;
  experience: Experience;
  className?: string;
}) {
  const isCurrentRole = experience.duration.toLowerCase().includes("present");

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-near-black/10 bg-white p-7 dark:border-white/10 dark:bg-white/5 ${className ?? ""}`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -right-2 font-heading text-9xl font-black text-near-black/[0.04] select-none dark:text-white/[0.06]"
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
      <p className="relative mt-4 font-heading text-xl font-black text-near-black dark:text-white">
        {experience.company}
      </p>
      <p className="relative mt-1 text-sm font-semibold text-cobalt">
        {experience.role}
      </p>
      <p className="relative mt-4 text-sm leading-relaxed text-near-black/55 dark:text-white/55">
        {experience.description}
      </p>
    </div>
  );
}

function SectionHeading() {
  return (
    <>
      <p className="mb-6 text-xs font-semibold tracking-widest text-cobalt uppercase">
        Experience
      </p>
      <h2 className="font-heading text-[clamp(36px,5.5vw,64px)] leading-[1.05] font-black tracking-tight text-near-black dark:text-white">
        {EXPERIENCE.length} roles.{" "}
        <span className="font-serif text-cobalt italic">One obsession.</span>
      </h2>
    </>
  );
}

function StaticExperienceList() {
  return (
    <section
      id="experience"
      className="bg-canvas py-20 lg:py-28 dark:bg-near-black"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <SectionHeading />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCE.map((exp, index) => (
            <ExperienceCard key={exp.company} index={index} experience={exp} />
          ))}
        </div>
      </div>
    </section>
  );
}

/** Mobile fallback: the 3D camera-journey doesn't translate to touch scroll, so this is a
 * horizontal snap-scroll row instead — swipe through roles rather than fly past them. */
function MobileExperienceRow() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollXProgress } = useScroll({ container: rowRef });

  useMotionValueEvent(scrollXProgress, "change", (value) => {
    const next = Math.min(
      EXPERIENCE.length - 1,
      Math.max(0, Math.round(value * (EXPERIENCE.length - 1))),
    );
    setActiveIndex((prev) => (prev === next ? prev : next));
  });

  const progressWidth = useTransform(
    scrollXProgress,
    (value) => `${Math.min(Math.max(value, 0), 1) * 100}%`,
  );

  return (
    <section
      id="experience"
      className="bg-canvas py-20 lg:py-28 dark:bg-near-black"
    >
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-15%" }}
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <div className="px-6">
          <motion.div variants={fadeUp}>
            <SectionHeading />
          </motion.div>
          <motion.p
            variants={fadeUp}
            className="mt-3 text-xs font-semibold tracking-widest text-near-black/35 uppercase dark:text-white/35"
          >
            Swipe to explore
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          ref={rowRef}
          className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {EXPERIENCE.map((exp, index) => (
            <ExperienceCard
              key={exp.company}
              index={index}
              experience={exp}
              className="w-[82%] shrink-0 snap-center sm:w-[60%]"
            />
          ))}
        </motion.div>

        <div className="mt-2 flex items-center gap-4 px-6">
          <span className="text-xs font-semibold tracking-widest text-near-black/40 uppercase dark:text-white/40">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(EXPERIENCE.length).padStart(2, "0")}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-near-black/10 dark:bg-white/10">
            <motion.div
              className="h-full rounded-full bg-cobalt"
              style={{ width: progressWidth }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export function Experience() {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  if (prefersReducedMotion) {
    return <StaticExperienceList />;
  }

  if (isMobile === null) {
    return <section id="experience" className="bg-canvas dark:bg-near-black" />;
  }

  if (isMobile) {
    return <MobileExperienceRow />;
  }

  return (
    <GalleryErrorBoundary fallback={<StaticExperienceList />}>
      <ExperienceGallery />
    </GalleryErrorBoundary>
  );
}
