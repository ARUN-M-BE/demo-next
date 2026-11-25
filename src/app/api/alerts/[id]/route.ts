import { NextRequest, NextResponse } from "next/server";
import { deleteAlert, updateAlert } from "@/server/services/alertService";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = (await request.json()) as {
    enabled?: boolean;
    targetValue?: number;
    condition?: "ABOVE" | "BELOW" | "PERCENT_CHANGE";
    triggeredAt?: string | null;
  };

  const updated = updateAlert(id, body);
  if (!updated) {
    return NextResponse.json({ error: "Alert not found" }, { status: 404 });
  }
  return NextResponse.json({ alert: updated });
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
