"use client";

import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { ROLE_META } from "@/lib/roles";

export function RestrictedAccess({
  title = "Restricted access",
  description = "This workspace area is not available for your current demo role.",
  action
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  const { role } = useAuth();
  const roleMeta = ROLE_META[role];

  return (
    <div className="flex min-h-[55vh] items-center justify-center px-4 py-12">
      <div className="panel w-full max-w-lg rounded-lg p-6 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-border bg-muted">
          <LockKeyhole className="h-5 w-5 text-subtle" />
        </div>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-600 dark:text-brand-400">
          {roleMeta.label} role
        </p>
        <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-subtle">{description}</p>
        <div className="mt-6 flex justify-center">
          {action ?? (
            <Button variant="secondary" onClick={() => window.history.back()}>
              Go back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

