"use client";

import { useState } from "react";
import { Activity, Smartphone, Users } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { ChartCard } from "@/components/charts/chart-card";
import { ActiveAreaChart } from "@/components/charts/active-area-chart";
import { activeUsersData, featureUsage, userActivityData } from "@/lib/data";
import { FilterBar } from "@/components/filters/filter-bar";
import { chartTheme } from "@/components/charts/chart-theme";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { Filters } from "@/types/analytics";

function DauChart({ data }: { data: typeof userActivityData }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 11 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={chartTheme.tooltip}
          formatter={(value: number, name: string) => [value.toLocaleString(), name.toUpperCase()]}
        />
        <Legend />
        <Line type="monotone" dataKey="dau" name="dau" stroke={chartTheme.accent} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="wau" name="wau" stroke={chartTheme.accentSoft} strokeWidth={2} dot={false} strokeDasharray="5 3" />
        <Line type="monotone" dataKey="mau" name="mau" stroke="#64748B" strokeWidth={2} dot={false} strokeDasharray="3 3" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function UserActivityPage() {
  const [filters, setFilters] = useState<Filters>({ dateRange: "7d", category: "All categories", source: "All sources", project: "All projects" });

  const latest = userActivityData.at(-1)!;
  const dauWauRatio = ((latest.dau / latest.wau) * 100).toFixed(1);

  return (
    <ProtectedPage permission="view:analytics">
      <PageHeader title="User Activity" description="DAU, WAU, MAU, session patterns, and feature adoption." />
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel rounded-lg p-4">
          <div className="flex items-center gap-2"><Activity className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">Daily Active Users</p></div>
          <p className="mt-2 text-2xl font-bold">{latest.dau.toLocaleString()}</p>
          <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">+6.9% vs last week</p>
        </div>
        <div className="panel rounded-lg p-4">
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">Weekly Active Users</p></div>
          <p className="mt-2 text-2xl font-bold">{latest.wau.toLocaleString()}</p>
          <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">DAU/WAU: {dauWauRatio}%</p>
        </div>
        <div className="panel rounded-lg p-4">
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">Monthly Active Users</p></div>
          <p className="mt-2 text-2xl font-bold">{latest.mau.toLocaleString()}</p>
          <p className="mt-0.5 text-xs text-subtle">DAU/MAU: {((latest.dau / latest.mau) * 100).toFixed(1)}%</p>
        </div>
        <div className="panel rounded-lg p-4">
          <div className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">Mobile Share</p></div>
          <p className="mt-2 text-2xl font-bold">44.2%</p>
          <p className="mt-0.5 text-xs text-subtle">of all sessions</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="DAU / WAU / MAU" eyebrow="14-day user activity trend">
          <DauChart data={userActivityData} />
        </ChartCard>
        <ChartCard title="Mobile vs Desktop sessions" eyebrow="Weekly breakdown">
          <ActiveAreaChart data={activeUsersData} />
        </ChartCard>
      </div>

      <div className="mt-6 panel rounded-lg overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <p className="text-sm font-semibold">Feature Adoption</p>
          <p className="text-xs text-subtle mt-0.5">% of active users engaging with each feature</p>
        </div>
        <div className="divide-y divide-border">
          {featureUsage.map((feat, i) => (
            <div key={feat.feature} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition">
              <span className="w-4 text-xs text-subtle">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-sm font-medium">{feat.feature}</span>
                  <span className="text-sm font-semibold">{feat.users.toLocaleString()} users</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${feat.pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-subtle">{feat.pct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedPage>
  );
}
