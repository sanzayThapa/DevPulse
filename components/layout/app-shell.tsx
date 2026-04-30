"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Bell, Gauge, LayoutDashboard, LogOut, Menu, Moon, Settings, Sun, Users, X, FileText, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/layout/theme-provider";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/analytics";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/users", label: "Users", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, logout, name, email } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const switchRole = (nextRole: Role) => setRole(nextRole);

  return (
    <div className="min-h-screen">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-panel/95 px-4 py-5 backdrop-blur-xl transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-canvas dark:bg-white dark:text-ink-950">
              <Gauge className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">DevPulse</p>
              <p className="text-xs text-subtle">Realtime command center</p>
            </div>
          </Link>
          <button className="focus-ring rounded-lg p-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-subtle transition hover:bg-muted hover:text-foreground",
                  active && "bg-muted text-foreground shadow-sm"
                )}
                onClick={() => setOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute inset-x-4 bottom-5 rounded-xl border border-border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white">
              {name.split(" ").map((part) => part[0]).join("")}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-subtle">{email}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {(["admin", "user"] as Role[]).map((option) => (
              <button
                key={option}
                className={cn(
                  "focus-ring rounded-lg border border-border px-3 py-2 text-xs font-semibold capitalize transition hover:bg-panel",
                  role === option && "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100"
                )}
                onClick={() => switchRole(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {open ? <button className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden" onClick={() => setOpen(false)} aria-label="Close overlay" /> : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-canvas/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="focus-ring rounded-lg border border-border bg-panel p-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </button>
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
                Live
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button className="hidden sm:inline-flex" variant="ghost" onClick={() => router.push("/settings")}>
                <Shield className="h-4 w-4" />
                {role}
              </Button>
              <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme" className="h-10 w-10 px-0">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="secondary" aria-label="Notifications" className="h-10 w-10 px-0">
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                aria-label="Log out"
                className="h-10 w-10 px-0"
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
