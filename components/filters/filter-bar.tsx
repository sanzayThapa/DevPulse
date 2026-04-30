"use client";

import { CalendarDays, Filter } from "lucide-react";
import { categories, projects, sources } from "@/lib/data";
import type { Filters } from "@/types/analytics";

const ranges: Filters["dateRange"][] = ["24h", "7d", "30d", "90d"];

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs font-medium text-subtle">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="focus-ring h-10 rounded-lg border border-border bg-panel px-3 text-sm font-medium text-foreground"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function FilterBar({ filters, onChange }: { filters: Filters; onChange: (filters: Filters) => void }) {
  return (
    <div className="panel mb-6 rounded-xl p-4">
      <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_1fr_1fr]">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-subtle">
          Date range
          <div className="flex rounded-lg border border-border bg-panel p-1">
            {ranges.map((range) => (
              <button
                key={range}
                className={`focus-ring flex h-8 flex-1 items-center justify-center gap-1 rounded-md text-sm font-semibold transition ${filters.dateRange === range ? "bg-foreground text-canvas dark:bg-white dark:text-ink-950" : "text-subtle hover:text-foreground"}`}
                onClick={() => onChange({ ...filters, dateRange: range })}
              >
                {range === "24h" ? <CalendarDays className="h-3.5 w-3.5" /> : null}
                {range}
              </button>
            ))}
          </div>
        </label>
        <Select label="Category" value={filters.category} onChange={(category) => onChange({ ...filters, category })} options={["All categories", ...categories]} />
        <Select label="Traffic source" value={filters.source} onChange={(source) => onChange({ ...filters, source })} options={["All sources", ...sources]} />
        <Select label="Project" value={filters.project} onChange={(project) => onChange({ ...filters, project })} options={["All projects", ...projects]} />
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-subtle">
        <Filter className="h-3.5 w-3.5" />
        Filters update the mock API query shape and are ready to map to Django REST query params.
      </div>
    </div>
  );
}
