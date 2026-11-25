"use client";

import React from "react";
import type { FeedStatus } from "@/types/market";
import { cn } from "../utils/cn";
import { AnimatedCounter } from "./AnimatedCounter";

export interface LivePriceProps {
  value: number | null;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  feedStatus: FeedStatus;
  accent?: "cyan" | "gold" | "silver" | "default";
  size?: "md" | "lg" | "xl";
  className?: string;
}

export function LivePrice({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  feedStatus,
  accent = "default",
  size = "lg",
  className,
}: LivePriceProps) {
  const isLive = feedStatus === "LIVE";

  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      {isLive && (
        <span className="relative flex h-2.5 w-2.5" title="Live streaming feed">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
      )}
      <span
        className={cn(
          "font-bold tracking-tight tabular-nums",
          size === "md" && "text-xl",
          size === "lg" && "text-2xl sm:text-3xl",
          size === "xl" && "text-3xl sm:text-4xl lg:text-5xl",
          accent === "gold" && "text-amber-500 dark:text-amber-300",
          accent === "silver" && "text-slate-700 dark:text-slate-200",
          accent === "cyan" && "text-cyan-600 dark:text-cyan-300",
          accent === "default" && "text-slate-900 dark:text-white"
        )}
      >
        {value === null ? (
          <span className="text-slate-400 dark:text-slate-500">--</span>
        ) : (
          <AnimatedCounter
            value={value}
            prefix={prefix}
            suffix={suffix}
            decimals={decimals}
          />
        )}
      </span>
    </div>
  );
}
