"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";

type VolumePoint = { time: string; success: number; failed: number };

export function RequestVolumeChart({ data }: { data: VolumePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={chartTheme.tooltip}
          formatter={(value: number, name: string) => [value.toLocaleString(), name === "success" ? "Successful" : "Failed"]}
        />
        <Legend />
        <Bar dataKey="success" name="success" stackId="a" fill={chartTheme.accent} fillOpacity={0.85} radius={[0, 0, 0, 0]} />
        <Bar dataKey="failed" name="failed" stackId="a" fill="#64748B" fillOpacity={0.7} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
