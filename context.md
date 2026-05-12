# DevPulse Cloud — Project Context

> Production-grade SaaS analytics platform built as a portfolio/demo project.
> All data is local mock data — no backend required to run.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.6 |
| UI | React 19 |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| Charts | Recharts 2.13 |
| Tables | TanStack React Table 8.21 |
| Icons | Lucide React |
| Forms | React Hook Form 7.5 |
| Utilities | clsx + tailwind-merge |

---

## Project Structure

```
Devpulse/
├── app/
│   ├── layout.tsx                      Root layout — ThemeProvider > AuthProvider > NotificationsProvider
│   ├── page.tsx                        Redirects to /dashboard
│   ├── globals.css                     CSS variables (--canvas, --panel, --muted, --border, --foreground, --subtle)
│   ├── login/page.tsx                  Demo login — 3 role options
│   ├── dashboard/page.tsx              Live KPIs + InsightCards + OnboardingWizard (first login)
│   ├── analytics/
│   │   ├── page.tsx                    Analytics hub — section links + DashboardView
│   │   ├── traffic/page.tsx            Traffic Analytics (page views, top pages, bounce rate)
│   │   ├── revenue/page.tsx            Revenue Analytics (MRR trend, plan breakdown, ARPU)
│   │   ├── api-performance/page.tsx    API Performance (latency p50/p95/p99, endpoints, error rate)
│   │   ├── errors/page.tsx             Error Monitoring (error events, status filter, rate chart)
│   │   └── user-activity/page.tsx      User Activity (DAU/WAU/MAU, feature adoption)
│   ├── reports/page.tsx                Reports table + Export modal (CSV/PDF) + Preview modal
│   ├── users/page.tsx                  User management (admin-only)
│   └── settings/page.tsx              Profile, theme, notifications, API key
│
├── components/
│   ├── layout/
│   │   ├── app-shell.tsx               Main shell — sidebar + header + Ctrl+K + NotificationsPanel
│   │   ├── protected-page.tsx          Auth guard → redirects to /login, wraps in AppShell
│   │   ├── page-header.tsx             Page title + description + optional actions slot
│   │   └── theme-provider.tsx          Dark/light mode context (localStorage)
│   ├── cards/
│   │   └── metric-card.tsx             KPI card with sparkline mini-chart
│   ├── charts/
│   │   ├── chart-card.tsx              Card wrapper (title, eyebrow, fixed 260px height)
│   │   ├── traffic-line-chart.tsx      Visitors + Requests line chart
│   │   ├── active-area-chart.tsx       Mobile vs Desktop stacked area chart
│   │   ├── revenue-bar-chart.tsx       Revenue by category bar chart
│   │   ├── source-donut-chart.tsx      Traffic sources donut chart
│   │   ├── latency-chart.tsx           p50/p95/p99 area chart
│   │   ├── error-rate-chart.tsx        Error rate bar chart
│   │   ├── endpoint-bar-chart.tsx      Horizontal bar chart (switchable: latency/rpm/error rate)
│   │   └── request-volume-chart.tsx    Stacked success vs failed bar chart
│   ├── dashboard/
│   │   └── dashboard-view.tsx          Live-updating dashboard (metrics + InsightCards + 4 charts)
│   ├── filters/
│   │   └── filter-bar.tsx              Date range + Category + Source + Project selects
│   ├── command-palette/
│   │   └── command-palette.tsx         Ctrl+K global palette — navigate, switch role/theme, search
│   ├── notifications/
│   │   └── notifications-panel.tsx     Bell icon + unread badge + dropdown panel
│   ├── insights/
│   │   └── insight-cards.tsx           6 AI-style insight cards + InsightAlert banner
│   ├── onboarding/
│   │   └── onboarding-wizard.tsx       4-step first-login modal (workspace → type → metrics → done)
│   ├── tables/
│   │   ├── reports-table.tsx           Sortable TanStack Table for reports
│   │   └── users-list.tsx              User management table
│   └── ui/
│       ├── button.tsx                  4 variants: primary | secondary | ghost | danger
│       ├── badge.tsx                   Inline status/label chip
│       ├── card.tsx                    Card + CardHeader primitives
│       ├── skeleton.tsx                Loading placeholder
│       └── empty-state.tsx             No-data fallback
│
├── lib/
│   ├── data.ts                         All demo data + live jitter generators
│   ├── auth.tsx                        Auth context (role, isAuthenticated, hasCompletedOnboarding)
│   ├── roles.ts                        RBAC — hasPermission(), ROLE_META, roleDetails()
│   ├── notifications.tsx               Notifications context (markAsRead, dismiss, unreadCount)
│   ├── export.ts                       exportReportsCsv() + exportReportsPdf() (print dialog)
│   └── utils.ts                        cn(), formatMetric(), jitter(), percentageJitter()
│
└── types/
    └── analytics.ts                    All shared TypeScript types
```

---

## Routing

| Route | Auth | Role access |
|---|---|---|
| `/` | public | — |
| `/login` | public | — |
| `/dashboard` | required | all roles |
| `/analytics` | required | all roles |
| `/analytics/traffic` | required | all roles |
| `/analytics/revenue` | required | all roles |
| `/analytics/api-performance` | required | all roles |
| `/analytics/errors` | required | all roles |
| `/analytics/user-activity` | required | all roles |
| `/reports` | required | all roles (export: admin + manager only) |
| `/users` | required | admin only |
| `/settings` | required | admin + manager |

Route protection is handled by `ProtectedPage` — checks `isAuthenticated`, redirects to `/login` if false. Per-feature permission checks use `hasPermission(role, permission)` inline in components.

---

## Authentication & Roles

**No real backend.** Auth state is stored in `localStorage` under the key `devpulse-auth`.

Three demo roles, selectable on the login page and from the sidebar:

| Role | Label | Permissions |
|---|---|---|
| `admin` | Admin | Full access — all pages, export, user management, settings |
| `manager` | Manager | Analytics + reports + settings + export. No user management. |
| `viewer` | Viewer | Read-only dashboards. No export, no settings, no users. |

**Permission keys** (defined in `lib/roles.ts`):
`view:dashboard` · `view:analytics` · `view:reports` · `view:users` · `view:settings` · `export:reports` · `manage:users` · `manage:settings` · `switch:role`

**Auth context API** (`lib/auth.tsx`):
```ts
const { isAuthenticated, role, name, email, hasCompletedOnboarding } = useAuth();
login(email, role)
logout()
setRole(role)
completeOnboarding()
```

---

## Data Layer (`lib/data.ts`)

All data is static with live jitter applied every 5 seconds on the dashboard.

### Exported datasets

| Export | Type | Description |
|---|---|---|
| `baseMetrics` | `Metric[]` | 6 KPI cards (visitors, revenue, apiRequests, errorRate, activeUsers, conversionRate) |
| `trafficData` | `TrafficPoint[]` | Hourly traffic (6 points) |
| `dailyTrafficData` | `DailyTrafficPoint[]` | 14-day page view history |
| `topPages` | object[] | 7 pages with views, bounce rate, avg time |
| `activeUsersData` | `ActiveUserPoint[]` | Mon–Sun mobile vs desktop breakdown |
| `userActivityData` | `UserActivityPoint[]` | 14-day DAU/WAU/MAU trend |
| `featureUsage` | object[] | 7 features with user count + adoption % |
| `revenueByCategory` | `RevenueCategory[]` | 4 revenue categories |
| `revenueHistory` | `RevenuePoint[]` | 12-month MRR/ARR/churn trend |
| `revenueByPlan` | object[] | 4 plans with revenue, users, ARPU |
| `trafficSources` | `TrafficSource[]` | Organic/Direct/Referral/Paid |
| `apiEndpoints` | `ApiEndpoint[]` | 8 endpoints with latency, rpm, error rate |
| `latencyHistory` | `LatencyPoint[]` | 12-hour p50/p95/p99 trend |
| `requestVolumeHistory` | object[] | 12-hour success vs failed |
| `errorEvents` | `ErrorEvent[]` | 7 error events with type, count, status |
| `errorRateHistory` | object[] | 12-hour error rate |
| `notifications` | `Notification[]` | 6 notifications (3 unread) |
| `insightCards` | `InsightCard[]` | 6 AI-style insight cards |
| `reports` | `Report[]` | 5 exportable reports |
| `users` | `User[]` | 6 demo users (admin, manager, viewers) |
| `projects` | `string[]` | 4 project names (used in FilterBar) |
| `categories` | `string[]` | 4 categories |
| `sources` | `string[]` | 4 traffic sources |

### Live update functions (called every 5s on dashboard)
```ts
getLiveMetrics()         // ±6% jitter on all metric values
getLiveTrafficData()     // ±6% jitter on visitor/request/error counts
getLiveActiveUsersData() // ±6% jitter on user counts
getLiveLatencyData()     // ±8–12% jitter on p50/p95/p99
```

---

## Styling System

**Tailwind CSS** with CSS custom properties for theming. Dark mode is class-based (`document.documentElement.classList.toggle("dark")`), defaulting to dark on first load.

### CSS variables (defined in `globals.css`)

| Variable | Light | Dark | Usage |
|---|---|---|---|
| `--canvas` | near-white | deep navy | page background |
| `--panel` | white | dark navy | cards, sidebar |
| `--muted` | light gray | slightly lighter navy | hover states, inputs |
| `--border` | blue-gray/20 | blue-gray/18 | dividers, input borders |
| `--foreground` | dark navy | near-white | primary text |
| `--subtle` | mid gray | light blue-gray | secondary text, icons |

### Brand colors (cyan)
`brand-50` `brand-100` `brand-500` `brand-600` `brand-700`

### Utility classes
- `.panel` — `border border-border bg-panel/80 shadow-soft backdrop-blur-xl`
- `.focus-ring` — accessible focus outline using `brand-500`

### Button variants
```ts
primary   // bg-foreground text-canvas (inverted) — dark bg, white text
secondary // border bg-panel text-foreground
ghost     // text-subtle, hover:bg-muted
danger    // red border/bg/text
```

---

## Key Features

### Command Palette — `Ctrl+K`
- Trigger: keyboard shortcut `Ctrl+K` / `Cmd+K`, or the search bar in the sidebar/header
- Component: `components/command-palette/command-palette.tsx`
- Keyboard navigation: `↑↓` to move, `Enter` to select, `Escape` to close
- Commands grouped into: Navigation · Actions · Roles
- 15 commands total: all pages, theme toggle, all 3 role switches

### Notifications Panel
- Component: `components/notifications/notifications-panel.tsx`
- Context: `lib/notifications.tsx` — `useNotifications()`
- Bell icon with red badge showing unread count
- Mark individual or all as read; dismiss individual notifications
- 6 seed notifications, 3 unread on first load

### Insight Cards
- Component: `components/insights/insight-cards.tsx`
- 6 cards shown below the KPI grid on the dashboard
- Types: `positive` (green) · `negative` (red) · `warning` (amber) · `neutral`
- `InsightAlert` — banner for the first critical insight

### Onboarding Wizard
- Component: `components/onboarding/onboarding-wizard.tsx`
- Triggers on first login when `hasCompletedOnboarding === false`
- 4 steps: Create workspace → Project type → Select metrics → Done
- Calls `completeOnboarding()` on finish or skip

### Export System
- `exportReportsCsv(reports)` — downloads `.csv` file directly
- `exportReportsPdf(reports)` — opens print-optimized HTML in new tab, triggers `window.print()`
- Export modal: format selector, per-report checkboxes, download history panel
- Report preview modal: shows all fields + single-report CSV download

### Filter Bar
- Present on dashboard, analytics, and reports pages
- Date range: `24h` · `7d` · `30d` · `90d`
- Dropdowns: Category · Source · Project
- Filter shape maps directly to query param names for a REST API

---

## TypeScript Types (`types/analytics.ts`)

```ts
Role               = "admin" | "manager" | "viewer"
Metric             { key, label, value, unit, delta, sparkline[] }
TrafficPoint       { time, visitors, requests, errors }
ActiveUserPoint    { time, users, mobile, desktop }
RevenueCategory    { category, revenue, subscriptions }
TrafficSource      { source, value, color }
Report             { id, name, project, category, source, visitors, revenue, conversion, createdAt, status }
Filters            { dateRange, category, source, project }
Notification       { id, title, body, type, time, read }
ApiEndpoint        { path, method, avgLatency, p95Latency, errorRate, requestsPerMin }
LatencyPoint       { time, p50, p95, p99 }
ErrorEvent         { id, type, message, endpoint, count, lastSeen, status }
InsightCard        { id, title, body, metric?, delta?, type }
DownloadRecord     { id, name, format, size, downloadedAt }
DailyTrafficPoint  { date, pageViews, uniqueVisitors, bounceRate, avgSessionDuration }
RevenuePoint       { month, mrr, arr, newRevenue, churn }
UserActivityPoint  { date, dau, wau, mau }
```

---

## Development

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build (15 static pages)
npm run lint     # ESLint
```

No environment variables are required to run the app. The `.env.example` file exists as a placeholder for when a real API backend is connected.

---

## Connecting a Real Backend

The filter bar state maps directly to Django REST query params:
```
?dateRange=7d&category=Subscriptions&source=Organic&project=Pulse+API
```

Replace the `getLive*()` functions in `lib/data.ts` with `fetch()` calls, using the `Filters` object as query params. The TypeScript types in `types/analytics.ts` already match the expected API response shape.
