import { NextResponse } from "next/server";
import { getSensexMarketData } from "@/lib/services/marketDataService";
import { getIndianMarketStatus } from "@/server/services/marketCalendarService";

export async function GET() {
  const [{ quote, freshness }, marketStatus] = await Promise.all([
    getSensexMarketData(),
    Promise.resolve(getIndianMarketStatus()),
  ]);
  return NextResponse.json({ quote, freshness, marketStatus });
}
