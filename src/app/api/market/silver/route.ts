import { NextResponse } from "next/server";
import { getSilverBenchmarkData } from "@/lib/services/marketDataService";

export async function GET() {
  const result = await getSilverBenchmarkData();
  return NextResponse.json(result);
}
