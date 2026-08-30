"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import info from "@/lib/info.json";
import { Magnetic } from "./magnetic";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
];

const SOCIALS = [
  {
    label: "Instagram",
    href: info.contact.instagram,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="1.5"
          y="1.5"
          width="13"
          height="13"
          rx="3.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="11.5" cy="4.5" r="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Behance",
    href: info.contact.behance,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="1.5"
          y="1.5"
          width="13"
          height="13"
          rx="3.5"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <text
          x="8"
          y="10.8"
          textAnchor="middle"
          fontSize="6.5"
          fontWeight="700"
          fill="currentColor"
        >
          Be
        </text>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: info.contact.linkedin,
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="1.5"
          y="1.5"
          width="13"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M5 7V11M5 5.5V5.6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M8 11V8.5C8 7.67 8.67 7 9.5 7C10.33 7 11 7.67 11 8.5V11"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const MARQUEE_ITEMS = [
  "UI/UX Design",
  "Graphic Design",
  "Brand Identity",
  "Design Systems",
];

const MARQUEE_HALF = Array.from({ length: 8 }).flatMap((_, rep) =>
  MARQUEE_ITEMS.map((item) => `${rep}-${item}`),
);

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M5 19L19 5M19 5H9M19 5V15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer id="contact" className="bg-near-black text-white">
      {/* Marquee divider */}
      <div
        className="overflow-hidden border-b border-white/8 py-4"
        aria-hidden="true"
      >
        <div className="flex w-max animate-marquee-left">
          {["a", "b"].map((half) => (
            <div key={half} className="flex shrink-0 items-center gap-6 pr-6">
              {MARQUEE_HALF.map((label) => (
                <span
                  key={`${half}-${label}`}
                  className="flex items-center gap-6 text-sm font-semibold tracking-[0.2em] text-white/25 uppercase"
                >
                  {label.split("-")[1]}
                  <span className="text-cobalt">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Oversized CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24"
      >
        <Magnetic strength={0.15} className="inline-block">
          <a
            href={`mailto:${info.contact.email}`}
            className="group flex flex-wrap items-center gap-6"
          >
            <span className="font-heading text-[clamp(36px,7vw,88px)] leading-[0.95] font-black tracking-tight">
              Let&apos;s build something{" "}
              <span className="font-serif font-light text-cobalt italic">
                people love.
              </span>
            </span>
            <ArrowIcon className="size-10 shrink-0 text-cobalt transition-transform duration-300 ease-out group-hover:translate-x-2 group-hover:-translate-y-2 lg:size-14" />
          </a>
        </Magnetic>
      </motion.div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-20">
        <div className="grid grid-cols-2 gap-10 border-t border-white/8 pt-14 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="mb-5 flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-cobalt">
                <span className="font-heading text-sm font-bold text-white">
                  PK
                </span>
              </div>
              <span className="font-heading text-lg font-bold tracking-tight">
                Parul Kumari
              </span>
            </div>
            <p className="max-w-[240px] text-sm leading-relaxed text-white/45">
              UI/UX designer &amp; digital visual artist crafting interfaces and
              visual identities that live on the internet.
            </p>
            <div className="mt-7 flex items-center gap-3">
              {SOCIALS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-white/30 hover:text-white"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <p className="mb-5 text-xs font-semibold tracking-widest text-white/35 uppercase">
              Navigate
            </p>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/55 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-xs font-semibold tracking-widest text-white/35 uppercase">
              Contact
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${info.contact.email}`}
                  className="text-sm text-white/55 transition-colors hover:text-white"
                >
                  {info.contact.email}
                </a>
              </li>
              <li>
                <span className="text-sm text-white/55">
                  Open to freelance &amp; full-time work
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row lg:px-8">
          <p className="text-xs text-white/30">
            © 2026 Parul Kumari. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group flex items-center gap-1.5 text-xs text-white/30 transition-colors hover:text-white/70"
            >
              Back to top
              <ArrowIcon className="size-3 -rotate-45 transition-transform duration-300 group-hover:-translate-y-0.5" />
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
