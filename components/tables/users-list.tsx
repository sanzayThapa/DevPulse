"use client";

import { MoreHorizontal, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { users } from "@/lib/data";
import { useAuth } from "@/lib/auth";

export function UsersList() {
  const { role } = useAuth();

  if (role !== "admin") {
    return (
      <EmptyState
        title="Limited access"
        description="User management is available to admins. Switch to the admin demo role from the navbar or settings page to review this workflow."
      />
    );
  }

  return (
    <Card className="p-0">
      <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold">Workspace Members</h2>
          <p className="mt-1 text-sm text-subtle">Manage access, account status, and plan visibility.</p>
        </div>
        <Button variant="primary">
          <UserPlus className="h-4 w-4" />
          Invite user
        </Button>
      </div>
      <div className="divide-y divide-border">
        {users.map((user) => (
          <div key={user.id} className="grid gap-4 p-5 transition hover:bg-muted/35 md:grid-cols-[1.4fr_.7fr_.7fr_.7fr_auto] md:items-center">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-muted font-bold text-brand-600 dark:text-brand-100">{user.avatar}</div>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-subtle">{user.email}</p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold capitalize text-subtle">
              {user.role === "admin" ? <ShieldCheck className="h-3.5 w-3.5" /> : null}
              {user.role}
            </span>
            <span className="text-sm text-subtle">{user.plan}</span>
            <span className="text-sm text-subtle">{user.lastSeen}</span>
            <Button variant="ghost" className="h-9 w-9 px-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
