"use client";

import { Activity, Clock, Users } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

const activity = [
  { user: "Sarah Manager", action: "approved the weekly revenue report", time: "12 minutes ago" },
  { user: "Alex Viewer", action: "reviewed assigned traffic dashboards", time: "34 minutes ago" },
  { user: "DevPulse Admin", action: "rotated an API integration token", time: "1 hour ago" },
  { user: "Maya Analyst", action: "created a conversion-rate snapshot", time: "2 hours ago" }
];

export default function TeamActivityPage() {
  return (
    <ProtectedPage permission="view:team-activity" restrictedDescription="Team activity is available to admins only.">
      <PageHeader title="Team Activity" description="Admin-level visibility into workspace activity and operational changes." />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Active teammates", value: "18", icon: Users },
          { label: "Events today", value: "146", icon: Activity },
          { label: "Avg response", value: "4m", icon: Clock }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <section key={item.label} className="panel rounded-lg p-4">
              <Icon className="h-4 w-4 text-brand-500" />
              <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-subtle">{item.label}</p>
              <p className="mt-1 text-2xl font-semibold">{item.value}</p>
            </section>
          );
        })}
      </div>

      <section className="panel mt-6 overflow-hidden rounded-lg">
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm font-semibold">Recent team events</p>
          <p className="mt-1 text-xs text-subtle">A lightweight audit-style feed for demo activity.</p>
        </div>
        <div className="divide-y divide-border">
          {activity.map((item) => (
            <div key={`${item.user}-${item.time}`} className="flex items-start justify-between gap-4 px-5 py-4">
              <div>
                <p className="text-sm font-medium">{item.user}</p>
                <p className="mt-1 text-sm text-subtle">{item.action}</p>
              </div>
              <Badge>{item.time}</Badge>
            </div>
          ))}
        </div>
      </section>
    </ProtectedPage>
  );
}

