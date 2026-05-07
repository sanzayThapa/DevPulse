"use client";

import { useState } from "react";
import { DollarSign, TrendingDown, TrendingUp, Users } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/filters/filter-bar";
import { ChartCard } from "@/components/charts/chart-card";
import { RevenueBarChart } from "@/components/charts/revenue-bar-chart";
import { revenueByCategory, revenueByPlan, revenueHistory } from "@/lib/data";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { Filters } from "@/types/analytics";

function StatCard({ label, value, delta, icon: Icon, positive = true }: { label: string; value: string; delta?: string; icon: React.ElementType; positive?: boolean }) {
  return (
    <div className="panel rounded-xl p-4">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-subtle" />
        <p className="text-xs font-medium text-subtle">{label}</p>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {delta && (
        <p className={`mt-0.5 flex items-center gap-1 text-xs font-medium ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {delta}
        </p>
      )}
    </div>
  );
}

function MrrChart({ data }: { data: typeof revenueHistory }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.22)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid rgba(148,163,184,.25)", background: "rgba(15,23,42,.92)", color: "white" }}
          formatter={(value: number, name: string) => [`$${value.toLocaleString()}`, name === "mrr" ? "MRR" : name === "newRevenue" ? "New Revenue" : "Churn"]}
        />
        <Legend />
        <Line type="monotone" dataKey="mrr" name="mrr" stroke="#06b6d4" strokeWidth={3} dot={false} />
        <Line type="monotone" dataKey="newRevenue" name="newRevenue" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="5 3" />
        <Line type="monotone" dataKey="churn" name="churn" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="5 3" />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function RevenueAnalyticsPage() {
  const [filters, setFilters] = useState<Filters>({ dateRange: "30d", category: "All categories", source: "All sources", project: "All projects" });

  const latestMrr = revenueHistory.at(-1)!;
  const prevMrr = revenueHistory.at(-2)!;
  const mrrGrowth = (((latestMrr.mrr - prevMrr.mrr) / prevMrr.mrr) * 100).toFixed(1);

  return (
    <ProtectedPage>
      <PageHeader title="Revenue Analytics" description="MRR, ARR, churn, and plan-level revenue breakdown." />
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Monthly Recurring Revenue" value={`$${latestMrr.mrr.toLocaleString()}`} delta={`+${mrrGrowth}% MoM`} icon={DollarSign} />
        <StatCard label="Annual Run Rate" value={`$${(latestMrr.mrr * 12).toLocaleString()}`} delta="+8.7% vs last year" icon={TrendingUp} />
        <StatCard label="New Revenue (Apr)" value={`$${latestMrr.newRevenue.toLocaleString()}`} delta="+6.5% MoM" icon={TrendingUp} />
        <StatCard label="Monthly Churn" value={`$${latestMrr.churn.toLocaleString()}`} delta="−10.5% MoM" icon={TrendingDown} positive={false} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="MRR trend (12 months)" eyebrow="Monthly recurring revenue">
          <MrrChart data={revenueHistory} />
        </ChartCard>
        <ChartCard title="Revenue by category" eyebrow="Commercial pulse">
          <RevenueBarChart data={revenueByCategory} />
        </ChartCard>
      </div>

      <div className="mt-6 panel rounded-xl overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <p className="text-sm font-semibold">Revenue by Plan</p>
          <p className="text-xs text-subtle mt-0.5">ARPU and subscriber count per tier</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-subtle">Plan</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Revenue</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Customers</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">ARPU</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Share</th>
              </tr>
            </thead>
            <tbody>
              {revenueByPlan.map((plan) => {
                const total = revenueByPlan.reduce((s, p) => s + p.revenue, 0);
                const share = ((plan.revenue / total) * 100).toFixed(1);
                return (
                  <tr key={plan.plan} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-subtle" />
                        <span className="font-medium">{plan.plan}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">${plan.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-subtle">{plan.users}</td>
                    <td className="px-4 py-3 text-right">${plan.arpu}/mo</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-brand-500" style={{ width: `${share}%` }} />
                        </div>
                        <span className="text-xs text-subtle w-10 text-right">{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedPage>
  );
}
