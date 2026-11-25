"use client";

import React, { useMemo, useRef, useState } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { MapMarkers } from "./MapMarkers";
import { MapTooltip, type CountryMarkerData } from "./MapTooltip";

export interface WorldMapProps {
  markers: CountryMarkerData[];
  selectedCountryId: string | null;
  onSelectCountry: (country: CountryMarkerData | null) => void;
}

const SVG_WIDTH = 860;
const SVG_HEIGHT = 430;

/**
 * Interactive SVG world map rendered from real world-atlas TopoJSON boundaries.
 */
export function WorldMap({
  markers,
  selectedCountryId,
  onSelectCountry,
}: WorldMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hovered, setHovered] = useState<CountryMarkerData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null
  );

  const countries = useMemo(() => {
    const topology = worldAtlas as unknown as Topology<{
      countries: GeometryCollection;
    }>;
    return feature(topology, topology.objects.countries).features;
  }, []);

  const projection = useMemo(
    () =>
      geoNaturalEarth1()
        .scale(155 * zoom)
        .translate([SVG_WIDTH / 2, SVG_HEIGHT / 2 + 12]),
    [zoom]
  );

  const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

  const handleHover = (
    country: CountryMarkerData | null,
    event?: React.MouseEvent<SVGGElement>
  ) => {
    setHovered(country);
    if (!country || !event || !containerRef.current) {
      setTooltipPos(null);
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-900/95 dark:border-white/10 dark:bg-[#050d1a]"
    >
      {/* Zoom controls */}
      <div className="absolute right-3 top-3 z-20 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.25).toFixed(2)))}
          aria-label="Zoom in map"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-slate-900/80 text-slate-200 backdrop-blur-md transition-colors hover:border-cyan-400/50 hover:text-white cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
          aria-label="Zoom out map"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-slate-900/80 text-slate-200 backdrop-blur-md transition-colors hover:border-cyan-400/50 hover:text-white cursor-pointer"
        >
          <Minus className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            setZoom(1);
            onSelectCountry(null);
          }}
          aria-label="Reset map zoom and selection"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-slate-900/80 text-slate-200 backdrop-blur-md transition-colors hover:border-cyan-400/50 hover:text-white cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>

      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        className="h-auto w-full select-none"
        role="img"
        aria-label="Interactive global traffic world map"
      >
        <defs>
          <radialGradient id="map-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0.12)" />
            <stop offset="100%" stopColor="rgba(7, 17, 31, 0)" />
          </radialGradient>
        </defs>
        <rect width={SVG_WIDTH} height={SVG_HEIGHT} fill="url(#map-glow)" />

        <g>
          {countries.map((geo, idx) => {
            const d = pathGenerator(geo) ?? "";
            const geoName = String(
              (geo.properties as { name?: string } | undefined)?.name ?? ""
            );
            const matchedMarker = markers.find(
              (m) =>
                m.name.toLowerCase() === geoName.toLowerCase() ||
                (m.id === "us" && geoName === "United States of America")
            );
            const isSelected =
              matchedMarker && selectedCountryId === matchedMarker.id;

            return (
              <path
                key={String(geo.id ?? idx)}
                d={d}
                onClick={() => {
                  if (matchedMarker) {
                    onSelectCountry(
                      selectedCountryId === matchedMarker.id
                        ? null
                        : matchedMarker
                    );
                  }
                }}
                className={
                  matchedMarker
                    ? "cursor-pointer transition-colors duration-150"
                    : "transition-colors duration-150"
                }
                fill={
                  isSelected
                    ? "rgba(34, 211, 238, 0.35)"
                    : matchedMarker
                    ? "rgba(59, 130, 246, 0.24)"
                    : "rgba(148, 163, 184, 0.12)"
                }
                stroke={
                  isSelected
                    ? "rgba(34, 211, 238, 0.85)"
                    : "rgba(148, 163, 184, 0.22)"
                }
                strokeWidth={isSelected ? 1.1 : 0.6}
              />
            );
          })}
        </g>

        <MapMarkers
          markers={markers}
          projection={projection}
          selectedCountryId={selectedCountryId}
          onSelect={(c) =>
            onSelectCountry(selectedCountryId === c.id ? null : c)
          }
          onHover={handleHover}
        />
      </svg>

      <MapTooltip country={hovered} position={tooltipPos} />
    </div>
  );
}
