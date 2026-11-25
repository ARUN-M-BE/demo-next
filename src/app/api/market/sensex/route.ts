import { NextResponse } from "next/server";
import { fetchSensexQuote } from "@/server/providers/sensexProvider";
import { getIndianMarketStatus } from "@/server/services/marketCalendarService";

export async function GET() {
  const [quote, marketStatus] = await Promise.all([
    fetchSensexQuote(),
    Promise.resolve(getIndianMarketStatus()),
  ]);
  return NextResponse.json({ quote, marketStatus });
}
