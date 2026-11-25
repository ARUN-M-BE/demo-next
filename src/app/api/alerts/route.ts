import { NextRequest, NextResponse } from "next/server";
import { createAlert, listAlerts } from "@/server/services/alertService";
import type { MarketAlert, MarketAssetId } from "@/types/market";

const VALID_ASSETS = new Set<MarketAssetId>([
  "GOLD_24K",
  "GOLD_22K",
  "GOLD_18K",
  "SILVER",
]);
const VALID_CONDITIONS = new Set<MarketAlert["condition"]>([
  "ABOVE",
  "BELOW",
  "PERCENT_CHANGE",
]);

export async function GET() {
  return NextResponse.json({ alerts: listAlerts() });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const asset = body.asset as MarketAssetId;
    const condition = body.condition as MarketAlert["condition"];
    const targetValue = body.targetValue;
    const unit =
      typeof body.unit === "string" && body.unit.trim().length <= 16
        ? body.unit.trim()
        : "INR";

    if (
      !VALID_ASSETS.has(asset) ||
      !VALID_CONDITIONS.has(condition) ||
      typeof targetValue !== "number" ||
      !Number.isFinite(targetValue) ||
      targetValue <= 0
    ) {
      return NextResponse.json(
        { error: "Invalid alert payload." },
        { status: 400 }
      );
    }

    const alert = createAlert({
      asset,
      condition,
      targetValue,
      unit,
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse request body." },
      { status: 400 }
    );
  }
}
