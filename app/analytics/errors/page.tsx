"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle, EyeOff, XCircle } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { ChartCard } from "@/components/charts/chart-card";
import { ErrorRateChart } from "@/components/charts/error-rate-chart";
import { errorEvents, errorRateHistory } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ErrorEvent } from "@/types/analytics";

const STATUS_META: Record<ErrorEvent["status"], { label: string; icon: React.ElementType; color: string; bg: string }> = {
  active: { label: "Active", icon: XCircle, color: "text-red-500", bg: "bg-red-50 border-red-200 text-red-700 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300" },
  resolved: { label: "Resolved", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300" },
  ignored: { label: "Ignored", icon: EyeOff, color: "text-subtle", bg: "bg-muted border-border text-subtle" }
};

type StatusFilter = "all" | ErrorEvent["status"];

export default function ErrorMonitoringPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const filtered = statusFilter === "all" ? errorEvents : errorEvents.filter((e) => e.status === statusFilter);

  const activeCount = errorEvents.filter((e) => e.status === "active").length;
  const totalErrors = errorEvents.reduce((s, e) => s + e.count, 0);

  return (
    <ProtectedPage>
      <PageHeader title="Error Monitoring" description="Live error events, types, impacted endpoints, and resolution status." />

      {activeCount > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 dark:border-red-900 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">{activeCount} active error{activeCount !== 1 ? "s" : ""} require attention</p>
            <p className="text-xs text-red-600/80 dark:text-red-400">Review and resolve issues below to maintain SLA compliance</p>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="panel rounded-xl p-4">
          <div className="flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" /><p className="text-xs font-medium text-subtle">Active errors</p></div>
          <p className="mt-2 text-2xl font-bold text-red-600 dark:text-red-400">{activeCount}</p>
        </div>
        <div className="panel rounded-xl p-4">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">Total occurrences</p></div>
          <p className="mt-2 text-2xl font-bold">{totalErrors.toLocaleString()}</p>
          <p className="mt-0.5 text-xs text-subtle">Last 24 hours</p>
        </div>
        <div className="panel rounded-xl p-4">
          <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /><p className="text-xs font-medium text-subtle">Error rate</p></div>
          <p className="mt-2 text-2xl font-bold">0.42%</p>
          <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">−0.08% vs yesterday</p>
        </div>
      </div>

      <div className="mt-6">
        <ChartCard title="Error rate over time" eyebrow="Errors per hour (last 24h)">
          <ErrorRateChart data={errorRateHistory} />
        </ChartCard>
      </div>

      <div className="mt-6 panel rounded-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <p className="text-sm font-semibold">Error Events</p>
            <p className="text-xs text-subtle mt-0.5">Grouped by type and endpoint</p>
          </div>
          <div className="flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
            {(["all", "active", "resolved", "ignored"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn("rounded-md px-3 py-1 text-xs font-medium capitalize transition", statusFilter === s ? "bg-panel shadow-sm text-foreground" : "text-subtle hover:text-foreground")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-border">
          {filtered.map((err) => {
            const meta = STATUS_META[err.status];
            const StatusIcon = meta.icon;
            return (
              <div key={err.id} className="flex items-start gap-4 px-6 py-4 hover:bg-muted/30 transition">
                <StatusIcon className={cn("mt-0.5 h-4 w-4 shrink-0", meta.color)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-xs font-mono font-semibold">{err.type}</code>
                    <Badge className={meta.bg}>{meta.label}</Badge>
                    <code className="text-[11px] font-mono text-subtle">{err.endpoint}</code>
                  </div>
                  <p className="mt-1 text-sm text-subtle">{err.message}</p>
                  <div className="mt-1.5 flex items-center gap-3 text-[11px] text-subtle/70">
                    <span>{err.id}</span>
                    <span>·</span>
                    <span>{err.count.toLocaleString()} occurrences</span>
                    <span>·</span>
                    <span>Last seen {err.lastSeen}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold">{err.count}</p>
                  <p className="text-[11px] text-subtle">events</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ProtectedPage>
  );
}
