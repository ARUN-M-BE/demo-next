"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "../utils/cn";
import { AnimatedCounter } from "./AnimatedCounter";
import { GlassCard } from "./GlassCard";

export interface MetricCardProps {
  label: string;
  value: number;
  change: number;
  sparkline: number[];
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  compact?: boolean;
  accentColor?: string;
  invertTrend?: boolean;
  index?: number;
}

/**
 * Glassmorphism KPI metric card with animated counter, trend indicator, and sparkline.
 */
export function MetricCard({
  label,
  value,
  change,
  sparkline,
  icon,
  prefix = "",
  suffix = "",
  decimals = 0,
  compact = false,
  accentColor = "#22D3EE",
  invertTrend = false,
  index = 0,
}: MetricCardProps) {
  const isPositive = change >= 0;
  const isGood = invertTrend ? !isPositive : isPositive;
  const sparkData = sparkline.map((v, i) => ({ idx: i, value: v }));
  const gradientId = `spark-${label.replace(/\s+/g, "-").toLowerCase()}-${index}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
    >
      <GlassCard hoverable padding="sm" className="relative overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </span>
          {icon && (
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-cyan-300">
              {icon}
            </span>
          )}
        </div>

        <div className="mt-2.5 flex items-baseline justify-between gap-2">
          <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              compact={compact}
            />
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
              isGood
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(change).toFixed(1)}%
          </span>
        </div>

        <div className="mt-3 h-11 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={accentColor} stopOpacity={0.38} />
                  <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={accentColor}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  );
}
