"use client";

import { Activity, ArrowDownRight, ArrowUpRight, CircleDollarSign, MousePointer2, RadioTower, ServerCrash, Users } from "lucide-react";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";
import { formatMetric } from "@/lib/utils";
import type { Metric, MetricKey } from "@/types/analytics";

const icons: Record<MetricKey, React.ElementType> = {
  visitors: MousePointer2,
  revenue: CircleDollarSign,
  apiRequests: RadioTower,
  errorRate: ServerCrash,
  activeUsers: Users,
  conversionRate: Activity
};

export function MetricCard({ metric }: { metric: Metric }) {
  const Icon = icons[metric.key];
  const positive = metric.delta >= 0;
  const data = metric.sparkline.map((value, index) => ({ index, value }));

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">{metric.label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{formatMetric(metric.value, metric.unit)}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-muted/55">
          <Icon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${positive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"}`}>
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(metric.delta)}%
        </div>
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="value" stroke={positive ? "#10b981" : "#ef4444"} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
