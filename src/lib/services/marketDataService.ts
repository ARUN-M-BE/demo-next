import { getIndianMarketStatus } from "@/server/services/marketCalendarService";
import { computeTechnicalIndicators } from "@/server/services/technicalIndicatorsService";
import type { MarketAssetId, Timeframe } from "@/types/market";
import {
  fetchIndiaGoldBenchmark,
  fetchIndiaSilverBenchmark,
} from "../providers/indiaBullionProvider";
import { fetchSnapdataSensex } from "../providers/snapdataProvider";
import { fetchXausSpotRates } from "../providers/xausProvider";
import { evaluateDataFreshness } from "./dataFreshnessService";
import { getUnifiedPriceHistory } from "./priceHistoryService";

/**
 * Resolves BSE SENSEX daily snapshot from free SnapData provider.
 */
export async function getSensexMarketData() {
  const quote = await fetchSnapdataSensex();
  const freshness = evaluateDataFreshness(quote.timestamp, quote.feedStatus);
  return { quote, freshness };
}

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
  const [sensexRes, goldRes, silverRes, spotRes] = await Promise.all([
    getSensexMarketData(),
    getGoldBenchmarkData(),
    getSilverBenchmarkData(),
    getSpotMarketData(),
  ]);

  return {
    marketStatus: getIndianMarketStatus(),
    sensex: sensexRes.quote,
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
