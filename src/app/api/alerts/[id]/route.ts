import { NextRequest, NextResponse } from "next/server";
import { deleteAlert, updateAlert } from "@/server/services/alertService";
import type { MarketAlert } from "@/types/market";

const VALID_CONDITIONS = new Set<MarketAlert["condition"]>([
  "ABOVE",
  "BELOW",
  "PERCENT_CHANGE",
]);

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const patch: Partial<
      Pick<MarketAlert, "enabled" | "targetValue" | "condition" | "triggeredAt">
    > = {};

    if (typeof body.enabled === "boolean") {
      patch.enabled = body.enabled;
    }
    if (
      typeof body.targetValue === "number" &&
      Number.isFinite(body.targetValue) &&
      body.targetValue > 0
    ) {
      patch.targetValue = body.targetValue;
    }
    if (
      typeof body.condition === "string" &&
      VALID_CONDITIONS.has(body.condition as MarketAlert["condition"])
    ) {
      patch.condition = body.condition as MarketAlert["condition"];
    }
    if (body.triggeredAt === null || typeof body.triggeredAt === "string") {
      patch.triggeredAt = body.triggeredAt;
    }

    const updated = updateAlert(id, patch);
    if (!updated) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }
    return NextResponse.json({ alert: updated });
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const removed = deleteAlert(id);
  if (!removed) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }
  return NextResponse.json({ deleted: true });
}
