"use client";

import { useMemo, useState } from "react";
import { Download, Eye, FileText, X } from "lucide-react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/filters/filter-bar";
import { ReportsTable } from "@/components/tables/reports-table";
import { reports } from "@/lib/data";
import { exportReportsCsv, exportReportsPdf } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { hasPermission } from "@/lib/roles";
import { cn } from "@/lib/utils";
import type { Filters, Report } from "@/types/analytics";

const DOWNLOAD_HISTORY = [
  { id: "DL-001", name: "Executive Growth Snapshot", format: "pdf", size: "124 KB", downloadedAt: "Today, 09:42" },
  { id: "DL-002", name: "Checkout Revenue Drilldown", format: "csv", size: "18 KB", downloadedAt: "Yesterday, 16:18" },
  { id: "DL-003", name: "Q1 Full Export", format: "csv", size: "84 KB", downloadedAt: "Apr 28, 11:03" }
] as const;

function ExportModal({ data, onClose }: { data: Report[]; onClose: () => void }) {
  const [selected, setSelected] = useState<Report["id"][]>(data.filter((r) => r.status === "Ready").map((r) => r.id));
  const [format, setFormat] = useState<"csv" | "pdf">("csv");

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));

  const handleExport = () => {
    const toExport = data.filter((r) => selected.includes(r.id));
    if (format === "csv") exportReportsCsv(toExport);
    else exportReportsPdf(toExport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg border border-border bg-panel shadow-elevated">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <Download className="h-4 w-4 text-subtle" />
            <p className="font-semibold">Export Reports</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted transition" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Format selector */}
          <p className="text-xs font-semibold uppercase tracking-widest text-subtle">Export format</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["csv", "pdf"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={cn("rounded-lg border px-4 py-3 text-left transition", format === f ? "border-brand-500 bg-brand-50/50 dark:bg-brand-500/10" : "border-border hover:border-brand-500/45")}
              >
                <p className="text-sm font-semibold uppercase">{f}</p>
                <p className="mt-0.5 text-xs text-subtle">
                  {f === "csv" ? "Comma-separated values for spreadsheets" : "Print-optimized report document"}
                </p>
              </button>
            ))}
          </div>

          {/* Report selector */}
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-subtle">Select reports</p>
          <div className="mt-2 space-y-1.5 max-h-48 overflow-y-auto">
            {data.map((report) => (
              <label
                key={report.id}
                className={cn("flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition", selected.includes(report.id) ? "border-brand-500 bg-brand-50/40 dark:bg-brand-500/10" : "border-border hover:border-brand-500/45")}
              >
                <input
                  type="checkbox"
                  className="accent-brand-500"
                  checked={selected.includes(report.id)}
                  onChange={() => toggle(report.id)}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{report.name}</p>
                  <p className="text-xs text-subtle">{report.project} · {report.createdAt}</p>
                </div>
                <Badge className={report.status === "Ready"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
                  : report.status === "Processing"
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                  : "bg-muted text-subtle border-border"
                }>
                  {report.status}
                </Badge>
              </label>
            ))}
          </div>

          {/* Download history */}
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-subtle">Recent downloads</p>
          <div className="mt-2 space-y-1">
            {DOWNLOAD_HISTORY.map((dl) => (
              <div key={dl.id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted/40 transition">
                <FileText className="h-3.5 w-3.5 shrink-0 text-subtle" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{dl.name}</p>
                  <p className="text-[11px] text-subtle">{dl.downloadedAt} · {dl.size}</p>
                </div>
                <Badge className="bg-muted text-subtle border-border uppercase text-[10px]">{dl.format}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <p className="text-xs text-subtle">{selected.length} report{selected.length !== 1 ? "s" : ""} selected</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={handleExport} disabled={selected.length === 0}>
              <Download className="h-4 w-4" />
              Export {format.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { role } = useAuth();
  const canExport = hasPermission(role, "export:reports");
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPreview, setShowPreview] = useState<Report | null>(null);
  const [filters, setFilters] = useState<Filters>({
    dateRange: "30d",
    category: "All categories",
    source: "All sources",
    project: "All projects"
  });

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const category = filters.category === "All categories" || report.category === filters.category;
        const source = filters.source === "All sources" || report.source === filters.source;
        const project = filters.project === "All projects" || report.project === filters.project;
        return category && source && project;
      }),
    [filters]
  );

  return (
    <ProtectedPage>
      {showExportModal && (
        <ExportModal data={filteredReports} onClose={() => setShowExportModal(false)} />
      )}

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={() => setShowPreview(null)} />
          <div className="relative w-full max-w-md rounded-lg border border-border bg-panel shadow-elevated">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-subtle" />
                <p className="font-semibold">Report Preview</p>
              </div>
              <button onClick={() => setShowPreview(null)} className="rounded-lg p-1.5 hover:bg-muted transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <p className="text-xs text-subtle">Report name</p>
                <p className="mt-0.5 font-semibold">{showPreview.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Project", value: showPreview.project },
                  { label: "Category", value: showPreview.category },
                  { label: "Source", value: showPreview.source },
                  { label: "Status", value: showPreview.status },
                  { label: "Visitors", value: showPreview.visitors.toLocaleString() },
                  { label: "Revenue", value: `$${showPreview.revenue.toLocaleString()}` },
                  { label: "Conversion", value: `${showPreview.conversion}%` },
                  { label: "Created", value: showPreview.createdAt }
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-border bg-muted/50 px-3 py-2">
                    <p className="text-[11px] text-subtle">{label}</p>
                    <p className="mt-0.5 text-sm font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
              <Button variant="secondary" onClick={() => setShowPreview(null)}>Close</Button>
              {canExport && (
                <Button variant="primary" onClick={() => { exportReportsCsv([showPreview]); setShowPreview(null); }}>
                  <Download className="h-4 w-4" />
                  Download CSV
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <PageHeader
        title="Reports"
        description="Sortable analytics exports for product, finance, and executive review cycles."
      >
        {canExport && (
          <Button variant="primary" onClick={() => setShowExportModal(true)}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        )}
      </PageHeader>

      <FilterBar filters={filters} onChange={setFilters} />
      <ReportsTable data={filteredReports} />
    </ProtectedPage>
  );
}
