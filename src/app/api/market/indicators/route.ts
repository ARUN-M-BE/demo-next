import { NextRequest, NextResponse } from "next/server";
import { getTechnicalIndicators } from "@/lib/services/marketDataService";
import type { MarketAssetId, Timeframe } from "@/types/market";

const VALID_ASSETS = new Set<MarketAssetId>([
  "GOLD_24K",
  "GOLD_22K",
  "GOLD_18K",
  "SILVER",
]);
const VALID_TIMEFRAMES = new Set<Timeframe>([
  "1D",
  "5D",
  "1M",
  "3M",
  "6M",
  "1Y",
  "5Y",
]);

export async function GET(request: NextRequest) {
  const assetParam = (request.nextUrl.searchParams.get("asset") ?? "GOLD_24K") as MarketAssetId;
  const tfParam = (request.nextUrl.searchParams.get("timeframe") ?? "3M") as Timeframe;

  const asset = VALID_ASSETS.has(assetParam) ? assetParam : "GOLD_24K";
  const timeframe = VALID_TIMEFRAMES.has(tfParam) ? tfParam : "3M";

  const data = await getTechnicalIndicators(asset, timeframe);
  return NextResponse.json(data);
}
