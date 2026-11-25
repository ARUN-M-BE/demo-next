import { NextRequest, NextResponse } from "next/server";
import { fetchSilverMarketData } from "@/server/providers/silverProvider";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city") ?? undefined;
  const data = await fetchSilverMarketData(city);
  return NextResponse.json(data);
}
