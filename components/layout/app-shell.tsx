"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileText,
  Gauge,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  ScrollText,
  Search,
  Settings,
  Shield,
  UserCircle,
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
import { WorkspaceSwitcher } from "@/components/layout/workspace-switcher";
import { CommandPalette } from "@/components/command-palette/command-palette";
import { NotificationsPanel } from "@/components/notifications/notifications-panel";
import { cn } from "@/lib/utils";
import { ROLE_META, hasPermission, type Permission } from "@/lib/roles";
import type { Role } from "@/types/analytics";

type NavItem = {
  href: string;
  label: string;
  icon: React.ElementType;
  permission?: Permission;
  children?: { href: string; label: string; icon: React.ElementType }[];
};

const analyticsChildren = [
  { href: "/analytics/traffic", label: "Traffic", icon: Globe },
  { href: "/analytics/revenue", label: "Revenue", icon: TrendingUp },
  { href: "/analytics/user-activity", label: "User Activity", icon: Activity }
];

const roleNav: Record<Role, NavItem[]> = {
  admin: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
    { href: "/analytics", label: "Analytics", icon: BarChart3, permission: "view:analytics", children: analyticsChildren },
    { href: "/analytics/api-performance", label: "API Performance", icon: Zap, permission: "view:api-performance" },
    { href: "/analytics/errors", label: "Error Monitoring", icon: AlertTriangle, permission: "view:error-monitoring" },
    { href: "/users", label: "Users", icon: Users, permission: "view:users" },
    { href: "/team-activity", label: "Team Activity", icon: Activity, permission: "view:team-activity" },
    { href: "/billing", label: "Billing", icon: CreditCard, permission: "view:billing" },
    { href: "/reports", label: "Reports", icon: FileText, permission: "view:reports" },
    { href: "/audit-logs", label: "Audit Logs", icon: ScrollText, permission: "view:audit-logs" },
    { href: "/settings", label: "Settings", icon: Settings, permission: "view:settings" }
  ],
  manager: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
    { href: "/analytics", label: "Analytics", icon: BarChart3, permission: "view:analytics", children: analyticsChildren },
    { href: "/team-performance", label: "Team Performance", icon: TrendingUp, permission: "view:team-performance" },
    { href: "/reports", label: "Reports", icon: FileText, permission: "view:reports" },
    { href: "/notifications", label: "Notifications", icon: Bell, permission: "view:notifications" },
    { href: "/settings", label: "Settings", icon: Settings, permission: "view:settings" }
  ],
  viewer: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
    { href: "/analytics", label: "Analytics", icon: BarChart3, permission: "view:analytics", children: analyticsChildren },
    { href: "/reports", label: "Reports", icon: FileText, permission: "view:reports" },
    { href: "/profile", label: "Profile", icon: UserCircle, permission: "view:profile" }
  ]
};

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
  const nav = roleNav[role];

  return (
    <div className="min-h-screen">
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-border bg-panel px-4 py-5 transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-brand-500/30 bg-brand-500 text-white shadow-sm">
              <Gauge className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">DevPulse Cloud</p>
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
          className="mt-6 flex h-9 w-full items-center gap-2 rounded-md border border-border bg-muted/45 px-3 text-xs text-subtle transition hover:border-brand-500/50 hover:text-foreground"
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
            const active = item.children
              ? pathname === item.href || item.children.some((child) => pathname === child.href)
              : pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            if (item.children) {
              return (
                <div key={item.href}>
                  <button
                    className={cn(
                    "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-subtle transition hover:bg-muted hover:text-foreground",
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
                        className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-subtle transition hover:bg-muted hover:text-foreground", pathname === "/analytics" && "bg-muted text-foreground")}
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
                            className={cn("flex items-center gap-2 rounded-md px-2 py-2 text-xs font-medium text-subtle transition hover:bg-muted hover:text-foreground", cActive && "bg-muted text-foreground")}
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
                className={cn("flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-subtle transition hover:bg-muted hover:text-foreground", active && "bg-muted text-foreground shadow-sm")}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Role switcher + user card */}
        <div className="mt-5 rounded-lg border border-border bg-muted/35 p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-500 text-sm font-semibold text-white">
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
                  "focus-ring rounded-md border px-2 py-1.5 text-[11px] font-semibold capitalize transition hover:bg-panel",
                  role === option
                    ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
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
        <button className="fixed inset-0 z-30 bg-ink-950/60 lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close overlay" />
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-border bg-canvas/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button className="focus-ring rounded-md border border-border bg-panel p-2 lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation">
                <Menu className="h-5 w-5" />
              </button>
              <WorkspaceSwitcher />
              <Badge className="border-brand-500/25 bg-brand-500/10 text-brand-700 dark:text-brand-300">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                Live
              </Badge>
              <button
                onClick={() => setPaletteOpen(true)}
                className="hidden items-center gap-2 rounded-md border border-border bg-muted/45 px-3 py-1.5 text-xs text-subtle transition hover:border-brand-500/50 hover:text-foreground sm:flex"
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
