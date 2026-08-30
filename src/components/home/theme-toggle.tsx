"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <title>Sun</title>
      <circle cx="8" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1V2.5M8 13.5V15M15 8H13.5M2.5 8H1M12.95 3.05L11.9 4.1M4.1 11.9L3.05 12.95M12.95 12.95L11.9 11.9M4.1 4.1L3.05 3.05"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <title>Moon</title>
      <path
        d="M14 9.3A6 6 0 116.7 2a4.7 4.7 0 007.3 7.3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSwap({ isDark }: { isDark: boolean }) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <span className="relative flex size-3.5 shrink-0 items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, rotate: -90, scale: 0.4 }
          }
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={
            prefersReducedMotion
              ? { opacity: 0 }
              : { opacity: 0, rotate: 90, scale: 0.4 }
          }
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * `variant="pill"` (default) is a labeled pill styled for a permanently-dark surface (the footer).
 * `variant="icon"` is a compact icon-only button with `dark:` variants, for surfaces that
 * themselves flip between light and dark (the navbar).
 */
export function ThemeToggle({
  variant = "pill",
}: {
  variant?: "pill" | "icon";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "shrink-0 rounded-full border",
          variant === "pill"
            ? "h-8 w-26 border-white/15"
            : "size-10 border-near-black/15 dark:border-white/15",
        )}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label={label}
        className="flex size-10 shrink-0 items-center justify-center rounded-full text-near-black transition-colors hover:bg-near-black/5 dark:text-white dark:hover:bg-white/10"
      >
        <IconSwap isDark={isDark} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      className="group flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
    >
      <IconSwap isDark={isDark} />
      {isDark ? "Dark mode" : "Light mode"}
    </button>
  );
}
