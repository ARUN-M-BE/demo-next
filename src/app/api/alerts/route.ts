import { NextRequest, NextResponse } from "next/server";
import { createAlert, listAlerts } from "@/server/services/alertService";
import type { MarketAlert, MarketAssetId } from "@/types/market";

export async function GET() {
  return NextResponse.json({ alerts: listAlerts() });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      asset?: MarketAssetId;
      condition?: MarketAlert["condition"];
      targetValue?: number;
      unit?: string;
    };

    if (
      !body.asset ||
      !body.condition ||
      typeof body.targetValue !== "number" ||
      Number.isNaN(body.targetValue)
    ) {
      return NextResponse.json(
        { error: "Invalid alert payload." },
        { status: 400 }
      );
    }

    const alert = createAlert({
      asset: body.asset,
      condition: body.condition,
      targetValue: body.targetValue,
      unit: body.unit ?? "INR",
    });

    return NextResponse.json({ alert }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to parse request body." },
      { status: 400 }
    );
  }
}
