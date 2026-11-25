"use client";

import React, { useState } from "react";
import { cn } from "../utils/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  value?: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

/**
 * Accessible tabs component supporting both controlled and uncontrolled modes.
 */
export function Tabs({
  items,
  defaultTab,
  value,
  onChange,
  className,
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(
    defaultTab ?? items[0]?.id ?? ""
  );
  const activeId = value ?? internalTab;

  const handleSelect = (id: string) => {
    if (value === undefined) setInternalTab(id);
    onChange?.(id);
  };

  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        role="tablist"
        className="inline-flex w-full flex-wrap gap-1 rounded-xl border border-grayscale-border bg-grayscale-surface-subtle p-1 sm:w-fit"
      >
        {items.map((tab) => {
          const isActive = tab.id === activeItem?.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => handleSelect(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                "disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
                isActive
                  ? "bg-card text-grayscale-textIcon-title shadow-elevation-xs"
                  : "text-grayscale-textIcon-body hover:text-grayscale-textIcon-title"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      {activeItem && (
        <div role="tabpanel" className="focus:outline-none">
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
