"use client";

import { AlertTriangle, ArrowDown, ArrowUp, Minus, Sparkles } from "lucide-react";
import { insightCards } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { InsightCard } from "@/types/analytics";

const TYPE_STYLES: Record<InsightCard["type"], { border: string; bg: string; badge: string; icon: string }> = {
  positive: {
    border: "border-emerald-200 dark:border-emerald-900",
    bg: "bg-emerald-50/60 dark:bg-emerald-950/20",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
    icon: "text-emerald-500"
  },
  negative: {
    border: "border-red-200 dark:border-red-900",
    bg: "bg-red-50/60 dark:bg-red-950/20",
    badge: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
    icon: "text-red-500"
  },
  warning: {
    border: "border-amber-200 dark:border-amber-900",
    bg: "bg-amber-50/60 dark:bg-amber-950/20",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
    icon: "text-amber-500"
  },
  neutral: {
    border: "border-border",
    bg: "bg-muted/30",
    badge: "bg-muted text-subtle",
    icon: "text-subtle"
  }
};

function DeltaIcon({ delta, type }: { delta?: number; type: InsightCard["type"] }) {
  if (type === "negative" || (delta !== undefined && delta < 0)) return <ArrowDown className="h-3.5 w-3.5" />;
  if (type === "positive" || (delta !== undefined && delta > 0)) return <ArrowUp className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
}

function InsightCardItem({ card }: { card: InsightCard }) {
  const styles = TYPE_STYLES[card.type];
  return (
    <div className={cn("rounded-xl border p-4 transition hover:shadow-md", styles.border, styles.bg)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles className={cn("h-3.5 w-3.5 shrink-0", styles.icon)} />
            <p className="text-sm font-semibold leading-snug">{card.title}</p>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-subtle">{card.body}</p>
        </div>
        {card.metric && (
          <span className={cn("flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", styles.badge)}>
            <DeltaIcon delta={card.delta} type={card.type} />
            {card.metric}
          </span>
        )}
      </div>
    </div>
  );
}

export function InsightCards() {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-500" />
        <h2 className="text-sm font-semibold">AI Insights</h2>
        <span className="rounded-full border border-brand-200 bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:border-brand-900 dark:bg-brand-950/40 dark:text-brand-200">
          6 signals
        </span>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {insightCards.map((card) => (
          <InsightCardItem key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

export function InsightAlert() {
  const critical = insightCards.filter((c) => c.type === "warning" || c.type === "negative");
  if (critical.length === 0) return null;
  const first = critical[0];
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/20">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <div className="min-w-0">
        <p className="text-sm font-semibold">{first.title}</p>
        <p className="mt-0.5 text-xs text-subtle">{first.body}</p>
      </div>
    </div>
  );
}
