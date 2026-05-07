export type Role = "admin" | "manager" | "viewer";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited" | "suspended";
  plan: "Starter" | "Growth" | "Scale" | "Enterprise";
  lastSeen: string;
  avatar: string;
};

export type MetricKey =
  | "visitors"
  | "revenue"
  | "apiRequests"
  | "errorRate"
  | "activeUsers"
  | "conversionRate";

export type Metric = {
  key: MetricKey;
  label: string;
  value: number;
  unit: "number" | "currency" | "percent";
  delta: number;
  sparkline: number[];
};

export type TrafficPoint = {
  time: string;
  visitors: number;
  requests: number;
  errors: number;
};

export type ActiveUserPoint = {
  time: string;
  users: number;
  mobile: number;
  desktop: number;
};

export type RevenueCategory = {
  category: string;
  revenue: number;
  subscriptions: number;
};

export type TrafficSource = {
  source: string;
  value: number;
  color: string;
};

export type Report = {
  id: string;
  name: string;
  project: string;
  category: string;
  source: string;
  visitors: number;
  revenue: number;
  conversion: number;
  createdAt: string;
  status: "Ready" | "Processing" | "Archived";
};

export type Filters = {
  dateRange: "24h" | "7d" | "30d" | "90d";
  category: string;
  source: string;
  project: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  type: "alert" | "info" | "success" | "warning";
  time: string;
  read: boolean;
};

export type ApiEndpoint = {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  avgLatency: number;
  p95Latency: number;
  errorRate: number;
  requestsPerMin: number;
};

export type LatencyPoint = {
  time: string;
  p50: number;
  p95: number;
  p99: number;
};

export type ErrorEvent = {
  id: string;
  type: string;
  message: string;
  endpoint: string;
  count: number;
  lastSeen: string;
  status: "active" | "resolved" | "ignored";
};

export type InsightCard = {
  id: string;
  title: string;
  body: string;
  metric?: string;
  delta?: number;
  type: "positive" | "negative" | "neutral" | "warning";
};

export type DownloadRecord = {
  id: string;
  name: string;
  format: "csv" | "pdf";
  size: string;
  downloadedAt: string;
};

export type DailyTrafficPoint = {
  date: string;
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
};

export type RevenuePoint = {
  month: string;
  mrr: number;
  arr: number;
  newRevenue: number;
  churn: number;
};

export type UserActivityPoint = {
  date: string;
  dau: number;
  wau: number;
  mau: number;
};
