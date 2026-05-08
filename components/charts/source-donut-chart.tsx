"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";
import type { TrafficSource } from "@/types/analytics";

const DONUT_COLORS = [chartTheme.accent, "#64748B", "#475569", "#334155"];

export function SourceDonutChart({ data }: { data: TrafficSource[] }) {
  return (
    <div className="grid h-full grid-cols-1 items-center gap-4 sm:grid-cols-[1.15fr_.85fr]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="source" innerRadius={62} outerRadius={96} paddingAngle={4}>
            {data.map((entry, index) => (
              <Cell key={entry.source} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={chartTheme.tooltip} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={item.source} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-subtle">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
              {item.source}
            </span>
            <span className="font-semibold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
