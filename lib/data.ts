import type {
  ActiveUserPoint,
  ApiEndpoint,
  DailyTrafficPoint,
  ErrorEvent,
  InsightCard,
  LatencyPoint,
  Metric,
  Notification,
  Report,
  RevenueCategory,
  RevenuePoint,
  TrafficPoint,
  TrafficSource,
  User,
  UserActivityPoint
} from "@/types/analytics";
import { jitter, percentageJitter } from "@/lib/utils";

export const projects = ["Pulse API", "Checkout Flow", "Docs Portal", "Mobile App"];
export const categories = ["Subscriptions", "Usage", "Add-ons", "Enterprise"];
export const sources = ["Organic", "Direct", "Referral", "Paid"];

// ─── Core KPI Metrics ───────────────────────────────────────────────────────

export const baseMetrics: Metric[] = [
  { key: "visitors", label: "Total Visitors", value: 184260, unit: "number", delta: 12.4, sparkline: [42, 46, 44, 53, 57, 62, 69] },
  { key: "revenue", label: "Revenue", value: 92340, unit: "currency", delta: 8.7, sparkline: [30, 38, 44, 43, 52, 58, 66] },
  { key: "apiRequests", label: "API Requests", value: 1268420, unit: "number", delta: 18.2, sparkline: [62, 58, 61, 69, 78, 75, 84] },
  { key: "errorRate", label: "Error Rate", value: 0.42, unit: "percent", delta: -2.1, sparkline: [12, 10, 11, 8, 7, 6, 5] },
  { key: "activeUsers", label: "Active Users", value: 8432, unit: "number", delta: 6.9, sparkline: [31, 36, 35, 44, 48, 52, 59] },
  { key: "conversionRate", label: "Conversion Rate", value: 7.83, unit: "percent", delta: 1.6, sparkline: [18, 20, 19, 23, 25, 27, 28] }
];

// ─── Traffic Data ────────────────────────────────────────────────────────────

export const trafficData: TrafficPoint[] = [
  { time: "00:00", visitors: 5400, requests: 21000, errors: 41 },
  { time: "04:00", visitors: 7200, requests: 28600, errors: 36 },
  { time: "08:00", visitors: 12400, requests: 48200, errors: 61 },
  { time: "12:00", visitors: 18300, requests: 70100, errors: 78 },
  { time: "16:00", visitors: 22100, requests: 84300, errors: 69 },
  { time: "20:00", visitors: 19600, requests: 76800, errors: 54 }
];

export const dailyTrafficData: DailyTrafficPoint[] = [
  { date: "Apr 8", pageViews: 42100, uniqueVisitors: 18400, bounceRate: 38.2, avgSessionDuration: 214 },
  { date: "Apr 9", pageViews: 44800, uniqueVisitors: 19200, bounceRate: 37.8, avgSessionDuration: 221 },
  { date: "Apr 10", pageViews: 51200, uniqueVisitors: 21600, bounceRate: 36.5, avgSessionDuration: 228 },
  { date: "Apr 11", pageViews: 48600, uniqueVisitors: 20800, bounceRate: 39.1, avgSessionDuration: 208 },
  { date: "Apr 12", pageViews: 55300, uniqueVisitors: 23100, bounceRate: 35.4, avgSessionDuration: 234 },
  { date: "Apr 13", pageViews: 61800, uniqueVisitors: 26400, bounceRate: 34.2, avgSessionDuration: 241 },
  { date: "Apr 14", pageViews: 58400, uniqueVisitors: 24900, bounceRate: 35.8, avgSessionDuration: 236 },
  { date: "Apr 15", pageViews: 63200, uniqueVisitors: 27100, bounceRate: 33.6, avgSessionDuration: 248 },
  { date: "Apr 16", pageViews: 67400, uniqueVisitors: 28800, bounceRate: 32.9, avgSessionDuration: 252 },
  { date: "Apr 17", pageViews: 72100, uniqueVisitors: 30600, bounceRate: 31.4, avgSessionDuration: 261 },
  { date: "Apr 18", pageViews: 69800, uniqueVisitors: 29400, bounceRate: 32.2, avgSessionDuration: 255 },
  { date: "Apr 19", pageViews: 74300, uniqueVisitors: 31700, bounceRate: 30.8, avgSessionDuration: 268 },
  { date: "Apr 20", pageViews: 78600, uniqueVisitors: 33200, bounceRate: 29.6, avgSessionDuration: 274 },
  { date: "Apr 21", pageViews: 76100, uniqueVisitors: 32400, bounceRate: 30.4, avgSessionDuration: 269 }
];

export const topPages = [
  { path: "/dashboard", views: 48240, unique: 21600, bounceRate: 22.4, avgTime: "4m 12s" },
  { path: "/api/v2/events", views: 36800, unique: 18200, bounceRate: 8.1, avgTime: "0m 48s" },
  { path: "/docs/quickstart", views: 28400, unique: 16100, bounceRate: 41.3, avgTime: "6m 22s" },
  { path: "/pricing", views: 22100, unique: 14800, bounceRate: 52.8, avgTime: "2m 04s" },
  { path: "/checkout", views: 18600, unique: 12400, bounceRate: 18.2, avgTime: "3m 38s" },
  { path: "/settings/billing", views: 14200, unique: 9800, bounceRate: 28.6, avgTime: "2m 51s" },
  { path: "/analytics/overview", views: 12800, unique: 8600, bounceRate: 19.4, avgTime: "5m 44s" }
];

// ─── Active Users ────────────────────────────────────────────────────────────

export const activeUsersData: ActiveUserPoint[] = [
  { time: "Mon", users: 4200, mobile: 1700, desktop: 2500 },
  { time: "Tue", users: 5200, mobile: 2100, desktop: 3100 },
  { time: "Wed", users: 6100, mobile: 2600, desktop: 3500 },
  { time: "Thu", users: 6900, mobile: 3000, desktop: 3900 },
  { time: "Fri", users: 8400, mobile: 3700, desktop: 4700 },
  { time: "Sat", users: 7600, mobile: 3600, desktop: 4000 },
  { time: "Sun", users: 8900, mobile: 4100, desktop: 4800 }
];

export const userActivityData: UserActivityPoint[] = [
  { date: "Apr 8", dau: 4200, wau: 18400, mau: 68200 },
  { date: "Apr 9", dau: 4600, wau: 18900, mau: 68800 },
  { date: "Apr 10", dau: 5100, wau: 19600, mau: 69400 },
  { date: "Apr 11", dau: 4800, wau: 19200, mau: 70100 },
  { date: "Apr 12", dau: 5600, wau: 20100, mau: 70900 },
  { date: "Apr 13", dau: 6200, wau: 21400, mau: 71800 },
  { date: "Apr 14", dau: 5900, wau: 21800, mau: 72400 },
  { date: "Apr 15", dau: 6400, wau: 22600, mau: 73200 },
  { date: "Apr 16", dau: 7100, wau: 23400, mau: 74100 },
  { date: "Apr 17", dau: 7800, wau: 24200, mau: 75000 },
  { date: "Apr 18", dau: 7400, wau: 24800, mau: 75900 },
  { date: "Apr 19", dau: 8100, wau: 25600, mau: 77200 },
  { date: "Apr 20", dau: 8432, wau: 26800, mau: 78600 },
  { date: "Apr 21", dau: 8200, wau: 27100, mau: 79400 }
];

export const featureUsage = [
  { feature: "API Explorer", users: 5840, pct: 69.3 },
  { feature: "Real-time Dashboard", users: 5210, pct: 61.8 },
  { feature: "Alerts & Rules", users: 4380, pct: 52.0 },
  { feature: "Report Builder", users: 3640, pct: 43.2 },
  { feature: "Webhook Integrations", users: 2980, pct: 35.4 },
  { feature: "CSV Exports", users: 2410, pct: 28.6 },
  { feature: "Team Collaboration", users: 1860, pct: 22.1 }
];

// ─── Revenue ──────────────────────────────────────────────────────────────────

export const revenueByCategory: RevenueCategory[] = [
  { category: "Subscriptions", revenue: 42600, subscriptions: 620 },
  { category: "Usage", revenue: 21800, subscriptions: 340 },
  { category: "Add-ons", revenue: 12600, subscriptions: 180 },
  { category: "Enterprise", revenue: 36700, subscriptions: 74 }
];

export const revenueHistory: RevenuePoint[] = [
  { month: "May", mrr: 61200, arr: 734400, newRevenue: 8400, churn: 2200 },
  { month: "Jun", mrr: 64800, arr: 777600, newRevenue: 6900, churn: 2100 },
  { month: "Jul", mrr: 68400, arr: 820800, newRevenue: 7200, churn: 1900 },
  { month: "Aug", mrr: 72100, arr: 865200, newRevenue: 8100, churn: 2400 },
  { month: "Sep", mrr: 74600, arr: 895200, newRevenue: 6800, churn: 1800 },
  { month: "Oct", mrr: 78200, arr: 938400, newRevenue: 8900, churn: 2100 },
  { month: "Nov", mrr: 81400, arr: 976800, newRevenue: 7600, churn: 1700 },
  { month: "Dec", mrr: 79800, arr: 957600, newRevenue: 5200, churn: 2600 },
  { month: "Jan", mrr: 82400, arr: 988800, newRevenue: 8400, churn: 1800 },
  { month: "Feb", mrr: 85600, arr: 1027200, newRevenue: 7800, churn: 1600 },
  { month: "Mar", mrr: 88900, arr: 1066800, newRevenue: 9200, churn: 1900 },
  { month: "Apr", mrr: 92340, arr: 1108080, newRevenue: 9800, churn: 1700 }
];

export const revenueByPlan = [
  { plan: "Enterprise", revenue: 36700, users: 74, arpu: 496 },
  { plan: "Scale", revenue: 28400, users: 184, arpu: 154 },
  { plan: "Growth", revenue: 18600, users: 380, arpu: 49 },
  { plan: "Starter", revenue: 8640, users: 720, arpu: 12 }
];

// ─── Traffic Sources ─────────────────────────────────────────────────────────

export const trafficSources: TrafficSource[] = [
  { source: "Organic", value: 44, color: "#10b981" },
  { source: "Direct", value: 27, color: "#10b981" },
  { source: "Referral", value: 18, color: "#f59e0b" },
  { source: "Paid", value: 11, color: "#334155" }
];

// ─── API Performance ─────────────────────────────────────────────────────────

export const apiEndpoints: ApiEndpoint[] = [
  { path: "/api/v2/events", method: "POST", avgLatency: 42, p95Latency: 98, errorRate: 0.12, requestsPerMin: 2840 },
  { path: "/api/v2/metrics", method: "GET", avgLatency: 68, p95Latency: 142, errorRate: 0.08, requestsPerMin: 1920 },
  { path: "/api/v2/users", method: "GET", avgLatency: 54, p95Latency: 118, errorRate: 0.15, requestsPerMin: 1480 },
  { path: "/api/v2/reports", method: "POST", avgLatency: 186, p95Latency: 420, errorRate: 0.31, requestsPerMin: 640 },
  { path: "/api/v2/alerts", method: "GET", avgLatency: 38, p95Latency: 84, errorRate: 0.06, requestsPerMin: 1120 },
  { path: "/api/v2/webhooks", method: "POST", avgLatency: 94, p95Latency: 248, errorRate: 0.44, requestsPerMin: 380 },
  { path: "/api/v2/auth/token", method: "POST", avgLatency: 28, p95Latency: 62, errorRate: 0.22, requestsPerMin: 2160 },
  { path: "/api/v2/export", method: "GET", avgLatency: 312, p95Latency: 680, errorRate: 0.58, requestsPerMin: 220 }
];

export const latencyHistory: LatencyPoint[] = [
  { time: "00:00", p50: 38, p95: 88, p99: 142 },
  { time: "02:00", p50: 34, p95: 78, p99: 128 },
  { time: "04:00", p50: 31, p95: 72, p99: 118 },
  { time: "06:00", p50: 44, p95: 104, p99: 168 },
  { time: "08:00", p50: 62, p95: 148, p99: 241 },
  { time: "10:00", p50: 78, p95: 184, p99: 296 },
  { time: "12:00", p50: 84, p95: 198, p99: 318 },
  { time: "14:00", p50: 72, p95: 168, p99: 274 },
  { time: "16:00", p50: 68, p95: 158, p99: 258 },
  { time: "18:00", p50: 74, p95: 172, p99: 282 },
  { time: "20:00", p50: 58, p95: 136, p99: 218 },
  { time: "22:00", p50: 46, p95: 108, p99: 174 }
];

export const requestVolumeHistory = [
  { time: "00:00", success: 18400, failed: 82 },
  { time: "02:00", success: 12800, failed: 54 },
  { time: "04:00", success: 9600, failed: 38 },
  { time: "06:00", success: 16200, failed: 68 },
  { time: "08:00", success: 42800, failed: 198 },
  { time: "10:00", success: 68400, failed: 284 },
  { time: "12:00", success: 72100, failed: 312 },
  { time: "14:00", success: 64800, failed: 268 },
  { time: "16:00", success: 58600, failed: 242 },
  { time: "18:00", success: 54200, failed: 224 },
  { time: "20:00", success: 46800, failed: 186 },
  { time: "22:00", success: 28400, failed: 118 }
];

// ─── Error Monitoring ────────────────────────────────────────────────────────

export const errorEvents: ErrorEvent[] = [
  { id: "ERR-0841", type: "TimeoutError", message: "Request timeout after 30s on export endpoint", endpoint: "/api/v2/export", count: 184, lastSeen: "4 min ago", status: "active" },
  { id: "ERR-0840", type: "ValidationError", message: "Invalid webhook payload: missing event_type field", endpoint: "/api/v2/webhooks", count: 96, lastSeen: "12 min ago", status: "active" },
  { id: "ERR-0839", type: "AuthError", message: "JWT signature verification failed", endpoint: "/api/v2/auth/token", count: 48, lastSeen: "28 min ago", status: "active" },
  { id: "ERR-0838", type: "RateLimitError", message: "Rate limit exceeded: 1000 req/min per tenant", endpoint: "/api/v2/events", count: 312, lastSeen: "1 hr ago", status: "resolved" },
  { id: "ERR-0837", type: "DatabaseError", message: "Connection pool exhausted under peak load", endpoint: "/api/v2/reports", count: 24, lastSeen: "2 hr ago", status: "resolved" },
  { id: "ERR-0836", type: "ParseError", message: "Malformed JSON body in batch event upload", endpoint: "/api/v2/events", count: 68, lastSeen: "3 hr ago", status: "ignored" },
  { id: "ERR-0835", type: "NotFoundError", message: "Metric key 'custom_event_v1' not registered", endpoint: "/api/v2/metrics", count: 142, lastSeen: "6 hr ago", status: "resolved" }
];

export const errorRateHistory = [
  { time: "00:00", rate: 0.38, count: 72 },
  { time: "02:00", rate: 0.31, count: 48 },
  { time: "04:00", rate: 0.28, count: 36 },
  { time: "06:00", rate: 0.42, count: 68 },
  { time: "08:00", rate: 0.56, count: 198 },
  { time: "10:00", rate: 0.48, count: 284 },
  { time: "12:00", rate: 0.52, count: 312 },
  { time: "14:00", rate: 0.44, count: 268 },
  { time: "16:00", rate: 0.41, count: 242 },
  { time: "18:00", rate: 0.38, count: 224 },
  { time: "20:00", rate: 0.35, count: 186 },
  { time: "22:00", rate: 0.29, count: 118 }
];

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications: Notification[] = [
  { id: "N-001", title: "Traffic spike detected", body: "Visitors jumped 42% above baseline in the last 15 minutes.", type: "alert", time: "3 min ago", read: false },
  { id: "N-002", title: "Weekly report ready", body: "Your Apr 14–21 analytics report has been generated and is ready to download.", type: "success", time: "1 hr ago", read: false },
  { id: "N-003", title: "API error rate elevated", body: "/api/v2/export error rate reached 0.58% — above the 0.5% threshold.", type: "warning", time: "2 hr ago", read: false },
  { id: "N-004", title: "New user joined", body: "Priya Shah (priya@devpulse.app) accepted the invitation and joined the workspace.", type: "info", time: "4 hr ago", read: true },
  { id: "N-005", title: "Revenue milestone hit", body: "Monthly recurring revenue crossed $92k for the first time.", type: "success", time: "Yesterday", read: true },
  { id: "N-006", title: "Export job completed", body: "Your Q1 Revenue Drilldown PDF export is ready for download.", type: "info", time: "Yesterday", read: true }
];

// ─── Insight Cards ────────────────────────────────────────────────────────────

export const insightCards: InsightCard[] = [
  { id: "I-001", title: "Traffic up 23% this week", body: "Visitor growth is accelerating — driven by a 41% surge in organic search. Desktop sessions lead the increase.", metric: "+23.4%", delta: 23.4, type: "positive" },
  { id: "I-002", title: "Error rate dropped 48%", body: "After the v2.4.1 hotfix deployment at 14:20, /api/v2/export errors fell from 1.1% to 0.58%. Still above SLA threshold.", metric: "-48%", delta: -48, type: "warning" },
  { id: "I-003", title: "Pro plan drives 72% of revenue", body: "Enterprise + Scale tiers account for $65.1k of $92.3k MRR. Upsell velocity from Growth → Scale is up 18%.", metric: "$65.1k", type: "positive" },
  { id: "I-004", title: "Mobile conversion 3.2× lower", body: "Desktop converts at 9.8% vs mobile at 3.1%. Checkout friction on mobile detected in session replays.", metric: "3.1% vs 9.8%", type: "negative" },
  { id: "I-005", title: "API p99 latency trending up", body: "p99 latency climbed from 142ms to 318ms during 10:00–12:00 peak window. Correlated with report generation queue depth.", metric: "318ms p99", type: "warning" },
  { id: "I-006", title: "DAU grew 6.9% week-over-week", body: "Daily active users hit 8,432 — the highest since launch. Friday sessions are 2.1× longer than Monday sessions.", metric: "8,432 DAU", delta: 6.9, type: "positive" }
];

// ─── Reports ─────────────────────────────────────────────────────────────────

export const reports: Report[] = [
  { id: "RPT-2048", name: "Executive Growth Snapshot", project: "Pulse API", category: "Subscriptions", source: "Organic", visitors: 38240, revenue: 24800, conversion: 8.4, createdAt: "2026-04-30", status: "Ready" },
  { id: "RPT-2047", name: "Checkout Revenue Drilldown", project: "Checkout Flow", category: "Usage", source: "Direct", visitors: 21680, revenue: 18750, conversion: 9.1, createdAt: "2026-04-29", status: "Ready" },
  { id: "RPT-2046", name: "Acquisition Channel Audit", project: "Docs Portal", category: "Add-ons", source: "Referral", visitors: 15890, revenue: 9400, conversion: 5.8, createdAt: "2026-04-28", status: "Processing" },
  { id: "RPT-2045", name: "Mobile Activation Cohort", project: "Mobile App", category: "Enterprise", source: "Paid", visitors: 30210, revenue: 30900, conversion: 7.6, createdAt: "2026-04-27", status: "Ready" },
  { id: "RPT-2044", name: "API Reliability Summary", project: "Pulse API", category: "Usage", source: "Direct", visitors: 48770, revenue: 16420, conversion: 6.9, createdAt: "2026-04-26", status: "Archived" }
];

// ─── Users ────────────────────────────────────────────────────────────────────

export const users: User[] = [
  { id: "USR-001", name: "DevPulse Admin", email: "admin@devpulse.app", role: "admin", status: "active", plan: "Enterprise", lastSeen: "2 min ago", avatar: "DA" },
  { id: "USR-002", name: "Sarah Manager", email: "sarah@devpulse.app", role: "manager", status: "active", plan: "Scale", lastSeen: "18 min ago", avatar: "SM" },
  { id: "USR-003", name: "Alex Viewer", email: "alex@devpulse.app", role: "viewer", status: "active", plan: "Growth", lastSeen: "1 hr ago", avatar: "AV" },
  { id: "USR-004", name: "Priya Shah", email: "priya@devpulse.app", role: "viewer", status: "invited", plan: "Growth", lastSeen: "Pending", avatar: "PS" },
  { id: "USR-005", name: "Noah Reed", email: "noah@devpulse.app", role: "manager", status: "active", plan: "Growth", lastSeen: "2 hr ago", avatar: "NR" },
  { id: "USR-006", name: "Ava Stone", email: "ava@devpulse.app", role: "viewer", status: "suspended", plan: "Starter", lastSeen: "4 days ago", avatar: "AS" }
];

// ─── Live Data Generators ─────────────────────────────────────────────────────

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

export function getLiveLatencyData() {
  return latencyHistory.map((point) => ({
    ...point,
    p50: jitter(point.p50, 0.12, 0),
    p95: jitter(point.p95, 0.10, 0),
    p99: jitter(point.p99, 0.08, 0)
  }));
}
