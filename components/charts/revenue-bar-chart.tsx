"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";
import type { RevenueCategory } from "@/types/analytics";

export function RevenueBarChart({ data }: { data: RevenueCategory[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
        <Tooltip contentStyle={chartTheme.tooltip} />
        <Bar dataKey="revenue" radius={[4, 4, 0, 0]} fill={chartTheme.accent} />
      </BarChart>
    </ResponsiveContainer>
  );
}
