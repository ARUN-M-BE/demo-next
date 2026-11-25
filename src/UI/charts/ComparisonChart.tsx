"use client";

import React from "react";
import { LineChart, type LineSeries } from "./LineChart";

export function ComparisonChart({
  data,
  series,
  height = 290,
}: {
  data: Array<Record<string, string | number>>;
  series: LineSeries[];
  height?: number;
}) {
  return <LineChart data={data} xKey="time" series={series} height={height} />;
}
