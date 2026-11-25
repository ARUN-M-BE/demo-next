"use client";

import React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { CustomTooltip } from "../components/CustomTooltip";

export interface PieDatum {
  name: string;
  value: number;
  color: string;
}

export interface PieChartProps {
  data: PieDatum[];
  height?: number;
}

export function PieChart({ data, height = 260 }: PieChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={88}
            stroke="none"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
