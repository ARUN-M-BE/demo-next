"use client";

import React from "react";
import { AreaChart } from "./AreaChart";

export interface VolatilityChartProps {
  data: Array<{ time: string; value: number }>;
  seriesName: string;
  color?: string;
  height?: number;
}

export function VolatilityChart({
  data,
  seriesName,
  color = "#8B5CF6",
  height = 230,
}: VolatilityChartProps) {
  return (
    <AreaChart
      data={data}
      xKey="time"
      height={height}
      series={[{ key: "value", name: seriesName, color }]}
    />
  );
}
