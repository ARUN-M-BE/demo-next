import type { MarketAlert, MarketAssetId } from "@/types/market";

const alertStore = new Map<string, MarketAlert>();

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
  const id = `alt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
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
  patch: Partial<Pick<MarketAlert, "enabled" | "targetValue" | "condition" | "triggeredAt">>
): MarketAlert | null {
  const existing = alertStore.get(id);
  if (!existing) return null;
  const updated: MarketAlert = { ...existing, ...patch };
  alertStore.set(id, updated);
  return updated;
}

export function deleteAlert(id: string): boolean {
  return alertStore.delete(id);
}
