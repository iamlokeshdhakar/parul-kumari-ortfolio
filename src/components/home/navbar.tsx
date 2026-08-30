"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./magnetic";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Work", href: "#projects" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-near-black dark:bg-white">
        <span className="font-heading text-sm font-bold text-white dark:text-near-black">
          PK
        </span>
      </div>
      <span className="font-heading text-lg font-bold tracking-tight text-near-black dark:text-white">
        Parul Kumari
      </span>
      <span
        className="mx-1 hidden h-4 w-px bg-near-black/15 md:block dark:bg-white/15"
        aria-hidden="true"
      />
      <span className="hidden text-[11px] font-semibold uppercase tracking-widest text-near-black/45 md:inline dark:text-white/45">
        Product &amp; UI/UX Designer
      </span>
    </Link>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M2 11L11 2M11 2H5M11 2V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={
          open ? { d: "M4 4L14 14", opacity: 1 } : { d: "M2 5H16", opacity: 1 }
        }
        transition={{ duration: 0.25 }}
      />
      <motion.path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M2 9H16"
        animate={{ opacity: open ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={
          open ? { d: "M4 14L14 4", opacity: 1 } : { d: "M2 13H16", opacity: 1 }
        }
        transition={{ duration: 0.25 }}
      />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#about");
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((link) => link.href.slice(1));
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(`#${visible[0].target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    for (const el of els) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const indicatorTarget = hovered ?? active;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center transition-[padding] duration-500 ease-out",
        scrolled ? "px-4 pt-3" : "px-0 pt-0",
      )}
    >
      <div
        className={cn(
          "flex w-full items-center justify-between rounded-full border transition-all duration-500 ease-out",
          scrolled
            ? "h-14 max-w-5xl border-near-black/[0.06] bg-white/75 px-5 shadow-[0_10px_30px_-14px_rgba(12,12,20,0.18)] backdrop-blur-xl sm:px-6 dark:border-white/10 dark:bg-near-black/60"
            : "h-20 max-w-7xl border-transparent bg-transparent px-6 lg:px-8",
        )}
      >
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onMouseEnter={() => setHovered(link.href)}
              onMouseLeave={() => setHovered(null)}
              aria-current={active === link.href ? "location" : undefined}
              className="relative rounded-full px-4 py-2 text-sm font-medium"
            >
              {indicatorTarget === link.href && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-full bg-near-black/[0.05] dark:bg-white/10"
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                />
              )}
              <span
                className={cn(
                  "relative z-10 transition-colors",
                  active === link.href
                    ? "text-near-black dark:text-white"
                    : "text-near-black/55 hover:text-near-black dark:text-white/55 dark:hover:text-white",
                )}
              >
                {link.label}
              </span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle variant="icon" />

          <Magnetic className="hidden sm:inline-block">
            <a
              href="#contact"
              className="flex items-center gap-1.5 rounded-full bg-cobalt px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cobalt-dark"
            >
              Let&apos;s Talk
              <ArrowIcon />
            </a>
          </Magnetic>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-full text-near-black md:hidden dark:text-white"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-canvas md:hidden dark:bg-near-black"
          >
            <div className="h-20 shrink-0" aria-hidden="true" />
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: prefersReducedMotion ? 0 : 0.06,
                  },
                },
              }}
              className="flex flex-1 flex-col justify-center gap-2 px-8"
              aria-label="Mobile primary"
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active === link.href ? "location" : undefined}
                    className={cn(
                      "font-heading block py-3 text-4xl font-bold tracking-tight transition-colors",
                      active === link.href
                        ? "text-cobalt"
                        : "text-near-black hover:text-cobalt dark:text-white",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 24 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6"
              >
                <Link
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-cobalt px-6 py-3 text-sm font-semibold text-white hover:bg-cobalt-dark"
                >
                  Let&apos;s Talk
                  <ArrowIcon />
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
