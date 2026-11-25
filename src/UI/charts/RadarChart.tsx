"use client";

import React from "react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CustomTooltip } from "../components/CustomTooltip";

export interface RadarSeries {
  key: string;
  name: string;
  color: string;
}

export interface RadarChartProps {
  data: Array<Record<string, string | number>>;
  angleKey: string;
  series: RadarSeries[];
  height?: number;
}

export function RadarChart({
  data,
  angleKey,
  series,
  height = 290,
}: RadarChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="rgba(148, 163, 184, 0.22)" />
          <PolarAngleAxis
            dataKey={angleKey}
            tick={{ fontSize: 11, fill: "#94A3B8" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s) => (
            <Radar
              key={s.key}
              name={s.name}
              dataKey={s.key}
              stroke={s.color}
              fill={s.color}
              fillOpacity={0.25}
            />
          ))}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
