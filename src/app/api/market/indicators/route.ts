import { NextRequest, NextResponse } from "next/server";
import { getIndicatorsForAsset } from "@/server/services/marketDataService";
import type { MarketAssetId, Timeframe } from "@/types/market";

export async function GET(request: NextRequest) {
  const asset = (request.nextUrl.searchParams.get("asset") ?? "SENSEX") as MarketAssetId;
  const timeframe = (request.nextUrl.searchParams.get("timeframe") ?? "3M") as Timeframe;
  const city = request.nextUrl.searchParams.get("city") ?? undefined;

  const data = await getIndicatorsForAsset(asset, timeframe, city);
  return NextResponse.json(data);
}
