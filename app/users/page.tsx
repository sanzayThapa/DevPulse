import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { UsersList } from "@/components/tables/users-list";

export default function UsersPage() {
  return (
    <ProtectedPage>
      <PageHeader title="Users" description="Role-aware member management for admins, with a restricted view for normal users." />
      <UsersList />
    </ProtectedPage>
  );
}
