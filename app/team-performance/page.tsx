"use client";

import { BarChart3, CheckCircle2, Target, TrendingUp } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";

const metrics = [
  { label: "Team productivity", value: "87%", detail: "Objectives completed", icon: CheckCircle2 },
  { label: "Conversion rate", value: "6.8%", detail: "+0.9% this week", icon: TrendingUp },
  { label: "Weekly reports", value: "14", detail: "Ready for review", icon: BarChart3 },
  { label: "Campaign performance", value: "42k", detail: "Qualified sessions", icon: Target }
];

export default function TeamPerformancePage() {
  return (
    <ProtectedPage permission="view:team-performance" restrictedDescription="Team performance is available to managers and admins.">
      <PageHeader title="Team Performance" description="Manager-focused performance indicators for weekly operating reviews." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <section key={metric.label} className="panel rounded-lg p-4">
              <div className="grid h-10 w-10 place-items-center rounded-md border border-brand-500/30 bg-brand-500/10 text-brand-500">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-subtle">{metric.label}</p>
              <p className="mt-1 text-2xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-sm text-subtle">{metric.detail}</p>
            </section>
          );
        })}
      </div>
    </ProtectedPage>
  );
}

