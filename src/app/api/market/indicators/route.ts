import { NextRequest, NextResponse } from "next/server";
import { getTechnicalIndicators } from "@/lib/services/marketDataService";
import type { MarketAssetId, Timeframe } from "@/types/market";

export async function GET(request: NextRequest) {
  const asset = (request.nextUrl.searchParams.get("asset") ?? "GOLD_24K") as MarketAssetId;
  const timeframe = (request.nextUrl.searchParams.get("timeframe") ?? "3M") as Timeframe;

  const data = await getTechnicalIndicators(asset, timeframe);
  return NextResponse.json(data);
}
