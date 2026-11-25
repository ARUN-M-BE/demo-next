"use client";

import React, { useEffect, useState } from "react";
import { Info } from "lucide-react";
import type {
  MarketAssetId,
  TechnicalIndicatorsResult,
  Timeframe,
} from "@/types/market";
import { VolatilityChart } from "../charts/VolatilityChart";
import { ChartCard } from "../components/ChartCard";
import { GlassCard } from "../components/GlassCard";
import { Select } from "../components/Select";
import { TimeframeSelector } from "../components/TimeframeSelector";

export function TechnicalAnalysis() {
  const [asset, setAsset] = useState<MarketAssetId>("GOLD_24K");
  const [timeframe, setTimeframe] = useState<Timeframe>("3M");
  const [data, setData] = useState<TechnicalIndicatorsResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/market/indicators?asset=${asset}&timeframe=${timeframe}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((res: TechnicalIndicatorsResult) => {
        if (active) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [asset, timeframe]);

  const fmt = (v: number | null | undefined) =>
    v !== null && v !== undefined ? v.toLocaleString("en-IN") : "--";

  const metrics = [
    { label: "SMA 20", value: fmt(data?.sma20) },
    { label: "SMA 50", value: fmt(data?.sma50) },
    { label: "SMA 200", value: fmt(data?.sma200) },
    { label: "EMA 20", value: fmt(data?.ema20) },
    {
      label: "RSI (14)",
      value:
        data?.rsi14 !== null && data?.rsi14 !== undefined
          ? `${data.rsi14} (${data.rsiCondition})`
          : "--",
    },
    { label: "MACD Line", value: fmt(data?.macd.macdLine) },
    {
      label: "Bollinger (U / L)",
      value:
        data?.bollingerBands.upper && data?.bollingerBands.lower
          ? `${data.bollingerBands.upper} / ${data.bollingerBands.lower}`
          : "--",
    },
    { label: "ATR (14)", value: fmt(data?.atr14) },
  ];

  return (
    <section aria-label="Technical Indicators" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Technical Indicators &amp; Volatility
          </h2>
          <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Info className="h-3.5 w-3.5 text-cyan-500" />
            <span>
              Analytical indicators computed from historical OHLC data — not financial advice.
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={asset}
            onChange={(e) => setAsset(e.target.value as MarketAssetId)}
            options={[
              { value: "GOLD_24K", label: "24K Gold (IBJA)" },
              { value: "GOLD_22K", label: "22K Gold (IBJA)" },
              { value: "SILVER", label: "Silver (IBJA)" },
            ]}
            containerClassName="w-44"
          />
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((m) => (
          <GlassCard key={m.label} padding="sm">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {m.label}
            </p>
            <p className="mt-1 text-base font-bold tabular-nums text-slate-900 dark:text-white">
              {m.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Historical Volatility (%)"
          subtitle="Rolling 10-period standard deviation of closes"
          isLoading={loading}
          isEmpty={!loading && (data?.volatilitySeries.length ?? 0) === 0}
          emptyMessage={data?.message ?? "Insufficient OHLC history to compute volatility."}
        >
          <VolatilityChart
            data={(data?.volatilitySeries ?? []).map((v) => ({
              time: v.time,
              value: v.volatility,
            }))}
            seriesName="Volatility %"
            color="#8B5CF6"
          />
        </ChartCard>

        <ChartCard
          title="Peak-to-Trough Drawdown (%)"
          subtitle="Historical drawdown from running high"
          isLoading={loading}
          isEmpty={!loading && (data?.drawdownSeries.length ?? 0) === 0}
          emptyMessage={data?.message ?? "Insufficient OHLC history to compute drawdown."}
        >
          <VolatilityChart
            data={(data?.drawdownSeries ?? []).map((d) => ({
              time: d.time,
              value: d.drawdown,
            }))}
            seriesName="Drawdown %"
            color="#F43F5E"
          />
        </ChartCard>
      </div>
    </section>
  );
}
