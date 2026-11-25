import { fetchGoldMarketData } from "../providers/goldProvider";
import { fetchHistoricalSeries } from "../providers/historicalDataProvider";
import { fetchSensexQuote } from "../providers/sensexProvider";
import { fetchSilverMarketData } from "../providers/silverProvider";
import { getIndianMarketStatus } from "./marketCalendarService";
import { computeTechnicalIndicators } from "./technicalIndicatorsService";
import type { MarketAssetId, Timeframe } from "@/types/market";

export async function getMarketOverview(city?: string) {
  const [sensex, gold, silver] = await Promise.all([
    fetchSensexQuote(),
    fetchGoldMarketData(city),
    fetchSilverMarketData(city),
  ]);

  const marketStatus = getIndianMarketStatus();

  return {
    marketStatus,
    sensex,
    gold,
    silver,
    serverTimestamp: new Date().toISOString(),
  };
}

export async function getIndicatorsForAsset(
  asset: MarketAssetId,
  timeframe: Timeframe,
  city?: string
) {
  const history = await fetchHistoricalSeries(asset, timeframe, city);
  return computeTechnicalIndicators(
    asset,
    timeframe,
    history.points,
    history.feedStatus,
    history.message
  );
}
