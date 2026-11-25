import type { SensexQuote } from "@/types/market";
import { getCached, setCached } from "@/server/services/cacheService";

const SNAPDATA_URL = "https://snapdata.dev/api/v1/equity-indices/in/latest.json";
const CACHE_TTL_MS = 5 * 60 * 1000;

interface SnapDataObservation {
  date: string;
  instrument: string;
  instrument_id: string;
  value: number | null;
  close: number | null;
  prev_close: number | null;
  change_pct: number | null;
  status: string;
  is_trading_day: boolean;
  source: string;
}

interface SnapDataResponse {
  generated_at?: string;
  coverage?: { from?: string; to?: string };
  observations?: SnapDataObservation[];
}

/**
 * Fetches daily BSE SENSEX snapshot from SnapData (snapdata.dev).
 * Never substitutes missing values with fabricated prices.
 */
export async function fetchSnapdataSensex(): Promise<SensexQuote> {
  const cacheKey = "snapdata_sensex_latest";
  const cached = getCached<SensexQuote>(cacheKey);
  if (cached && !cached.isStale) {
    return cached.value;
  }

  try {
    const res = await fetch(SNAPDATA_URL, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`SnapData API HTTP ${res.status}`);
    }

    const json = (await res.json()) as SnapDataResponse;
    const obs = json.observations?.find(
      (o) => o.instrument === "SENSEX" || o.instrument_id === "SENSEX.INR.IDX"
    );

    if (!obs || obs.value === null || obs.status === "missing") {
      return {
        symbol: "BSE_SENSEX",
        name: "BSE SENSEX",
        price: null,
        change: null,
        changePercent: null,
        open: null,
        previousClose: obs?.prev_close ?? null,
        dayHigh: null,
        dayLow: null,
        volume: null,
        timestamp: json.generated_at ?? null,
        feedStatus: "STALE",
        provider: "SnapData (snapdata.dev)",
        message: `SnapData reported SENSEX status="${obs?.status ?? "missing"}" for ${obs?.date ?? "latest"}.`,
      };
    }

    const price = obs.close ?? obs.value;
    const prevClose = obs.prev_close;
    const change =
      price !== null && prevClose !== null
        ? Number((price - prevClose).toFixed(2))
        : null;

    const quote: SensexQuote = {
      symbol: "BSE_SENSEX",
      name: "BSE SENSEX",
      price,
      change,
      changePercent: obs.change_pct ?? null,
      open: null,
      previousClose: prevClose,
      dayHigh: null,
      dayLow: null,
      volume: null,
      timestamp: json.generated_at ?? `${obs.date}T15:30:00+05:30`,
      feedStatus: "DAILY_BENCHMARK",
      provider: `SnapData (${obs.source.toUpperCase()} Daily Snapshot)`,
    };

    setCached(cacheKey, quote, CACHE_TTL_MS);
    return quote;
  } catch (err) {
    return {
      symbol: "BSE_SENSEX",
      name: "BSE SENSEX",
      price: null,
      change: null,
      changePercent: null,
      open: null,
      previousClose: null,
      dayHigh: null,
      dayLow: null,
      volume: null,
      timestamp: null,
      feedStatus: "ERROR",
      provider: "SnapData (snapdata.dev)",
      message: err instanceof Error ? err.message : "Failed to fetch SnapData SENSEX.",
    };
  }
}
