import type { Role } from "@/types/analytics";

export type Permission =
  | "view:dashboard"
  | "view:analytics"
  | "view:reports"
  | "view:users"
  | "view:settings"
  | "view:billing"
  | "export:reports"
  | "manage:users"
  | "manage:settings"
  | "switch:role";

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    "view:dashboard",
    "view:analytics",
    "view:reports",
    "view:users",
    "view:settings",
    "view:billing",
    "export:reports",
    "manage:users",
    "manage:settings",
    "switch:role"
  ],
  manager: [
    "view:dashboard",
    "view:analytics",
    "view:reports",
    "view:settings",
    "view:billing",
    "export:reports"
  ],
  viewer: ["view:dashboard", "view:analytics", "view:reports"]
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export const ROLE_META: Record<Role, { label: string; description: string; color: string }> = {
  admin: {
    label: "Admin",
    description: "Full platform access",
    color:
      "text-brand-700 bg-brand-50 border-brand-200 dark:text-brand-100 dark:bg-brand-950/40 dark:border-brand-900"
  },
  manager: {
    label: "Manager",
    description: "Analytics, reports & settings",
    color:
      "text-violet-700 bg-violet-50 border-violet-200 dark:text-violet-200 dark:bg-violet-950/40 dark:border-violet-900"
  },
  viewer: {
    label: "Viewer",
    description: "Read-only dashboards",
    color:
      "text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-300 dark:bg-slate-900/40 dark:border-slate-700"
  }
};

export function roleDetails(role: Role): { name: string; email: string } {
  return {
    admin: { name: "DevPulse Admin", email: "admin@devpulse.app" },
    manager: { name: "Sarah Manager", email: "sarah@devpulse.app" },
    viewer: { name: "Alex Viewer", email: "alex@devpulse.app" }
  }[role];
}
