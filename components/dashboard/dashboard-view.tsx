"use client";

import { useEffect, useMemo, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CircleDollarSign,
  FileText,
  Gauge,
  GripVertical,
  RadioTower,
  RotateCcw,
  Server,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { MetricCard } from "@/components/cards/metric-card";
import { ChartCard } from "@/components/charts/chart-card";
import { TrafficLineChart } from "@/components/charts/traffic-line-chart";
import { ActiveAreaChart } from "@/components/charts/active-area-chart";
import { RevenueBarChart } from "@/components/charts/revenue-bar-chart";
import { SourceDonutChart } from "@/components/charts/source-donut-chart";
import { FilterBar } from "@/components/filters/filter-bar";
import { PageHeader } from "@/components/layout/page-header";
import { InsightCards } from "@/components/insights/insight-cards";
import { LiveDataSection } from "@/components/live-data/live-data-section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useWorkspace } from "@/lib/workspace";
import { cn } from "@/lib/utils";
import { activeUsersData, baseMetrics, getLiveActiveUsersData, getLiveMetrics, getLiveTrafficData, revenueByCategory, trafficData, trafficSources } from "@/lib/data";
import type { ActiveUserPoint, Filters, Metric, RevenueCategory, Role, TrafficPoint } from "@/types/analytics";

type RoleWidget = {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
  tone?: "accent" | "neutral" | "warning" | "danger";
};

type DashboardItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

const LAYOUT_STORAGE_PREFIX = "devpulse-dashboard-layout";
const DEFAULT_CHART_ORDER = ["chart:traffic", "chart:active-users", "chart:revenue", "chart:sources"];

function scaleValue(value: number, multiplier: number) {
  return Math.max(1, Math.round(value * multiplier));
}

function compact(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function scaleMetric(metric: Metric, multiplier: number): Metric {
  const valueMultiplier = metric.unit === "percent" ? 0.72 + multiplier * 0.28 : multiplier;
  return {
    ...metric,
    value: Number((metric.value * valueMultiplier).toFixed(metric.unit === "percent" ? 2 : 0)),
    sparkline: metric.sparkline.map((value) => Number((value * valueMultiplier).toFixed(0)))
  };
}

function scaleTraffic(point: TrafficPoint, multiplier: number): TrafficPoint {
  return {
    ...point,
    visitors: scaleValue(point.visitors, multiplier),
    requests: scaleValue(point.requests, multiplier),
    errors: scaleValue(point.errors, multiplier === 0.18 ? 0.42 : multiplier)
  };
}

function scaleActiveUsers(point: ActiveUserPoint, multiplier: number): ActiveUserPoint {
  return {
    ...point,
    users: scaleValue(point.users, multiplier),
    mobile: scaleValue(point.mobile, multiplier),
    desktop: scaleValue(point.desktop, multiplier)
  };
}

function scaleRevenue(category: RevenueCategory, multiplier: number): RevenueCategory {
  return {
    ...category,
    revenue: scaleValue(category.revenue, multiplier),
    subscriptions: scaleValue(category.subscriptions, multiplier)
  };
}

function layoutStorageKey(mode: "dashboard" | "analytics", role: Role, workspaceId: string) {
  return `${LAYOUT_STORAGE_PREFIX}:${mode}:${role}:${workspaceId}`;
}

function normalizeOrder(savedOrder: string[] | null, itemIds: string[]) {
  if (!savedOrder) return itemIds;

  const available = new Set(itemIds);
  const ordered = savedOrder.filter((id) => available.has(id));
  const missing = itemIds.filter((id) => !ordered.includes(id));

  return [...ordered, ...missing];
}

function readSavedLayout(key: string) {
  try {
    const saved = window.localStorage.getItem(key);
    if (!saved) return null;
    const parsed = JSON.parse(saved) as { cards?: string[]; charts?: string[] };
    return parsed;
  } catch {
    return null;
  }
}

function roleWidgets(role: Role, multiplier: number): RoleWidget[] {
  const widgets: Record<Role, RoleWidget[]> = {
    admin: [
      { label: "Revenue", value: `$${compact(scaleValue(92400, multiplier))}`, description: "+12.8% monthly recurring revenue", icon: CircleDollarSign, tone: "accent" },
      { label: "User Growth", value: compact(scaleValue(18400, multiplier)), description: `${compact(scaleValue(1204, multiplier))} new users this week`, icon: Users },
      { label: "API Usage", value: compact(scaleValue(8900000, multiplier)), description: "Requests across selected workspace", icon: RadioTower },
      { label: "System Health", value: multiplier < 0.25 ? "99.91%" : "99.98%", description: "Platform uptime over 30 days", icon: ShieldCheck, tone: "accent" },
      { label: "Subscriptions", value: compact(scaleValue(1284, multiplier)), description: "Active paid workspaces", icon: TrendingUp },
      { label: "Critical Errors", value: String(scaleValue(7, multiplier < 0.25 ? 0.42 : multiplier)), description: "Require admin review", icon: AlertTriangle, tone: "danger" },
      { label: "Server Status", value: multiplier < 0.25 ? "Testing" : "Nominal", description: "All regions responding normally", icon: Server, tone: "accent" }
    ],
    manager: [
      { label: "Team Productivity", value: `${scaleValue(87, 0.82 + multiplier * 0.18)}%`, description: "Completed weekly objectives", icon: Users, tone: "accent" },
      { label: "Conversion Rate", value: `${(4.8 + multiplier * 2).toFixed(1)}%`, description: "+0.9% against last sprint", icon: TrendingUp, tone: "accent" },
      { label: "Weekly Reports", value: String(scaleValue(14, multiplier)), description: "Ready for review and export", icon: FileText },
      { label: "Campaign Performance", value: compact(scaleValue(42000, multiplier)), description: "Qualified sessions from active campaigns", icon: BarChart3 }
    ],
    viewer: [
      { label: "Personal Activity", value: String(scaleValue(24, 0.75 + multiplier * 0.25)), description: "Reports viewed this month", icon: Activity, tone: "accent" },
      { label: "Usage Overview", value: `${scaleValue(68, 0.8 + multiplier * 0.2)}%`, description: "Workspace insights consumed", icon: Gauge },
      { label: "Assigned Reports", value: String(scaleValue(5, multiplier < 0.25 ? 0.5 : multiplier)), description: "Read-only reports awaiting review", icon: FileText }
    ]
  };
  return widgets[role];
}

function RoleWidgetCard({ widget }: { widget: RoleWidget }) {
  const Icon = widget.icon;
  const toneClass = {
    accent: "border-brand-500/30 bg-brand-500/10 text-brand-600 dark:text-brand-400",
    neutral: "border-border bg-muted text-subtle",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-500",
    danger: "border-red-500/30 bg-red-500/10 text-red-500"
  }[widget.tone ?? "neutral"];

  return (
    <section className="panel rounded-lg p-4 transition-colors hover:border-brand-500/25">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-subtle">{widget.label}</p>
          <p className="mt-2 text-2xl font-semibold">{widget.value}</p>
        </div>
        <div className={`grid h-10 w-10 place-items-center rounded-md border ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 text-sm leading-5 text-subtle">{widget.description}</p>
    </section>
  );
}

function SortableDashboardItem({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group relative min-w-0 touch-manipulation rounded-lg outline-none transition-shadow",
        isDragging && "z-10 shadow-elevated"
      )}
    >
      <button
        type="button"
        aria-label={`Move ${label}`}
        className={cn(
          "focus-ring absolute right-2 top-2 z-10 grid h-8 w-8 cursor-grab place-items-center rounded-md border border-border bg-panel/95 text-subtle opacity-0 shadow-sm transition hover:border-brand-500/40 hover:text-foreground active:cursor-grabbing group-hover:opacity-100 group-focus-within:opacity-100",
          isDragging && "opacity-100"
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      {children}
    </div>
  );
}

function SortableGrid({ items, order, onOrderChange, className }: { items: DashboardItem[]; order: string[]; onOrderChange: (order: string[]) => void; className: string }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const itemMap = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const visibleItems = order.map((id) => itemMap.get(id)).filter((item): item is DashboardItem => Boolean(item));

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(String(active.id));
    const newIndex = order.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;

    onOrderChange(arrayMove(order, oldIndex, newIndex));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={order} strategy={rectSortingStrategy}>
        <div className={className}>
          {visibleItems.map((item) => (
            <SortableDashboardItem key={item.id} id={item.id} label={item.label}>
              {item.content}
            </SortableDashboardItem>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export function DashboardView({ mode = "dashboard" }: { mode?: "dashboard" | "analytics" }) {
  const { role } = useAuth();
  const { workspace } = useWorkspace();
  const [metrics, setMetrics] = useState<Metric[]>(() => baseMetrics.map((metric) => scaleMetric(metric, workspace.multiplier)));
  const [traffic, setTraffic] = useState<TrafficPoint[]>(() => trafficData.map((point) => scaleTraffic(point, workspace.multiplier)));
  const [activeUsers, setActiveUsers] = useState<ActiveUserPoint[]>(() => activeUsersData.map((point) => scaleActiveUsers(point, workspace.multiplier)));
  const [filters, setFilters] = useState<Filters>({
    dateRange: "7d",
    category: "All categories",
    source: "All sources",
    project: "All projects"
  });
  const [tick, setTick] = useState(0);
  const [cardOrder, setCardOrder] = useState<string[]>([]);
  const [chartOrder, setChartOrder] = useState<string[]>([]);
  const [loadedLayoutKey, setLoadedLayoutKey] = useState<string | null>(null);

  useEffect(() => {
    setMetrics(baseMetrics.map((metric) => scaleMetric(metric, workspace.multiplier)));
    setTraffic(trafficData.map((point) => scaleTraffic(point, workspace.multiplier)));
    setActiveUsers(activeUsersData.map((point) => scaleActiveUsers(point, workspace.multiplier)));

    const interval = window.setInterval(() => {
      setMetrics(getLiveMetrics().map((metric) => scaleMetric(metric, workspace.multiplier)));
      setTraffic(getLiveTrafficData().map((point) => scaleTraffic(point, workspace.multiplier)));
      setActiveUsers(getLiveActiveUsersData().map((point) => scaleActiveUsers(point, workspace.multiplier)));
      setTick((current) => current + 1);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [workspace.multiplier]);

  const isAnalytics = mode === "analytics";
  const widgets = useMemo(() => roleWidgets(role, workspace.multiplier), [role, workspace.multiplier]);
  const revenue = useMemo(() => revenueByCategory.map((category) => scaleRevenue(category, workspace.multiplier)), [workspace.multiplier]);
  const storageKey = layoutStorageKey(mode, role, workspace.id);
  const cardItems: DashboardItem[] = useMemo(
    () =>
      isAnalytics
        ? metrics.map((metric) => ({
            id: `metric:${metric.key}`,
            label: metric.label,
            content: <MetricCard metric={metric} />
          }))
        : widgets.map((widget) => ({
            id: `widget:${widget.label}`,
            label: widget.label,
            content: <RoleWidgetCard widget={widget} />
          })),
    [isAnalytics, metrics, widgets]
  );
  const chartItems: DashboardItem[] = useMemo(
    () => [
      {
        id: "chart:traffic",
        label: "Traffic over time",
        content: (
          <ChartCard title="Traffic over time" eyebrow="Requests and visitors">
            <TrafficLineChart data={traffic} />
          </ChartCard>
        )
      },
      {
        id: "chart:active-users",
        label: "Active users",
        content: (
          <ChartCard title="Active users" eyebrow="Weekly sessions">
            <ActiveAreaChart data={activeUsers} />
          </ChartCard>
        )
      },
      {
        id: "chart:revenue",
        label: "Revenue by category",
        content: (
          <ChartCard title="Revenue by category" eyebrow="Commercial pulse">
            <RevenueBarChart data={revenue} />
          </ChartCard>
        )
      },
      {
        id: "chart:sources",
        label: "Traffic sources",
        content: (
          <ChartCard title="Traffic sources" eyebrow="Acquisition mix">
            <SourceDonutChart data={trafficSources} />
          </ChartCard>
        )
      }
    ],
    [activeUsers, revenue, traffic]
  );
  const cardIds = useMemo(
    () => (isAnalytics ? baseMetrics.map((metric) => `metric:${metric.key}`) : widgets.map((widget) => `widget:${widget.label}`)),
    [isAnalytics, widgets]
  );
  const chartIds = DEFAULT_CHART_ORDER;
  const defaultCardOrder = useMemo(() => cardIds, [cardIds]);
  const defaultChartOrder = useMemo(() => chartIds, [chartIds]);
  const layoutChanged = cardOrder.join("|") !== defaultCardOrder.join("|") || chartOrder.join("|") !== defaultChartOrder.join("|");

  useEffect(() => {
    const saved = readSavedLayout(storageKey);
    setCardOrder(normalizeOrder(saved?.cards ?? null, defaultCardOrder));
    setChartOrder(normalizeOrder(saved?.charts ?? null, defaultChartOrder));
    setLoadedLayoutKey(storageKey);
  }, [storageKey, defaultCardOrder, defaultChartOrder]);

  useEffect(() => {
    if (loadedLayoutKey !== storageKey) return;

    window.localStorage.setItem(storageKey, JSON.stringify({ cards: cardOrder, charts: chartOrder }));
  }, [cardOrder, chartOrder, loadedLayoutKey, storageKey]);

  function resetLayout() {
    setCardOrder(defaultCardOrder);
    setChartOrder(defaultChartOrder);
    window.localStorage.removeItem(storageKey);
  }

  return (
    <>
      <PageHeader
        title={isAnalytics ? "Analytics" : "Performance Dashboard"}
        description={
          isAnalytics
            ? "Explore acquisition, engagement, revenue, and reliability trends with filters ready for a real API."
            : `Monitor ${workspace.name.toLowerCase()} traffic, revenue, API health, and conversion activity.`
        }
      >
        <div className="flex flex-wrap gap-2">
          <Badge className="border-brand-500/25 bg-brand-500/10 text-brand-700 dark:text-brand-300">
            <Activity className="h-3.5 w-3.5" />
            {workspace.name} · refresh {tick}
          </Badge>
          <Button variant="secondary" onClick={resetLayout} disabled={!layoutChanged} className="disabled:cursor-not-allowed disabled:opacity-50">
            <RotateCcw className="h-4 w-4" />
            Reset layout
          </Button>
          <Button variant="primary">
            <Zap className="h-4 w-4" />
            Deploy view
          </Button>
        </div>
      </PageHeader>

      <FilterBar filters={filters} onChange={setFilters} />

      <SortableGrid
        items={cardItems}
        order={cardOrder.length ? cardOrder : defaultCardOrder}
        onOrderChange={setCardOrder}
        className={isAnalytics ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "grid gap-4 sm:grid-cols-2 xl:grid-cols-4"}
      />

      <LiveDataSection />

      {role !== "viewer" ? <InsightCards /> : null}

      <SortableGrid
        items={chartItems}
        order={chartOrder.length ? chartOrder : defaultChartOrder}
        onOrderChange={setChartOrder}
        className="mt-6 grid gap-6 xl:grid-cols-2"
      />
    </>
  );
}
