import { NextResponse } from "next/server";
import { getGoldBenchmarkData } from "@/lib/services/marketDataService";

export async function GET() {
  const result = await getGoldBenchmarkData();
  return NextResponse.json(result);
}
