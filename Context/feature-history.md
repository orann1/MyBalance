# MyBalance — Feature History

## Purpose

This file records completed phases and major historical decisions.

Do not use this file as the active task spec.
Use `Context/current-feature.md` for the active phase.

## Phase 0 — Product Foundation

Status: Planned

Decisions:
- Product name: MyBalance
- Audience: Israeli individuals/households
- Default language: Hebrew
- Default direction: RTL
- Future English/LTR support will be prepared from day one
- MVP will be manual-first
- Bank/Open Banking integrations are out of initial scope
- Public PensionNet/GemelNet data will be synced later through Data.gov.il
- Tech stack:
  - Next.js App Router
  - React
  - TypeScript
  - Tailwind CSS
  - PostgreSQL
  - Prisma
  - next-intl
  - Zod
  - React Hook Form
  - Recharts
  - Auth.js

## Phase 1A — Clean App Foundation

Status: Completed (2026-06-25)

Completed:
- Next.js 16 App Router setup with TypeScript
- next-intl library integration with `localePrefix: "as-needed"` configuration
- Locale-aware routing:
  - `/` serves Hebrew content directly (unprefixed, canonical route)
  - `/en` serves English content (prefixed route)
  - `/he` redirects to `/` (307 Temporary Redirect)
- Middleware-based locale detection and routing
- Translation message files (Hebrew and English)
- Locale direction mapping (RTL for Hebrew, LTR for English)
- Formatting helpers for currency, date, percentage, number, month
- Minimal placeholder page confirming foundation works
- No database, authentication, or API implementation
- No dashboard UI or mock financial data

Routing behavior:
- Root path `/` renders Hebrew with `lang="he"` and `dir="rtl"`
- Path `/en` renders English with `lang="en"` and `dir="ltr"`
- Path `/he` redirects to `/` (no separate Hebrew-prefixed route)

Tests passed:
- ESLint: clean
- TypeScript: no errors
- Build: successful
- Browser QA: all routes verified

## Phase 1B — Static Dashboard UI and App Shell

Status: Completed and Approved (2026-06-28)

Completed:
- **App Shell & Layout:**
  - Right-side desktop sidebar (desktop only, sticky positioning)
  - Sidebar collapse/expand with smooth 200ms animation
  - Sidebar width: 280px expanded, 78px collapsed
  - Mobile right-side drawer (nav menu from right)
  - Hebrew-first RTL navigation with 9 menu items
  - Mobile header with menu toggle

- **Dashboard Sections:**
  - KPI cards (4 cards with icon bubbles):
    - Net Worth (Wallet icon, networth gradient)
    - Total Assets (TrendingUp icon, asset gradient)
    - Total Liabilities (CreditCard icon, liability gradient)
    - Monthly Change (LineChart icon, goal gradient)
  - Net Worth Timeline chart (12-month area chart with range controls)
  - Asset Allocation donut chart with custom legend
  - Assets mini-card section (icon bubbles, 2-column grid on desktop)
  - Liabilities mini-card section (icon bubbles, progress bars)
  - Pension/Gemel summary cards (3 cards with subtitles)
  - Financial Goals progress section
  - Data Freshness status section (Hebrew dates)
  - Informational Insights section

- **Placeholder Pages:**
  - /accounts, /assets, /liabilities, /snapshots
  - /pension-gemel, /goals, /import-export, /settings

- **Visual Design:**
  - Lovable fintech design system with oklch color space
  - Semantic financial category gradients
  - Heebo font for Hebrew typography
  - Tailwind CSS with custom shadow/card styling
  - lucide-react icons throughout
  - Responsive layout for desktop (1440px/1280px), tablet (768-1024px), mobile (390-430px)

- **Internationalization:**
  - All visible UI text from translation files
  - Hebrew (he.json) with RTL support
  - English (en.json) with LTR support
  - Localized financial category names
  - Localized date strings in freshness section
  - No hardcoded visible text in components

- **Data:**
  - Static mock financial data (clearly marked as sample data)
  - No database persistence
  - No real financial data handling
  - Mock data in src/lib/mock/dashboard-data.ts

Out of Scope (Not Implemented):
- Real database or Prisma schema changes
- Authentication or Auth.js setup
- API routes or server actions
- Bank/Open Banking integrations
- Pension/Gemel public data sync
- Financial advisory features
- CRUD forms or data modification
- Import/Export functionality
- Admin tools or user roles
- Billing or payment integration

Tests passed:
- ESLint: clean (0 errors, 0 warnings)
- TypeScript: no errors
- Build: successful (next build)
- Dev server: running without errors
- Browser QA: all routes verified
  - / renders Hebrew dashboard with lang="he" dir="rtl"
  - /he redirects to /
  - /en renders English dashboard with lang="en" dir="ltr"
  - Desktop sidebar visible and functional
  - Mobile drawer opens from right
  - All components render without overflow

Known Decisions:
- Sidebar uses sticky positioning (participates in layout flow) not fixed (overlay)
- Range controls for net worth chart hidden on mobile
- Currency formatting uses 0 decimal places (₪1,842,500 not ₪1,842,500.00)
- RTL support maintained throughout with dir="ltr" containers for charts
- All financial category colors use oklch() color space
- Lovable reference files (TanStack Router patterns) not committed

Branch History:
- Feature branch: feature/dashboard-mock-experience
- Merged into: master
- Commit: feat: implement phase 1b dashboard mock experience

Next phase: Phase 2 — TBD (awaiting product roadmap)
