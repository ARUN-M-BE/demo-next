"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils/cn";

export interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

export function ThemeToggle({ className, size = "md" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/70 text-slate-800 backdrop-blur-md transition-colors hover:border-cyan-400/50 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 cursor-pointer",
        size === "sm" ? "h-8 w-8" : "h-9 w-9",
        className
      )}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700" />
      )}
    </button>
  );
}
