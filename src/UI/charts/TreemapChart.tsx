"use client";

import React from "react";
import { ResponsiveContainer, Tooltip, Treemap } from "recharts";
import { CustomTooltip } from "../components/CustomTooltip";

export interface TreemapDatum {
  name: string;
  size: number;
  color: string;
  [key: string]: string | number;
}

export interface TreemapChartProps {
  data: TreemapDatum[];
  height?: number;
}

interface CustomCellProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  name?: string;
  color?: string;
}

function TreemapCell({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name,
  color = "#3B82F6",
}: CustomCellProps) {
  if (width <= 4 || height <= 4) return null;
  return (
    <g>
      <rect
        x={x + 2}
        y={y + 2}
        width={Math.max(0, width - 4)}
        height={Math.max(0, height - 4)}
        rx={10}
        fill={color}
        fillOpacity={0.82}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={1}
      />
      {width > 64 && height > 32 && (
        <text
          x={x + 12}
          y={y + 24}
          fill="#ffffff"
          fontSize={12}
          fontWeight={600}
        >
          {name}
        </text>
      )}
    </g>
  );
}

export function TreemapChart({ data, height = 270 }: TreemapChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#fff"
          content={<TreemapCell />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
