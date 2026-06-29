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

## Phase 2A — Managed Savings Mock Experience

Status: Completed and Approved (2026-06-28)

Routes:
- Canonical Hebrew route: `/managed-savings`
- English route: `/en/managed-savings`
- Legacy compatibility: `/pension-gemel` (still functional, not primary nav)

Feature Focus:
Non-pension managed savings only. Pension investments intentionally separated into a future dedicated page to keep pension-specific concepts (retirement age, conversion factors, monthly pension estimates) isolated.

Completed:
- **Page Structure:**
  - Top summary area with 5 KPI cards: total current value, monthly contributions, projected in 5Y, projected in 10Y, projected in custom horizon
  - Interactive custom horizon selector (1–50 years) affecting all projection columns
  - No pension monthly estimate card (pension-specific, intentionally excluded)

- **Main Investments Table:**
  - Premium styled table with expand/collapse rows
  - Columns: name, ownership, type, company/track, current balance, monthly contribution, accumulation fee, 5Y historical return, 1Y/5Y/10Y/15Y/custom projections, edit button
  - Zebra striping, column borders, active-row highlight on expand
  - `React.Fragment` wrappers for semantic table structure

- **Expanded Row:**
  - Public track performance card only (last month, 1Y, 3Y, 5Y, 10Y returns)
  - Public data disclaimer note
  - Last updated metadata line
  - Smooth entry animation via CSS keyframe (`expandedRowIn`)

- **Add Managed Fund Modal:**
  - Three card sections: Fund Identity, Fund Details, Your Assumptions
  - Product type select dropdown with translated labels
  - Client-side only — adds investment to local state, resets on refresh
  - Smooth open animation via CSS keyframes (`modalBackdropIn`, `modalPanelIn`)

- **Edit Managed Fund Modal:**
  - Same structure as Add modal with pre-populated values
  - Edit button in table row triggers modal for that investment
  - Client-side only — updates local state, resets on refresh

- **Internationalization:**
  - All user-facing strings from translation files (he.json, en.json)
  - Complete Hebrew (RTL) and English (LTR) translations
  - `pensionGemel` namespace retained in both message files for legacy routes
  - Timezone set to `Asia/Jerusalem` in next-intl request config

- **Animation:**
  - Real CSS `@keyframes` defined in `globals.css` (no animation plugin dependency)
  - `modal-backdrop-in`: backdrop fade 200ms
  - `modal-panel-in`: panel scale + translate in 240ms with spring easing
  - `expanded-row-in`: row fade + slide-up 200ms

- **Architecture:**
  - Root-level `src/app/managed-savings/page.tsx` for canonical Hebrew route
  - Locale-level `src/app/[locale]/managed-savings/page.tsx` for explicit locale routes
  - Shared components under `src/components/managed-savings/`
  - Mock data in `src/lib/mock/managed-savings-data.ts`
  - Navigation in Sidebar and MobileDrawer updated to `/managed-savings`

Out of Scope (Not Implemented):
- Pension page (intentionally deferred — dedicated future phase)
- Real database or Prisma schema
- API integration with Data.gov.il or any external source
- Authentication or user accounts
- Persistent data storage (all edits reset on page refresh)
- Production-grade financial calculation engine
- Financial advisory or recommendation functionality
- Fund comparison mode
- Export/import functionality

Automated Checks:
- ESLint: clean (0 errors, 0 warnings)
- TypeScript: no errors
- Build: successful (25 routes including `/managed-savings` and legacy `/pension-gemel`)

Browser QA:
- `/` Hebrew dashboard renders correctly
- `/managed-savings` Hebrew RTL, lang="he"
- `/en/managed-savings` English LTR, lang="en"
- `/en` English dashboard, no regressions
- `/pension-gemel` legacy route functional
- Navigation sidebar and mobile drawer point to `/managed-savings`
- Add fund modal opens with visible animation, closes cleanly
- Edit fund modal opens with visible animation, closes cleanly
- Expanded row opens with visible animation
- Product type dropdown shows translated labels (no raw keys)
- Table borders, zebra striping, and column separators visible
- Client-side add/edit behavior works without persistence
- No DB/API/Auth/persistence behavior

Known Limitations:
- Projection calculations use simplified fixed-rate formulas (not production-grade)
- `ENVIRONMENT_FALLBACK` warning logged at build time (non-fatal; timeZone configured in request.ts)
- PensionGemelTable has invalid `<div>` wrapper inside `<tbody>` (legacy page, not active nav)
- Mock data resets on page refresh (by design for mock experience)

Branch History:
- Feature branch: feature/pension-gemel-mock-experience
- Merged into: master
- Commit: feat: add managed savings mock experience

## Phase 2B-1 — Managed Savings Persistence Infrastructure

Status: Completed (2026-06-29)

Note: This entry covers Phase 2B-1 (infrastructure / schema / seed) only. Phase 2B overall is not yet complete. Phase 2B-2 (server actions and UI DB connection) is the next planned sub-phase.

Completed:
- **Prisma v7 setup:**
  - `prisma` (dev dependency) and `@prisma/client` (runtime) installed.
  - `@prisma/adapter-pg` and `pg` installed for Prisma v7 adapter pattern.
  - `prisma.config.ts` — Prisma v7 config with schema path, datasource URL, and seed command. Requires `dotenv/config` import because Prisma v7 CLI does not auto-load `.env` when evaluating the config file.
  - `prisma/schema.prisma` — Prisma v7 schema. Datasource block has no `url` field (connection URL is in `prisma.config.ts`).

- **Schema models:**
  - `User` — stub model for future Auth.js compatibility. Fields: id (cuid), email (unique), name (optional), createdAt, updatedAt.
  - `ManagedSavingsHolding` — personal managed savings record. Non-pension only (pension is a future dedicated model).
    - Money fields (`currentBalanceMinor`, `monthlyContributionMinor`) stored as `BigInt` integer agorot (ILS × 100). Never floats.
    - Fee fields (`accumulationFeeBps`, `depositFeeBps`) stored as `Int` basis points (bps = percent × 100).
    - `notes` field: optional, personal, displayed in expanded row only — not in main table.
    - `officialFundId` field: optional, reserved for future Data.gov.il / GemelNet fund matching.
  - Enums: `ManagedSavingsType` (hishtalmut, gemel, hashkaa, savings), `OwnerLabel` (self, spouse, child, shared, family, other), `HoldingStatus` (active, inactive, archived).

- **Supporting files:**
  - `src/lib/db/prisma.ts` — singleton Prisma client with adapter pattern, hot-reload safe (global caching in development).
  - `src/lib/financial/units.ts` — `toMinorUnits`, `fromMinorUnits`, `percentToBps`, `bpsToPercent` helpers.
  - `prisma/seed.ts` — seeds 1 dev user (`dev@mybalance.local`) + 8 managed savings holdings using stable IDs (`hist-001`, `gemel-001`, etc.) so upsert is idempotent.
  - `zod`, `react-hook-form`, `@hookform/resolvers`, `tsx` installed.

- **Local PostgreSQL workflow:**
  - `docker-compose.yml` — local PostgreSQL 16 Alpine container (`mybalance_local`).
  - Host port **5433** mapped to container port 5432. Port 5433 was chosen because native PostgreSQL 18 (`postgresql-x64-18` Windows service) occupies port 5432 on the development machine.
  - `.env.example` — local DATABASE_URL (port 5433) + Neon placeholder. Previously gitignored by overly broad `.env*` pattern — fixed by adding `!.env.example` negation to `.gitignore`.
  - `package.json` scripts added: `db:local:up/down/logs`, `db:migrate:local`, `db:seed:local`, `db:studio:local`, `db:migrate:deploy`, `db:generate`, `db:validate`.

- **Local DB verified:**
  - Migration applied: `prisma/migrations/20260629090812_init_managed_savings/migration.sql`.
  - Seed verified: 1 dev user (`dev@mybalance.local`) + 8 holdings (hishtalmut×2, gemel×3, hashkaa×1, savings×2).

- **Automated checks passed:**
  - ESLint: clean (0 errors, 0 warnings)
  - TypeScript: no errors
  - Build: successful (25 routes, no regressions)
  - Prisma format, validate, generate: all passed

Out of Scope (Not Implemented in Phase 2B-1):
- Server actions for CRUD on holdings
- UI connection to database (Managed Savings page still uses mock data)
- Auth.js or any authentication
- PublicFund or FundReturn models (Phase 2C)
- Data.gov.il / GemelNet / PensionNet sync
- Net worth snapshot integration
- Neon remote DB migration (local only)

Known Issues:
- Native PostgreSQL 18 is installed on the development machine and occupies port 5432. Local development always uses port 5433. This is documented in `docker-compose.yml`, `.env.example`, and context docs.
- Pre-existing `ENVIRONMENT_FALLBACK` build warning (non-fatal, unrelated to Phase 2B-1).

Branch History:
- Feature branch: feature/managed-savings-persistence
- Merged into: master
- Commit: feat: add managed savings persistence infrastructure
