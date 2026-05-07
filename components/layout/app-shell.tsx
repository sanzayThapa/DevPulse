"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronRight,
  FileText,
  Gauge,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  TrendingUp,
  Users,
  X,
  Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/layout/theme-provider";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { cn } from "@/lib/utils";
import { ROLE_META, hasPermission } from "@/lib/roles";
import type { Role } from "@/types/analytics";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: Parameters<typeof hasPermission>[1];
  children?: { href: string; label: string; icon: React.ElementType }[];
};

const nav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
  {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3,
    permission: "view:analytics",
    children: [
      { href: "/analytics/traffic", label: "Traffic", icon: Globe },
      { href: "/analytics/revenue", label: "Revenue", icon: TrendingUp },
      { href: "/analytics/api-performance", label: "API Performance", icon: Zap },
      { href: "/analytics/errors", label: "Error Monitoring", icon: AlertTriangle },
      { href: "/analytics/user-activity", label: "User Activity", icon: Activity }
    ]
  },
  { href: "/reports", label: "Reports", icon: FileText, permission: "view:reports" },
  { href: "/users", label: "Users", icon: Users, permission: "view:users" },
  { href: "/settings", label: "Settings", icon: Settings, permission: "view:settings" }
];

const ALL_ROLES: Role[] = ["admin", "manager", "viewer"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setRole, logout, name, email } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(pathname.startsWith("/analytics"));
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const roleMeta = ROLE_META[role];

  return (
    <div className="min-h-screen">
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-panel/95 px-4 py-5 backdrop-blur-xl transition-transform lg:translate-x-0 flex flex-col",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-foreground text-canvas dark:bg-white dark:text-ink-950">
              <Gauge className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-bold">DevPulse Cloud</p>
              <p className="text-xs text-subtle">Analytics platform</p>
            </div>
          </Link>
          <button className="focus-ring rounded-lg p-2 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search shortcut */}
        <button
          onClick={() => { setPaletteOpen(true); setSidebarOpen(false); }}
          className="mt-5 flex h-9 w-full items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 text-xs text-subtle transition hover:border-brand-400 hover:text-foreground"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search or jump to…</span>
          <kbd className="rounded border border-border bg-panel px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>

        {/* Navigation */}
        <nav className="mt-5 flex-1 space-y-0.5 overflow-y-auto">
          {nav.map((item) => {
            if (item.permission && !hasPermission(role, item.permission)) return null;
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            if (item.children) {
              return (
                <div key={item.href}>
                  <button
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-subtle transition hover:bg-muted hover:text-foreground",
                      active && "bg-muted text-foreground"
                    )}
                    onClick={() => setAnalyticsOpen((v) => !v)}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {analyticsOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                  {analyticsOpen && (
                    <div className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-3">
                      <Link
                        href="/analytics"
                        onClick={() => setSidebarOpen(false)}
                        className={cn("flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-subtle transition hover:bg-muted hover:text-foreground", pathname === "/analytics" && "bg-muted text-foreground")}
                      >
                        <BarChart3 className="h-3.5 w-3.5" />
                        Overview
                      </Link>
                      {item.children.map((child) => {
                        const CIcon = child.icon;
                        const cActive = pathname === child.href;
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn("flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-subtle transition hover:bg-muted hover:text-foreground", cActive && "bg-muted text-foreground")}
                          >
                            <CIcon className="h-3.5 w-3.5" />
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                href={item.href}
                key={item.href}
                className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-subtle transition hover:bg-muted hover:text-foreground", active && "bg-muted text-foreground shadow-sm")}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Role switcher + user card */}
        <div className="mt-4 rounded-xl border border-border bg-muted/50 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-500 text-sm font-bold text-white shrink-0">
              {name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-subtle">{email}</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {ALL_ROLES.map((option) => (
              <button
                key={option}
                className={cn(
                  "focus-ring rounded-lg border px-2 py-1.5 text-[11px] font-semibold capitalize transition hover:bg-panel",
                  role === option
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100"
                    : "border-border text-subtle"
                )}
                onClick={() => setRole(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close overlay" />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-canvas/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="focus-ring rounded-lg border border-border bg-panel p-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </button>
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
                Live
              </Badge>
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-subtle transition hover:border-brand-400 hover:text-foreground sm:flex"
              >
                <Search className="h-3.5 w-3.5" />
                Search…
                <kbd className="rounded border border-border bg-panel px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className={cn("hidden sm:inline-flex border", roleMeta.color)}
                variant="ghost"
                onClick={() => router.push("/settings")}
              >
                <Shield className="h-4 w-4" />
                {roleMeta.label}
              </Button>
              <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme" className="h-10 w-10 px-0">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <NotificationsPanel />
              <Button
                variant="ghost"
                aria-label="Log out"
                className="h-10 w-10 px-0"
                onClick={() => { logout(); router.push("/login"); }}
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
