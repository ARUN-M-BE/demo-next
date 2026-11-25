import type {
  HistoricalSeriesResponse,
  MarketAssetId,
  OhlcPoint,
  Timeframe,
} from "@/types/market";
import { getCached, setCached } from "../services/cacheService";

/**
 * Fetches real historical OHLC series from configured SENSEX or Metals provider.
 * Returns empty points + UNCONFIGURED/ERROR status when credentials are absent.
 */
export async function fetchHistoricalSeries(
  asset: MarketAssetId,
  timeframe: Timeframe,
  city?: string
): Promise<HistoricalSeriesResponse> {
  const isSensex = asset === "SENSEX";
  const apiKey = isSensex
    ? process.env.SENSEX_API_KEY?.trim()
    : process.env.METALS_API_KEY?.trim();

  const missingKey = isSensex ? "SENSEX_API_KEY" : "METALS_API_KEY";
  const providerName = isSensex
    ? "Groww / BSE Market Data"
    : process.env.GOLD_API_PROVIDER?.trim() || "nebula";

  if (!apiKey) {
    return {
      asset,
      timeframe,
      interval: timeframe === "1D" ? "5m" : "1d",
      currency: isSensex ? "PTS" : "INR",
      points: [],
      feedStatus: "UNCONFIGURED",
      provider: providerName,
      lastUpdated: null,
      missingEnv: [missingKey],
      message: `Configure ${missingKey} in .env.local to load ${asset} historical OHLC data.`,
    };
  }

  const cacheKey = `history_${asset}_${timeframe}_${city ?? "default"}`;
  const cached = getCached<HistoricalSeriesResponse>(cacheKey);
  if (cached && !cached.isStale) {
    return cached.value;
  }

  try {
    const baseUrl = isSensex
      ? process.env.SENSEX_API_BASE_URL?.trim() || "https://api.groww.in/v1"
      : process.env.METALS_API_BASE_URL?.trim() || "https://metals.nebulaapi.com/v1";

    const url = isSensex
      ? `${baseUrl.replace(/\/$/, "")}/historical/candle/range?exchange=BSE&segment=CASH&trading_symbol=SENSEX&timeframe=${timeframe}`
      : `${baseUrl.replace(/\/$/, "")}/history?asset=${asset}&timeframe=${timeframe}&city=${encodeURIComponent(city || "Madurai")}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "x-api-key": apiKey,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Historical API returned HTTP ${res.status}`);
    }

    const json = (await res.json()) as { candles?: OhlcPoint[]; points?: OhlcPoint[] };
    const points = json.candles ?? json.points ?? [];

    const result: HistoricalSeriesResponse = {
      asset,
      timeframe,
      interval: timeframe === "1D" ? "5m" : "1d",
      currency: isSensex ? "PTS" : "INR",
      points,
      feedStatus: "DELAYED",
      provider: providerName,
      lastUpdated: new Date().toISOString(),
    };

    setCached(cacheKey, result, 60000);
    return result;
  } catch (err) {
    if (cached) {
      return {
        ...cached.value,
        feedStatus: "STALE",
        message: `Historical feed interrupted (${err instanceof Error ? err.message : "Unknown"}).`,
      };
    }

    return {
      asset,
      timeframe,
      interval: timeframe === "1D" ? "5m" : "1d",
      currency: isSensex ? "PTS" : "INR",
      points: [],
      feedStatus: "ERROR",
      provider: providerName,
      lastUpdated: null,
      message:
        err instanceof Error
          ? err.message
          : "Failed to load historical OHLC series.",
    };
  }
}
