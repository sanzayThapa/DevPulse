"use client";

import { ScrollText, ShieldCheck } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";

const logs = [
  { event: "Role changed", actor: "DevPulse Admin", target: "Alex Viewer", time: "Today, 10:14", status: "reviewed" },
  { event: "Billing plan updated", actor: "DevPulse Admin", target: "Pro workspace", time: "Today, 09:08", status: "approved" },
  { event: "API key viewed", actor: "DevPulse Admin", target: "Production key", time: "Yesterday, 16:42", status: "sensitive" },
  { event: "Report exported", actor: "Sarah Manager", target: "Executive Growth Snapshot", time: "Yesterday, 14:17", status: "complete" }
];

export default function AuditLogsPage() {
  return (
    <ProtectedPage permission="view:audit-logs" restrictedDescription="Audit logs are reserved for admins with full compliance access.">
      <PageHeader title="Audit Logs" description="Administrative record of sensitive workspace events and access changes." />

      <section className="panel overflow-hidden rounded-lg">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <ShieldCheck className="h-4 w-4 text-brand-500" />
          <p className="text-sm font-semibold">Security events</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="border-b border-border bg-muted/50 text-xs text-subtle">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Event</th>
                <th className="px-5 py-3 text-left font-semibold">Actor</th>
                <th className="px-5 py-3 text-left font-semibold">Target</th>
                <th className="px-5 py-3 text-left font-semibold">Time</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={`${log.event}-${log.time}`} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-5 py-4 font-medium"><ScrollText className="mr-2 inline h-3.5 w-3.5 text-subtle" />{log.event}</td>
                  <td className="px-5 py-4 text-subtle">{log.actor}</td>
                  <td className="px-5 py-4">{log.target}</td>
                  <td className="px-5 py-4 text-subtle">{log.time}</td>
                  <td className="px-5 py-4"><Badge>{log.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ProtectedPage>
  );
}

