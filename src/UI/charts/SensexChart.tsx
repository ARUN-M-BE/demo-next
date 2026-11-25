"use client";

import React from "react";
import type { OhlcPoint } from "@/types/market";
import { AreaChart } from "./AreaChart";
import { BarChart } from "./BarChart";

export function SensexChart({ points }: { points: OhlcPoint[] }) {
  const chartData = points.map((p) => ({ time: p.time, close: p.close }));
  const hasVolume = points.some((p) => typeof p.volume === "number" && p.volume > 0);
  const volumeData = points.map((p) => ({ time: p.time, volume: p.volume ?? 0 }));

  return (
    <div className="flex flex-col gap-4">
      <AreaChart
        data={chartData}
        xKey="time"
        height={260}
        series={[{ key: "close", name: "BSE SENSEX", color: "#22D3EE" }]}
      />
      {hasVolume && (
        <BarChart
          data={volumeData}
          xKey="time"
          height={130}
          series={[{ key: "volume", name: "Volume", color: "#3B82F6" }]}
        />
      )}
    </div>
  );
}
