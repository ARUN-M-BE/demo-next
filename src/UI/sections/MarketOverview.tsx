"use client";

import React from "react";
import { Activity, Coins, ShieldAlert, TrendingUp } from "lucide-react";
import { useMarketStore } from "@/store/marketStore";
import { DonutChart } from "../charts/DonutChart";
import { ChartCard } from "../components/ChartCard";
import { GlassCard } from "../components/GlassCard";
import { LivePrice } from "../components/LivePrice";
import { PriceChange } from "../components/PriceChange";

/**
 * High-level Market Intelligence overview combining SENSEX, 24K Gold, Silver, and Watchlist Distribution.
 */
export function MarketOverview() {
  const { sensex, gold, silver, watchlistAllocation } = useMarketStore();
  const gold24 = gold?.rates.find((r) => r.purity === "24K");

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:col-span-2">
        <GlassCard hoverable className="flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500">
              BSE SENSEX
            </span>
            <TrendingUp className="h-4 w-4 text-cyan-400" />
          </div>
          <LivePrice
            value={sensex?.price ?? null}
            feedStatus={sensex?.feedStatus ?? "UNCONFIGURED"}
            accent="cyan"
            size="md"
          />
          <PriceChange
            change={sensex?.change ?? null}
            changePercent={sensex?.changePercent ?? null}
          />
        </GlassCard>

        <GlassCard hoverable className="flex flex-col justify-between gap-3 border-amber-400/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              24K Gold / 10g
            </span>
            <Coins className="h-4 w-4 text-amber-400" />
          </div>
          <LivePrice
            value={gold24?.per10Grams ?? null}
            prefix="₹"
            feedStatus={gold?.feedStatus ?? "UNCONFIGURED"}
            accent="gold"
            size="md"
          />
          <PriceChange
            change={gold24?.changePerGram ?? null}
            changePercent={gold24?.changePercent ?? null}
            prefix="₹"
          />
        </GlassCard>

        <GlassCard hoverable className="flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Silver / 1kg
            </span>
            <Activity className="h-4 w-4 text-slate-300" />
          </div>
          <LivePrice
            value={silver?.perKg ?? null}
            prefix="₹"
            feedStatus={silver?.feedStatus ?? "UNCONFIGURED"}
            accent="silver"
            size="md"
          />
          <PriceChange
            change={silver?.changePerGram ?? null}
            changePercent={silver?.changePercent ?? null}
            prefix="₹"
          />
        </GlassCard>

        <GlassCard className="sm:col-span-3 flex items-start gap-3 border-cyan-500/20">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
          <div className="text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">
              Real-Time Provider Integrity
            </p>
            <p className="mt-0.5">
              All quotes reflect server-side provider responses only. When API
              credentials (<code className="font-mono">SENSEX_API_KEY</code>,{" "}
              <code className="font-mono">METALS_API_KEY</code>) are not set,
              the terminal displays unconfigured states instead of fabricated
              live prices.
            </p>
          </div>
        </GlassCard>
      </div>

      <ChartCard
        title="Watchlist Distribution"
        subtitle="User-configurable watchlist allocation (not actual portfolio holdings)"
      >
        <DonutChart
          data={watchlistAllocation.map((w) => ({
            name: w.name,
            value: w.weight,
            color: w.color,
          }))}
          centerLabel="Watchlist"
          centerValue="100%"
          height={210}
        />
      </ChartCard>
    </div>
  );
}
