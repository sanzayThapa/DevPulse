"use client";

import { UserCircle } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { ROLE_META } from "@/lib/roles";

export default function ProfilePage() {
  const { name, email, role } = useAuth();
  const meta = ROLE_META[role];

  return (
    <ProtectedPage permission="view:profile" restrictedDescription="Profile is intended for viewer read-only access in this demo.">
      <PageHeader title="Profile" description="Read-only account details for viewer users." />

      <Card className="max-w-2xl">
        <CardHeader title="Account" eyebrow="Read only" />
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 place-items-center rounded-lg border border-border bg-muted">
            <UserCircle className="h-7 w-7 text-subtle" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold">{name}</p>
            <p className="mt-1 text-sm text-subtle">{email}</p>
            <p className="mt-3 inline-flex rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-subtle">
              {meta.label} · {meta.description}
            </p>
          </div>
        </div>
      </Card>
    </ProtectedPage>
  );
}

