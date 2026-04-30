"use client";

import { useMemo, useState } from "react";
import { ProtectedPage } from "@/components/layout/protected-page";
import { PageHeader } from "@/components/layout/page-header";
import { FilterBar } from "@/components/filters/filter-bar";
import { ReportsTable } from "@/components/tables/reports-table";
import { reports } from "@/lib/data";
import type { Filters } from "@/types/analytics";

export default function ReportsPage() {
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
      <PageHeader title="Reports" description="Sortable analytics exports for product, finance, and executive review cycles." />
      <FilterBar filters={filters} onChange={setFilters} />
      <ReportsTable data={filteredReports} />
    </ProtectedPage>
  );
}
