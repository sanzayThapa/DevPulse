"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";
import type { TrafficPoint } from "@/types/analytics";

export function TrafficLineChart({ data }: { data: TrafficPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000}k`} />
        <Tooltip contentStyle={chartTheme.tooltip} />
        <Legend />
        <Line type="monotone" dataKey="visitors" stroke={chartTheme.accent} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="requests" stroke={chartTheme.accentSoft} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
