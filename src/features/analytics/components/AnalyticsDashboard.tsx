"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  Bell,
  ChevronRight,
  Compass,
  DollarSign,
  Eye,
  FileText,
  Globe2,
  LayoutDashboard,
  MousePointerClick,
  Percent,
  Settings,
  TrendingDown,
  Users,
} from "lucide-react";
import {
  AreaChart,
  Avatar,
  Badge,
  BarChart,
  ChartCard,
  DashboardLayout,
  DateRangePicker,
  DonutChart,
  FunnelChart,
  GlassButton,
  GlassCard,
  LineChart,
  MetricCard,
  Modal,
  PieChart,
  RadarChart,
  SearchBar,
  Skeleton,
  Switch,
  ThemeToggle,
  TreemapChart,
  useDashboard,
  useToast,
  type DashboardNavItem,
} from "@/UI";
import { ANALYTICS_ACCENT_COLORS, CATEGORY_OPTIONS } from "@/lib/constants";
import { useAnalyticsFilter } from "../hooks/useAnalyticsFilter";
import type { AnalyticsChannel } from "../types/analytics";
import { AnimatedBackground } from "./AnimatedBackground";
import { CountryStatsPanel } from "./CountryStatsPanel";
import { ExportMenu } from "./ExportMenu";

const LazyWorldMap = dynamic(
  () => import("@/UI/maps/WorldMap").then((mod) => mod.WorldMap),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[340px] w-full rounded-2xl" />,
  }
);

const NAV_ITEMS: DashboardNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: "overview", label: "Overview", icon: <Compass className="h-4 w-4" /> },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "traffic", label: "Traffic", icon: <Activity className="h-4 w-4" /> },
  { id: "audience", label: "Audience", icon: <Users className="h-4 w-4" /> },
  { id: "geography", label: "Geography", icon: <Globe2 className="h-4 w-4" /> },
  { id: "reports", label: "Reports", icon: <FileText className="h-4 w-4" /> },
  { id: "settings", label: "Settings", icon: <Settings className="h-4 w-4" /> },
];

const KPI_ICONS: Record<string, React.ReactNode> = {
  visitors: <Users className="h-4 w-4" />,
  sessions: <Activity className="h-4 w-4" />,
  pageviews: <Eye className="h-4 w-4" />,
  bounce: <TrendingDown className="h-4 w-4" />,
  conversion: <Percent className="h-4 w-4" />,
  revenue: <DollarSign className="h-4 w-4" />,
};

export interface AnalyticsDashboardProps {
  userName?: string | null;
  userEmail?: string | null;
}

export function AnalyticsDashboard({
  userName,
  userEmail,
}: AnalyticsDashboardProps) {
  const { toast } = useToast();
  const {
    activeSection,
    setActiveSection,
    sidebarCollapsed,
    toggleSidebar,
    mobileMenuOpen,
    openMobileMenu,
    closeMobileMenu,
  } = useDashboard("dashboard");

  const {
    filters,
    analytics,
    setDateRange,
    setCustomDates,
    setChannel,
    setCountryId,
    setSearchQuery,
    toggleCompare,
  } = useAnalyticsFilter();

  const [barLayout, setBarLayout] = useState<"horizontal" | "vertical">("horizontal");
  const [notifOpen, setNotifOpen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const activeNav = NAV_ITEMS.find((n) => n.id === activeSection) ?? NAV_ITEMS[0];

  const headerContent = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400"
          >
            <Link href="/" className="hover:text-cyan-500">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span className="font-medium text-cyan-600 dark:text-cyan-400">
              {activeNav.label}
            </span>
          </nav>
          <div className="mt-1 flex items-center gap-2.5">
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
              Executive Web Analytics
            </h1>
            {analytics.selectedCountry && (
              <Badge variant="info" dot>
                {analytics.selectedCountry.name}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SearchBar
            value={filters.searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-56"
          />
          <GlassButton
            size="sm"
            aria-label="Notifications"
            onClick={() => setNotifOpen(true)}
            leftIcon={<Bell className="h-4 w-4 text-cyan-500" />}
          >
            <span className="hidden sm:inline">Alerts</span>
          </GlassButton>
          <ThemeToggle size="sm" />
          <ExportMenu countries={analytics.countries} />
          <div className="hidden md:flex items-center gap-2 pl-1">
            <Avatar
              size="sm"
              alt={userName ?? "Guest Analyst"}
              status="online"
            />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <DateRangePicker
          value={filters.dateRange}
          onChange={setDateRange}
          customStart={filters.customStart}
          customEnd={filters.customEnd}
          onCustomChange={setCustomDates}
        />

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-slate-200/80 bg-white/70 p-1 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            {CATEGORY_OPTIONS.map((opt) => {
              const active = filters.channel === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setChannel(opt.value as AnalyticsChannel)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <GlassButton
            size="sm"
            variant={filters.comparePrevious ? "accent" : "default"}
            onClick={toggleCompare}
          >
            Compare Period
          </GlassButton>
        </div>
      </div>
    </div>
  );

  const showOverview =
    activeSection === "dashboard" ||
    activeSection === "overview" ||
    activeSection === "analytics" ||
    activeSection === "traffic";
  const showAudience =
    activeSection === "dashboard" ||
    activeSection === "analytics" ||
    activeSection === "audience";
  const showGeography =
    activeSection === "dashboard" ||
    activeSection === "geography" ||
    activeSection === "reports";

  return (
    <DashboardLayout
      items={NAV_ITEMS}
      activeSection={activeSection}
      onSelectSection={setActiveSection}
      collapsed={sidebarCollapsed}
      onToggleCollapse={toggleSidebar}
      mobileOpen={mobileMenuOpen}
      onOpenMobile={openMobileMenu}
      onCloseMobile={closeMobileMenu}
      headerContent={headerContent}
    >
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col gap-6">
        {/* 6 KPI Metric Cards */}
        <section aria-label="Key performance indicators">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {analytics.kpis.map((kpi, idx) => (
              <MetricCard
                key={kpi.id}
                index={idx}
                label={kpi.label}
                value={kpi.value}
                change={kpi.change}
                sparkline={kpi.sparkline}
                icon={KPI_ICONS[kpi.id]}
                prefix={kpi.prefix}
                suffix={kpi.suffix}
                decimals={kpi.decimals}
                compact={kpi.compact}
                accentColor={kpi.accentColor}
                invertTrend={kpi.invertTrend}
              />
            ))}
          </div>
        </section>

        {/* Settings panel when Settings section is selected */}
        {activeSection === "settings" && (
          <GlassCard className="flex flex-col gap-4">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">
              Dashboard Preferences
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {userName
                ? `Signed in as ${userName} (${userEmail ?? "Clerk verified"}).`
                : "Viewing in sample analytics mode."}
            </p>
            <Switch
              checked={autoRefresh}
              onCheckedChange={(val) => {
                setAutoRefresh(val);
                toast({
                  type: "info",
                  title: "Preference updated",
                  description: `Auto-sync ${val ? "enabled" : "paused"}.`,
                });
              }}
              label="Real-time UI transitions"
              description="Enable smooth animated counters and chart updates on filter changes."
            />
          </GlassCard>
        )}

        {/* Primary Charts Row: Area + Donut */}
        {showOverview && (
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <ChartCard
              className="xl:col-span-2"
              title="Traffic & Session Velocity"
              subtitle="Visitors and sessions across the selected timeframe"
              isEmpty={analytics.timeSeries.length === 0}
            >
              <AreaChart
                data={analytics.timeSeries}
                xKey="date"
                series={[
                  {
                    key: "visitors",
                    name: "Visitors",
                    color: ANALYTICS_ACCENT_COLORS.cyan,
                  },
                  {
                    key: "sessions",
                    name: "Sessions",
                    color: ANALYTICS_ACCENT_COLORS.electricBlue,
                  },
                ]}
              />
            </ChartCard>

            <ChartCard
              title="Channel Distribution"
              subtitle="Share of traffic by acquisition source"
              isEmpty={analytics.categories.length === 0}
            >
              <DonutChart
                data={analytics.categories.map((c) => ({
                  name: c.name,
                  value: c.value,
                  color: c.color,
                }))}
                centerLabel="Visitors"
              />
            </ChartCard>
          </section>
        )}

        {/* Secondary Charts Row: Bar (horizontal/vertical) + Line comparison */}
        {showOverview && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Channel Performance Comparison"
              subtitle="Current vs. previous period by acquisition channel"
              isEmpty={analytics.categories.length === 0}
              action={
                <GlassButton
                  size="sm"
                  onClick={() =>
                    setBarLayout((l) =>
                      l === "horizontal" ? "vertical" : "horizontal"
                    )
                  }
                >
                  {barLayout === "horizontal" ? "Horizontal" : "Vertical"}
                </GlassButton>
              }
            >
              <BarChart
                data={analytics.categories.map((c) => ({
                  name: c.name,
                  current: c.value,
                  previous: c.previousValue,
                }))}
                xKey="name"
                layout={barLayout}
                series={[
                  {
                    key: "current",
                    name: "Current",
                    color: ANALYTICS_ACCENT_COLORS.electricBlue,
                  },
                  {
                    key: "previous",
                    name: "Previous",
                    color: ANALYTICS_ACCENT_COLORS.violet,
                  },
                ]}
              />
            </ChartCard>

            <ChartCard
              title="Period-over-Period Growth"
              subtitle="Daily visitor trajectory with optional baseline comparison"
              isEmpty={analytics.timeSeries.length === 0}
            >
              <LineChart
                data={analytics.timeSeries}
                xKey="date"
                series={[
                  {
                    key: "visitors",
                    name: "Current Period",
                    color: ANALYTICS_ACCENT_COLORS.emerald,
                  },
                  ...(filters.comparePrevious
                    ? [
                        {
                          key: "previousVisitors",
                          name: "Previous Period",
                          color: ANALYTICS_ACCENT_COLORS.softOrange,
                          dashed: true,
                        },
                      ]
                    : []),
                ]}
              />
            </ChartCard>
          </section>
        )}

        {/* Interactive World Map + Country Panel */}
        {showGeography && (
          <section>
            <ChartCard
              title="Global Audience Geography"
              subtitle="Interactive world map — hover markers for metrics or click a country to filter the entire dashboard"
              isEmpty={analytics.countries.length === 0}
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <LazyWorldMap
                    markers={analytics.countries}
                    selectedCountryId={filters.countryId}
                    onSelectCountry={(country) =>
                      setCountryId(country ? country.id : null)
                    }
                  />
                </div>
                <CountryStatsPanel
                  countries={analytics.countries}
                  selectedCountryId={filters.countryId}
                  onSelect={setCountryId}
                />
              </div>
            </ChartCard>
          </section>
        )}

        {/* Advanced Visualizations Row: Treemap + Radar + Funnel + Pie */}
        {showAudience && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Acquisition Treemap"
              subtitle="Proportional traffic volume by channel"
              isEmpty={analytics.categories.length === 0}
            >
              <TreemapChart
                data={analytics.categories.map((c) => ({
                  name: c.name,
                  size: c.value,
                  color: c.color,
                }))}
              />
            </ChartCard>

            <ChartCard
              title="Multi-Dimensional Health Radar"
              subtitle="Current product funnel health vs. target benchmark"
            >
              <RadarChart
                data={analytics.radar.map((r) => ({ ...r }))}
                angleKey="metric"
                series={[
                  {
                    key: "current",
                    name: "Current Score",
                    color: ANALYTICS_ACCENT_COLORS.cyan,
                  },
                  {
                    key: "benchmark",
                    name: "Benchmark",
                    color: ANALYTICS_ACCENT_COLORS.violet,
                  },
                ]}
              />
            </ChartCard>

            <ChartCard
              title="Conversion Funnel"
              subtitle="Stage-by-stage user progression and drop-off rates"
              action={
                <span className="inline-flex items-center gap-1 text-xs text-cyan-500">
                  <MousePointerClick className="h-3.5 w-3.5" />
                  Live filter synced
                </span>
              }
            >
              <FunnelChart data={analytics.funnel} />
            </ChartCard>

            <ChartCard
              title="Channel Mix Breakdown"
              subtitle="Proportional channel split"
              isEmpty={analytics.categories.length === 0}
            >
              <PieChart
                data={analytics.categories.map((c) => ({
                  name: c.name,
                  value: c.value,
                  color: c.color,
                }))}
              />
            </ChartCard>
          </section>
        )}
      </div>

      <Modal
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        title="Analytics Alerts"
        description="Recent threshold notifications from your sample dataset."
      >
        <div className="flex flex-col gap-3 text-sm">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p className="font-semibold text-emerald-600 dark:text-emerald-300">
              India traffic +22.4%
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Organic search sessions exceeded weekly baseline.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3">
            <p className="font-semibold text-cyan-600 dark:text-cyan-300">
              Conversion rate at 4.38%
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Checkout drop-off improved by 2.1% over the last 30 days.
            </p>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
