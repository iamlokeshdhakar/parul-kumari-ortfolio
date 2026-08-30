"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import info from "@/lib/info.json";
import { Magnetic } from "./magnetic";

const SKILLS = info.skills;

const ABBR: Record<string, string> = {
  Figma: "Fi",
  "Adobe Illustrator": "Ai",
  "Adobe XD": "Xd",
  "Adobe After Effects": "Ae",
  "Adobe Premiere Pro": "Pr",
  "Adobe InDesign": "Id",
  AutoCAD: "Cd",
  "Autodesk Maya": "Ma",
};

const DURATIONS = [4, 4.6, 5.2, 4.2, 5, 4.8, 4.4, 5.4];

const EASE = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

function SkillChip({
  name,
  image,
  duration,
  delay,
}: {
  name: string;
  image: string;
  duration: number;
  delay: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const abbr = ABBR[name] ?? name.slice(0, 2);

  return (
    <motion.div variants={fadeUp}>
      <Magnetic strength={0.4}>
        <motion.div
          animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
          whileHover={{ scale: 1.05 }}
          transition={
            prefersReducedMotion
              ? { type: "spring", stiffness: 300, damping: 20 }
              : {
                  duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay,
                }
          }
          className="flex cursor-default items-center gap-3 rounded-full border border-near-black/10 bg-white py-2.5 pr-5 pl-2.5 shadow-[0_15px_35px_-18px_rgba(12,12,20,0.3)] dark:border-white/10 dark:bg-white/5"
        >
          <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-cobalt/10">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                sizes="36px"
                className="object-contain p-1.5"
              />
            ) : (
              <span className="text-xs font-bold text-cobalt">{abbr}</span>
            )}
          </span>
          <span className="text-sm font-semibold whitespace-nowrap text-near-black dark:text-white">
            {name}
          </span>
        </motion.div>
      </Magnetic>
    </motion.div>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      className="bg-canvas py-20 lg:py-28 dark:bg-near-black"
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
            Skills
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="max-w-2xl font-heading text-[clamp(36px,5.5vw,64px)] leading-[1.05] font-black tracking-tight text-near-black dark:text-white"
          >
            The toolkit behind{" "}
            <span className="font-serif text-cobalt italic">
              every project.
            </span>
          </motion.h2>

          <motion.div
            variants={{
              visible: {
                transition: { staggerChildren: 0.06, delayChildren: 0.2 },
              },
            }}
            className="mt-16 flex flex-wrap items-center justify-center gap-4 lg:gap-5"
          >
            {SKILLS.map((skill, index) => (
              <SkillChip
                key={skill.name}
                name={skill.name}
                image={skill.image}
                duration={DURATIONS[index % DURATIONS.length]}
                delay={index * 0.15}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
