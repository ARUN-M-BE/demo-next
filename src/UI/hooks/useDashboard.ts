"use client";

import { useCallback, useState } from "react";

export type DashboardSection =
  | "overview"
  | "sensex"
  | "gold"
  | "silver"
  | "comparison"
  | "indicators"
  | "alerts";

export function useDashboard(initialSection: DashboardSection = "overview") {
  const [activeSection, setActiveSection] =
    useState<DashboardSection>(initialSection);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = useCallback(
    () => setSidebarCollapsed((prev) => !prev),
    []
  );
  const openMobileMenu = useCallback(() => setMobileMenuOpen(true), []);
  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  return {
    activeSection,
    setActiveSection,
    sidebarCollapsed,
    toggleSidebar,
    mobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  };
}
