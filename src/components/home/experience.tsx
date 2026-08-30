"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import info from "@/lib/info.json";

const EXPERIENCE = info.experience;

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function ExperienceCard({
  index,
  company,
  role,
  duration,
  description,
}: {
  index: number;
  company: string;
  role: string;
  duration: string;
  description: string;
}) {
  const isCurrent = duration.toLowerCase().includes("present");

  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group relative flex h-full min-h-80 flex-col overflow-hidden rounded-2xl border border-near-black/10 bg-white p-7 transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(12,12,20,0.25)] dark:border-white/10 dark:bg-white/5"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 -right-2 font-heading text-9xl font-black text-near-black/[0.04] select-none dark:text-white/[0.06]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative flex items-center gap-2">
        {isCurrent && (
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
          </span>
        )}
        <span className="text-[10px] font-semibold tracking-widest text-near-black/40 uppercase dark:text-white/40">
          {duration}
        </span>
      </div>

      <p className="relative mt-4 font-heading text-xl font-black text-near-black dark:text-white">
        {company}
      </p>
      <p className="relative mt-1 text-sm font-semibold text-cobalt">{role}</p>
      <p className="relative mt-4 line-clamp-5 text-sm leading-relaxed text-near-black/55 dark:text-white/55">
        {description}
      </p>
    </motion.div>
  );
}

export function Experience() {
  const [api, setApi] = useState<CarouselApi>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onScroll = () => setProgress(api.scrollProgress());
    onScroll();
    api.on("scroll", onScroll);
    api.on("reInit", onScroll);
    return () => {
      api.off("scroll", onScroll);
      api.off("reInit", onScroll);
    };
  }, [api]);

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
        <Carousel setApi={setApi} opts={{ align: "start", dragFree: true }}>
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <motion.p
                  variants={fadeUp}
                  className="mb-6 text-xs font-semibold tracking-widest text-cobalt uppercase"
                >
                  Experience
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="font-heading text-[clamp(36px,5.5vw,64px)] leading-[1.05] font-black tracking-tight text-near-black dark:text-white"
                >
                  {EXPERIENCE.length} roles.{" "}
                  <span className="font-serif text-cobalt italic">
                    One obsession.
                  </span>
                </motion.h2>
              </div>

              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <span className="hidden text-xs font-semibold tracking-widest text-near-black/35 uppercase sm:inline dark:text-white/35">
                  Drag or use arrows
                </span>
                <div className="flex items-center gap-2">
                  <CarouselPrevious className="static translate-x-0 translate-y-0" />
                  <CarouselNext className="static translate-x-0 translate-y-0" />
                </div>
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            className="mx-auto mt-12 max-w-7xl px-6 lg:px-8"
          >
            <CarouselContent className="-ml-6">
              {EXPERIENCE.map((exp, index) => (
                <CarouselItem
                  key={exp.company}
                  className="basis-[85%] pl-6 sm:basis-[60%] lg:basis-[38%]"
                >
                  <ExperienceCard index={index} {...exp} />
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-near-black/10 dark:bg-white/10">
              <motion.div
                className="h-full rounded-full bg-cobalt"
                style={{
                  width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
                }}
              />
            </div>
          </motion.div>
        </Carousel>
      </motion.div>
    </section>
  );
}
