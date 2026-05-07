"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CreditCard,
  Download,
  FlaskConical,
  HardDrive,
  Receipt,
  RefreshCw,
  Sparkles,
  Users,
  Zap
} from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// ─── Demo data ────────────────────────────────────────────────────────────────

type PlanId = "starter" | "pro" | "enterprise";

const PLANS: {
  id: PlanId;
  name: string;
  price: number | null;
  period: string;
  description: string;
  badge?: string;
  features: string[];
  limits: { requests: string; seats: string; retention: string; storage: string };
}[] = [
  {
    id: "starter",
    name: "Starter",
    price: 12,
    period: "/ month",
    description: "For indie developers and early-stage products.",
    features: [
      "1M API requests / month",
      "3 team seats",
      "30-day data retention",
      "Core dashboards",
      "5 reports / month",
      "Email support"
    ],
    limits: { requests: "1M", seats: "3", retention: "30 days", storage: "10 GB" }
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    period: "/ month",
    description: "For growing SaaS teams that need the full picture.",
    badge: "Most popular",
    features: [
      "10M API requests / month",
      "10 team seats",
      "90-day data retention",
      "All analytics sections",
      "Unlimited reports",
      "CSV & PDF export",
      "Error monitoring",
      "Priority support"
    ],
    limits: { requests: "10M", seats: "10", retention: "90 days", storage: "100 GB" }
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    period: "custom pricing",
    description: "For large teams with compliance and scale requirements.",
    features: [
      "Unlimited API requests",
      "Unlimited team seats",
      "1-year data retention",
      "Custom dashboards",
      "SLA guarantee (99.99%)",
      "Dedicated CSM",
      "SSO / SAML",
      "Custom integrations",
      "On-prem option"
    ],
    limits: { requests: "Unlimited", seats: "Unlimited", retention: "1 year", storage: "Unlimited" }
  }
];

const USAGE = [
  {
    label: "API Requests",
    icon: Zap,
    used: 1268420,
    limit: 10000000,
    unit: "",
    format: (v: number) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(2)}M` : `${(v / 1000).toFixed(0)}k`,
    color: "bg-brand-500"
  },
  {
    label: "Team Seats",
    icon: Users,
    used: 6,
    limit: 10,
    unit: "",
    format: (v: number) => String(v),
    color: "bg-violet-500"
  },
  {
    label: "Data Retention",
    icon: RefreshCw,
    used: 90,
    limit: 90,
    unit: "days",
    format: (v: number) => `${v}d`,
    color: "bg-emerald-500"
  },
  {
    label: "Storage Used",
    icon: HardDrive,
    used: 48.2,
    limit: 100,
    unit: "GB",
    format: (v: number) => `${v} GB`,
    color: "bg-amber-500"
  }
];

const INVOICES = [
  { id: "INV-2026-005", date: "May 1, 2026",  description: "DevPulse Pro — May 2026",      amount: 49,  status: "paid" },
  { id: "INV-2026-004", date: "Apr 1, 2026",  description: "DevPulse Pro — Apr 2026",      amount: 49,  status: "paid" },
  { id: "INV-2026-003", date: "Mar 1, 2026",  description: "DevPulse Pro — Mar 2026",      amount: 49,  status: "paid" },
  { id: "INV-2026-002", date: "Feb 1, 2026",  description: "DevPulse Pro — Feb 2026",      amount: 49,  status: "paid" },
  { id: "INV-2026-001", date: "Jan 1, 2026",  description: "DevPulse Pro — Jan 2026",      amount: 49,  status: "paid" },
  { id: "INV-2025-012", date: "Dec 1, 2025",  description: "DevPulse Starter — Dec 2025",  amount: 12,  status: "paid" },
] as const;

const CURRENT_PLAN: PlanId = "pro";

// ─── Sub-components ───────────────────────────────────────────────────────────

function DemoBanner() {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 dark:border-amber-900 dark:bg-amber-950/20">
      <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
      <div>
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Demo billing UI</p>
        <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-400/80">
          This is a mock billing interface. No real charges, payments, or subscriptions exist. Buttons and actions are non-functional placeholders.
        </p>
      </div>
    </div>
  );
}

function CurrentPlanCard() {
  const plan = PLANS.find((p) => p.id === CURRENT_PLAN)!;
  return (
    <div className="panel rounded-2xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-brand-500" />
            <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Current plan</p>
          </div>
          <h2 className="mt-2 text-2xl font-bold">DevPulse {plan.name}</h2>
          <p className="mt-1 text-sm text-subtle">{plan.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-semibold">${plan.price}<span className="text-xs font-normal text-subtle">/mo</span></span>
            <span className="text-subtle">·</span>
            <span className="text-subtle">Billed monthly</span>
            <span className="text-subtle">·</span>
            <span className="text-subtle">Renews <strong className="text-foreground">Jun 1, 2026</strong></span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <CreditCard className="h-4 w-4" />
            Update payment
          </Button>
          <Button variant="danger">Cancel plan</Button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Plan", value: plan.name },
          { label: "Cycle", value: "Monthly" },
          { label: "Next invoice", value: "$49.00" },
          { label: "Renewal date", value: "Jun 1, 2026" }
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-muted/50 px-4 py-3">
            <p className="text-[11px] font-medium text-subtle">{label}</p>
            <p className="mt-1 text-sm font-semibold">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function UsageSection() {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="text-sm font-semibold">Usage this billing period</h2>
        <Badge className="border-border bg-muted text-subtle text-[11px]">Resets Jun 1</Badge>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {USAGE.map((item) => {
          const Icon = item.icon;
          const pct = Math.min((item.used / item.limit) * 100, 100);
          const isNearLimit = pct >= 85;
          const isAtLimit = pct >= 100;
          return (
            <div key={item.label} className="panel rounded-xl p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-subtle" />
                  <p className="text-xs font-medium text-subtle">{item.label}</p>
                </div>
                {isAtLimit && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                {isNearLimit && !isAtLimit && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
              </div>
              <p className="mt-2 text-xl font-bold">
                {item.format(item.used)}
                <span className="ml-1 text-sm font-normal text-subtle">/ {item.format(item.limit)}</span>
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-500" : item.color)}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className={cn("mt-1.5 text-[11px]", isAtLimit ? "text-red-500" : isNearLimit ? "text-amber-500" : "text-subtle")}>
                {pct.toFixed(1)}% used
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlanCard({ plan, isCurrent }: { plan: (typeof PLANS)[number]; isCurrent: boolean }) {
  const isEnterprise = plan.id === "enterprise";
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition",
        isCurrent
          ? "border-brand-500 bg-brand-50/30 dark:bg-brand-950/10 shadow-glow"
          : "border-border hover:border-brand-300"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="flex items-center gap-1 rounded-full border border-brand-200 bg-brand-500 px-3 py-1 text-[11px] font-bold text-white shadow-sm dark:border-brand-800">
            <Sparkles className="h-3 w-3" />
            {plan.badge}
          </span>
        </div>
      )}

      {isCurrent && (
        <div className="absolute right-4 top-4">
          <Badge className="border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-900 dark:bg-brand-950/40 dark:text-brand-200">
            <BadgeCheck className="h-3 w-3" />
            Current
          </Badge>
        </div>
      )}

      <div className="mb-4">
        {isEnterprise ? (
          <Building2 className="h-6 w-6 text-subtle" />
        ) : isCurrent ? (
          <BadgeCheck className="h-6 w-6 text-brand-500" />
        ) : (
          <CreditCard className="h-6 w-6 text-subtle" />
        )}
        <h3 className="mt-3 text-lg font-bold">{plan.name}</h3>
        <p className="mt-0.5 text-xs text-subtle">{plan.description}</p>
      </div>

      <div className="mb-5">
        {plan.price !== null ? (
          <div className="flex items-end gap-1">
            <span className="text-3xl font-bold">${plan.price}</span>
            <span className="mb-1 text-sm text-subtle">{plan.period}</span>
          </div>
        ) : (
          <div>
            <span className="text-xl font-bold">Custom</span>
            <p className="mt-0.5 text-xs text-subtle">Talk to sales for pricing</p>
          </div>
        )}
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((feat) => (
          <li key={feat} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span className="text-subtle">{feat}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <Button variant="secondary" className="w-full" disabled>
          <BadgeCheck className="h-4 w-4" />
          Current plan
        </Button>
      ) : isEnterprise ? (
        <Button variant="primary" className="w-full">
          <ArrowRight className="h-4 w-4" />
          Contact sales
        </Button>
      ) : plan.id === "starter" ? (
        <Button variant="ghost" className="w-full border border-border">
          Downgrade to Starter
        </Button>
      ) : (
        <Button variant="primary" className="w-full">
          <ArrowRight className="h-4 w-4" />
          Upgrade to {plan.name}
        </Button>
      )}
    </div>
  );
}

function PlansSection() {
  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">Plans</h2>
          <p className="mt-0.5 text-xs text-subtle">Upgrade or downgrade at any time. Changes take effect at the next billing cycle.</p>
        </div>
        <Badge className="shrink-0 border-border bg-muted text-subtle text-[11px]">
          Billed monthly · Cancel anytime
        </Badge>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} isCurrent={plan.id === CURRENT_PLAN} />
        ))}
      </div>
    </div>
  );
}

function InvoicesSection() {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloading(id);
    setTimeout(() => setDownloading(null), 1200);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold">Invoice history</h2>
        <Button variant="secondary" className="h-8 px-3 text-xs">
          <Download className="h-3.5 w-3.5" />
          Download all
        </Button>
      </div>
      <div className="panel overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-5 py-3 text-left text-xs font-semibold text-subtle">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-subtle">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-subtle">Description</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-subtle">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-subtle">Receipt</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.id} className="border-b border-border last:border-0 transition hover:bg-muted/30">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-3.5 w-3.5 shrink-0 text-subtle" />
                      <code className="font-mono text-xs">{inv.id}</code>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-subtle">{inv.date}</td>
                  <td className="px-4 py-3.5 text-subtle">{inv.description}</td>
                  <td className="px-4 py-3.5 text-right font-semibold">${inv.amount}.00</td>
                  <td className="px-4 py-3.5 text-center">
                    <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Paid
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleDownload(inv.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5 text-xs font-medium transition hover:bg-muted",
                        downloading === inv.id && "opacity-60"
                      )}
                    >
                      <Download className="h-3 w-3" />
                      {downloading === inv.id ? "Saving…" : "PDF"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-border px-5 py-3">
          <p className="text-xs text-subtle">Showing 6 invoices · All payments processed via Stripe (demo)</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BillingPage() {
  return (
    <ProtectedPage>
      <PageHeader
        title="Billing & Plans"
        description="Manage your subscription, review usage, and download invoices."
      />

      <div className="space-y-8">
        <DemoBanner />
        <CurrentPlanCard />
        <UsageSection />
        <PlansSection />
        <InvoicesSection />
      </div>
    </ProtectedPage>
  );
}
