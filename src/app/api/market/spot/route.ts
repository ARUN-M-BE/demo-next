import { NextResponse } from "next/server";
import { getSpotMarketData } from "@/lib/services/marketDataService";

export async function GET() {
  const result = await getSpotMarketData();
  return NextResponse.json(result);
}
