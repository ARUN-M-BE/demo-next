"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../utils/cn";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium",
    "transition-all duration-150 cursor-pointer select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary-surface text-neutral-1150 hover:bg-primary-surface-dark border border-primary-border shadow-elevation-xs",
        secondary:
          "bg-grayscale-surface text-grayscale-textIcon-title border border-grayscale-border hover:bg-grayscale-surface-hover hover:border-grayscale-border-hover",
        outline:
          "bg-transparent text-grayscale-textIcon-title border border-grayscale-border hover:bg-grayscale-surface-hover hover:border-grayscale-border-hover",
        ghost:
          "bg-transparent text-grayscale-textIcon-subtitle hover:bg-grayscale-surface-hover hover:text-grayscale-textIcon-title",
        danger:
          "bg-error-surface text-white hover:bg-error-surface-dark border border-error-border-hover shadow-elevation-xs",
        dark:
          "bg-button-surface text-grayscale-textIcon-text-button hover:bg-button-surface-hover border border-button-border",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Reusable UI Astra button supporting variants, sizes, loading state, and icons.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
