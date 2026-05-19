"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import {
  Activity,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Cpu,
  Database,
  Globe2,
  HardDrive,
  Network,
  Server,
  TriangleAlert,
  Wifi
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { chartTheme } from "@/components/charts/chart-theme";
import { cn } from "@/lib/utils";

type HealthStatus = "Healthy" | "Warning" | "Critical";
type RegionKey = "us-east-1" | "eu-west-1" | "ap-south-1" | "ap-northeast-1";

type HealthPoint = {
  time: string;
  cpu: number;
  memory: number;
  latency: number;
  connections: number;
};

const regions: Record<RegionKey, { label: string; city: string; baseLatency: number; load: number; uptime: number }> = {
  "us-east-1": { label: "US East", city: "Virginia", baseLatency: 42, load: 1, uptime: 99.982 },
  "eu-west-1": { label: "EU West", city: "Dublin", baseLatency: 58, load: 0.94, uptime: 99.967 },
  "ap-south-1": { label: "AP South", city: "Mumbai", baseLatency: 73, load: 1.12, uptime: 99.941 },
  "ap-northeast-1": { label: "AP Northeast", city: "Tokyo", baseLatency: 65, load: 1.04, uptime: 99.955 }
};

const statusStyles: Record<HealthStatus, { badge: string; text: string; bar: string; dot: string; icon: React.ElementType }> = {
  Healthy: {
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-600 dark:text-emerald-400",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    icon: CheckCircle2
  },
  Warning: {
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-600 dark:text-amber-400",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
    icon: TriangleAlert
  },
  Critical: {
    badge: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300",
    text: "text-red-600 dark:text-red-400",
    bar: "bg-red-500",
    dot: "bg-red-500",
    icon: CircleAlert
  }
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function jitter(value: number, amount: number, min: number, max: number) {
  return Math.round(clamp(value + (Math.random() - 0.5) * amount, min, max));
}

function statusFor(value: number, warning: number, critical: number): HealthStatus {
  if (value >= critical) return "Critical";
  if (value >= warning) return "Warning";
  return "Healthy";
}

function latencyStatus(value: number): HealthStatus {
  if (value >= 180) return "Critical";
  if (value >= 110) return "Warning";
  return "Healthy";
}

function dbStatus(cpu: number, memory: number, latency: number): HealthStatus {
  if (cpu > 88 || memory > 90 || latency > 185) return "Critical";
  if (cpu > 74 || memory > 78 || latency > 120) return "Warning";
  return "Healthy";
}

function initialSeries(region: RegionKey): HealthPoint[] {
  const config = regions[region];
  return Array.from({ length: 18 }, (_, index) => {
    const drift = Math.sin(index / 2.4);
    return {
      time: `${String(index + 7).padStart(2, "0")}:00`,
      cpu: Math.round(clamp((48 + drift * 16) * config.load, 18, 92)),
      memory: Math.round(clamp((62 + Math.cos(index / 2) * 10) * config.load, 32, 94)),
      latency: Math.round(clamp(config.baseLatency + drift * 18 + index * 1.2, 24, 210)),
      connections: Math.round(clamp((1180 + drift * 280 + index * 34) * config.load, 420, 3400))
    };
  });
}

function ProgressIndicator({ value, status }: { value: number; status: HealthStatus }) {
  return (
    <div className="mt-4">
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-700 ease-out", statusStyles[status].bar)}
          style={{ width: `${clamp(value, 0, 100)}%` }}
        />
      </div>
    </div>
  );
}

function MetricPanel({
  label,
  value,
  suffix,
  detail,
  icon: Icon,
  status,
  progress
}: {
  label: string;
  value: string | number;
  suffix?: string;
  detail: string;
  icon: React.ElementType;
  status: HealthStatus;
  progress: number;
}) {
  const StatusIcon = statusStyles[status].icon;

  return (
    <section className="panel rounded-lg p-4 transition-colors hover:border-brand-500/25">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-medium text-subtle">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </div>
          <p className="mt-3 text-2xl font-semibold">
            {value}
            {suffix ? <span className="ml-1 text-sm font-medium text-subtle">{suffix}</span> : null}
          </p>
        </div>
        <Badge className={statusStyles[status].badge}>
          <StatusIcon className="h-3.5 w-3.5" />
          {status}
        </Badge>
      </div>
      <ProgressIndicator value={progress} status={status} />
      <p className="mt-3 text-xs leading-5 text-subtle">{detail}</p>
    </section>
  );
}

function MiniBars({ data }: { data: HealthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data.slice(-12)} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 11 }} />
        <YAxis hide />
        <Tooltip contentStyle={chartTheme.tooltip} formatter={(value: number) => [`${value}%`, "Utilization"]} />
        <Bar dataKey="memory" fill="#64748B" radius={[4, 4, 0, 0]} isAnimationActive />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SystemHealthView() {
  const [region, setRegion] = useState<RegionKey>("us-east-1");
  const [series, setSeries] = useState<HealthPoint[]>(() => initialSeries("us-east-1"));
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setSeries(initialSeries(region));
    setTick(0);
  }, [region]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSeries((current) => {
        const last = current[current.length - 1];
        const config = regions[region];
        const next: HealthPoint = {
          time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
          cpu: jitter(last.cpu, 18 * config.load, 16, 96),
          memory: jitter(last.memory, 12 * config.load, 35, 96),
          latency: jitter(last.latency, 28, config.baseLatency - 12, 230),
          connections: jitter(last.connections, 420 * config.load, 380, 3900)
        };
        return [...current.slice(-17), next];
      });
      setTick((current) => current + 1);
    }, 3200);

    return () => window.clearInterval(interval);
  }, [region]);

  const latest = series[series.length - 1];
  const uptime = useMemo(() => clamp(regions[region].uptime - Math.max(0, latest.latency - 120) * 0.002, 99.7, 99.999), [latest.latency, region]);
  const database = dbStatus(latest.cpu, latest.memory, latest.latency);
  const overall: HealthStatus = database === "Critical" || latest.cpu > 90 ? "Critical" : database === "Warning" || latest.memory > 78 ? "Warning" : "Healthy";

  const connectionLoad = Math.round((latest.connections / 3900) * 100);

  return (
    <>
      <PageHeader
        title="System Health Monitoring"
        description="Real-time infrastructure telemetry for compute, memory, uptime, latency, connections, and database readiness."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={statusStyles[overall].badge}>
            <span className={cn("h-2 w-2 rounded-full", statusStyles[overall].dot)} />
            {overall}
          </Badge>
          <Badge>
            <Activity className="h-3.5 w-3.5" />
            refresh {tick}
          </Badge>
        </div>
      </PageHeader>

      <div className="mb-5 flex flex-col gap-3 rounded-lg border border-border bg-panel p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-brand-500/25 bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Globe2 className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Server region</p>
            <p className="text-xs text-subtle">{regions[region].city} edge cluster · mocked live telemetry</p>
          </div>
        </div>
        <select
          value={region}
          onChange={(event) => setRegion(event.target.value as RegionKey)}
          className="focus-ring h-10 rounded-md border border-border bg-muted/45 px-3 text-sm font-medium outline-none"
        >
          {Object.entries(regions).map(([key, item]) => (
            <option key={key} value={key}>
              {item.label} · {key}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricPanel label="CPU Usage" value={latest.cpu} suffix="%" detail="Container worker pool utilization" icon={Cpu} status={statusFor(latest.cpu, 72, 88)} progress={latest.cpu} />
        <MetricPanel label="Memory Usage" value={latest.memory} suffix="%" detail="Resident memory across active services" icon={HardDrive} status={statusFor(latest.memory, 76, 90)} progress={latest.memory} />
        <MetricPanel label="Server Uptime" value={uptime.toFixed(3)} suffix="%" detail="Availability over the current 30-day window" icon={Clock3} status={uptime < 99.9 ? "Warning" : "Healthy"} progress={uptime} />
        <MetricPanel label="Latency" value={latest.latency} suffix="ms" detail="Regional p95 response latency" icon={Wifi} status={latencyStatus(latest.latency)} progress={Math.min(100, (latest.latency / 220) * 100)} />
        <MetricPanel label="Active Connections" value={latest.connections.toLocaleString()} detail="Open socket and API gateway sessions" icon={Network} status={statusFor(connectionLoad, 72, 88)} progress={connectionLoad} />
        <MetricPanel label="Database Status" value={database} detail="Primary PostgreSQL writer and replica sync" icon={Database} status={database} progress={database === "Healthy" ? 96 : database === "Warning" ? 68 : 32} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="min-h-[360px] xl:col-span-2">
          <CardHeader title="Resource utilization" eyebrow="CPU and memory trend" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -14, right: 10, top: 8 }}>
                <defs>
                  <linearGradient id="healthCpu" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor={chartTheme.accent} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={chartTheme.accent} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="healthMemory" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#64748B" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#64748B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} tickFormatter={(value) => `${value}%`} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(value: number, name: string) => [`${value}%`, name.toUpperCase()]} />
                <Area type="monotone" dataKey="cpu" stroke={chartTheme.accent} strokeWidth={2} fill="url(#healthCpu)" dot={false} isAnimationActive />
                <Area type="monotone" dataKey="memory" stroke="#64748B" strokeWidth={2} fill="url(#healthMemory)" dot={false} isAnimationActive />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="min-h-[360px]">
          <CardHeader title="Memory pressure" eyebrow="Recent samples" />
          <div className="h-72">
            <MiniBars data={series} />
          </div>
        </Card>

        <Card className="min-h-[360px]">
          <CardHeader title="Latency" eyebrow="p95 response time" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series} margin={{ left: -14, right: 12, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} tickFormatter={(value) => `${value}ms`} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(value: number) => [`${value}ms`, "Latency"]} />
                <Line type="monotone" dataKey="latency" stroke="#F59E0B" strokeWidth={2.5} dot={false} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="min-h-[360px] xl:col-span-2">
          <CardHeader title="Active connections" eyebrow="Gateway session load" />
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -4, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id="connectionsGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(value: number) => [value.toLocaleString(), "Connections"]} />
                <Area type="monotone" dataKey="connections" stroke="#38BDF8" strokeWidth={2.5} fill="url(#connectionsGrad)" dot={false} isAnimationActive />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {[
          { name: "API gateway", status: latencyStatus(latest.latency), note: `${latest.latency}ms p95 latency`, icon: Server },
          { name: "Primary database", status: database, note: database === "Healthy" ? "Replica lag under 20ms" : "Replica lag elevated", icon: Database },
          { name: "Network edge", status: overall, note: `${latest.connections.toLocaleString()} live connections`, icon: Network }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <section key={item.name} className="panel rounded-lg p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-muted/45">
                    <Icon className="h-4 w-4 text-subtle" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="truncate text-xs text-subtle">{item.note}</p>
                  </div>
                </div>
                <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", statusStyles[item.status].dot)} />
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
