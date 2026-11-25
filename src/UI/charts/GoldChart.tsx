"use client";

import React from "react";
import type { OhlcPoint } from "@/types/market";
import { AreaChart } from "./AreaChart";

export interface GoldChartProps {
  points: OhlcPoint[];
  height?: number;
}

export function GoldChart({ points, height = 250 }: GoldChartProps) {
  const data = points.map((p) => ({
    time: p.time,
    close: p.close,
  }));

  return (
    <AreaChart
      data={data}
      xKey="time"
      height={height}
      series={[{ key: "close", name: "24K Gold (INR)", color: "#F59E0B" }]}
    />
  );
}
