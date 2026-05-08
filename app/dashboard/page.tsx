"use client";

import { DashboardView } from "@/components/dashboard/dashboard-view";
import { ProtectedPage } from "@/components/layout/protected-page";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { useAuth } from "@/lib/auth";

export default function DashboardPage() {
  const { isAuthenticated, hasCompletedOnboarding } = useAuth();

  return (
    <ProtectedPage permission="view:dashboard">
      {isAuthenticated && !hasCompletedOnboarding && <OnboardingWizard />}
      <DashboardView />
    </ProtectedPage>
  );
}
