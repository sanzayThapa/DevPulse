"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";

type ErrorRatePoint = { time: string; rate: number; count: number };

export function ErrorRateChart({ data }: { data: ErrorRatePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
        <Tooltip
          contentStyle={chartTheme.tooltip}
          formatter={(value: number, name: string) => [name === "rate" ? `${value}%` : value, name === "rate" ? "Error rate" : "Error count"]}
        />
        <Bar dataKey="rate" name="rate" fill="#64748B" fillOpacity={0.75} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
