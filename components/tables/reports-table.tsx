"use client";

import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { ArrowUpDown, Download, FileDown } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { exportReportsCsv } from "@/lib/export";
import { formatMetric } from "@/lib/utils";
import type { Report } from "@/types/analytics";

export function ReportsTable({ data, canExport = false }: { data: Report[]; canExport?: boolean }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<Report>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Report",
        cell: ({ row }) => (
          <div>
            <p className="font-semibold">{row.original.name}</p>
            <p className="text-xs text-subtle">{row.original.id}</p>
          </div>
        )
      },
      { accessorKey: "project", header: "Project" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "source", header: "Source" },
      {
        accessorKey: "visitors",
        header: "Visitors",
        cell: ({ row }) => formatMetric(row.original.visitors, "number")
      },
      {
        accessorKey: "revenue",
        header: "Revenue",
        cell: ({ row }) => formatMetric(row.original.revenue, "currency")
      },
      {
        accessorKey: "conversion",
        header: "Conversion",
        cell: ({ row }) => `${row.original.conversion}%`
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-subtle">{row.original.status}</span>
        )
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-col justify-between gap-3 border-b border-border p-5 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-semibold">Analytics Reports</h2>
          <p className="mt-1 text-sm text-subtle">Exportable snapshots designed for leadership and product reviews.</p>
        </div>
        {canExport ? (
          <div className="flex gap-2">
            <Button onClick={() => exportReportsCsv(data)}>
              <Download className="h-4 w-4" />
              CSV
            </Button>
            <Button onClick={() => alert("PDF export placeholder: connect jsPDF or server-side rendering when ready.")}>
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
          </div>
        ) : (
          <span className="rounded-md border border-border bg-muted px-2.5 py-1 text-xs font-medium text-subtle">
            Read-only
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[940px] text-left text-sm">
          <thead className="bg-muted/60 text-xs uppercase text-subtle">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-5 py-3 font-semibold">
                    <button className="inline-flex items-center gap-1" onClick={header.column.getToggleSortingHandler()}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      <ArrowUpDown className="h-3.5 w-3.5" />
                    </button>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-border transition hover:bg-muted/45">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
