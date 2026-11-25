"use client";

import React, { useEffect, useState } from "react";
import { AlertTriangle, CandlestickChart as CandleIcon, LineChart as LineIcon } from "lucide-react";
import { useMarketStore } from "@/store/marketStore";
import type { HistoricalSeriesResponse, Timeframe } from "@/types/market";
import { CandlestickChart } from "../charts/CandlestickChart";
import { SensexChart } from "../charts/SensexChart";
import { ChartCard } from "../components/ChartCard";
import { GlassButton } from "../components/GlassButton";
import { GlassCard } from "../components/GlassCard";
import { LivePrice } from "../components/LivePrice";
import { PriceChange } from "../components/PriceChange";
import { TimeframeSelector } from "../components/TimeframeSelector";

export function SensexSection() {
  const { sensex } = useMarketStore();
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [chartMode, setChartMode] = useState<"area" | "candle">("candle");
  const [history, setHistory] = useState<HistoricalSeriesResponse | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    fetch(`/api/market/history?asset=SENSEX&timeframe=${timeframe}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((data: HistoricalSeriesResponse) => {
        if (active) {
          setHistory(data);
          setLoadingHistory(false);
        }
      })
      .catch(() => {
        if (active) setLoadingHistory(false);
      });
    return () => {
      active = false;
    };
  }, [timeframe]);

  const points = history?.points ?? [];
  const feedStatus = sensex?.feedStatus ?? "STALE";

  return (
    <section aria-label="BSE SENSEX Analytics" className="flex flex-col gap-6">
      <GlassCard className="flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-500">
                BSE SENSEX &bull; {sensex?.symbol ?? "BSE_SENSEX"}
              </span>
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase text-cyan-500 dark:text-cyan-300">
                {feedStatus.replace("_", " ")}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-4">
              <LivePrice
                value={sensex?.price ?? null}
                feedStatus={feedStatus}
                accent="cyan"
                size="xl"
              />
              <PriceChange
                change={sensex?.change ?? null}
                changePercent={sensex?.changePercent ?? null}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Source: {sensex?.provider ?? "SnapData Daily Snapshot"}
              {sensex?.timestamp
                ? ` • Updated: ${new Date(sensex.timestamp).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })} IST`
                : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Open", val: sensex?.open },
              { label: "Prev Close", val: sensex?.previousClose },
              { label: "Day High", val: sensex?.dayHigh },
              { label: "Day Low", val: sensex?.dayLow },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200/70 bg-white/50 px-3.5 py-2 dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-0.5 text-sm font-bold tabular-nums text-slate-900 dark:text-white">
                  {stat.val !== null && stat.val !== undefined
                    ? stat.val.toLocaleString("en-IN", { minimumFractionDigits: 2 })
                    : "--"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {sensex?.message && (
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{sensex.message}</p>
          </div>
        )}
      </GlassCard>

      <ChartCard
        title="BSE SENSEX Historical Chart"
        subtitle={`Source: ${history?.provider ?? "TIGZIG (^BSESN)"} • Timeframe: ${timeframe}`}
        isLoading={loadingHistory}
        isEmpty={!loadingHistory && points.length === 0}
        emptyMessage={
          history?.message ??
          "Historical ^BSESN candles unavailable from provider."
        }
        action={
          <div className="flex flex-wrap items-center gap-2">
            <TimeframeSelector value={timeframe} onChange={setTimeframe} />
            <div className="inline-flex gap-1">
              <GlassButton
                size="sm"
                variant={chartMode === "candle" ? "accent" : "default"}
                onClick={() => setChartMode("candle")}
                leftIcon={<CandleIcon className="h-3.5 w-3.5" />}
              >
                Candles
              </GlassButton>
              <GlassButton
                size="sm"
                variant={chartMode === "area" ? "accent" : "default"}
                onClick={() => setChartMode("area")}
                leftIcon={<LineIcon className="h-3.5 w-3.5" />}
              >
                Area
              </GlassButton>
            </div>
          </div>
        }
      >
        {chartMode === "candle" ? (
          <CandlestickChart points={points} />
        ) : (
          <SensexChart points={points} />
        )}
      </ChartCard>
    </section>
  );
}
