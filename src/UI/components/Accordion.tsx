"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils/cn";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
  className?: string;
}

/**
 * Accessible expand/collapse accordion list.
 */
export function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggleItem = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (isOpen) return prev.filter((item) => item !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div
      className={cn(
        "divide-y divide-grayscale-border rounded-2xl border border-grayscale-border bg-card",
        className
      )}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="overflow-hidden">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-grayscale-textIcon-title transition-colors hover:bg-grayscale-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 cursor-pointer"
            >
              <span>{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-grayscale-textIcon-caption transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 pt-1 text-sm text-grayscale-textIcon-body">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
