"use client";

import React from "react";
import { Radio } from "lucide-react";
import type { MarketStatusInfo } from "@/types/market";
import { cn } from "../utils/cn";

export interface MarketStatusProps {
  info: MarketStatusInfo | null;
  className?: string;
}

/**
 * Displays Indian exchange session state (MARKET OPEN, PRE-OPEN, MARKET CLOSED) and IST clock.
 */
export function MarketStatus({ info, className }: MarketStatusProps) {
  const status = info?.status ?? "MARKET CLOSED";

  const badgeStyle =
    status === "MARKET OPEN"
      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
      : status === "PRE-OPEN"
      ? "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-300"
      : "border-rose-500/35 bg-rose-500/15 text-rose-600 dark:text-rose-300";

  return (
    <div
      title={info ? `${info.reason} • ${info.nextSessionNote}` : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold",
        badgeStyle,
        className
      )}
    >
      <Radio className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{status}</span>
      {info?.istTime && (
        <span className="hidden sm:inline border-l border-current/25 pl-2 font-mono text-[11px] opacity-90">
          {info.istDate} &bull; {info.istTime}
        </span>
      )}
    </div>
  );
}
