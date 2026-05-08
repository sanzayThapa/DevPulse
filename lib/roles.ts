import type { Role } from "@/types/analytics";

export type Permission =
  | "view:dashboard"
  | "view:analytics"
  | "view:api-performance"
  | "view:error-monitoring"
  | "view:reports"
  | "view:users"
  | "view:team-activity"
  | "view:team-performance"
  | "view:notifications"
  | "view:audit-logs"
  | "view:settings"
  | "view:profile"
  | "view:billing"
  | "view:api-keys"
  | "export:reports"
  | "manage:users"
  | "manage:settings"
  | "read:only"
  | "switch:role";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "view:dashboard",
    "view:analytics",
    "view:api-performance",
    "view:error-monitoring",
    "view:reports",
    "view:users",
    "view:team-activity",
    "view:team-performance",
    "view:notifications",
    "view:audit-logs",
    "view:settings",
    "view:profile",
    "view:billing",
    "view:api-keys",
    "export:reports",
    "manage:users",
    "manage:settings",
    "switch:role"
  ],
  manager: [
    "view:dashboard",
    "view:analytics",
    "view:reports",
    "view:team-performance",
    "view:notifications",
    "view:settings",
    "export:reports"
  ],
  viewer: ["view:dashboard", "view:analytics", "view:reports", "view:profile", "read:only"]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function isReadOnlyRole(role: Role): boolean {
  return hasPermission(role, "read:only");
}

export const ROLE_META: Record<Role, { label: string; description: string; color: string }> = {
  admin: {
    label: "Admin",
    description: "Full platform access",
    color:
      "text-brand-700 bg-brand-50 border-brand-200 dark:text-brand-300 dark:bg-brand-500/10 dark:border-brand-500/30"
  },
  manager: {
    label: "Manager",
    description: "Analytics, reports & settings",
    color:
      "text-brand-700 bg-brand-50 border-brand-200 dark:text-brand-300 dark:bg-brand-500/10 dark:border-brand-500/30"
  },
  viewer: {
    label: "Viewer",
    description: "Read-only dashboards",
    color:
      "text-subtle bg-muted border-border"
  }
};

export function roleDetails(role: Role): { name: string; email: string } {
  return {
    admin: { name: "DevPulse Admin", email: "admin@devpulse.app" },
    manager: { name: "Sarah Manager", email: "sarah@devpulse.app" },
    viewer: { name: "Alex Viewer", email: "alex@devpulse.app" }
  }[role];
}
