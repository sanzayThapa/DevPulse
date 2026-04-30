"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { TrafficSource } from "@/types/analytics";

export function SourceDonutChart({ data }: { data: TrafficSource[] }) {
  return (
    <div className="grid h-full grid-cols-1 items-center gap-4 sm:grid-cols-[1.15fr_.85fr]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="source" innerRadius={62} outerRadius={96} paddingAngle={4}>
            {data.map((entry) => (
              <Cell key={entry.source} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid rgba(148,163,184,.25)", background: "rgba(15,23,42,.92)", color: "white" }} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.source} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-subtle">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.source}
            </span>
            <span className="font-semibold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
