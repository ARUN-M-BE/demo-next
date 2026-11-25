"use client";

import React, { createContext, useCallback, useEffect, useState } from "react";
import { type Theme, themeConfig } from "./theme-config";

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
  defaultTheme = themeConfig.defaultTheme,
  storageKey = themeConfig.storageKey,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  const applyTheme = useCallback((nextTheme: Theme) => {
    const root = document.documentElement;
    const effective = nextTheme === "system" ? getSystemTheme() : nextTheme;
    root.classList.remove("light", "dark");
    root.classList.add(effective);
    root.style.colorScheme = effective;
    setResolvedTheme(effective);
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      const initial =
        stored === "light" || stored === "dark" || stored === "system"
          ? stored
          : defaultTheme;
      setThemeState(initial);
      applyTheme(initial);
    } catch {
      applyTheme(defaultTheme);
    }
  }, [applyTheme, defaultTheme, storageKey]);

  const setTheme = useCallback(
    (nextTheme: Theme) => {
      setThemeState(nextTheme);
      applyTheme(nextTheme);
      try {
        localStorage.setItem(storageKey, nextTheme);
      } catch {
        // Ignore storage errors
      }
    },
    [applyTheme, storageKey]
  );

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, resolvedTheme, setTheme, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
