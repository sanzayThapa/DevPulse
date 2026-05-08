"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { RestrictedAccess } from "@/components/layout/restricted-access";
import { hasPermission, type Permission } from "@/lib/roles";

export function ProtectedPage({
  children,
  permission,
  restrictedTitle,
  restrictedDescription
}: {
  children: React.ReactNode;
  permission?: Permission;
  restrictedTitle?: string;
  restrictedDescription?: string;
}) {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, ready, router]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
        <div className="grid w-full gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (permission && !hasPermission(role, permission)) {
    return (
      <AppShell>
        <RestrictedAccess title={restrictedTitle} description={restrictedDescription} />
      </AppShell>
    );
  }

  return <AppShell>{children}</AppShell>;
}
