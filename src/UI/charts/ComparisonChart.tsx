"use client";

import React from "react";
import { LineChart, type LineSeries } from "./LineChart";

export interface ComparisonChartProps {
  data: Array<Record<string, string | number>>;
  series: LineSeries[];
  height?: number;
}

export function ComparisonChart({
  data,
  series,
  height = 290,
}: ComparisonChartProps) {
  return <LineChart data={data} xKey="time" series={series} height={height} />;
}
