"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "../utils/cn";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  type?: ToastType;
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

const icons: Record<ToastType, React.ReactNode> = {
  info: <Info className="h-4 w-4 text-info-500" />,
  success: <CheckCircle2 className="h-4 w-4 text-success-500" />,
  warning: <AlertTriangle className="h-4 w-4 text-warning-500" />,
  error: <AlertCircle className="h-4 w-4 text-error-500" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, description, type = "info" }: Omit<ToastItem, "id">) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);
      setTimeout(() => {
        dismiss(id);
      }, 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2 px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.16 }}
              className={cn(
                "pointer-events-auto flex items-start gap-3 rounded-xl border border-grayscale-border bg-card p-4 text-card-foreground shadow-elevation-lg"
              )}
            >
              <span className="mt-0.5 shrink-0">
                {icons[item.type ?? "info"]}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-grayscale-textIcon-title">
                  {item.title}
                </p>
                {item.description && (
                  <p className="mt-0.5 text-xs text-grayscale-textIcon-body">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Close notification"
                className="rounded-md p-1 text-grayscale-textIcon-caption hover:bg-grayscale-surface-hover hover:text-grayscale-textIcon-title"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
