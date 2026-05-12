"use client";

import { Check, ChevronDown, PanelsTopLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/lib/workspace";

export function WorkspaceSwitcher() {
  const { workspace, workspaces, setWorkspaceId } = useWorkspace();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="focus-ring flex h-10 min-w-0 items-center gap-2 rounded-md border border-border bg-panel px-2.5 text-left shadow-sm transition hover:border-brand-500/45 hover:bg-muted sm:min-w-52 sm:px-3"
        aria-expanded={open}
        aria-label="Switch workspace"
      >
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-brand-500/25 bg-brand-500/10 text-[11px] font-semibold text-brand-600 dark:text-brand-400">
          {workspace.initials}
        </span>
        <span className="hidden min-w-0 sm:block">
          <span className="block truncate text-sm font-semibold text-foreground">{workspace.name}</span>
          <span className="block truncate text-[11px] text-subtle">{workspace.description}</span>
        </span>
        <PanelsTopLeft className="h-4 w-4 text-subtle sm:hidden" />
        <ChevronDown className={cn("ml-auto h-4 w-4 shrink-0 text-subtle transition-transform", open && "rotate-180")} />
      </button>

      <div
        className={cn(
          "absolute left-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] origin-top-left overflow-hidden rounded-lg border border-border bg-panel shadow-elevated transition duration-150 sm:w-80",
          open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0"
        )}
      >
        <div className="border-b border-border px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Workspace</p>
        </div>
        <div className="p-1.5">
          {workspaces.map((option) => {
            const selected = option.id === workspace.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  setWorkspaceId(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition",
                  selected ? "bg-muted text-foreground" : "text-subtle hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-md border text-xs font-semibold",
                  selected ? "border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400" : "border-border bg-muted"
                )}>
                  {option.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{option.name}</span>
                  <span className="block truncate text-xs text-subtle">{option.description}</span>
                </span>
                {selected ? <Check className="h-4 w-4 shrink-0 text-brand-500" /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

