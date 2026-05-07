"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, Clock, Zap } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { ChartCard } from "@/components/charts/chart-card";
import { LatencyChart } from "@/components/charts/latency-chart";
import { EndpointBarChart } from "@/components/charts/endpoint-bar-chart";
import { RequestVolumeChart } from "@/components/charts/request-volume-chart";
import { apiEndpoints, getLiveLatencyData, latencyHistory, requestVolumeHistory } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { LatencyPoint } from "@/types/analytics";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900",
  POST: "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/40 dark:text-brand-100 dark:border-brand-900",
  PUT: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900",
  DELETE: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
  PATCH: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900"
};

type EndpointMetric = "avgLatency" | "requestsPerMin" | "errorRate";

export default function ApiPerformancePage() {
  const [latency, setLatency] = useState<LatencyPoint[]>(latencyHistory);
  const [endpointMetric, setEndpointMetric] = useState<EndpointMetric>("avgLatency");

  useEffect(() => {
    const interval = window.setInterval(() => setLatency(getLiveLatencyData()), 5000);
    return () => clearInterval(interval);
  }, []);

  const totalRpm = apiEndpoints.reduce((s, e) => s + e.requestsPerMin, 0);
  const avgLatency = Math.round(apiEndpoints.reduce((s, e) => s + e.avgLatency, 0) / apiEndpoints.length);
  const p99 = Math.max(...latency.map((p) => p.p99));
  const overallErrorRate = (apiEndpoints.reduce((s, e) => s + e.errorRate, 0) / apiEndpoints.length).toFixed(2);

  return (
    <ProtectedPage>
      <PageHeader title="API Performance" description="Latency percentiles, throughput, endpoint health, and error distribution." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel rounded-xl p-4">
          <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">Total Req/min</p></div>
          <p className="mt-2 text-2xl font-bold">{totalRpm.toLocaleString()}</p>
          <p className="mt-0.5 text-xs text-subtle">Across all endpoints</p>
        </div>
        <div className="panel rounded-xl p-4">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">Avg. Latency</p></div>
          <p className="mt-2 text-2xl font-bold">{avgLatency}ms</p>
          <p className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">Below 100ms SLA</p>
        </div>
        <div className="panel rounded-xl p-4">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">p99 Latency</p></div>
          <p className="mt-2 text-2xl font-bold">{p99}ms</p>
          <p className="mt-0.5 text-xs text-amber-600 dark:text-amber-400">Peak window 10–12:00</p>
        </div>
        <div className="panel rounded-xl p-4">
          <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-subtle" /><p className="text-xs font-medium text-subtle">Error Rate</p></div>
          <p className="mt-2 text-2xl font-bold">{overallErrorRate}%</p>
          <p className="mt-0.5 text-xs text-red-500">Above 0.3% threshold</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Latency percentiles" eyebrow="p50 · p95 · p99 over 24h">
          <LatencyChart data={latency} />
        </ChartCard>
        <ChartCard title="Request volume" eyebrow="Success vs failed requests">
          <RequestVolumeChart data={requestVolumeHistory} />
        </ChartCard>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <p className="text-sm font-semibold">Endpoint breakdown</p>
          <div className="ml-auto flex gap-1 rounded-lg border border-border bg-muted/50 p-1">
            {(["avgLatency", "requestsPerMin", "errorRate"] as EndpointMetric[]).map((m) => (
              <button
                key={m}
                onClick={() => setEndpointMetric(m)}
                className={cn("rounded-md px-3 py-1 text-xs font-medium transition", endpointMetric === m ? "bg-panel shadow-sm text-foreground" : "text-subtle hover:text-foreground")}
              >
                {m === "avgLatency" ? "Latency" : m === "requestsPerMin" ? "Req/min" : "Error rate"}
              </button>
            ))}
          </div>
        </div>
        <ChartCard title="" eyebrow="">
          <EndpointBarChart data={apiEndpoints} metric={endpointMetric} />
        </ChartCard>
      </div>

      <div className="mt-6 panel rounded-xl overflow-hidden">
        <div className="border-b border-border px-6 py-4">
          <p className="text-sm font-semibold">All Endpoints</p>
          <p className="text-xs text-subtle mt-0.5">Performance summary per route</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-semibold text-subtle">Endpoint</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Avg latency</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">p95</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Req/min</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Error rate</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-subtle">Health</th>
              </tr>
            </thead>
            <tbody>
              {apiEndpoints.map((ep) => (
                <tr key={`${ep.method}:${ep.path}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Badge className={METHOD_COLORS[ep.method]}>{ep.method}</Badge>
                      <code className="text-xs font-mono">{ep.path}</code>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{ep.avgLatency}ms</td>
                  <td className="px-4 py-3 text-right text-subtle">{ep.p95Latency}ms</td>
                  <td className="px-4 py-3 text-right">{ep.requestsPerMin.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={cn("font-medium", ep.errorRate > 0.4 ? "text-red-500" : ep.errorRate > 0.2 ? "text-amber-500" : "text-emerald-600 dark:text-emerald-400")}>
                      {ep.errorRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {ep.errorRate < 0.2 ? (
                      <CheckCircle className="mx-auto h-4 w-4 text-emerald-500" />
                    ) : ep.errorRate < 0.4 ? (
                      <AlertTriangle className="mx-auto h-4 w-4 text-amber-500" />
                    ) : (
                      <AlertTriangle className="mx-auto h-4 w-4 text-red-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedPage>
  );
}
