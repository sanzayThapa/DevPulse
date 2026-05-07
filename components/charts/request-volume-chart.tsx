"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type VolumePoint = { time: string; success: number; failed: number };

export function RequestVolumeChart({ data }: { data: VolumePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ left: -12, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.22)" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid rgba(148,163,184,.25)", background: "rgba(15,23,42,.92)", color: "white" }}
          formatter={(value: number, name: string) => [value.toLocaleString(), name === "success" ? "Successful" : "Failed"]}
        />
        <Legend />
        <Bar dataKey="success" name="success" stackId="a" fill="#10b981" fillOpacity={0.85} radius={[0, 0, 0, 0]} />
        <Bar dataKey="failed" name="failed" stackId="a" fill="#ef4444" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
