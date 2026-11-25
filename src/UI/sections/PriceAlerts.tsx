"use client";

import React, { useEffect, useState } from "react";
import { Bell, BellRing, Plus, Trash2 } from "lucide-react";
import { useMarketStore } from "@/store/marketStore";
import type { MarketAlert, MarketAssetId } from "@/types/market";
import { AlertDialog } from "../components/AlertDialog";
import { GlassButton } from "../components/GlassButton";
import { GlassCard } from "../components/GlassCard";
import { Switch } from "../components/Switch";
import { useToast } from "../components/Toast";

export function PriceAlerts() {
  const { alerts, fetchAlerts } = useMarketStore();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notifPerm, setNotifPerm] = useState("default");

  useEffect(() => {
    void fetchAlerts();
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPerm(Notification.permission);
    }
  }, [fetchAlerts]);

  const requestNotificationPermission = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
    toast({
      type: perm === "granted" ? "success" : "info",
      title: `Notifications ${perm}`,
      description:
        perm === "granted"
          ? "Browser-local price alerts enabled."
          : "Permission was not granted.",
    });
  };

  const handleCreate = async (payload: {
    asset: MarketAssetId;
    condition: MarketAlert["condition"];
    targetValue: number;
    unit: string;
  }) => {
    const res = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await fetchAlerts();
      toast({
        type: "success",
        title: "Alert Created",
        description: `Watching ${payload.asset} ${payload.condition} ${payload.targetValue} ${payload.unit}.`,
      });
    }
  };

  const handleToggle = async (alert: MarketAlert) => {
    await fetch(`/api/alerts/${alert.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !alert.enabled }),
    });
    await fetchAlerts();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/alerts/${id}`, { method: "DELETE" });
    await fetchAlerts();
    toast({ type: "info", title: "Alert Deleted" });
  };

  return (
    <section aria-label="Price Alerts" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Price Alert Rules
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browser-local &amp; server-memory alerts evaluated against incoming quotes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <GlassButton
            size="sm"
            onClick={requestNotificationPermission}
            leftIcon={<BellRing className="h-3.5 w-3.5 text-cyan-500" />}
          >
            Browser Alerts: {notifPerm}
          </GlassButton>
          <GlassButton
            variant="accent"
            size="sm"
            onClick={() => setDialogOpen(true)}
            leftIcon={<Plus className="h-3.5 w-3.5" />}
          >
            New Alert
          </GlassButton>
        </div>
      </div>

      {alerts.length === 0 ? (
        <GlassCard className="flex flex-col items-center justify-center gap-2 py-10 text-center">
          <Bell className="h-7 w-7 text-slate-400" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
            No active price alerts configured
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Example: Notify when 24K Gold exceeds ₹15,000 per gram.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {alerts.map((alert) => (
            <GlassCard key={alert.id} padding="sm" className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {alert.asset} &bull; {alert.condition}{" "}
                  {alert.targetValue.toLocaleString("en-IN")} {alert.unit}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                  Created {new Date(alert.createdAt).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={alert.enabled}
                  onCheckedChange={() => void handleToggle(alert)}
                />
                <button
                  type="button"
                  onClick={() => void handleDelete(alert.id)}
                  aria-label="Delete alert"
                  className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      <AlertDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />
    </section>
  );
}
