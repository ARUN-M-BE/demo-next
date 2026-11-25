import { getIndianMarketStatus } from "@/server/services/marketCalendarService";
import { computeTechnicalIndicators } from "@/server/services/technicalIndicatorsService";
import type { MarketAssetId, Timeframe } from "@/types/market";
import {
  fetchIndiaGoldBenchmark,
  fetchIndiaSilverBenchmark,
} from "../providers/indiaBullionProvider";
import { fetchXausSpotRates } from "../providers/xausProvider";
import { evaluateDataFreshness } from "./dataFreshnessService";
import { getUnifiedPriceHistory } from "./priceHistoryService";

export async function getGoldBenchmarkData() {
  const gold = await fetchIndiaGoldBenchmark();
  const freshness = evaluateDataFreshness(gold.timestamp, gold.feedStatus, 86400);
  return { gold, freshness };
}

export async function getSilverBenchmarkData() {
  const silver = await fetchIndiaSilverBenchmark();
  const freshness = evaluateDataFreshness(silver.timestamp, silver.feedStatus, 86400);
  return { silver, freshness };
}

export async function getSpotMarketData() {
  const spot = await fetchXausSpotRates();
  const freshness = evaluateDataFreshness(spot.timestamp, spot.feedStatus, 180);
  return { spot, freshness };
}

export async function getFullMarketOverview() {
  const [goldRes, silverRes, spotRes] = await Promise.all([
    getGoldBenchmarkData(),
    getSilverBenchmarkData(),
    getSpotMarketData(),
  ]);

  return {
    marketStatus: getIndianMarketStatus(),
    gold: goldRes.gold,
    silver: silverRes.silver,
    spot: spotRes.spot,
    serverTimestamp: new Date().toISOString(),
  };
}

export async function getTechnicalIndicators(
  asset: MarketAssetId,
  timeframe: Timeframe
) {
  const history = await getUnifiedPriceHistory(asset, timeframe);
  return computeTechnicalIndicators(
    asset,
    timeframe,
    history.points,
    history.feedStatus,
    history.message
  );
}
