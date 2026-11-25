import type { SensexQuote } from "@/types/market";
import { getCached, setCached } from "../services/cacheService";
import { getIndianMarketStatus } from "../services/marketCalendarService";

const CACHE_KEY = "sensex_live_quote";

/**
 * Adapter for BSE SENSEX live/previous quote using Groww Trade API or BSE Market Data.
 * Requires server-side SENSEX_API_KEY (and optional SENSEX_API_BASE_URL).
 */
export async function fetchSensexQuote(): Promise<SensexQuote> {
  const apiKey = process.env.SENSEX_API_KEY?.trim();
  const baseUrl =
    process.env.SENSEX_API_BASE_URL?.trim() || "https://api.groww.in/v1";
  const ttlMs = Number(process.env.MARKET_DATA_REFRESH_INTERVAL || 15000);
  const marketStatus = getIndianMarketStatus();

  if (!apiKey) {
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
      feedStatus: "UNCONFIGURED",
      provider: "Groww / BSE Market Data",
      missingEnv: ["SENSEX_API_KEY"],
      message:
        "Configure SENSEX_API_KEY in .env.local to stream BSE_SENSEX quotes.",
    };
  }

  const cached = getCached<SensexQuote>(CACHE_KEY);
  if (cached && !cached.isStale) {
    return cached.value;
  }

  try {
    const url = `${baseUrl.replace(/\/$/, "")}/live-data/quote?exchange=BSE&segment=CASH&trading_symbol=SENSEX`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (res.status === 429 && cached) {
      return { ...cached.value, feedStatus: "STALE", message: "Rate limited by vendor; showing last cached quote." };
    }

    if (!res.ok) {
      throw new Error(`Provider responded with HTTP ${res.status}`);
    }

    const json = (await res.json()) as {
      payload?: {
        last_price?: number;
        day_change?: number;
        day_change_perc?: number;
        ohlc?: { open?: number; high?: number; low?: number; close?: number };
        volume?: number;
      };
    };

    const payload = json.payload;
    if (!payload || typeof payload.last_price !== "number") {
      throw new Error("Unexpected response schema from SENSEX provider");
    }

    const quote: SensexQuote = {
      symbol: "BSE_SENSEX",
      name: "BSE SENSEX",
      price: payload.last_price,
      change: payload.day_change ?? null,
      changePercent: payload.day_change_perc ?? null,
      open: payload.ohlc?.open ?? null,
      previousClose: payload.ohlc?.close ?? null,
      dayHigh: payload.ohlc?.high ?? null,
      dayLow: payload.ohlc?.low ?? null,
      volume: payload.volume ?? null,
      timestamp: new Date().toISOString(),
      feedStatus:
        marketStatus.status === "MARKET CLOSED" ? "PREVIOUS_CLOSE" : "DELAYED",
      provider: "Groww Trade API (BSE_SENSEX)",
    };

    setCached(CACHE_KEY, quote, ttlMs);
    return quote;
  } catch (err) {
    if (cached) {
      return {
        ...cached.value,
        feedStatus: "STALE",
        message: `Feed interrupted (${err instanceof Error ? err.message : "Unknown error"}). Showing last cached quote.`,
      };
    }

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
      provider: "Groww / BSE Market Data",
      message:
        err instanceof Error ? err.message : "Failed to fetch BSE SENSEX quote.",
    };
  }
}
