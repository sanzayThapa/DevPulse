"use client";

import { AlertTriangle, ArrowDownRight, ArrowUpRight, Coins, RefreshCw, TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { chartTheme } from "@/components/charts/chart-theme";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useLiveCryptoPrices } from "@/hooks/use-live-crypto-prices";
import { cn, formatMetric } from "@/lib/utils";
import type { CryptoAsset, CryptoHistoryPoint } from "@/types/live-data";

function formatCurrency(value: number) {
  if (value >= 1000000) return formatMetric(value, "currency");

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2
  }).format(value);
}

function formatTime(date: Date | null) {
  if (!date) return "Waiting for first sync";
  return new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit", second: "2-digit" }).format(date);
}

function CryptoMetricCard({ asset }: { asset: CryptoAsset }) {
  const positive = asset.change24h >= 0;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">{asset.name}</p>
          <p className="mt-2 text-2xl font-semibold tracking-normal">{formatCurrency(asset.priceUsd)}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-muted/55">
          <Coins className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
            positive
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
          )}
        >
          {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(asset.change24h).toFixed(2)}%
        </span>
        <span className="text-xs font-medium text-subtle">24h</span>
      </div>
    </Card>
  );
}

function LoadingState() {
  return (
    <section className="mt-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-2 h-6 w-52" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
      <Skeleton className="mt-4 h-80" />
    </section>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <section className="panel mt-6 rounded-lg p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-md border border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-300">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Live Data unavailable</h2>
            <p className="mt-1 text-sm text-subtle">{message}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    </section>
  );
}

function PriceChart({ data }: { data: CryptoHistoryPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ left: -8, right: 12, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: chartTheme.muted, fontSize: 12 }} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: chartTheme.muted, fontSize: 12 }}
          tickFormatter={(value) => `$${new Intl.NumberFormat("en", { notation: "compact" }).format(Number(value))}`}
        />
        <Tooltip contentStyle={chartTheme.tooltip} formatter={(value) => formatCurrency(Number(value))} />
        <Line type="monotone" dataKey="Bitcoin" stroke={chartTheme.accent} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Ethereum" stroke={chartTheme.accentSoft} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="Solana" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function LiveDataSection() {
  const { data, error, isLoading, isRefreshing, lastUpdated, refetch } = useLiveCryptoPrices(30000);

  if (isLoading && !data) return <LoadingState />;
  if (!data && error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  const positiveAverage = data.averageChange24h >= 0;
  const chartData = data.history.length > 1 ? data.history : [data.history[0] ?? {
    time: "Live",
    Bitcoin: data.assets[0]?.priceUsd ?? 0,
    Ethereum: data.assets[1]?.priceUsd ?? 0,
    Solana: data.assets[2]?.priceUsd ?? 0
  }];

  return (
    <section className="mt-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">Live Data</p>
          <h2 className="mt-1 text-lg font-semibold">Crypto market pulse</h2>
          <p className="mt-1 text-sm text-subtle">Public CoinGecko prices refresh automatically every 30 seconds.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {error ? (
            <Badge className="border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5" />
              Last refresh failed
            </Badge>
          ) : (
            <Badge className="border-brand-500/25 bg-brand-500/10 text-brand-700 dark:text-brand-300">
              <span className="h-2 w-2 rounded-full bg-brand-500" />
              Synced {formatTime(lastUpdated)}
            </Badge>
          )}
          <Button variant="secondary" className="h-9 px-3" onClick={refetch} disabled={isRefreshing}>
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.assets.map((asset) => (
          <CryptoMetricCard key={asset.id} asset={asset} />
        ))}
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">Market snapshot</p>
              <p className="mt-2 text-2xl font-semibold tracking-normal">{formatMetric(data.totalMarketCapUsd, "currency")}</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-muted/55">
              <TrendingUp className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold",
                positiveAverage
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
              )}
            >
              {positiveAverage ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {Math.abs(data.averageChange24h).toFixed(2)}%
            </span>
            <span className="text-xs font-medium text-subtle">Avg change</span>
          </div>
        </Card>
      </div>

      <Card className="mt-4 min-h-[360px]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
              Price stream
            </p>
            <h3 className="mt-1 text-[15px] font-semibold text-foreground">BTC, ETH, and SOL in USD</h3>
          </div>
          <Badge>
            Leader: {data.strongestAsset.symbol} {data.strongestAsset.change24h.toFixed(2)}%
          </Badge>
        </div>
        <div className="h-72">
          <PriceChart data={chartData} />
        </div>
      </Card>
    </section>
  );
}
