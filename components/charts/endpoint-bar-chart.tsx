"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";
import type { ApiEndpoint } from "@/types/analytics";

export function EndpointBarChart({ data, metric }: { data: ApiEndpoint[]; metric: "avgLatency" | "requestsPerMin" | "errorRate" }) {
  const sorted = [...data].sort((a, b) => b[metric] - a[metric]);

  const formatted = sorted.map((e) => ({
    name: `${e.method} ${e.path}`,
    value: e[metric]
  }));

  const COLORS: Record<typeof metric, string> = {
    avgLatency: chartTheme.accent,
    requestsPerMin: chartTheme.accentSoft,
    errorRate: "#64748B"
  };

  const LABELS: Record<typeof metric, string> = {
    avgLatency: "Avg latency (ms)",
    requestsPerMin: "Req/min",
    errorRate: "Error rate (%)"
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={formatted} layout="vertical" margin={{ left: 8, right: 24, top: 8, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.muted, fontSize: 10 }}
          width={160}
        />
        <Tooltip
          contentStyle={chartTheme.tooltip}
          formatter={(value: number) => [metric === "errorRate" ? `${value}%` : metric === "avgLatency" ? `${value}ms` : value, LABELS[metric]]}
        />
        <Bar dataKey="value" name={LABELS[metric]} fill={COLORS[metric]} fillOpacity={0.85} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
