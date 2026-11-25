import React from "react";
import Link from "next/link";
import { cn } from "../utils/cn";

export interface FooterProps {
  brandName?: string;
  className?: string;
}

export function Footer({
  brandName = "MARKET INTELLIGENCE",
  className,
}: FooterProps) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-slate-200/70 bg-white/60 backdrop-blur-md dark:border-white/10 dark:bg-[#07111F]/90",
        className
      )}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6 lg:px-8">
        <p>
          &copy; 2026 {brandName}. Sources: IBJA (api.dharun.dev) &amp; XAUS Spot
          (xaus.com).
        </p>
        <div className="flex items-center gap-5">
          <Link href="/" className="hover:text-cyan-500">
            Market Terminal
          </Link>
          <Link href="/dashboard" className="hover:text-cyan-500">
            Analytics Workspace
          </Link>
        </div>
      </div>
    </footer>
  );
}
