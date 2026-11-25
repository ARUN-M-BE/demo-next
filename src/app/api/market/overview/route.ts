import { NextResponse } from "next/server";
import { getFullMarketOverview } from "@/lib/services/marketDataService";

export async function GET() {
  const overview = await getFullMarketOverview();
  return NextResponse.json(overview);
}
