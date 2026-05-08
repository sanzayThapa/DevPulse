import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { UsersList } from "@/components/tables/users-list";

export default function UsersPage() {
  return (
    <ProtectedPage
      permission="view:users"
      restrictedDescription="Only admins can manage users and workspace membership."
    >
      <PageHeader title="Users" description="Role-aware member management for admins, with a restricted view for normal users." />
      <UsersList />
    </ProtectedPage>
  );
}
