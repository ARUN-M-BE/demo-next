"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { cn } from "../utils/cn";
import { GlassCard } from "./GlassCard";
import { Skeleton } from "./Skeleton";

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Glassmorphism container for charts with loading skeleton and empty states.
 */
export function ChartCard({
  title,
  subtitle,
  action,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No data available for the selected filters.",
  children,
  className,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={className}
    >
      <GlassCard hoverable className="flex h-full flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {isLoading ? (
          <div className="flex h-64 flex-col justify-end gap-3 pt-4">
            <Skeleton className="h-44 w-full rounded-xl" />
            <div className="flex gap-2">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300/60 text-center dark:border-white/10">
            <BarChart3 className="h-7 w-7 text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className={cn("w-full flex-1")}>{children}</div>
        )}
      </GlassCard>
    </motion.div>
  );
}
