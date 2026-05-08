"use client";

import { useEffect, useState } from "react";
import { Activity, Zap } from "lucide-react";
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
import { activeUsersData, baseMetrics, getLiveActiveUsersData, getLiveMetrics, getLiveTrafficData, revenueByCategory, trafficData, trafficSources } from "@/lib/data";
import type { ActiveUserPoint, Filters, Metric, TrafficPoint } from "@/types/analytics";

export function DashboardView({ mode = "dashboard" }: { mode?: "dashboard" | "analytics" }) {
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.key} metric={metric} />
        ))}
      </div>

      <InsightCards />

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
