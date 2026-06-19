# Go Business — Referral Dashboard

A responsive referral management dashboard built for the Go Business coding assessment. Includes secure authentication, an overview of referral metrics pulled live from an API, a searchable/sortable/paginated referrals table, referral link & code sharing, and a referral detail view.

## Tech Stack

- **React** (Vite)
- **React Router v6** — client-side routing
- **js-cookie** — JWT token storage
- **Plain CSS** — no UI framework, custom design system via CSS variables

## Features

- Email/password authentication against a secure signin endpoint
- JWT stored in a cookie and sent as a Bearer token on all subsequent requests
- Protected routes — unauthenticated users are redirected to `/login`; authenticated users visiting `/login` are redirected to `/`
- Dashboard with:
  - Overview metrics
  - Service summary
  - Referral link & code sharing (with Copy buttons)
  - Searchable, sortable (by date), paginated referrals table (10 rows/page, pagination handled client-side)
- Referral detail page (`/referral/:id`) with graceful "Referral not found" fallback
- Custom 404 page for unmatched routes
- Logout clears the session cookie and returns to `/login`

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation

```bash
git clone <this-repo-url>
cd go-business-referral-dashboard
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

## Test Credentials

```
Email: admin@example.com
Password: admin123
```

## Project Structure

```
src/
├── api/
│   └── client.js          # API base URLs + fetch helpers + response parsing
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ProtectedRoute.jsx
│   └── ReferralsTable.jsx
├── hooks/
│   └── useDebouncedValue.js
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── ReferralDetail.jsx
│   └── NotFound.jsx
├── utils/
│   ├── format.js           # date/currency formatting
│   └── metricIcons.jsx
├── App.jsx                  # BrowserRouter + route definitions
├── main.jsx                 # renders <App /> only
└── index.css
```

## API

All endpoints are hosted externally (no backend included in this repo):

- **Auth:** `POST /api/auth/signin`
- **Referrals:** `GET /api/referrals` (supports `search`/`q`, `sort`, `id` query params)

Base URL: `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com`