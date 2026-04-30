export type Role = "admin" | "user";

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
