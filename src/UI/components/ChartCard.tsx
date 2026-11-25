"use client";

import React from "react";
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
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

export function ChartCard({
  title,
  subtitle,
  action,
  isLoading = false,
  isEmpty = false,
  emptyMessage = "No chart data available.",
  children,
  className,
}: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
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
          <div className="flex h-60 flex-col justify-end gap-3 pt-4">
            <Skeleton className="h-44 w-full" />
          </div>
        ) : isEmpty ? (
          <div className="flex h-60 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300/60 p-4 text-center dark:border-white/10">
            <BarChart3 className="h-7 w-7 text-slate-400" />
            <p className="max-w-md text-xs text-slate-500 dark:text-slate-400">
              {emptyMessage}
            </p>
          </div>
        ) : (
          <div className="w-full flex-1">{children}</div>
        )}
      </GlassCard>
    </motion.div>
  );
}
