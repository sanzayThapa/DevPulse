import type { ActiveUserPoint, Metric, Report, RevenueCategory, TrafficPoint, TrafficSource, User } from "@/types/analytics";
import { jitter, percentageJitter } from "@/lib/utils";

export const projects = ["Pulse API", "Checkout Flow", "Docs Portal", "Mobile App"];
export const categories = ["Subscriptions", "Usage", "Add-ons", "Enterprise"];
export const sources = ["Organic", "Direct", "Referral", "Paid"];

export const baseMetrics: Metric[] = [
  { key: "visitors", label: "Total Visitors", value: 184260, unit: "number", delta: 12.4, sparkline: [42, 46, 44, 53, 57, 62, 69] },
  { key: "revenue", label: "Revenue", value: 92340, unit: "currency", delta: 8.7, sparkline: [30, 38, 44, 43, 52, 58, 66] },
  { key: "apiRequests", label: "API Requests", value: 1268420, unit: "number", delta: 18.2, sparkline: [62, 58, 61, 69, 78, 75, 84] },
  { key: "errorRate", label: "Error Rate", value: 0.42, unit: "percent", delta: -2.1, sparkline: [12, 10, 11, 8, 7, 6, 5] },
  { key: "activeUsers", label: "Active Users", value: 8432, unit: "number", delta: 6.9, sparkline: [31, 36, 35, 44, 48, 52, 59] },
  { key: "conversionRate", label: "Conversion Rate", value: 7.83, unit: "percent", delta: 1.6, sparkline: [18, 20, 19, 23, 25, 27, 28] }
];

export const trafficData: TrafficPoint[] = [
  { time: "00:00", visitors: 5400, requests: 21000, errors: 41 },
  { time: "04:00", visitors: 7200, requests: 28600, errors: 36 },
  { time: "08:00", visitors: 12400, requests: 48200, errors: 61 },
  { time: "12:00", visitors: 18300, requests: 70100, errors: 78 },
  { time: "16:00", visitors: 22100, requests: 84300, errors: 69 },
  { time: "20:00", visitors: 19600, requests: 76800, errors: 54 }
];

export const activeUsersData: ActiveUserPoint[] = [
  { time: "Mon", users: 4200, mobile: 1700, desktop: 2500 },
  { time: "Tue", users: 5200, mobile: 2100, desktop: 3100 },
  { time: "Wed", users: 6100, mobile: 2600, desktop: 3500 },
  { time: "Thu", users: 6900, mobile: 3000, desktop: 3900 },
  { time: "Fri", users: 8400, mobile: 3700, desktop: 4700 },
  { time: "Sat", users: 7600, mobile: 3600, desktop: 4000 },
  { time: "Sun", users: 8900, mobile: 4100, desktop: 4800 }
];

export const revenueByCategory: RevenueCategory[] = [
  { category: "Subscriptions", revenue: 42600, subscriptions: 620 },
  { category: "Usage", revenue: 21800, subscriptions: 340 },
  { category: "Add-ons", revenue: 12600, subscriptions: 180 },
  { category: "Enterprise", revenue: 36700, subscriptions: 74 }
];

export const trafficSources: TrafficSource[] = [
  { source: "Organic", value: 44, color: "#06b6d4" },
  { source: "Direct", value: 27, color: "#10b981" },
  { source: "Referral", value: 18, color: "#f59e0b" },
  { source: "Paid", value: 11, color: "#6366f1" }
];

export const reports: Report[] = [
  { id: "RPT-2048", name: "Executive Growth Snapshot", project: "Pulse API", category: "Subscriptions", source: "Organic", visitors: 38240, revenue: 24800, conversion: 8.4, createdAt: "2026-04-30", status: "Ready" },
  { id: "RPT-2047", name: "Checkout Revenue Drilldown", project: "Checkout Flow", category: "Usage", source: "Direct", visitors: 21680, revenue: 18750, conversion: 9.1, createdAt: "2026-04-29", status: "Ready" },
  { id: "RPT-2046", name: "Acquisition Channel Audit", project: "Docs Portal", category: "Add-ons", source: "Referral", visitors: 15890, revenue: 9400, conversion: 5.8, createdAt: "2026-04-28", status: "Processing" },
  { id: "RPT-2045", name: "Mobile Activation Cohort", project: "Mobile App", category: "Enterprise", source: "Paid", visitors: 30210, revenue: 30900, conversion: 7.6, createdAt: "2026-04-27", status: "Ready" },
  { id: "RPT-2044", name: "API Reliability Summary", project: "Pulse API", category: "Usage", source: "Direct", visitors: 48770, revenue: 16420, conversion: 6.9, createdAt: "2026-04-26", status: "Archived" }
];

export const users: User[] = [
  { id: "USR-001", name: "DevPulse Admin", email: "admin@devpulse.app", role: "admin", status: "active", plan: "Enterprise", lastSeen: "2 min ago", avatar: "DA" },
  { id: "USR-002", name: "DevPulse User", email: "user@devpulse.app", role: "user", status: "active", plan: "Scale", lastSeen: "18 min ago", avatar: "DU" },
  { id: "USR-003", name: "Priya Shah", email: "priya@devpulse.app", role: "user", status: "invited", plan: "Growth", lastSeen: "Pending", avatar: "PS" },
  { id: "USR-004", name: "Noah Reed", email: "noah@devpulse.app", role: "user", status: "active", plan: "Growth", lastSeen: "1 hr ago", avatar: "NR" },
  { id: "USR-005", name: "Ava Stone", email: "ava@devpulse.app", role: "user", status: "suspended", plan: "Starter", lastSeen: "4 days ago", avatar: "AS" }
];

export function getLiveMetrics() {
  return baseMetrics.map((metric) => ({
    ...metric,
    value: metric.unit === "percent" ? percentageJitter(metric.value) : jitter(metric.value),
    delta: Number((metric.delta + (Math.random() - 0.5) * 1.8).toFixed(1)),
    sparkline: [...metric.sparkline.slice(1), jitter(metric.sparkline.at(-1) ?? 50, 0.18, 1)]
  }));
}

export function getLiveTrafficData() {
  return trafficData.map((point) => ({
    ...point,
    visitors: jitter(point.visitors),
    requests: jitter(point.requests),
    errors: jitter(point.errors, 0.14, 0)
  }));
}

export function getLiveActiveUsersData() {
  return activeUsersData.map((point) => ({
    ...point,
    users: jitter(point.users),
    mobile: jitter(point.mobile),
    desktop: jitter(point.desktop)
  }));
}
