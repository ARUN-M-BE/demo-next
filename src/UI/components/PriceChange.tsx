"use client";

import React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "../utils/cn";

export interface PriceChangeProps {
  change: number | null;
  changePercent: number | null;
  prefix?: string;
  className?: string;
}

/**
 * Displays absolute and percentage price movement in emerald/coral institutional styling.
 */
export function PriceChange({
  change,
  changePercent,
  prefix = "",
  className,
}: PriceChangeProps) {
  if (change === null && changePercent === null) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-slate-400",
          className
        )}
      >
        <Minus className="h-3 w-3" />
        <span>--</span>
      </span>
    );
  }

  const val = change ?? changePercent ?? 0;
  const isPositive = val > 0;
  const isNegative = val < 0;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold tabular-nums",
        isPositive && "bg-emerald-500/15 text-emerald-500 dark:text-emerald-400",
        isNegative && "bg-rose-500/15 text-rose-500 dark:text-rose-400",
        !isPositive && !isNegative && "bg-slate-500/15 text-slate-400",
        className
      )}
    >
      {isPositive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : isNegative ? (
        <ArrowDownRight className="h-3.5 w-3.5" />
      ) : (
        <Minus className="h-3.5 w-3.5" />
      )}
      {change !== null && (
        <span>
          {isPositive ? "+" : ""}
          {prefix}
          {change.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </span>
      )}
      {changePercent !== null && (
        <span>
          ({isPositive ? "+" : ""}
          {changePercent.toFixed(2)}%)
        </span>
      )}
    </span>
  );
}
