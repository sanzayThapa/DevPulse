"use client";

import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { LatencyPoint } from "@/types/analytics";

export function LatencyChart({ data }: { data: LatencyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="p50Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="p99Grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.22)" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `${v}ms`} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid rgba(148,163,184,.25)", background: "rgba(15,23,42,.92)", color: "white" }}
          formatter={(value: number, name: string) => [`${value}ms`, name.toUpperCase()]}
        />
        <Legend />
        <Area type="monotone" dataKey="p50" name="p50" stroke="#10b981" strokeWidth={2} fill="url(#p50Grad)" dot={false} />
        <Area type="monotone" dataKey="p95" name="p95" stroke="#f59e0b" strokeWidth={2} fill="url(#p95Grad)" dot={false} />
        <Area type="monotone" dataKey="p99" name="p99" stroke="#ef4444" strokeWidth={2} fill="url(#p99Grad)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
