import { randomUUID } from "node:crypto";
import type { MarketAlert, MarketAssetId } from "@/types/market";

const alertStore = new Map<string, MarketAlert>();
const MAX_ALERTS = 100;

export function listAlerts(): MarketAlert[] {
  return Array.from(alertStore.values()).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function createAlert(input: {
  asset: MarketAssetId;
  condition: MarketAlert["condition"];
  targetValue: number;
  unit: string;
}): MarketAlert {
  if (alertStore.size >= MAX_ALERTS) {
    const oldestKey = alertStore.keys().next().value;
    if (oldestKey) alertStore.delete(oldestKey);
  }
  const id = `alt_${randomUUID()}`;
  const alert: MarketAlert = {
    id,
    asset: input.asset,
    condition: input.condition,
    targetValue: input.targetValue,
    unit: input.unit,
    enabled: true,
    createdAt: new Date().toISOString(),
    triggeredAt: null,
    storageMode: "SERVER_MEMORY",
  };
  alertStore.set(id, alert);
  return alert;
}

export function updateAlert(
  id: string,
  patch: Partial<
    Pick<MarketAlert, "enabled" | "targetValue" | "condition" | "triggeredAt">
  >
): MarketAlert | null {
  const existing = alertStore.get(id);
  if (!existing) return null;

  const updated: MarketAlert = {
    ...existing,
    enabled:
      typeof patch.enabled === "boolean" ? patch.enabled : existing.enabled,
    targetValue:
      typeof patch.targetValue === "number" &&
      Number.isFinite(patch.targetValue) &&
      patch.targetValue > 0
        ? patch.targetValue
        : existing.targetValue,
    condition: patch.condition ?? existing.condition,
    triggeredAt:
      patch.triggeredAt !== undefined ? patch.triggeredAt : existing.triggeredAt,
  };

  alertStore.set(id, updated);
  return updated;
}

export function deleteAlert(id: string): boolean {
  return alertStore.delete(id);
}
