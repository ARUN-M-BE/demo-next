import React from "react";
import { cn } from "../utils/cn";

export interface PageContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: "md" | "lg" | "xl" | "7xl";
}

const maxWidthMap: Record<
  NonNullable<PageContainerProps["maxWidth"]>,
  string
> = {
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
  "7xl": "max-w-7xl",
};

export function PageContainer({
  children,
  maxWidth = "7xl",
  className,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 sm:px-6 lg:px-8",
        maxWidthMap[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
