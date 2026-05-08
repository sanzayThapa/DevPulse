"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CircleDollarSign,
  FileText,
  Gauge,
  RadioTower,
  Server,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { MetricCard } from "@/components/cards/metric-card";
import { ChartCard } from "@/components/charts/chart-card";
import { TrafficLineChart } from "@/components/charts/traffic-line-chart";
import { ActiveAreaChart } from "@/components/charts/active-area-chart";
import { RevenueBarChart } from "@/components/charts/revenue-bar-chart";
import { SourceDonutChart } from "@/components/charts/source-donut-chart";
import { FilterBar } from "@/components/filters/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { InsightCards } from "@/components/insights/insight-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { activeUsersData, baseMetrics, getLiveActiveUsersData, getLiveMetrics, getLiveTrafficData, revenueByCategory, trafficData, trafficSources } from "@/lib/data";
import type { ActiveUserPoint, Filters, Metric, Role, TrafficPoint } from "@/types/analytics";

type RoleWidget = {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
  tone?: "accent" | "neutral" | "warning" | "danger";
};

const roleWidgets: Record<Role, RoleWidget[]> = {
  admin: [
    { label: "Revenue", value: "$92.4k", description: "+12.8% monthly recurring revenue", icon: CircleDollarSign, tone: "accent" },
    { label: "User Growth", value: "18.4k", description: "1,204 new users this week", icon: Users },
    { label: "API Usage", value: "8.9M", description: "Requests across production projects", icon: RadioTower },
    { label: "System Health", value: "99.98%", description: "Platform uptime over 30 days", icon: ShieldCheck, tone: "accent" },
    { label: "Subscriptions", value: "1,284", description: "Active paid workspaces", icon: TrendingUp },
    { label: "Critical Errors", value: "7", description: "Require admin review", icon: AlertTriangle, tone: "danger" },
    { label: "Server Status", value: "Nominal", description: "All regions responding normally", icon: Server, tone: "accent" }
  ],
  manager: [
    { label: "Team Productivity", value: "87%", description: "Completed weekly objectives", icon: Users, tone: "accent" },
    { label: "Conversion Rate", value: "6.8%", description: "+0.9% against last sprint", icon: TrendingUp, tone: "accent" },
    { label: "Weekly Reports", value: "14", description: "Ready for review and export", icon: FileText },
    { label: "Campaign Performance", value: "42k", description: "Qualified sessions from active campaigns", icon: BarChart3 }
  ],
  viewer: [
    { label: "Personal Activity", value: "24", description: "Reports viewed this month", icon: Activity, tone: "accent" },
    { label: "Usage Overview", value: "68%", description: "Workspace insights consumed", icon: Gauge },
    { label: "Assigned Reports", value: "5", description: "Read-only reports awaiting review", icon: FileText }
  ]
};

function RoleWidgetCard({ widget }: { widget: RoleWidget }) {
  const Icon = widget.icon;
  const toneClass = {
    accent: "border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400",
    neutral: "border-border bg-muted text-subtle",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    danger: "border-red-500/30 bg-red-500/10 text-red-500"
  }[widget.tone ?? "neutral"];

  return (
    <section className="panel rounded-lg p-4 transition-colors hover:border-brand-500/25">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">{widget.label}</p>
          <p className="mt-2 text-2xl font-semibold">{widget.value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-md border ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-5 text-subtle">{widget.description}</p>
    </section>
  );
}

export function DashboardView({ mode = "dashboard" }: { mode?: "dashboard" | "analytics" }) {
  const { role } = useAuth();
  const [metrics, setMetrics] = useState<Metric[]>(baseMetrics);
  const [traffic, setTraffic] = useState<TrafficPoint[]>(trafficData);
  const [activeUsers, setActiveUsers] = useState<ActiveUserPoint[]>(activeUsersData);
  const [filters, setFilters] = useState<Filters>({
    dateRange: "7d",
    category: "All categories",
    source: "All sources",
    project: "All projects"
  });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setMetrics(getLiveMetrics());
      setTraffic(getLiveTrafficData());
      setActiveUsers(getLiveActiveUsersData());
      setTick((current) => current + 1);
    }, 5000);
    return () => window.clearInterval(interval);
  }, []);

  const isAnalytics = mode === "analytics";
  const widgets = roleWidgets[role];

  return (
    <>
      <PageHeader
        title={isAnalytics ? "Analytics" : "Performance Dashboard"}
        description={
          isAnalytics
            ? "Explore acquisition, engagement, revenue, and reliability trends with filters ready for a real API."
            : "Monitor traffic, revenue, API health, and conversion activity as if a production stream is flowing in."
        }
      >
        <div className="flex gap-2">
          <Badge className="border-brand-500/25 bg-brand-500/10 text-brand-700 dark:text-brand-300">
            <Activity className="h-3.5 w-3.5" />
            refresh {tick}
          </Badge>
          <Button variant="primary">
            <Zap className="h-4 w-4" />
            Deploy view
          </Button>
        </div>
      </PageHeader>

      <FilterBar filters={filters} onChange={setFilters} />

      {isAnalytics ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard key={metric.key} metric={metric} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {widgets.map((widget) => (
            <RoleWidgetCard key={widget.label} widget={widget} />
          ))}
        </div>
      )}

      {role !== "viewer" ? <InsightCards /> : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Traffic over time" eyebrow="Requests and visitors">
          <TrafficLineChart data={traffic} />
        </ChartCard>
        <ChartCard title="Active users" eyebrow="Weekly sessions">
          <ActiveAreaChart data={activeUsers} />
        </ChartCard>
        <ChartCard title="Revenue by category" eyebrow="Commercial pulse">
          <RevenueBarChart data={revenueByCategory} />
        </ChartCard>
        <ChartCard title="Traffic sources" eyebrow="Acquisition mix">
          <SourceDonutChart data={trafficSources} />
        </ChartCard>
      </div>
    </>
  );
}
