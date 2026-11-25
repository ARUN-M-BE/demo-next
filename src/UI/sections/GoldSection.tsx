"use client";

import React, { useEffect, useState } from "react";
import { useMarketStore } from "@/store/marketStore";
import type { HistoricalSeriesResponse, Timeframe } from "@/types/market";
import { GoldChart } from "../charts/GoldChart";
import { ChartCard } from "../components/ChartCard";
import { PriceCard } from "../components/PriceCard";
import { Select } from "../components/Select";
import { TimeframeSelector } from "../components/TimeframeSelector";

const CITIES = [
  { value: "Madurai", label: "Madurai" },
  { value: "Chennai", label: "Chennai" },
  { value: "Mumbai", label: "Mumbai" },
  { value: "Delhi", label: "Delhi" },
  { value: "Bengaluru", label: "Bengaluru" },
  { value: "Hyderabad", label: "Hyderabad" },
  { value: "Kolkata", label: "Kolkata" },
];

export function GoldSection() {
  const { gold, city, setCity } = useMarketStore();
  const [timeframe, setTimeframe] = useState<Timeframe>("1M");
  const [history, setHistory] = useState<HistoricalSeriesResponse | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    let active = true;
    setLoadingHistory(true);
    fetch(
      `/api/market/history?asset=GOLD_24K&timeframe=${timeframe}&city=${encodeURIComponent(city)}`,
      { cache: "no-store" }
    )
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
  }, [timeframe, city]);

  const rate24 = gold?.rates.find((r) => r.purity === "24K");
  const rate22 = gold?.rates.find((r) => r.purity === "22K");
  const rate18 = gold?.rates.find((r) => r.purity === "18K");

  return (
    <section aria-label="Indian Gold Price Analytics" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Indian Gold Market Intelligence
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {gold?.rateTypeLabel ?? "Retail Indicative Rate"} &bull; City:{" "}
            <strong className="text-amber-500">{city}</strong>
          </p>
        </div>
        <Select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          options={CITIES}
          containerClassName="w-44"
          aria-label="Select city for gold rates"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PriceCard
          title="24K Gold (99.9% Pure)"
          subtitle={gold?.rateTypeLabel}
          price={rate24?.perGram ?? null}
          secondaryLabel="Per 10g"
          secondaryValue={
            rate24?.per10Grams !== null && rate24?.per10Grams !== undefined
              ? `₹${rate24.per10Grams.toLocaleString("en-IN")}`
              : undefined
          }
          change={rate24?.changePerGram ?? null}
          changePercent={rate24?.changePercent ?? null}
          feedStatus={gold?.feedStatus ?? "UNCONFIGURED"}
          accent="gold"
          timestamp={gold?.timestamp}
          missingEnv={gold?.missingEnv}
        />
        <PriceCard
          title="22K Gold (91.6%)"
          subtitle={gold?.rateTypeLabel}
          price={rate22?.perGram ?? null}
          secondaryLabel="Per 10g"
          secondaryValue={
            rate22?.per10Grams !== null && rate22?.per10Grams !== undefined
              ? `₹${rate22.per10Grams.toLocaleString("en-IN")}`
              : undefined
          }
          change={rate22?.changePerGram ?? null}
          changePercent={rate22?.changePercent ?? null}
          feedStatus={gold?.feedStatus ?? "UNCONFIGURED"}
          accent="gold"
          timestamp={gold?.timestamp}
          missingEnv={gold?.missingEnv}
        />
        <PriceCard
          title="18K Gold (75.0%)"
          subtitle={gold?.rateTypeLabel}
          price={rate18?.perGram ?? null}
          secondaryLabel="Per 10g"
          secondaryValue={
            rate18?.per10Grams !== null && rate18?.per10Grams !== undefined
              ? `₹${rate18.per10Grams.toLocaleString("en-IN")}`
              : undefined
          }
          change={rate18?.changePerGram ?? null}
          changePercent={rate18?.changePercent ?? null}
          feedStatus={gold?.feedStatus ?? "UNCONFIGURED"}
          accent="gold"
          timestamp={gold?.timestamp}
          missingEnv={gold?.missingEnv}
        />
      </div>

      <ChartCard
        title="24K Gold Price History"
        subtitle={`City: ${city} • Timeframe: ${timeframe}`}
        isLoading={loadingHistory}
        isEmpty={!loadingHistory && (history?.points.length ?? 0) === 0}
        emptyMessage={
          history?.message ??
          "No gold historical data available. Configure METALS_API_KEY in .env.local."
        }
        action={<TimeframeSelector value={timeframe} onChange={setTimeframe} />}
      >
        <GoldChart points={history?.points ?? []} />
      </ChartCard>
    </section>
  );
}
