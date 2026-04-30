import type { Report } from "@/types/analytics";

export function exportReportsCsv(reports: Report[]) {
  const headers = ["Name", "Project", "Category", "Source", "Visitors", "Revenue", "Conversion", "Created", "Status"];
  const rows = reports.map((report) => [
    report.name,
    report.project,
    report.category,
    report.source,
    report.visitors,
    report.revenue,
    `${report.conversion}%`,
    report.createdAt,
    report.status
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `devpulse-reports-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
