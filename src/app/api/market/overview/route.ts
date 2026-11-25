import { NextRequest, NextResponse } from "next/server";
import { getMarketOverview } from "@/server/services/marketDataService";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city") ?? undefined;
  const overview = await getMarketOverview(city);
  return NextResponse.json(overview);
}
