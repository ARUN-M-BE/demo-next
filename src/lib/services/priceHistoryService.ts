import type {
  HistoricalSeriesResponse,
  MarketAssetId,
  Timeframe,
} from "@/types/market";
import { fetchIndiaBullionHistory } from "../providers/indiaBullionProvider";

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
 * Unified historical OHLC provider using free India Bullion (api.dharun.dev)
 * for Indian Gold (24K/22K/18K) and Silver.
 */
export async function getUnifiedPriceHistory(
  asset: MarketAssetId,
  timeframe: Timeframe
): Promise<HistoricalSeriesResponse> {
  const days = timeframeToDays(timeframe);
  const metal = asset === "SILVER" ? "silver" : "gold";
  const purity =
    asset === "GOLD_24K"
      ? "999"
      : asset === "GOLD_22K"
      ? "916"
      : asset === "GOLD_18K"
      ? "750"
      : undefined;

  try {
    const points = await fetchIndiaBullionHistory(metal, purity, days);
    return {
      asset,
      timeframe,
      interval: "1d (AM/PM IBJA)",
      currency: "INR",
      points,
      feedStatus: points.length > 0 ? "DAILY_BENCHMARK" : "STALE",
      provider: "IBJA (api.dharun.dev)",
      lastUpdated: new Date().toISOString(),
    };
  } catch (err) {
    return {
      asset,
      timeframe,
      interval: "1d",
      currency: "INR",
      points: [],
      feedStatus: "ERROR",
      provider: "IBJA (api.dharun.dev)",
      lastUpdated: null,
      message:
        err instanceof Error ? err.message : "Failed to load bullion history.",
    };
  }
}
