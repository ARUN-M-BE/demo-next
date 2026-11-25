"use client";

import React from "react";
import type { GeoProjection } from "d3-geo";
import type { CountryMarkerData } from "./MapTooltip";

export interface MapMarkersProps {
  markers: CountryMarkerData[];
  projection: GeoProjection;
  selectedCountryId: string | null;
  onSelect: (country: CountryMarkerData) => void;
  onHover: (
    country: CountryMarkerData | null,
    event?: React.MouseEvent<SVGGElement>
  ) => void;
}

export function MapMarkers({
  markers,
  projection,
  selectedCountryId,
  onSelect,
  onHover,
}: MapMarkersProps) {
  const maxVisitors = Math.max(...markers.map((m) => m.visitors), 1);

  return (
    <g>
      {markers.map((marker) => {
        const projected = projection(marker.coordinates);
        if (!projected) return null;
        const [cx, cy] = projected;
        const intensity = 0.5 + (marker.visitors / maxVisitors) * 0.8;
        const radius = 4.5 * intensity;
        const isSelected = selectedCountryId === marker.id;

        return (
          <g
            key={marker.id}
            transform={`translate(${cx}, ${cy})`}
            className="cursor-pointer"
            role="button"
            tabIndex={0}
            aria-label={`${marker.name}: ${marker.visitors.toLocaleString()} visitors`}
            onClick={() => onSelect(marker)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(marker);
              }
            }}
            onMouseEnter={(e) => onHover(marker, e)}
            onMouseMove={(e) => onHover(marker, e)}
            onMouseLeave={() => onHover(null)}
          >
            {/* Outer animated pulse ring */}
            <circle
              r={radius * 2.2}
              fill={isSelected ? "#3B82F6" : "#22D3EE"}
              fillOpacity={0.22}
              className="animate-ping"
              style={{ animationDuration: "2.6s" }}
            />
            {/* Soft glow halo */}
            <circle
              r={radius * 1.65}
              fill={isSelected ? "#60A5FA" : "#22D3EE"}
              fillOpacity={isSelected ? 0.45 : 0.28}
            />
            {/* Core marker */}
            <circle
              r={radius}
              fill={isSelected ? "#F59E0B" : "#22D3EE"}
              stroke="#07111F"
              strokeWidth={1.5}
            />
          </g>
        );
      })}
    </g>
  );
}
