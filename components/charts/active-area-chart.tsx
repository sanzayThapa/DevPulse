"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";
import type { ActiveUserPoint } from "@/types/analytics";

export function ActiveAreaChart({ data }: { data: ActiveUserPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <defs>
          <linearGradient id="users" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={chartTheme.accent} stopOpacity={0.2} />
            <stop offset="100%" stopColor={chartTheme.accent} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
        <Tooltip contentStyle={chartTheme.tooltip} />
        <Area type="monotone" dataKey="users" stroke={chartTheme.accent} strokeWidth={2} fill="url(#users)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
