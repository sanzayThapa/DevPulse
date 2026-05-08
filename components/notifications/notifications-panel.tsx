"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bell, Check, CheckCheck, Info, Sparkles, X, Zap } from "lucide-react";
import { useNotifications } from "@/lib/notifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Notification } from "@/types/analytics";

const TYPE_META = {
  alert: { icon: Zap, color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40", border: "border-red-200 dark:border-red-900" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/40", border: "border-amber-200 dark:border-amber-900" },
  success: { icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40", border: "border-emerald-200 dark:border-emerald-900" },
  info: { icon: Info, color: "text-brand-500", bg: "bg-brand-50 dark:bg-brand-500/10", border: "border-brand-200 dark:border-brand-500/30" }
};

function NotificationItem({ n, onRead, onDismiss }: { n: Notification; onRead: () => void; onDismiss: () => void }) {
  const meta = TYPE_META[n.type];
  const Icon = meta.icon;
  return (
    <div
      className={cn("group relative flex gap-3 border-b border-border p-4 transition hover:bg-muted/40", !n.read && "bg-muted/20")}
      onClick={onRead}
      role="button"
      tabIndex={0}
    >
      <div className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border", meta.bg, meta.border)}>
        <Icon className={cn("h-3.5 w-3.5", meta.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm font-semibold leading-snug", !n.read && "text-foreground")}>{n.title}</p>
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="shrink-0 rounded p-0.5 opacity-0 transition hover:bg-muted group-hover:opacity-100"
            aria-label="Dismiss"
          >
            <X className="h-3 w-3 text-subtle" />
          </button>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-subtle">{n.body}</p>
        <p className="mt-1.5 text-[11px] text-subtle/70">{n.time}</p>
      </div>
      {!n.read && (
        <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-brand-500" />
      )}
    </div>
  );
}

export function NotificationsPanel() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, dismiss } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div ref={panelRef} className="relative">
      <Button
        variant="secondary"
        aria-label="Notifications"
        className="relative h-10 w-10 px-0"
        onClick={() => setOpen((v) => !v)}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-[380px] max-sm:right-[-3rem] max-sm:w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-border bg-panel shadow-elevated">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-subtle" />
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-md bg-brand-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unreadCount}</span>
              )}
            </div>
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-subtle transition hover:bg-muted hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          </div>

          <div className="max-h-[440px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-12 text-center">
                <Check className="h-8 w-8 text-emerald-500" />
                <p className="text-sm font-medium">You&apos;re all caught up</p>
                <p className="text-xs text-subtle">No new notifications</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  n={n}
                  onRead={() => markAsRead(n.id)}
                  onDismiss={() => dismiss(n.id)}
                />
              ))
            )}
          </div>

          <div className="border-t border-border px-4 py-2.5">
            <p className="text-center text-xs text-subtle">Real-time alerts from DevPulse Cloud</p>
          </div>
        </div>
      )}
    </div>
  );
}
