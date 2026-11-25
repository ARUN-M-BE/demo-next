"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import type { FeedStatus } from "@/types/market";
import { cn } from "../utils/cn";
import { GlassCard } from "./GlassCard";
import { LivePrice } from "./LivePrice";
import { PriceChange } from "./PriceChange";

export interface PriceCardProps {
  title: string;
  subtitle?: string;
  price: number | null;
  secondaryLabel?: string;
  secondaryValue?: string;
  change: number | null;
  changePercent: number | null;
  feedStatus: FeedStatus;
  accent?: "cyan" | "gold" | "silver" | "default";
  prefix?: string;
  timestamp?: string | null;
  missingEnv?: string[];
  className?: string;
}

/**
 * Institutional glassmorphism card for Gold (24K/22K/18K), Silver, and market benchmarks.
 */
export function PriceCard({
  title,
  subtitle,
  price,
  secondaryLabel,
  secondaryValue,
  change,
  changePercent,
  feedStatus,
  accent = "default",
  prefix = "₹",
  timestamp,
  missingEnv,
  className,
}: PriceCardProps) {
  return (
    <GlassCard
      hoverable
      className={cn(
        "flex flex-col justify-between gap-4",
        accent === "gold" && "border-amber-400/25",
        accent === "silver" && "border-slate-300/30 dark:border-slate-400/25",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
            feedStatus === "LIVE"
              ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
              : feedStatus === "UNCONFIGURED" || feedStatus === "ERROR"
              ? "border-amber-500/40 bg-amber-500/15 text-amber-400"
              : "border-cyan-500/30 bg-cyan-500/10 text-cyan-500 dark:text-cyan-300"
          )}
        >
          {feedStatus.replace("_", " ")}
        </span>
      </div>

      {price === null ? (
        <div className="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Provider Credentials Required</p>
            <p className="mt-0.5 opacity-90">
              Set {missingEnv?.join(", ") || "API credentials"} in{" "}
              <code className="font-mono">.env.local</code> to display live rates.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <LivePrice
            value={price}
            prefix={prefix}
            feedStatus={feedStatus}
            accent={accent}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <PriceChange
              change={change}
              changePercent={changePercent}
              prefix={prefix}
            />
            {secondaryLabel && secondaryValue && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {secondaryLabel}:{" "}
                <strong className="text-slate-800 dark:text-slate-200">
                  {secondaryValue}
                </strong>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="border-t border-slate-200/60 pt-2.5 text-[11px] text-slate-500 dark:border-white/10 dark:text-slate-400">
        {timestamp
          ? `Updated: ${new Date(timestamp).toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
            })} IST`
          : "Awaiting live provider connection"}
      </div>
    </GlassCard>
  );
}
