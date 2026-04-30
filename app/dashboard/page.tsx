import { DashboardView } from "@/components/dashboard/dashboard-view";
import { ProtectedPage } from "@/components/layout/protected-page";

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <DashboardView />
    </ProtectedPage>
  );
}
