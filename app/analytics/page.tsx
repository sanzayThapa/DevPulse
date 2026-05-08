"use client";

import Link from "next/link";
import { Activity, AlertTriangle, ArrowRight, BarChart3, Globe, TrendingUp, Zap } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { DashboardView } from "@/components/dashboard/dashboard-view";

const SECTIONS = [
  { href: "/analytics/traffic", label: "Traffic Analytics", description: "Visitors, page views, sessions, acquisition channels", icon: Globe, color: "text-brand-500" },
  { href: "/analytics/revenue", label: "Revenue Analytics", description: "MRR, ARR, plan breakdown, churn, and ARPU", icon: TrendingUp, color: "text-emerald-500" },
  { href: "/analytics/api-performance", label: "API Performance", description: "Latency percentiles, throughput, endpoint health", icon: Zap, color: "text-amber-500" },
  { href: "/analytics/errors", label: "Error Monitoring", description: "Error events, types, resolution status", icon: AlertTriangle, color: "text-red-500" },
  { href: "/analytics/user-activity", label: "User Activity", description: "DAU/WAU/MAU, feature adoption, session patterns", icon: Activity, color: "text-brand-500" }
];

export default function AnalyticsPage() {
  return (
    <ProtectedPage>
      <PageHeader
        title="Analytics"
        description="Explore all analytics sections — from traffic and revenue to API performance and user activity."
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group panel flex items-start gap-4 rounded-lg p-4 transition-colors hover:border-brand-500/35"
            >
              <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-muted">
                <Icon className={`h-5 w-5 ${section.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{section.label}</p>
                <p className="mt-0.5 text-xs text-subtle">{section.description}</p>
              </div>
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-subtle transition group-hover:translate-x-1 group-hover:text-brand-500" />
            </Link>
          );
        })}
        <Link
          href="/dashboard"
          className="group panel flex items-start gap-4 rounded-lg p-4 transition-colors hover:border-brand-500/35"
        >
          <div className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-md border border-border bg-muted">
            <BarChart3 className="h-5 w-5 text-subtle" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Main Dashboard</p>
            <p className="mt-0.5 text-xs text-subtle">Live KPIs, charts, and AI insight cards</p>
          </div>
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-subtle transition group-hover:translate-x-1 group-hover:text-brand-500" />
        </Link>
      </div>

      <DashboardView mode="analytics" />
    </ProtectedPage>
  );
}
