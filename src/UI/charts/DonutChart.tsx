"use client";

import React from "react";
import {
  Cell,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CustomTooltip } from "../components/CustomTooltip";

export interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutDatum[];
  centerLabel?: string;
  centerValue?: string;
  height?: number;
}

export function DonutChart({
  data,
  centerLabel = "Total",
  centerValue,
  height = 260,
}: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            {centerLabel}
          </span>
          <span className="text-xl font-bold tabular-nums text-slate-900 dark:text-white">
            {centerValue ?? total.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:w-44">
        {data.map((item) => {
          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0";
          return (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.name}</span>
              </span>
              <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
