"use client";

import { ProtectedPage } from "@/components/layout/protected-page";
import { SystemHealthView } from "@/components/system-health/system-health-view";

export default function SystemHealthPage() {
  return (
    <ProtectedPage
      permission="view:system-health"
      restrictedDescription="System health monitoring is an admin-only operational surface in this demo workspace."
    >
      <SystemHealthView />
    </ProtectedPage>
  );
}
