"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";
import type { LatencyPoint } from "@/types/analytics";

export function LatencyChart({ data }: { data: LatencyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartTheme.accent} stopOpacity={0.18} />
            <stop offset="95%" stopColor={chartTheme.accent} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#64748B" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="p99Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#475569" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#475569" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} tickFormatter={(v) => `${v}ms`} />
        <Tooltip
          contentStyle={chartTheme.tooltip}
          formatter={(value: number, name: string) => [`${value}ms`, name.toUpperCase()]}
        />
        <Legend />
        <Area type="monotone" dataKey="p50" name="p50" stroke={chartTheme.accent} strokeWidth={2} fill="url(#p50Grad)" dot={false} />
        <Area type="monotone" dataKey="p95" name="p95" stroke="#64748B" strokeWidth={2} fill="url(#p95Grad)" dot={false} />
        <Area type="monotone" dataKey="p99" name="p99" stroke="#475569" strokeWidth={2} fill="url(#p99Grad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
