"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CreditCard,
  FileText,
  Gauge,
  Globe,
  LayoutDashboard,
  Moon,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  Sun,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/components/layout/theme-provider";
import { hasPermission, type Permission } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Role } from "@/types/analytics";

type Command = {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  group: string;
  action: () => void;
  permission?: Permission;
  keywords?: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CommandPalette({ open, onClose }: Props) {
  const router = useRouter();
  const { setRole, role } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const commands: Command[] = [
    { id: "dashboard", label: "Dashboard", description: "Main performance dashboard", icon: LayoutDashboard, group: "Navigation", action: () => navigate("/dashboard"), permission: "view:dashboard", keywords: ["home", "overview"] },
    { id: "analytics", label: "Analytics Overview", description: "Full analytics hub", icon: BarChart3, group: "Navigation", action: () => navigate("/analytics"), permission: "view:analytics", keywords: ["charts", "metrics"] },
    { id: "traffic", label: "Traffic Analytics", description: "Visitors, page views, sessions", icon: Globe, group: "Navigation", action: () => navigate("/analytics/traffic"), permission: "view:analytics", keywords: ["visitors", "pageviews"] },
    { id: "revenue", label: "Revenue Analytics", description: "MRR, ARR, plan breakdown", icon: TrendingUp, group: "Navigation", action: () => navigate("/analytics/revenue"), permission: "view:analytics", keywords: ["mrr", "arr", "money"] },
    { id: "api-performance", label: "API Performance", description: "Latency, throughput, endpoints", icon: Zap, group: "Navigation", action: () => navigate("/analytics/api-performance"), permission: "view:api-performance", keywords: ["latency", "endpoints"] },
    { id: "system-health", label: "System Health", description: "Infrastructure health and uptime", icon: ShieldCheck, group: "Navigation", action: () => navigate("/system-health"), permission: "view:system-health", keywords: ["cpu", "memory", "uptime", "connections", "database"] },
    { id: "errors", label: "Error Monitoring", description: "Error events and alerts", icon: AlertTriangle, group: "Navigation", action: () => navigate("/analytics/errors"), permission: "view:error-monitoring", keywords: ["errors", "bugs", "exceptions"] },
    { id: "user-activity", label: "User Activity", description: "DAU, WAU, MAU, retention", icon: Activity, group: "Navigation", action: () => navigate("/analytics/user-activity"), permission: "view:analytics", keywords: ["dau", "retention"] },
    { id: "reports", label: "Reports", description: "Export and download reports", icon: FileText, group: "Navigation", action: () => navigate("/reports"), permission: "view:reports", keywords: ["export", "csv", "pdf"] },
    { id: "users", label: "User Management", description: "Manage team members", icon: Users, group: "Navigation", action: () => navigate("/users"), permission: "view:users", keywords: ["team", "members"] },
    { id: "billing", label: "Billing & Plans", description: "Manage subscription, invoices, and usage", icon: CreditCard, group: "Navigation", action: () => navigate("/billing"), permission: "view:billing", keywords: ["plan", "invoice", "subscription", "upgrade", "payment"] },
    { id: "settings", label: "Settings", description: "Profile and workspace settings", icon: Settings, group: "Navigation", action: () => navigate("/settings"), permission: "view:settings", keywords: ["profile", "api key"] },
    { id: "theme-toggle", label: `Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`, description: "Toggle theme appearance", icon: theme === "dark" ? Sun : Moon, group: "Actions", action: () => { toggleTheme(); onClose(); }, keywords: ["dark", "light", "theme"] },
    { id: "role-admin", label: "Switch to Admin role", description: "Full platform access", icon: Shield, group: "Roles", action: () => { setRole("admin" as Role); onClose(); }, keywords: ["admin"] },
    { id: "role-manager", label: "Switch to Manager role", description: "Analytics and reports", icon: Shield, group: "Roles", action: () => { setRole("manager" as Role); onClose(); }, keywords: ["manager"] },
    { id: "role-viewer", label: "Switch to Viewer role", description: "Read-only access", icon: Shield, group: "Roles", action: () => { setRole("viewer" as Role); onClose(); }, keywords: ["viewer", "readonly"] },
    { id: "devpulse", label: "DevPulse Cloud", description: "About this workspace", icon: Gauge, group: "Actions", action: () => navigate("/dashboard"), keywords: ["about", "workspace"] }
  ];

  const allowedCommands = commands.filter((cmd) => !cmd.permission || hasPermission(role, cmd.permission));

  const filtered = query.trim()
    ? allowedCommands.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.includes(q))
        );
      })
    : allowedCommands;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    (acc[cmd.group] ??= []).push(cmd);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, flatFiltered.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
      if (e.key === "Enter") { e.preventDefault(); flatFiltered[selected]?.action(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flatFiltered, selected, onClose]);

  if (!open) return null;

  let globalIdx = -1;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
      <div className="fixed inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl overflow-hidden rounded-lg border border-border bg-panel shadow-elevated">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search className="h-4 w-4 shrink-0 text-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, reports, actions…"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-subtle"
          />
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 text-xs text-subtle sm:block">ESC</kbd>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-2">
          {Object.entries(grouped).length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-subtle">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            Object.entries(grouped).map(([group, cmds]) => (
              <div key={group}>
                <p className="px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-subtle">{group}</p>
                {cmds.map((cmd) => {
                  globalIdx++;
                  const idx = globalIdx;
                  const Icon = cmd.icon;
                  const isSelected = idx === selected;
                  return (
                    <button
                      key={cmd.id}
                      onMouseEnter={() => setSelected(idx)}
                      onClick={cmd.action}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition",
                        isSelected ? "bg-muted" : "hover:bg-muted/45"
                      )}
                    >
                      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border", isSelected && "border-brand-500/40 bg-brand-50 dark:bg-brand-500/10")}>
                        <Icon className={cn("h-3.5 w-3.5", isSelected ? "text-brand-600 dark:text-brand-400" : "text-subtle")} />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-medium text-foreground">{cmd.label}</span>
                        {cmd.description && <span className="block truncate text-xs text-subtle">{cmd.description}</span>}
                      </span>
                      {cmd.group === "Roles" && cmd.label.toLowerCase().includes(role) && (
                        <span className="ml-auto shrink-0 rounded-md border border-brand-500/25 bg-brand-500/10 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:text-brand-300">
                          active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border px-4 py-2.5">
          <span className="flex items-center gap-1 text-[11px] text-subtle"><kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1 text-[11px] text-subtle"><kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">↵</kbd> select</span>
          <span className="flex items-center gap-1 text-[11px] text-subtle"><kbd className="rounded border border-border bg-muted px-1 py-0.5 text-[10px]">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
