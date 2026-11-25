"use client";

import React from "react";
import { Activity, Coins, Globe } from "lucide-react";
import { useMarketStore } from "@/store/marketStore";
import { DonutChart } from "../charts/DonutChart";
import { ChartCard } from "../components/ChartCard";
import { GlassCard } from "../components/GlassCard";
import { LivePrice } from "../components/LivePrice";
import { PriceChange } from "../components/PriceChange";

export function MarketOverview() {
  const { gold, silver, spot, watchlistAllocation } = useMarketStore();
  const gold24 = gold?.rates.find((r) => r.purity === "24K");
  const gold22 = gold?.rates.find((r) => r.purity === "22K");

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:col-span-2">
        <GlassCard hoverable className="flex flex-col justify-between gap-2.5 border-amber-400/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              24K Gold (10g) &bull; IBJA Benchmark
            </span>
            <Coins className="h-4 w-4 text-amber-400" />
          </div>
          <LivePrice
            value={gold24?.per10Grams ?? null}
            prefix="₹"
            feedStatus={gold?.feedStatus ?? "DAILY_BENCHMARK"}
            accent="gold"
            size="md"
          />
          <PriceChange
            change={gold24?.changePerGram ?? null}
            changePercent={gold24?.changePercent ?? null}
            prefix="₹"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Source: {gold?.provider ?? "IBJA (api.dharun.dev)"}
          </p>
        </GlassCard>

        <GlassCard hoverable className="flex flex-col justify-between gap-2.5 border-amber-400/15">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              22K Gold (10g) &bull; IBJA Benchmark
            </span>
            <Coins className="h-4 w-4 text-amber-300" />
          </div>
          <LivePrice
            value={gold22?.per10Grams ?? null}
            prefix="₹"
            feedStatus={gold?.feedStatus ?? "DAILY_BENCHMARK"}
            accent="gold"
            size="md"
          />
          <PriceChange
            change={gold22?.changePerGram ?? null}
            changePercent={gold22?.changePercent ?? null}
            prefix="₹"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Source: {gold?.provider ?? "IBJA (api.dharun.dev)"}
          </p>
        </GlassCard>

        <GlassCard hoverable className="flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Silver (1kg) &bull; IBJA Benchmark
            </span>
            <Activity className="h-4 w-4 text-slate-300" />
          </div>
          <LivePrice
            value={silver?.perKg ?? null}
            prefix="₹"
            feedStatus={silver?.feedStatus ?? "DAILY_BENCHMARK"}
            accent="silver"
            size="md"
          />
          <PriceChange
            change={silver?.changePerGram ?? null}
            changePercent={silver?.changePercent ?? null}
            prefix="₹"
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Source: {silver?.provider ?? "IBJA (api.dharun.dev)"}
          </p>
        </GlassCard>

        <GlassCard hoverable className="flex flex-col justify-between gap-2.5 border-cyan-500/20">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              International Spot (INR/g)
            </span>
            <Globe className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase text-slate-400">Gold Spot</p>
              <LivePrice
                value={spot?.goldSpotPerGram ?? null}
                prefix="₹"
                feedStatus={spot?.feedStatus ?? "DELAYED"}
                accent="gold"
                size="md"
              />
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase text-slate-400">Silver Spot</p>
              <LivePrice
                value={spot?.silverSpotPerGram ?? null}
                prefix="₹"
                feedStatus={spot?.feedStatus ?? "DELAYED"}
                accent="silver"
                size="md"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {spot?.rateTypeLabel ?? "International Indicative Spot Rate"} &bull;{" "}
            {spot?.source ?? "XAUS"}
          </p>
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
