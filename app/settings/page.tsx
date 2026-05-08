"use client";

import { Bell, Clipboard, KeyRound, Moon, Sun, UserCog } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/layout/theme-provider";
import { useAuth } from "@/lib/auth";
import { hasPermission } from "@/lib/roles";
import type { Role } from "@/types/analytics";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole, name, email } = useAuth();
  const canViewApiKeys = hasPermission(role, "view:api-keys");

  return (
    <ProtectedPage
      permission="view:settings"
      restrictedDescription="Settings are available to admins and managers. Viewers can use the Profile page for read-only account details."
    >
      <PageHeader title="Settings" description="Profile, theme, notification, API key, and demo role preferences." />

      <div className="grid gap-6 xl:grid-cols-[1fr_.9fr]">
        <Card>
          <CardHeader title="Profile" eyebrow="Account" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 place-items-center rounded-lg bg-muted text-xl font-bold text-brand-600 dark:text-brand-400">
              {name.split(" ").map((part) => part[0]).join("")}
            </div>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Name
                <input value={name} readOnly className="mt-2 h-11 w-full rounded-lg border border-border bg-muted px-3 text-sm outline-none" />
              </label>
              <label className="text-sm font-medium">
                Email
                <input value={email} readOnly className="mt-2 h-11 w-full rounded-lg border border-border bg-muted px-3 text-sm outline-none" />
              </label>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Appearance" eyebrow="Theme" />
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/45 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-panel">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </div>
              <div>
                <p className="font-semibold capitalize">{theme} mode</p>
                <p className="text-sm text-subtle">Stored in localStorage</p>
              </div>
            </div>
            <Button onClick={toggleTheme}>Toggle</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Demo Access" eyebrow="Role-based views" />
          <div className="grid gap-3 sm:grid-cols-3">
            {(["admin", "manager", "viewer"] as Role[]).map((option) => (
              <button
                key={option}
                onClick={() => setRole(option)}
                className={`focus-ring rounded-lg border p-4 text-left transition hover:bg-muted ${role === option ? "border-brand-500 bg-brand-50 dark:bg-brand-500/15" : "border-border bg-panel"}`}
              >
                <UserCog className="mb-4 h-5 w-5 text-brand-600 dark:text-brand-400" />
                <p className="font-semibold capitalize">{option}</p>
                <p className="mt-1 text-sm text-subtle">
                  {option === "admin" ? "Full workspace controls." : option === "manager" ? "Analytics and reports access." : "Read-only dashboard access."}
                </p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader title="Notifications" eyebrow="Preferences" />
          <div className="space-y-3">
            {["Weekly executive summary", "Spike detection alerts", "Error-rate anomaly digest"].map((item) => (
              <label key={item} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-muted/35 p-4">
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Bell className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                  {item}
                </span>
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-brand-600" />
              </label>
            ))}
          </div>
        </Card>

        {canViewApiKeys ? (
          <Card className="xl:col-span-2">
            <CardHeader title="API Key" eyebrow="Mock integration" />
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/45 p-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3">
                <KeyRound className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <code className="min-w-0 truncate text-sm">dp_live_8f4b2c9e_analytics_demo_key</code>
              </div>
              <Button onClick={() => navigator.clipboard.writeText("dp_live_8f4b2c9e_analytics_demo_key")}>
                <Clipboard className="h-4 w-4" />
                Copy
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="xl:col-span-2">
            <CardHeader title="API Key" eyebrow="Restricted" />
            <div className="rounded-lg border border-border bg-muted/35 p-4">
              <div className="flex items-center gap-3">
                <KeyRound className="h-5 w-5 text-subtle" />
                <div>
                  <p className="text-sm font-semibold">API keys hidden for manager access</p>
                  <p className="mt-1 text-sm text-subtle">Managers can adjust workspace preferences, but only admins can view or copy integration secrets.</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </ProtectedPage>
  );
}
