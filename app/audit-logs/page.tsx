"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Search, ShieldCheck } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuditStatus = "Success" | "Warning" | "Failed" | "Pending";

type AuditLog = {
  id: string;
  user: string;
  action: string;
  resource: string;
  ipAddress: string;
  timestamp: string;
  status: AuditStatus;
};

const auditLogs: AuditLog[] = [
  {
    id: "AUD-1048",
    user: "DevPulse Admin",
    action: "Changed user role",
    resource: "User: Alex Viewer",
    ipAddress: "203.0.113.42",
    timestamp: "2026-05-18T10:14:00",
    status: "Success"
  },
  {
    id: "AUD-1047",
    user: "DevPulse Admin",
    action: "Updated billing plan",
    resource: "Workspace: Pro Analytics",
    ipAddress: "203.0.113.42",
    timestamp: "2026-05-18T09:08:00",
    status: "Success"
  },
  {
    id: "AUD-1046",
    user: "Sarah Manager",
    action: "Exported report",
    resource: "Report: Executive Growth Snapshot",
    ipAddress: "198.51.100.27",
    timestamp: "2026-05-17T16:42:00",
    status: "Success"
  },
  {
    id: "AUD-1045",
    user: "DevPulse Admin",
    action: "Viewed API key",
    resource: "API Key: Production Gateway",
    ipAddress: "203.0.113.42",
    timestamp: "2026-05-17T14:17:00",
    status: "Warning"
  },
  {
    id: "AUD-1044",
    user: "Nina Ops",
    action: "Failed login",
    resource: "Authentication",
    ipAddress: "192.0.2.88",
    timestamp: "2026-05-16T21:31:00",
    status: "Failed"
  },
  {
    id: "AUD-1043",
    user: "DevPulse Admin",
    action: "Created API key",
    resource: "API Key: Data Ingest",
    ipAddress: "203.0.113.42",
    timestamp: "2026-05-16T12:06:00",
    status: "Success"
  },
  {
    id: "AUD-1042",
    user: "Sarah Manager",
    action: "Updated report schedule",
    resource: "Report: Weekly Revenue Brief",
    ipAddress: "198.51.100.27",
    timestamp: "2026-05-15T18:25:00",
    status: "Pending"
  },
  {
    id: "AUD-1041",
    user: "DevPulse Admin",
    action: "Disabled user",
    resource: "User: Former Contractor",
    ipAddress: "203.0.113.42",
    timestamp: "2026-05-15T11:52:00",
    status: "Success"
  },
  {
    id: "AUD-1040",
    user: "Alex Viewer",
    action: "Access denied",
    resource: "Settings: API Keys",
    ipAddress: "198.51.100.96",
    timestamp: "2026-05-14T15:44:00",
    status: "Warning"
  },
  {
    id: "AUD-1039",
    user: "DevPulse Admin",
    action: "Updated SSO settings",
    resource: "Workspace Security",
    ipAddress: "203.0.113.42",
    timestamp: "2026-05-14T10:03:00",
    status: "Success"
  },
  {
    id: "AUD-1038",
    user: "Sarah Manager",
    action: "Invited user",
    resource: "User: Morgan Analyst",
    ipAddress: "198.51.100.27",
    timestamp: "2026-05-13T13:19:00",
    status: "Pending"
  },
  {
    id: "AUD-1037",
    user: "DevPulse Admin",
    action: "Deleted API key",
    resource: "API Key: Legacy Sandbox",
    ipAddress: "203.0.113.42",
    timestamp: "2026-05-12T17:38:00",
    status: "Success"
  },
  {
    id: "AUD-1036",
    user: "Nina Ops",
    action: "Password reset requested",
    resource: "User: Nina Ops",
    ipAddress: "192.0.2.88",
    timestamp: "2026-05-11T08:57:00",
    status: "Success"
  },
  {
    id: "AUD-1035",
    user: "DevPulse Admin",
    action: "Changed data retention",
    resource: "Compliance Settings",
    ipAddress: "203.0.113.42",
    timestamp: "2026-05-10T16:04:00",
    status: "Success"
  },
  {
    id: "AUD-1034",
    user: "Alex Viewer",
    action: "Failed login",
    resource: "Authentication",
    ipAddress: "198.51.100.96",
    timestamp: "2026-05-09T22:18:00",
    status: "Failed"
  }
];

const pageSize = 8;
const users = ["All users", ...Array.from(new Set(auditLogs.map((log) => log.user)))];
const actions = ["All actions", ...Array.from(new Set(auditLogs.map((log) => log.action)))];
const statuses: ("All statuses" | AuditStatus)[] = ["All statuses", "Success", "Warning", "Failed", "Pending"];

const statusStyles: Record<AuditStatus, string> = {
  Success: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
  Warning: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
  Failed: "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300",
  Pending: "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-300"
};

function formatDateTime(timestamp: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(timestamp));
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [user, setUser] = useState("All users");
  const [action, setAction] = useState("All actions");
  const [status, setStatus] = useState("All statuses");
  const [page, setPage] = useState(1);

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase();
    const start = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const end = endDate ? new Date(`${endDate}T23:59:59`) : null;

    return auditLogs.filter((log) => {
      const logDate = new Date(log.timestamp);
      const matchesSearch =
        !query ||
        [log.user, log.action, log.resource, log.ipAddress, log.status, log.id].some((value) =>
          value.toLowerCase().includes(query)
        );
      const matchesUser = user === "All users" || log.user === user;
      const matchesAction = action === "All actions" || log.action === action;
      const matchesStatus = status === "All statuses" || log.status === status;
      const matchesStart = !start || logDate >= start;
      const matchesEnd = !end || logDate <= end;

      return matchesSearch && matchesUser && matchesAction && matchesStatus && matchesStart && matchesEnd;
    });
  }, [action, endDate, search, startDate, status, user]);

  const pageCount = Math.max(1, Math.ceil(filteredLogs.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = (currentPage - 1) * pageSize;
  const paginatedLogs = filteredLogs.slice(pageStart, pageStart + pageSize);

  const updateFilter = (callback: () => void) => {
    callback();
    setPage(1);
  };

  return (
    <ProtectedPage
      permission="view:audit-logs"
      restrictedTitle="Access denied"
      restrictedDescription="Only admins can view audit logs and compliance activity."
    >
      <PageHeader title="Audit Logs" description="System activity trail for security reviews, account changes, and sensitive workspace events." />

      <section className="panel overflow-hidden rounded-lg">
        <div className="flex flex-col gap-4 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-md border border-brand-500/25 bg-brand-500/10 text-brand-700 dark:text-brand-300">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-semibold">Security events</h2>
              <p className="mt-1 text-sm text-subtle">{filteredLogs.length} matching records</p>
            </div>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
            <input
              value={search}
              onChange={(event) => updateFilter(() => setSearch(event.target.value))}
              placeholder="Search user, action, resource, IP..."
              className="focus-ring h-10 w-full rounded-md border border-border bg-panel pl-9 pr-3 text-sm"
            />
          </div>
        </div>

        <div className="grid gap-3 border-b border-border bg-muted/25 px-5 py-4 md:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-subtle">
              <Filter className="h-3.5 w-3.5" />
              Start date
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => updateFilter(() => setStartDate(event.target.value))}
              className="focus-ring h-10 w-full rounded-md border border-border bg-panel px-3 text-sm"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-subtle">End date</span>
            <input
              type="date"
              value={endDate}
              onChange={(event) => updateFilter(() => setEndDate(event.target.value))}
              className="focus-ring h-10 w-full rounded-md border border-border bg-panel px-3 text-sm"
            />
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-subtle">User</span>
            <select
              value={user}
              onChange={(event) => updateFilter(() => setUser(event.target.value))}
              className="focus-ring h-10 w-full rounded-md border border-border bg-panel px-3 text-sm"
            >
              {users.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-subtle">Action type</span>
            <select
              value={action}
              onChange={(event) => updateFilter(() => setAction(event.target.value))}
              className="focus-ring h-10 w-full rounded-md border border-border bg-panel px-3 text-sm"
            >
              {actions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
          <label className="space-y-1.5">
            <span className="text-xs font-semibold text-subtle">Status</span>
            <select
              value={status}
              onChange={(event) => updateFilter(() => setStatus(event.target.value))}
              className="focus-ring h-10 w-full rounded-md border border-border bg-panel px-3 text-sm"
            >
              {statuses.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs uppercase text-subtle">
              <tr>
                <th className="px-5 py-3 font-semibold">User</th>
                <th className="px-5 py-3 font-semibold">Action</th>
                <th className="px-5 py-3 font-semibold">Resource</th>
                <th className="px-5 py-3 font-semibold">IP Address</th>
                <th className="px-5 py-3 font-semibold">Date/Time</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="border-b border-border last:border-0 transition hover:bg-muted/35">
                  <td className="px-5 py-4">
                    <p className="font-semibold">{log.user}</p>
                    <p className="mt-0.5 text-xs text-subtle">{log.id}</p>
                  </td>
                  <td className="px-5 py-4 font-medium">{log.action}</td>
                  <td className="px-5 py-4 text-subtle">{log.resource}</td>
                  <td className="px-5 py-4 font-mono text-xs">{log.ipAddress}</td>
                  <td className="px-5 py-4 text-subtle">{formatDateTime(log.timestamp)}</td>
                  <td className="px-5 py-4">
                    <Badge className={cn("font-semibold", statusStyles[log.status])}>{log.status}</Badge>
                  </td>
                </tr>
              ))}
              {paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-subtle">
                    No audit records match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-subtle">
            Showing {filteredLogs.length === 0 ? 0 : pageStart + 1}-{Math.min(pageStart + pageSize, filteredLogs.length)} of {filteredLogs.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="h-9 px-3"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <span className="min-w-20 text-center text-sm font-medium">
              {currentPage} / {pageCount}
            </span>
            <Button
              variant="secondary"
              className="h-9 px-3"
              disabled={currentPage === pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </ProtectedPage>
  );
}
