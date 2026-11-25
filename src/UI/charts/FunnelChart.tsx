"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

export interface FunnelStage {
  stage: string;
  count: number;
  color: string;
}

export interface FunnelChartProps {
  data: FunnelStage[];
  className?: string;
}

/**
 * Animated conversion funnel with stage-by-stage drop-off percentages.
 */
export function FunnelChart({ data, className }: FunnelChartProps) {
  const topCount = data[0]?.count || 1;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {data.map((item, idx) => {
        const pctOfTop = (item.count / topCount) * 100;
        const prevCount = idx > 0 ? data[idx - 1].count : item.count;
        const dropOff =
          idx > 0 && prevCount > 0
            ? (((prevCount - item.count) / prevCount) * 100).toFixed(1)
            : null;

        return (
          <div key={item.stage} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-800 dark:text-slate-200">
                {item.stage}
              </span>
              <div className="flex items-center gap-2.5 tabular-nums">
                {dropOff !== null && (
                  <span className="text-[11px] text-rose-500 dark:text-rose-400">
                    -{dropOff}% drop
                  </span>
                )}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {item.count.toLocaleString("en-US")}
                </span>
                <span className="w-11 text-right text-slate-500 dark:text-slate-400">
                  {pctOfTop.toFixed(0)}%
                </span>
              </div>
            </div>
            <div className="h-7 w-full overflow-hidden rounded-lg bg-slate-200/70 p-0.5 dark:bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(4, pctOfTop)}%` }}
                transition={{ duration: 0.55, delay: idx * 0.08 }}
                className="h-full rounded-md"
                style={{ backgroundColor: item.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
