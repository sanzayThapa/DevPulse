"use client";

import { useMemo, useState } from "react";
import { Activity, BarChart3, Clock, FileDown, LayoutDashboard, Settings, Trash2, UserPlus, Users, Zap } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ActivityType = "users" | "reports" | "system";
type ActivityStatus = "completed" | "pending" | "warning" | "deleted";

type ActivityEvent = {
  id: string;
  user: string;
  initials: string;
  role: string;
  action: string;
  detail: string;
  time: string;
  type: ActivityType;
  status: ActivityStatus;
  icon: React.ElementType;
};

const filters: { label: string; value: "all" | ActivityType }[] = [
  { label: "All", value: "all" },
  { label: "Users", value: "users" },
  { label: "Reports", value: "reports" },
  { label: "System", value: "system" }
];

const activity: ActivityEvent[] = [
  {
    id: "act-001",
    user: "Sarah Manager",
    initials: "SM",
    role: "Manager",
    action: "exported report",
    detail: "Downloaded Executive Growth Snapshot as CSV for the weekly leadership review.",
    time: "2 minutes ago",
    type: "reports",
    status: "completed",
    icon: FileDown
  },
  {
    id: "act-002",
    user: "DevPulse Admin",
    initials: "DA",
    role: "Admin",
    action: "invited new user",
    detail: "Invited Priya Shah to the Marketing workspace with manager permissions.",
    time: "11 minutes ago",
    type: "users",
    status: "pending",
    icon: UserPlus
  },
  {
    id: "act-003",
    user: "System Monitor",
    initials: "SM",
    role: "System",
    action: "detected API traffic spike",
    detail: "Requests to /v1/events increased 43% above the 24-hour baseline.",
    time: "18 minutes ago",
    type: "system",
    status: "warning",
    icon: Zap
  },
  {
    id: "act-004",
    user: "Maya Analyst",
    initials: "MA",
    role: "Analyst",
    action: "updated settings",
    detail: "Changed notification routing for conversion-rate anomaly alerts.",
    time: "36 minutes ago",
    type: "system",
    status: "completed",
    icon: Settings
  },
  {
    id: "act-005",
    user: "DevPulse Admin",
    initials: "DA",
    role: "Admin",
    action: "created dashboard",
    detail: "Created Mobile App Reliability dashboard with API latency and crash-rate panels.",
    time: "1 hour ago",
    type: "system",
    status: "completed",
    icon: LayoutDashboard
  },
  {
    id: "act-006",
    user: "Sarah Manager",
    initials: "SM",
    role: "Manager",
    action: "deleted report",
    detail: "Deleted archived Checkout Revenue Drilldown after replacing it with the Q2 version.",
    time: "2 hours ago",
    type: "reports",
    status: "deleted",
    icon: Trash2
  },
  {
    id: "act-007",
    user: "Alex Viewer",
    initials: "AV",
    role: "Viewer",
    action: "opened assigned report",
    detail: "Viewed Weekly Traffic Overview in read-only mode.",
    time: "3 hours ago",
    type: "reports",
    status: "completed",
    icon: BarChart3
  },
  {
    id: "act-008",
    user: "DevPulse Admin",
    initials: "DA",
    role: "Admin",
    action: "updated user role",
    detail: "Changed Noah Kim from viewer to manager for the Production workspace.",
    time: "4 hours ago",
    type: "users",
    status: "completed",
    icon: Users
  }
];

const statusClasses: Record<ActivityStatus, string> = {
  completed: "border-brand-500/25 bg-brand-500/10 text-brand-700 dark:text-brand-300",
  pending: "border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  warning: "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
  deleted: "border-border bg-muted text-subtle"
};

export default function TeamActivityPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | ActivityType>("all");
  const filteredActivity = useMemo(
    () => activity.filter((item) => activeFilter === "all" || item.type === activeFilter),
    [activeFilter]
  );

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
        <div className="flex flex-col justify-between gap-4 border-b border-border px-5 py-4 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold">Activity feed</p>
            <p className="mt-1 text-xs text-subtle">Recent workspace events across users, reports, and system signals.</p>
          </div>
          <div className="flex rounded-md border border-border bg-muted/35 p-1">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={cn(
                  "focus-ring h-8 rounded px-3 text-xs font-semibold transition",
                  activeFilter === filter.value ? "bg-brand-500 text-white" : "text-subtle hover:bg-muted hover:text-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[34rem] overflow-y-auto">
          <div className="divide-y divide-border">
            {filteredActivity.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.id} className="grid gap-3 px-5 py-4 transition hover:bg-muted/25 sm:grid-cols-[auto_1fr_auto] sm:items-start">
                  <div className="flex items-center gap-3 sm:block">
                    <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-muted text-xs font-semibold text-foreground">
                      {item.initials}
                    </div>
                    <div className="sm:hidden">
                      <p className="text-sm font-semibold">{item.user}</p>
                      <p className="text-xs text-subtle">{item.time}</p>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="hidden items-center gap-2 sm:flex">
                      <p className="text-sm font-semibold">{item.user}</p>
                      <span className="text-xs text-subtle">·</span>
                      <p className="text-xs text-subtle">{item.role}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-brand-500/25 bg-brand-500/10 text-brand-600 dark:text-brand-400">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <p className="text-sm font-medium">{item.action}</p>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-subtle">{item.detail}</p>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <Badge className={statusClasses[item.status]}>{item.status}</Badge>
                    <time className="text-xs text-subtle">{item.time}</time>
                  </div>
                </article>
              );
            })}

            {filteredActivity.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Activity className="mx-auto h-8 w-8 text-subtle" />
                <p className="mt-3 text-sm font-semibold">No matching activity</p>
                <p className="mt-1 text-sm text-subtle">Try another filter to view more workspace events.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
