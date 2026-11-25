"use client";

import React from "react";
import type { Timeframe } from "@/types/market";
import { cn } from "../utils/cn";

const DEFAULT_TIMEFRAMES: Timeframe[] = [
  "1D",
  "5D",
  "1M",
  "3M",
  "6M",
  "1Y",
  "5Y",
];

export interface TimeframeSelectorProps {
  value: Timeframe;
  onChange: (tf: Timeframe) => void;
  options?: Timeframe[];
  className?: string;
}

export function TimeframeSelector({
  value,
  onChange,
  options = DEFAULT_TIMEFRAMES,
  className,
}: TimeframeSelectorProps) {
  return (
    <div
      role="group"
      aria-label="Chart timeframe"
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-white/70 p-1 backdrop-blur-md dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      {options.map((tf) => {
        const active = tf === value;
        return (
          <button
            key={tf}
            type="button"
            onClick={() => onChange(tf)}
            aria-pressed={active}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
              active
                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-slate-950 shadow-elevation-xs"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            )}
          >
            {tf}
          </button>
        );
      })}
    </div>
  );
}

