import { NextRequest, NextResponse } from "next/server";
import { fetchGoldMarketData } from "@/server/providers/goldProvider";

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get("city") ?? undefined;
  const data = await fetchGoldMarketData(city);
  return NextResponse.json(data);
}
