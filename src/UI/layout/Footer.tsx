import React from "react";
import Link from "next/link";
import { cn } from "../utils/cn";

export interface FooterProps {
  brandName?: string;
  className?: string;
}

export function Footer({ brandName = "AstraStudio", className }: FooterProps) {
  return (
    <footer
      className={cn(
        "mt-auto border-t border-grayscale-border bg-grayscale-surface-subtle/50",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs text-grayscale-textIcon-body sm:flex-row sm:px-6 lg:px-8">
        <p>
          &copy; 2026 {brandName}. Built with Next.js,
          UI Astra &amp; Clerk.
        </p>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="transition-colors hover:text-grayscale-textIcon-title"
          >
            Market Terminal
          </Link>
          <Link
            href="/dashboard"
            className="transition-colors hover:text-grayscale-textIcon-title"
          >
            Analytics Workspace
          </Link>
        </div>
      </div>
    </footer>
  );
}
