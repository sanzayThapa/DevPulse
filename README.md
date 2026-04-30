# DevPulse

DevPulse is a polished portfolio SaaS dashboard for monitoring app performance, traffic, revenue, API usage, error rate, conversion, and user activity. It is built as a frontend-first Next.js product surface with realistic mock analytics data and a clean structure that can later connect to a Django REST API.

## Features

- Responsive SaaS layout with sidebar and top navigation
- Dark and light mode with `localStorage` persistence
- Mock authentication with `admin` and `user` roles
- Demo role switching from the navbar and settings page
- Real-time-looking analytics updates every 5 seconds
- Live status badge and loading skeletons
- Metric cards for visitors, revenue, API requests, error rate, active users, and conversion rate
- Recharts visualizations:
  - Traffic line chart
  - Active users area chart
  - Revenue by category bar chart
  - Traffic source donut chart
- Analytics filters for date range, category, traffic source, and project/app
- Reports page using TanStack Table with sortable columns
- CSV export and PDF export placeholder
- Admin-only user management view
- Settings page with profile, theme, notifications, API key, and role controls

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Recharts
- TanStack Table
- React Hook Form
- Lucide React icons

## Screenshots

Add screenshots here after running the app:

- Dashboard overview
- Analytics charts
- Reports table
- Users admin view
- Settings page
- Mobile layout

## Installation

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. The app redirects to `/dashboard`; unauthenticated users are sent to `/login`.

## Demo Credentials

No real credentials are required. Use the login page to choose:

- `admin`: full dashboard and user management access
- `user`: dashboard access with limited user management permissions

Mock auth state, role, and theme preference are stored in `localStorage`.

## Django REST API Readiness

The data layer lives in `lib/data.ts`, and shared TypeScript contracts live in `types/analytics.ts`. Replace the mock functions with fetchers that call Django REST endpoints such as:

- `GET /api/metrics/`
- `GET /api/traffic/`
- `GET /api/revenue/`
- `GET /api/reports/`
- `GET /api/users/`

The filter shape already maps cleanly to query parameters for date range, category, source, and project.

## Future Improvements

- Add real authentication and refresh tokens
- Connect live metrics to Django REST Framework or WebSockets
- Add server-side PDF exports
- Add report scheduling
- Add alert rules for traffic spikes and error-rate anomalies
- Add chart drilldowns and saved dashboard views
