"use client";

import { useState } from "react";
import { Globe, MousePointerClick, Timer, TrendingDown } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/filters/filter-bar";
import { ChartCard } from "@/components/charts/chart-card";
import { TrafficLineChart } from "@/components/charts/traffic-line-chart";
import { SourceDonutChart } from "@/components/charts/source-donut-chart";
import { dailyTrafficData, topPages, trafficData, trafficSources } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import type { Filters } from "@/types/analytics";

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub?: string; icon: React.ElementType }) {
  return (
    <div className="panel rounded-lg p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-subtle" />
        <p className="text-xs font-medium text-subtle">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-subtle">{sub}</p>}
    </div>
  );
}

export default function TrafficAnalyticsPage() {
  const [filters, setFilters] = useState<Filters>({ dateRange: "7d", category: "All categories", source: "All sources", project: "All projects" });

  const totalViews = dailyTrafficData.reduce((s, d) => s + d.pageViews, 0);
  const avgBounce = (dailyTrafficData.reduce((s, d) => s + d.bounceRate, 0) / dailyTrafficData.length).toFixed(1);
  const avgSession = Math.round(dailyTrafficData.reduce((s, d) => s + d.avgSessionDuration, 0) / dailyTrafficData.length);

  return (
    <ProtectedPage>
      <PageHeader title="Traffic Analytics" description="Visitors, page views, sessions, and acquisition channels over time." />
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Page Views" value={totalViews.toLocaleString()} sub="Last 14 days" icon={Globe} />
        <StatCard label="Unique Visitors" value="184,260" sub="+12.4% vs prior period" icon={MousePointerClick} />
        <StatCard label="Avg. Bounce Rate" value={`${avgBounce}%`} sub="-4.1% improvement" icon={TrendingDown} />
        <StatCard label="Avg. Session Duration" value={`${Math.floor(avgSession / 60)}m ${avgSession % 60}s`} sub="+18s vs last period" icon={Timer} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Traffic over time" eyebrow="Requests and visitors">
          <TrafficLineChart data={trafficData} />
        </ChartCard>
        <ChartCard title="Acquisition channels" eyebrow="Traffic source mix">
          <SourceDonutChart data={trafficSources} />
        </ChartCard>
      </div>

      <div className="mt-6 panel rounded-lg overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <p className="text-sm font-semibold">Top Pages</p>
          <p className="text-xs text-subtle mt-0.5">Ranked by page views in the selected period</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-subtle">Page</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Views</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Unique</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Bounce rate</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Avg. time</th>
              </tr>
            </thead>
            <tbody>
              {topPages.map((page, i) => (
                <tr key={page.path} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-subtle w-4">{i + 1}</span>
                      <code className="text-xs font-mono text-foreground">{page.path}</code>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{page.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-subtle">{page.unique.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Badge className={page.bounceRate > 45 ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900" : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"}>
                      {page.bounceRate}%
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-subtle">{page.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedPage>
  );
}
