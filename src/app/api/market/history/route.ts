import { NextRequest, NextResponse } from "next/server";
import { getUnifiedPriceHistory } from "@/lib/services/priceHistoryService";
import type { MarketAssetId, Timeframe } from "@/types/market";

const VALID_ASSETS = new Set<MarketAssetId>([
  "SENSEX",
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
  const assetParam = (request.nextUrl.searchParams.get("asset") ?? "SENSEX") as MarketAssetId;
  const tfParam = (request.nextUrl.searchParams.get("timeframe") ?? "1M") as Timeframe;

  const asset = VALID_ASSETS.has(assetParam) ? assetParam : "SENSEX";
  const timeframe = VALID_TIMEFRAMES.has(tfParam) ? tfParam : "1M";

  const data = await getUnifiedPriceHistory(asset, timeframe);
  return NextResponse.json(data);
}
