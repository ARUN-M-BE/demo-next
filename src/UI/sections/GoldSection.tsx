"use client";

import React, { useEffect, useState } from "react";
import { useMarketStore } from "@/store/marketStore";
import type { HistoricalSeriesResponse, Timeframe } from "@/types/market";
import { GoldChart } from "../charts/GoldChart";
import { ChartCard } from "../components/ChartCard";
import { PriceCard } from "../components/PriceCard";
import { TimeframeSelector } from "../components/TimeframeSelector";

export function GoldSection() {
  const { gold, spot } = useMarketStore();
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [history, setHistory] = useState<HistoricalSeriesResponse | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    fetch(`/api/market/history?asset=GOLD_24K&timeframe=${timeframe}`, {
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

  const rate24 = gold?.rates.find((r) => r.purity === "24K");
  const rate22 = gold?.rates.find((r) => r.purity === "22K");
  const rate18 = gold?.rates.find((r) => r.purity === "18K");

  return (
    <section aria-label="Indian Gold Benchmark & Spot" className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PriceCard
          title="24K Gold (999)"
          subtitle={gold?.rateTypeLabel ?? "IBJA Bullion Benchmark"}
          sourceLabel="IBJA (api.dharun.dev)"
          price={rate24?.perGram ?? null}
          secondaryLabel="Per 10g"
          secondaryValue={
            rate24?.per10Grams !== null && rate24?.per10Grams !== undefined
              ? `₹${rate24.per10Grams.toLocaleString("en-IN")}`
              : undefined
          }
          change={rate24?.changePerGram ?? null}
          changePercent={rate24?.changePercent ?? null}
          feedStatus={gold?.feedStatus ?? "DAILY_BENCHMARK"}
          accent="gold"
          timestamp={gold?.timestamp}
          emptyNote={gold?.message}
        />
        <PriceCard
          title="22K Gold (916)"
          subtitle={gold?.rateTypeLabel ?? "IBJA Bullion Benchmark"}
          sourceLabel="IBJA (api.dharun.dev)"
          price={rate22?.perGram ?? null}
          secondaryLabel="Per 10g"
          secondaryValue={
            rate22?.per10Grams !== null && rate22?.per10Grams !== undefined
              ? `₹${rate22.per10Grams.toLocaleString("en-IN")}`
              : undefined
          }
          change={rate22?.changePerGram ?? null}
          changePercent={rate22?.changePercent ?? null}
          feedStatus={gold?.feedStatus ?? "DAILY_BENCHMARK"}
          accent="gold"
          timestamp={gold?.timestamp}
          emptyNote={gold?.message}
        />
        <PriceCard
          title="18K Gold (750)"
          subtitle={gold?.rateTypeLabel ?? "IBJA Bullion Benchmark"}
          sourceLabel="IBJA (api.dharun.dev)"
          price={rate18?.perGram ?? null}
          secondaryLabel="Per 10g"
          secondaryValue={
            rate18?.per10Grams !== null && rate18?.per10Grams !== undefined
              ? `₹${rate18.per10Grams.toLocaleString("en-IN")}`
              : undefined
          }
          change={rate18?.changePerGram ?? null}
          changePercent={rate18?.changePercent ?? null}
          feedStatus={gold?.feedStatus ?? "DAILY_BENCHMARK"}
          accent="gold"
          timestamp={gold?.timestamp}
          emptyNote={gold?.message}
        />
        <PriceCard
          title="Gold Spot (INR/g)"
          subtitle="International Indicative Spot Rate"
          sourceLabel={spot?.source ?? "XAUS"}
          price={spot?.goldSpotPerGram ?? null}
          secondaryLabel="USD/oz"
          secondaryValue={
            spot?.goldSpotUsdOz ? `$${spot.goldSpotUsdOz.toLocaleString("en-US")}` : undefined
          }
          change={null}
          changePercent={null}
          feedStatus={spot?.feedStatus ?? "DELAYED"}
          accent="cyan"
          timestamp={spot?.timestamp}
          emptyNote={spot?.message}
        />
      </div>

      <ChartCard
        title="24K Gold IBJA Historical Trend"
        subtitle={`Source: ${history?.provider ?? "IBJA (api.dharun.dev)"} • Timeframe: ${timeframe}`}
        isLoading={loadingHistory}
        isEmpty={!loadingHistory && (history?.points.length ?? 0) === 0}
        emptyMessage={history?.message ?? "No gold historical data returned."}
        action={<TimeframeSelector value={timeframe} onChange={setTimeframe} />}
      >
        <GoldChart points={history?.points ?? []} />
      </ChartCard>
    </section>
  );
}
