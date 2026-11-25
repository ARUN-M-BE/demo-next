"use client";

import React, { useState } from "react";
import { BellPlus } from "lucide-react";
import type { MarketAlert, MarketAssetId } from "@/types/market";
import { Button } from "./Button";
import { Input } from "./Input";
import { Modal } from "./Modal";
import { Select } from "./Select";

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (payload: {
    asset: MarketAssetId;
    condition: MarketAlert["condition"];
    targetValue: number;
    unit: string;
  }) => Promise<void>;
}

export function AlertDialog({ open, onClose, onSubmit }: AlertDialogProps) {
  const [asset, setAsset] = useState<MarketAssetId>("GOLD_24K");
  const [condition, setCondition] = useState<MarketAlert["condition"]>("ABOVE");
  const [targetValue, setTargetValue] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const unit =
    condition === "PERCENT_CHANGE"
      ? "%"
      : asset === "SENSEX"
      ? "PTS"
      : "INR/g";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const numeric = Number(targetValue);
    if (!targetValue.trim() || Number.isNaN(numeric) || numeric <= 0) {
      setError("Enter a valid positive threshold value.");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ asset, condition, targetValue: numeric, unit });
      setTargetValue("");
      setError("");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create Price Alert"
      description="Browser-local & server-memory alert evaluated against incoming market quotes."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="price-alert-form"
            isLoading={saving}
            leftIcon={<BellPlus className="h-4 w-4" />}
          >
            Create Alert
          </Button>
        </>
      }
    >
      <form
        id="price-alert-form"
        onSubmit={handleSave}
        className="flex flex-col gap-4"
      >
        <Select
          label="Market Asset"
          value={asset}
          onChange={(e) => setAsset(e.target.value as MarketAssetId)}
          options={[
            { value: "SENSEX", label: "BSE SENSEX (Index)" },
            { value: "GOLD_24K", label: "24K Gold (per gram)" },
            { value: "GOLD_22K", label: "22K Gold (per gram)" },
            { value: "GOLD_18K", label: "18K Gold (per gram)" },
            { value: "SILVER", label: "Silver (per gram)" },
          ]}
        />
        <Select
          label="Trigger Condition"
          value={condition}
          onChange={(e) =>
            setCondition(e.target.value as MarketAlert["condition"])
          }
          options={[
            { value: "ABOVE", label: "Price Above Threshold" },
            { value: "BELOW", label: "Price Below Threshold" },
            { value: "PERCENT_CHANGE", label: "Daily % Move Exceeds" },
          ]}
        />
        <Input
          label={`Target Value (${unit})`}
          type="number"
          step="any"
          placeholder={asset === "SENSEX" ? "e.g. 82500" : "e.g. 15000"}
          value={targetValue}
          onChange={(e) => {
            setTargetValue(e.target.value);
            setError("");
          }}
          error={error}
          required
        />
      </form>
    </Modal>
  );
}
