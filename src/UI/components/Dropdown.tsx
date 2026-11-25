"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../utils/cn";

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger?: React.ReactNode;
  label?: string;
  items: DropdownItem[];
  align?: "left" | "right";
  className?: string;
}

/**
 * Interactive dropdown menu with outside-click and Escape key dismissal.
 */
export function Dropdown({
  trigger,
  label = "Options",
  items,
  align = "left",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {trigger ? (
        <div
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen((prev) => !prev);
            }
          }}
        >
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-grayscale-border bg-grayscale-surface-subtle px-3.5 text-sm font-medium text-grayscale-textIcon-title transition-colors hover:bg-grayscale-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          <span>{label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-grayscale-textIcon-caption transition-transform duration-150",
              open && "rotate-180"
            )}
          />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute z-40 mt-2 min-w-48 rounded-xl border border-grayscale-border bg-popover p-1.5 text-popover-foreground shadow-elevation-md",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onClick?.();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  "disabled:pointer-events-none disabled:opacity-40",
                  item.danger
                    ? "text-error-textIcon-link-label hover:bg-error-surface-subtle dark:hover:bg-error-950/50"
                    : "text-grayscale-textIcon-title hover:bg-grayscale-surface-hover"
                )}
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
