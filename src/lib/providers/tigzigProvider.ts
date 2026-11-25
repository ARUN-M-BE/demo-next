import type { OhlcPoint, Timeframe } from "@/types/market";
import { getCached, setCached } from "@/server/services/cacheService";

const TIGZIG_BASE = "https://api.tigzig.com/v1";
const CACHE_TTL_MS = 10 * 60 * 1000;

function timeframeToDays(tf: Timeframe): number {
  switch (tf) {
    case "1D":
      return 5;
    case "5D":
      return 7;
    case "1M":
      return 30;
    case "3M":
      return 90;
    case "6M":
      return 180;
    case "1Y":
      return 365;
    case "5Y":
      return 1825;
  }
}

/**
 * Fetches historical daily OHLC data for ^BSESN from TIGZIG Tremor API.
 */
export async function fetchTigzigSensexHistory(
  timeframe: Timeframe
): Promise<{ points: OhlcPoint[]; error?: string }> {
  const cacheKey = `tigzig_bsesn_${timeframe}`;
  const cached = getCached<OhlcPoint[]>(cacheKey);
  if (cached && !cached.isStale) {
    return { points: cached.value };
  }

  try {
    const days = timeframeToDays(timeframe);
    const url = `${TIGZIG_BASE}/yahoo/history?symbol=${encodeURIComponent("^BSESN")}&days=${days}`;
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`TIGZIG API HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      data?: Array<{
        date?: string;
        time?: string;
        open?: number;
        high?: number;
        low?: number;
        close?: number;
        volume?: number;
      }>;
    };

    const points: OhlcPoint[] = (json.data ?? [])
      .filter(
        (d) =>
          typeof d.open === "number" &&
          typeof d.high === "number" &&
          typeof d.low === "number" &&
          typeof d.close === "number"
      )
      .map((d) => ({
        time: (d.date ?? d.time ?? "").slice(0, 10),
        open: d.open as number,
        high: d.high as number,
        low: d.low as number,
        close: d.close as number,
        volume: d.volume,
      }));

    if (points.length > 0) {
      setCached(cacheKey, points, CACHE_TTL_MS);
    }

    return { points };
  } catch (err) {
    return {
      points: cached?.value ?? [],
      error:
        err instanceof Error
          ? err.message
          : "TIGZIG ^BSESN historical endpoint unreachable.",
    };
  }
}
