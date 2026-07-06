# MyBalance — Current Feature

## Feature Name

Phase 2C-4A — Fund Return Query Hardening + Documentation Correction (COMPLETED AND VERIFIED)

### Phase Breakdown

- **Phase 1A: Clean App Foundation** — COMPLETED & APPROVED
- **Phase 1B: Static Dashboard UI** — COMPLETED & APPROVED
- **Phase 2A: Managed Savings Mock Experience** — COMPLETED & APPROVED
- **Phase 2B-1: Managed Savings Persistence Infrastructure** — COMPLETED (2026-06-29)
- **Phase 2B-2: Managed Savings DB-backed Actions and UI** — COMPLETED (2026-06-29)
- **Phase 2B-3: Managed Savings Hardening & QA Audit** — COMPLETED AND VERIFIED (2026-06-29)
- **Phase 2C-1: Public Fund Schema and Resource Configuration** — COMPLETED AND VERIFIED (2026-06-30)
- **Phase 2C-2: Public Fund Live Sync** — COMPLETED AND VERIFIED (2026-06-30)
- **Phase 2C-3A: Public Fund Matching Search Backend** — COMPLETED AND VERIFIED (2026-06-30)
- **Phase 2C-3B: Public Fund Matching/Linking (UI, link/unlink, FK) — including the DB-backed linked public performance KPI display** — COMPLETED AND VERIFIED (2026-07-02), merged into `master`
- **Phase 2C-4A: Fund Return Query Hardening + Documentation Correction** — COMPLETED AND VERIFIED (2026-07-06), Product Owner browser QA approved, merged into `master` from `feature/fund-return-query-hardening`
- **Phase 2C-4B: Further public performance display work (if any)** — Not started; no scope defined yet

## Status

Phase 1A: Complete and Approved
Phase 1B: Complete and Approved
Phase 2A: **COMPLETED AND APPROVED** (2026-06-28)
Phase 2B: **COMPLETED AND VERIFIED** (2026-06-29)
  - 2B-1: Persistence Infrastructure — COMPLETED (2026-06-29)
  - 2B-2: DB-backed Actions and UI — COMPLETED AND VERIFIED (2026-06-29)
  - 2B-3: Hardening & QA Audit — COMPLETED AND VERIFIED (2026-06-29)
Phase 2C-1: Public Fund Schema and Resource Configuration — **COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report; schema, migration, seed/config, documentation, and automated checks accepted.
Phase 2C-2: Manual Public Fund Live Sync + Normalization — **COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report; Data.gov.il `datastore_search` client, GemelNet/PensionNet normalization, sync service, manual CLI trigger (`npm run sync:public-funds:local`), live local sync verification, documentation, and automated checks accepted. Merged into `master`.
Phase 2C-3A: Public Fund Matching Search Backend — **COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report; backend/data-layer search and candidate ranking over local `PublicFund`/`FundReturn` records, Hebrew-aware matching normalization, deterministic candidate scoring, Zod-validated server action, optional CLI smoke test, documentation updates, and automated checks accepted. Merged into `master` from `feature/public-fund-matching-search`. No linking UI, no FK from `ManagedSavingsHolding` to `PublicFund`, no replacement of mock/fallback public performance display.
Phase 2C-3B: Public Fund Matching UI + Confirm Link / Unlink — **COMPLETED AND VERIFIED** (2026-07-02). Product Owner browser QA approved. Committed and merged into `master`. Adds a nullable `publicFundId` FK from `ManagedSavingsHolding` to `PublicFund` (user-confirmed only, never auto-linked), Zod-validated `linkManagedSavingsHoldingToPublicFund`/`unlinkManagedSavingsHoldingFromPublicFund` server actions, a `PublicFundMatchModal` search/select UI reusing the Phase 2C-3A local search backend, link/change/unlink management surface in `EditManagedFundModal`, and a read-only public fund returns card in `ExpandedManagedSavingsRow` (linked: KPI return metrics + labelled metadata row + disclaimer; unlinked: compact amber warning only). Linked fund `latestAnnualized5YrReturn` drives the 5Y table column and `projectSimulations` when available via `getEffectiveAnnualReturn`. Add/Edit modal visual redesign (slate-based hierarchy) and modal scrollbar polish also included. No AUM display, no auto-linking, no Data.gov.il calls.

**Important correction:** Phase 2C-3B already fully replaced the linked-holding public performance display with real DB-backed KPI data — this is not mock/fallback and was not deferred to a later phase. What remained mock/fallback after 2C-3B was narrower than earlier notes implied: only the `trackPerformance` object used as a *calculation fallback* inside `getEffectiveAnnualReturn` (and therefore the table 5Y column and `projectSimulations`) for **unlinked** holdings, or linked holdings whose linked fund has a null `latestAnnualized5YrReturn`. No mock performance numbers are rendered in the UI for either linked or unlinked holdings.

Phase 2C-4A: Fund Return Query Hardening + Documentation Correction — **COMPLETED AND VERIFIED** (2026-07-06). Product Owner browser QA approved. Committed and merged into `master` from `feature/fund-return-query-hardening`. This phase is primarily backend/data-layer and documentation work. Replaced the "fetch all `FundReturn` rows for a fund-id set and reduce to the latest in JS" pattern in `getLatestFundReturnSummaries` (`src/lib/public-funds/latest-fund-returns.ts`) with a single parameterized `DISTINCT ON ("publicFundId") ... ORDER BY "publicFundId", "reportPeriod" DESC` raw SQL query, so exactly one row per fund is ever read from the database regardless of history depth. `searchPublicFundsForMatching` (`src/lib/public-funds/search-public-funds.ts`) now reuses this same hardened lookup instead of its own separate fetch-all-then-reduce enrichment step. No schema/migration changes, no new AUM exposure, `linkedPublicFund` output shape and all downstream behavior (KPI display, unlinked warning, link/unlink flow, `getEffectiveAnnualReturn`, projections, table 5Y column) unchanged.

**Follow-up QA fix (same branch, 2026-07-05):** Product Owner browser smoke QA found two issues in `PublicFundMatchModal`, fixed on the same branch: (1) the modal header used a translucent gradient background that let scrolled result text show through it — replaced with a fully opaque `bg-white` header with a solid border and shadow; (2) the modal exposed a GemelNet/PensionNet source dropdown, which is confusing (these are data sources, not product types) and wrongly allowed selecting PensionNet — a pension-specific source — from the non-pension Managed Savings page. The dropdown was removed entirely; the modal now always searches `source: "gemelnet"` internally (Option A from the fix prompt). New helper copy (`modal.gemelnetOnlyNote`) clarifies the search covers the public GemelNet dataset and may include Keren Hishtalmut/Kupat Gemel/Gemel LeHashkaa where available. No product-type filter was added (`PublicFund.productType` inference remains unresolved). The backend (`searchPublicFundsForMatching`, `searchPublicFundsForMatchingAction`) still supports both `gemelnet` and `pensionnet` for any future screen — only this modal's UI was restricted.

Phase 2C-4B (any further public performance display work): **Not started.** No scope defined — a chart/history table was evaluated during 2C-4A planning and explicitly deferred; Option A (KPI-only, already delivered in 2C-3B) remains the approved MVP display.

## Known Limitations / Deferred Items

- **`<html lang/dir>` SSR for English routes:** For `/en/*` routes, the initial server-rendered HTML has `lang="he" dir="rtl"` on the `<html>` element (from the minimal root layout). `SetHtmlAttributes` corrects this after client hydration. No visible layout flash — `AppShell` renders with `dir="ltr"` in SSR HTML. Should be addressed in a dedicated i18n hardening task before production.
- **Dev-user stub:** All DB operations use `dev@mybalance.local`. Auth.js and production multi-user isolation are future scope.
- **Public track performance:** Phase 2C-3B already replaced the displayed performance card for **linked** holdings with real DB-backed KPI data (monthly/YTD/3Y/5Y annualized returns) — this is not mock/fallback. **Unlinked** holdings show a compact warning only, with no performance numbers displayed at all. The mock `trackPerformance` object now exists only as a calculation fallback inside `getEffectiveAnnualReturn` (feeding the table 5Y column and `projectSimulations`) for unlinked holdings or linked holdings with a null `latestAnnualized5YrReturn` — replacing that calculation fallback with a different approach is a future product decision, not yet scoped.
- **ManagedSavingsHolding.publicFundId:** Added in Phase 2C-3B as a nullable FK to `PublicFund` (user-confirmed via `EditManagedFundModal`, `onDelete: SetNull`). The linked fund's `latestAnnualized5YrReturn` is used as the projection assumption by `getEffectiveAnnualReturn` when available. `officialFundId` remains a separate, unrelated plain optional string — not repurposed.
- **Product type inference for PublicFund:** Unresolved. GemelNet does not expose a clean product type column; `productType` must remain nullable / allow `unknown` until a future phase defines safe inference rules.
- **AUM units:** Not display-approved yet. `FundReturn.assetsUnderManagement` must not be displayed in UI until units are confirmed.
- **`ACTUARIAL_ADJUSTMENT` (PensionNet):** Observed in live Data.gov.il records but has no corresponding schema column — not mapped or stored. No functional impact in this phase.
- **Scheduled sync:** Not implemented. Sync is manual CLI trigger only (`npm run sync:public-funds:local`).
- **Historical resource backfill:** 1999–2022 and yearly-archive resources are not synced by default; only `isCurrent=true` resources sync automatically.
- **Custom horizon projection edge case:** Custom horizon for years 2–4, 6–9, 11–14 returns 0 in the Phase 2A projection model (normal usage defaults to 20 years). Remains deferred.

## Context

This phase builds the implementation foundation for MyBalance in two sub-phases:

### Phase 1A (Completed)
Establishes the core infrastructure:
- Locale-aware routing (Hebrew-first, RTL-first)
- next-intl integration for i18n
- Translation message files (English and Hebrew)
- Locale direction handling
- Formatting helpers (currency, date, percent, number, month)
- Minimal placeholder page confirming foundation works

### Phase 1B (Completed)
Static dashboard UI with mock data showing:
- Total net worth
- Total assets
- Total liabilities
- Monthly change
- Asset allocation
- Major asset categories
- Major liability categories
- Recent snapshots / freshness indicators
- App shell with desktop sidebar and mobile drawer
- Responsive layout for desktop, tablet, and mobile

## Phase 1A: Built (Complete)

### Infrastructure
- Next.js App Router with TypeScript
- next-intl library with `localePrefix: "as-needed"` configuration
- Middleware for locale detection and routing
- Root path `/` serves Hebrew directly (unprefixed, canonical)
- Locale-aware route structure for (/he, /en):
  - [locale]/layout.tsx — locale-specific layout and lang/dir attributes
  - [locale]/page.tsx — locale-specific content
- Root layout.tsx — serves Hebrew as default for root path

### Internationalization
- Translation message files (src/messages/he.json, src/messages/en.json)
- Direction mapping (rtl for Hebrew, ltr for English)
- All UI text sourced from translation files
- No hardcoded text in components

### Helpers & Utilities
- Locale direction helper (getDirection)
- Formatting helpers:
  - formatCurrency (default: ILS)
  - formatPercent
  - formatDate
  - formatNumber
  - formatMonth
- Default locale: he-IL
- Default currency: ILS

### UI
- Minimal placeholder page
- Product name: MyBalance
- Subtitle from translations
- Foundation description
- No dashboard cards, charts, or financial data
- Clean informational wording (no financial advice)

## Phase 1B: Built and Ready for QA

Implemented:
- App shell with desktop sidebar and mobile drawer
- Dashboard summary cards (KPI cards with gradient styling)
- Net worth timeline chart (Recharts)
- Asset allocation donut chart (Recharts)
- Assets summary section
- Liabilities summary section
- Pension/Gemel section with compliance disclaimer
- Financial goals progress bars
- Data freshness status indicators
- Informational insights section
- Mock financial data (static, clearly marked as example data)
- Responsive layout (desktop, tablet, mobile)
- Complete Hebrew translation for UI
- English translation keys for future support
- 8 placeholder pages for future feature areas

### Do Not Build in Phase 1B

- Real database persistence (Phase 3+)
- Prisma schema changes (Phase 3+)
- Authentication (Phase 3+)
- CRUD forms (Phase 3+)
- Pension/Gemel API sync (Phase 4+)
- Open Banking (Phase 4+)
- AI recommendations (Phase 5+)
- Import/export (Phase 4+)
- Admin settings (Phase 6+)
- User roles (Phase 6+)
- Billing (Phase 6+)
- Production deployment (Phase 7)

## Phase 1A Acceptance Criteria (MET ✓)

- ✓ App runs locally with `npm run dev`
- ✓ `/` (root) displays Hebrew UI with RTL direction (unprefixed, canonical path)
- ✓ `/he` redirects to `/` (no separate Hebrew-prefixed route)
- ✓ `/en` displays English UI with LTR direction (locale-specific route)
- ✓ All user-facing text comes from translation files
- ✓ HTML lang and dir attributes set correctly for each route
- ✓ Layout works on desktop and mobile widths
- ✓ No financial advice language appears
- ✓ No DB/API/Auth/Dashboard implementation added
- ✓ No runtime errors on routes
- ✓ ESLint, TypeScript, build all pass

## Phase 1B Acceptance Criteria (READY FOR QA)

Met criteria:
- ✓ Dashboard displays with Hebrew UI and RTL
- ✓ Summary KPI cards show net worth, assets, liabilities, monthly change
- ✓ Charts render correctly (Recharts integrated)
- ✓ Mock financial data displays appropriately with example badge
- ✓ No real data persistence or authentication
- ✓ App shell with sidebar and mobile drawer
- ✓ Responsive layout on desktop, tablet, mobile
- ✓ All UI text from translation files
- ✓ No financial advice language
- ✓ Placeholder pages for all feature areas

## QA Requirements — Phase 1A (COMPLETED)

Checks run:
- ✓ `npm run lint` — passed
- ✓ `npm run build` — successful
- ✓ `npx tsc --noEmit` — no errors

Browser QA performed:
- ✓ `/` renders with Hebrew and RTL (direct, no redirect)
- ✓ `/` has lang="he" and dir="rtl" attributes
- ✓ `/he` redirects to `/` (307 redirect)
- ✓ `/en` renders with English and LTR
- ✓ `/en` has lang="en" and dir="ltr" attributes
- ✓ No runtime errors

## Phase 2A: Managed Savings Mock Experience

### Overview

Rich front-end mock experience for the Managed Savings page at canonical route `/managed-savings` (Hebrew) and `/en/managed-savings` (English). This is a feature-complete UI mock with client-side interactivity and mock data only — no database persistence, no real API integration, no Prisma changes, and no authentication required.

### Important: Pension Separated

**Pension investments have been intentionally separated from this page.** This page focuses exclusively on non-pension managed savings products:
- Keren Hishtalmut (סדרת עו״ש)
- Kupat Gemel (קופות גמל)
- Gemel LeHashkaa (גמל להשקעה)
- Savings Policies (פוליסות חיסכון)

A dedicated Pension page is planned as a future feature to handle pension-specific concepts like retirement age, pension conversion factors, and estimated monthly pension calculations.

### Implemented Features

**Page Structure:**
- Top summary area with 5 KPI cards:
  - Total current managed savings
  - Total monthly contributions
  - Projected value in 5 years
  - Projected value in 10 years
  - Projected value in custom time horizon (1-50 years)
- Interactive custom horizon control (1-50 years) affecting all projections
- NO estimated monthly pension card (pension-specific, removed)

**Main Investments Table:**
- Unified table for all managed savings products (non-pension only)
- Columns: name, ownership, type, company, track, current balance, monthly contribution, fees, historical returns, and multi-year projections
- Expandable rows showing detailed information

**Expandable Row Details:**
- Public track performance card (last month, 1Y, 3Y, 5Y, 10Y returns)
- Public data disclaimer note
- Last updated metadata line
- Smooth entry animation via CSS keyframe (`expandedRowIn`)

**Disclaimers & Safety Language:**
- Four prominent disclaimers about data being informational only
- No financial advice language
- Clear statement that MyBalance does not provide financial or pension advice

### Responsive Design

- Desktop: Full table layout with all columns visible
- Tablet: Some columns hidden, expandable rows provide details
- Mobile: Optimized layout with essential columns and full expandable row access

### i18n & RTL

- All 100+ UI strings sourced from translation files (no hardcoded text)
- Complete Hebrew translations
- Complete English translations
- Proper Hebrew RTL layout (dir="rtl") at `/managed-savings`
- Proper English LTR layout (dir="ltr") at `/en/managed-savings`

### Mock Data

6 realistic managed savings investments (non-pension only) with Hebrew names:
- 2 Keren Hishtalmut (self and spouse)
- 2 Kupat Gemel (children)
- 1 Gemel LeHashkaa (shared family)
- 1 Savings Policy (family)

Mock data includes realistic:
- Account balances and monthly contributions
- Management fees (accumulation and deposit)
- Public track performance data by product type
- Ownership labels (self, spouse, child, shared, family, other)
- Status indicators (active/inactive)
- Last update dates
- Official fund/track identifiers

### Routing & Architecture

- **Canonical Hebrew route:** `/managed-savings` (root level)
- **English route:** `/en/managed-savings` (locale-specific)
- **Optional Hebrew prefix:** `/he/managed-savings` (locale-specific, also works)
- Root-level page component at `src/app/managed-savings/page.tsx` ensures canonical routing (no AppShell wrapper - layout provides it)
- Locale-specific components at `src/app/[locale]/managed-savings/page.tsx` for explicit locale handling
- Navigation updated in Sidebar and MobileDrawer to point to `/managed-savings`
- Old `/pension-gemel` routes remain functional but are no longer primary navigation targets
- Shared reusable components: ManagedSavingsSummaryCards, ManagedSavingsTable, ExpandedManagedSavingsRow, ManagedSavingsSummaryTable

### Non-Scope

This phase explicitly does NOT include:
- **Pension investments** - Intentionally separated for a dedicated future Pension page
- Real database or Prisma schema
- API integration with Data.gov.il or any external data sources
- Real fund data sync or historical sync workflows
- Authentication or user accounts
- Persistent data storage (all edits reset on page refresh)
- Production-grade financial calculation engine
- Financial advisory or recommendation functionality
- Mobile app or desktop app
- Export/import functionality

### Acceptance Criteria

- ✓ `/managed-savings` renders Hebrew RTL version (canonical route)
- ✓ `/en/managed-savings` renders English LTR version
- ✓ `/pension-gemel` still functional as legacy compatibility route (not primary nav)
- ✓ Page includes top summary cards with 5 KPIs (no pension monthly estimate card)
- ✓ Single managed savings table with expandable rows (non-pension products only)
- ✓ Expanded rows show public track performance, disclaimer, and last updated metadata
- ✓ Add managed fund modal opens with animation, adds to local state
- ✓ Edit managed fund modal opens with animation, updates local state
- ✓ Client-side mock add/edit behavior — resets on refresh by design
- ✓ Public track performance metrics displayed in expanded row
- ✓ All UI text from i18n translation files
- ✓ Hebrew RTL layout proper
- ✓ English LTR layout proper
- ✓ Responsive on desktop, tablet, mobile
- ✓ No hardcoded visible UI text
- ✓ Mock data only, no backend calls
- ✓ Safe informational language, no financial advice
- ✓ No pension content on managed savings page

### QA Requirements — Phase 2A (COMPLETED)

Automated checks:
- ✓ `npm run lint` — passed (0 errors, 0 warnings)
- ✓ `npm run build` — successful (25 routes including `/managed-savings` and legacy `/pension-gemel`)
- ✓ `npx tsc --noEmit` — no errors

Browser QA performed:
- ✓ `/` Hebrew dashboard renders, no regressions
- ✓ `/managed-savings` returns HTTP 200, renders Hebrew RTL (canonical route)
- ✓ `/en/managed-savings` returns HTTP 200, renders English LTR
- ✓ `/en` English dashboard renders, no regressions
- ✓ `/pension-gemel` returns HTTP 200 (legacy route still functional)
- ✓ Navigation sidebar and mobile drawer updated to point to `/managed-savings`
- ✓ Summary KPI cards render correctly (no pension KPI card)
- ✓ Single managed savings table with expandable rows
- ✓ Expanded row shows public track performance with smooth entry animation
- ✓ Add fund modal opens with visible fade+scale animation
- ✓ Edit fund modal opens with visible fade+scale animation
- ✓ Product type dropdown shows translated labels (no raw translation keys)
- ✓ Table borders, zebra striping, column separators visible
- ✓ Client-side mock add/edit behavior works, resets on refresh
- ✓ No DB/API/Auth/persistence behavior
- ✓ No hardcoded visible UI text
- ✓ Single app shell (no duplication)
- ✓ Responsive layout on desktop, tablet, mobile

## Documentation Checklist

Updated for Phase 1A:
- ✓ `Context/current-feature.md` — Updated to reflect unprefixed Hebrew at root and new routing structure
- ✓ `Context/i18n-and-localization.md` — Updated to document unprefixed Hebrew at root and localePrefix: "as-needed"

Updated for Phase 1B:
- ✓ `Context/current-feature.md` — Updated to reflect Phase 1B completion and visual design updates
- ✓ `Context/Features/dashboard-feature-spec.md` — Documented visual design system, typography, colors, gradients, layout, card system, navigation, charts

Phase 1B Visual Design Enhancements:
- Implemented Lovable fintech design system with oklch color space
- Added Heebo font for Hebrew-first typography
- Semantic financial category gradients (networth, asset, liability, goal, pension, cash)
- Soft pastel app background gradient
- Rounded-3xl card styling with shadow-card soft shadows
- Real lucide-react icons replacing placeholders
- Active navigation state with gradient backgrounds and accent bars
- Improved KPI card styling with icon bubbles and trend indicators
- Responsive layout optimization for desktop (1440px), tablet (768-1024px), mobile (390-430px)

Updated for Phase 2A (Refactored):
- ✓ `Context/current-feature.md` — Updated to document Phase 2A as Managed Savings Mock Experience (refactored from Pension & Gemel)
- ✓ `src/messages/he.json` — Updated navigation label from "פנסיה וגמל" to "חיסכון מנוהל"
- ✓ `src/messages/en.json` — Updated navigation label from "Pension & Gemel" to "Managed Savings"
- ✓ Sidebar and MobileDrawer — Updated route links from `/pension-gemel` to `/managed-savings`

Checked but not updated:
- `Context/coding-standards.md` — Standards being followed
- `Context/security-and-privacy.md` — No security/privacy issues identified
- `Context/i18n-and-localization.md` — Locale architecture unchanged
- `Context/Features/pension-gemel-sync-feature-spec.md` — Sync feature is future phase; Managed Savings mock experience is independent
- `Context/Features/dashboard-feature-spec.md` — Dashboard design system already documented for Phase 1B; Managed Savings reuses same system

---

## Phase 2B: Managed Savings Persistence Foundation

### Status

Phase 2B-1 (Infrastructure / Schema / Seed) — **COMPLETED AND VERIFIED** (2026-06-29)
Phase 2B-2 (Server Actions / UI DB Connection) — **IN PROGRESS** (2026-06-29)

### Phase 2B-1: Completed (2026-06-29)

Infrastructure, schema, and seed only. No UI DB connection, no server actions, no Auth.js.

#### Core infrastructure
- Prisma installed (v7) with PostgreSQL provider (`prisma` dev, `@prisma/client` runtime).
- `@prisma/adapter-pg` and `pg` installed for Prisma v7 adapter pattern.
- `zod`, `react-hook-form`, `@hookform/resolvers`, `tsx` installed.
- `prisma/schema.prisma` — User and ManagedSavingsHolding models with all planned fields.
- `prisma.config.ts` — Prisma v7 config with schema path and datasource URL.
- `src/lib/db/prisma.ts` — singleton Prisma client using adapter pattern, hot-reload safe.
- `src/lib/financial/units.ts` — `toMinorUnits`, `fromMinorUnits`, `percentToBps`, `bpsToPercent`.
- `prisma/seed.ts` — seeds 1 dev user + 8 managed savings holdings from Phase 2A mock data.

#### Local PostgreSQL workflow
- `docker-compose.yml` — local PostgreSQL 16 container (`mybalance_local`, host port 5433 → container port 5432), persistent volume. Host port 5433 is used because native PostgreSQL 18 is installed on this machine and occupies port 5432.
- `.env.example` — updated with local DB URL (matches Docker Compose) and Neon placeholder.
- Local DB is isolated from Neon — data is not shared between environments.
- Neon migrations use `migrate deploy` only (not `migrate dev`).
- `package.json` — `db:local:up/down/logs`, `db:migrate:local`, `db:seed:local`, `db:studio:local`, `db:migrate:deploy`, `db:generate`, `db:validate` scripts added.

#### Status (verified 2026-06-29)
- Docker Desktop v29.5.3 running. WSL2 was installed between sessions — Docker daemon now operational.
- Local PostgreSQL container starts successfully on host port **5433** (not 5432). Native PostgreSQL 18 is installed on this machine and occupies port 5432 — host port 5433 was chosen to avoid the conflict.
- Migration applied: `prisma/migrations/20260629090812_init_managed_savings/` created and applied.
- Seed verified: 1 dev user (`dev@mybalance.local`) + 8 holdings (hishtalmut×2, gemel×3, hashkaa×1, savings×2).
- Prisma format, validate, generate all passed.
- lint, tsc --noEmit, build all passed. Pre-existing ENVIRONMENT_FALLBACK build warning is unrelated to this task.
- `prisma.config.ts` updated with two fixes: `dotenv/config` import (Prisma v7 CLI does not auto-load `.env`), and `migrations.seed` config (Prisma v7 reads seed from config file, not `package.json`).
- `.gitignore` updated: added `!.env.example` negation so the example template file can be committed.

#### Port note
Host port **5433** is used instead of the default 5432. Native PostgreSQL 18 (`postgresql-x64-18` service) runs on this machine and occupies port 5432. The Docker Compose config maps `5433:5432` — the container still runs PostgreSQL on its internal port 5432.

#### Quick start
```bash
cp .env.example .env           # already has correct local DB URL (port 5433)
npm run db:local:up             # start PostgreSQL container (port 5433)
npm run db:migrate:local        # apply migration (creates tables)
npm run db:seed:local           # seed 1 dev user + 8 holdings
npm run db:studio:local         # open Prisma Studio to inspect data
```

### Goal

Convert the approved Managed Savings mock page into a DB-backed single-user/dev persistence experience. User-entered holdings will be stored in and loaded from a PostgreSQL database via Prisma server actions.

### Scope

- Bootstrap Prisma with PostgreSQL.
- Add a User stub model for future Auth.js compatibility.
- Add a ManagedSavingsHolding model for personal managed savings holdings.
- Store user-entered holdings in DB via server actions.
- Load holdings from DB on the Managed Savings page.
- Create/update/archive holdings through server actions.
- Use Zod validation for all writes.
- Add a `notes` field to each holding — optional, personal, displayed in expanded row only (not in main table).
- Allow notes to be edited through the edit modal or an appropriate expanded-row edit interaction.
- Keep `officialFundId` as optional preparation for future Data.gov.il / GemelNet matching.
- Keep public track performance as mock/fallback data until Phase 2C.
- Preserve the current UI direction as much as possible.
- Keep add/edit modals.
- Keep expanded row minimal.

### Phase 2B-2: In Progress (2026-06-29)

Server actions, Zod validation, cached DB reads, and DB-backed Managed Savings page.

#### Files created
- `src/lib/managed-savings/dev-user.ts` — Dev user helper (resolves `dev@mybalance.local`). TODO comment to replace with `session.user.id` when Auth.js is introduced.
- `src/lib/managed-savings/serializers.ts` — Maps Prisma `ManagedSavingsHolding` records to `ManagedSavingsInvestment` UI type. Converts BigInt minor units to ILS numbers, bps to percent. Track performance is mock fallback until Phase 2C.
- `src/lib/validation/managed-savings.ts` — Zod schemas: `CreateManagedSavingsSchema`, `UpdateManagedSavingsSchema`, `ArchiveManagedSavingsSchema`. Form validates UI values (ILS amounts, % fees). Server actions convert to minor units/bps.
- `src/lib/data/managed-savings.ts` — Cached data access layer using `unstable_cache`. Cache key: `managed-savings-dev-user`. Cache tag: `managed-savings:dev-user`. Sorted by `createdAt asc`. Excludes archived holdings. Invalidated via `revalidateTag` after any write.
- `src/lib/actions/managed-savings-actions.ts` — Server actions: `createManagedSavingsHolding`, `updateManagedSavingsHolding`, `archiveManagedSavingsHolding`. All validate with Zod, check ownership, convert units, call `revalidateTag` on success.
- `src/components/managed-savings/ManagedSavingsPageClient.tsx` — Client wrapper receiving `initialInvestments` from server. Calls `router.refresh()` after successful mutations to reload fresh server data.

#### Files updated
- `src/lib/mock/managed-savings-data.ts` — Added `notes?: string` to `ManagedSavingsInvestment` interface.
- `src/app/managed-savings/page.tsx` — Refactored from `"use client"` to async server component. Fetches holdings via `getManagedSavingsHoldingsForCurrentDevUser()` and renders `ManagedSavingsPageClient`.
- `src/app/[locale]/managed-savings/page.tsx` — Same refactoring as canonical route.
- `src/components/managed-savings/AddManagedFundModal.tsx` — Now calls `createManagedSavingsHolding` server action. Added notes textarea and owner dropdown. Removed mock-only behavior.
- `src/components/managed-savings/EditManagedFundModal.tsx` — Now calls `updateManagedSavingsHolding` and `archiveManagedSavingsHolding`. Fixed type field from free text to dropdown. Added notes textarea, owner dropdown, and archive button (two-click confirm).
- `src/components/managed-savings/ExpandedManagedSavingsRow.tsx` — Added notes section (shown only in expanded row, never in main table).
- `src/components/managed-savings/ManagedSavingsTable.tsx` — Fixed hardcoded Hebrew product labels to use i18n. Removed vestigial `onInvestmentChange` usage.
- `src/messages/he.json` — Added: `table.investmentsCount`, `emptyState`, `emptyStateSubtitle`, `errors.*`, `modal.archive`, `modal.archiveConfirm`, `modal.ownership`, `modal.notes`, `modal.notesPlaceholder`, `expandedView.notes`, `expandedView.noNotes`. Updated `modal.mockDataNote` to reflect DB persistence.
- `src/messages/en.json` — Same additions.

#### Cache and invalidation design
- DB read function: `getManagedSavingsHoldingsForCurrentDevUser` in `src/lib/data/managed-savings.ts`
- Cache mechanism: Next.js `unstable_cache` (server-side, not browser storage)
- Cache key: `["managed-savings-dev-user"]`
- Cache tag: `managed-savings:dev-user`
- Invalidation: `revalidateTag("managed-savings:dev-user")` called in all three server actions after successful DB write
- Page refresh after mutation: client calls `router.refresh()` to trigger server component re-render with fresh cached data
- Result: repeated page loads use cached data; DB is only re-queried after a write mutation invalidates the cache
- Admin cache UI: deferred (not in Phase 2B scope)
- TODO in code: replace dev-user cache tag with `managed-savings:user:${userId}` when Auth.js is introduced

### Non-Scope

- No Data.gov.il API calls.
- No GemelNet/PensionNet sync.
- No PublicFund or FundReturn model implementation.
- No dedicated Pension page.
- No Auth.js production login.
- No multi-user production isolation.
- No net worth snapshot integration.
- No import/export.
- No fund comparison mode.
- No production-grade financial calculation engine.
- No financial advice or recommendation language.

### Acceptance Criteria

- [ ] Prisma is bootstrapped with a PostgreSQL connection.
- [ ] User stub model exists (id, email, name, createdAt, updatedAt).
- [ ] ManagedSavingsHolding model exists with all planned fields including `notes`.
- [ ] Holdings are loaded from DB on the Managed Savings page.
- [ ] Add modal creates a DB record via server action.
- [ ] Edit modal updates a DB record via server action.
- [ ] Archive/delete removes or archives a holding via server action.
- [ ] All writes validated with Zod.
- [ ] Notes field displayed in expanded row only.
- [ ] Notes editable through edit modal.
- [ ] Public track performance remains mock/fallback.
- [ ] No financial advice language.
- [ ] Hebrew RTL and English LTR layouts preserved.
- [ ] No regressions on dashboard or other pages.

### QA Requirements

- `npm run lint` — must pass
- `npm run build` — must pass
- `npx tsc --noEmit` — must pass
- Browser QA: load page, add holding, edit holding, verify persistence after refresh
- Confirm no data leakage in URLs or logs

### Phase 2B-2 QA Fixes (applied 2026-06-29)

Two rounds of QA fixes applied on the same branch (`feature/managed-savings-actions`):

#### Fix Round 1 — Immediate UI updates and delete confirmation modal

- **Problem**: Add/edit/archive mutations required a manual browser refresh to see changes. `router.refresh()` is async and doesn't immediately update the visible list.
- **Fix**: `ManagedSavingsPageClient` now holds local `useState(initialInvestments)`. Server actions (`createManagedSavingsHolding`, `updateManagedSavingsHolding`) return the serialized holding in the `ok: true` branch. Handlers update local state immediately, then call `router.refresh()` in background.
- **Problem**: Archive button used a two-click inline confirm ("ארכב" → "לאשר ארכוב?") with incorrect language.
- **Fix**: Replaced with a single "מחק חיסכון" / "Delete holding" button in the edit modal footer. Clicking it opens a new `DeleteHoldingConfirmModal` component. The holding is soft-archived (status = `archived`), not hard-deleted.
- **Files changed**: `managed-savings-actions.ts`, `ManagedSavingsPageClient.tsx`, `AddManagedFundModal.tsx`, `EditManagedFundModal.tsx`, new `DeleteHoldingConfirmModal.tsx`, `he.json`, `en.json`.

#### Fix Round 2 — English LTR layout and duplicate menu

- **Root cause 1 (duplicate menu)**: `app/[locale]/layout.tsx` rendered a full `<html><body>` + `RootLayoutProvider` → `AppShell` NESTED inside the root layout's `<html><body>` + AppShell. Two `AppShell` instances = two sidebars visible simultaneously.
- **Root cause 2 (English RTL)**: The nested `<html lang="en" dir="ltr">` from the locale layout was ignored by browsers (nested html is invalid). The root layout's outer `<html lang="he" dir="rtl">` always won. Additionally, `AppShell` had `dir="rtl"` hardcoded on its container div.
- **Root cause 3 (MobileDrawer hardcoded RTL)**: Drawer used `right-0` + `translate-x-full` (always slides from right). Navigation strings were hardcoded Hebrew, bypassing i18n.
- **Fixes**:
  - `app/layout.tsx` is now `async`, calls `getLocale()` from `next-intl/server` to set correct `lang` and `dir` dynamically for both Hebrew and English routes. Passes locale to `RootLayoutProvider`.
  - `app/[locale]/layout.tsx` stripped to a minimal pass-through: only calls `setRequestLocale(locale)` and returns `{children}`. No html/body/AppShell rendered.
  - `AppShell.tsx` — removed hardcoded `dir="rtl"` from flex container. Direction now inherited from `<html dir>`.
  - `Sidebar.tsx` — uses `useLocale()` for direction-aware active indicator (`start-0` logical property), gradient direction, and collapse chevrons.
  - `MobileDrawer.tsx` — uses `useLocale()` for direction-aware positioning (`right-0`/`left-0`) and slide transform. All hardcoded Hebrew strings replaced with `useTranslations("nav")` and `useTranslations("sidebar")`.
  - `he.json` + `en.json` — added `sidebar.close` key.
- **Side effect**: All previously-static SSG locale routes (`/[locale]/accounts`, `/[locale]/assets`, etc.) become `ƒ (Dynamic)` because the root layout reads from request headers. This is acceptable during development.
- **Files changed**: `app/layout.tsx`, `app/[locale]/layout.tsx`, `AppShell.tsx`, `Sidebar.tsx`, `MobileDrawer.tsx`, `he.json`, `en.json`.

#### Fix Round 3 — Locale resolution fix (route group architecture)

- **Root cause**: `getLocale()` in `app/layout.tsx` reads from a React `cache()` slot populated by `setRequestLocale()`. The root layout renders BEFORE the `[locale]` layout in Next.js App Router. For `/en/*` routes, `setRequestLocale("en")` in `[locale]/layout.tsx` runs too late — the root layout's `getLocale()` call already returned "he" (default), so English routes received Hebrew messages, RTL direction, and the Hebrew AppShell.
- **Fix — route group `(root)`**: Root layout is now truly minimal (`lang="he" dir="rtl"` static, no `getLocale()`, no `RootLayoutProvider`). Hebrew routes are wrapped by a new `app/(root)/layout.tsx` group layout that calls `setRequestLocale("he")` and renders `RootLayoutProvider("he")`. English routes keep `app/[locale]/layout.tsx` which calls `setRequestLocale(locale)` and renders `RootLayoutProvider(locale)`. Each shell layout owns its locale before rendering children.
- **Fix — `SetHtmlAttributes` client component**: Because the root `<html>` element is statically set to `lang="he" dir="rtl"`, English routes use a new `SetHtmlAttributes` client component that patches `document.documentElement.lang` and `document.documentElement.dir` after hydration.
- **Fix — `AppShell.tsx` direction-aware `dir` attribute**: Added `useLocale()` from next-intl and derives `dir` (`"rtl"` for Hebrew, `"ltr"` for English). Applied `dir={dir}` on the root flex container div so CSS direction cascade is correct even if the `<html dir>` attribute is patched asynchronously post-hydration.
- **Fix — page migrations to `(root)` group**: Moved `app/page.tsx`, `app/managed-savings/page.tsx`, and `app/pension-gemel/page.tsx` into `app/(root)/` route group. The `pension-gemel` page had a pre-existing double-AppShell bug (the page wrapped itself in `<AppShell>` while also being inside the root layout's `AppShell`); the `(root)` group layout now provides the single shell.
- **Files changed**: `app/layout.tsx` (rewritten minimal), new `app/(root)/layout.tsx`, new `app/(root)/page.tsx`, new `app/(root)/managed-savings/page.tsx`, new `app/(root)/pension-gemel/page.tsx` (AppShell wrapper removed), deleted `app/page.tsx`, deleted `app/managed-savings/page.tsx`, deleted `app/pension-gemel/page.tsx`, `app/[locale]/layout.tsx` (full English shell restored), new `src/components/layout/SetHtmlAttributes.tsx`, `AppShell.tsx` (added `useLocale()` + `dir` prop).

---

## Phase 2B-3: Managed Savings Hardening & QA Audit

### Status

**COMPLETED AND VERIFIED** (2026-06-29) — Product Owner QA approved. Changes committed to master.

### Goal

Fix audit findings identified after Phase 2B-2 was merged. Focus on UX correctness, projection consistency, i18n cleanup, validation hardening, and code quality. No new features, no schema changes, no external APIs.

### Scope

- **Delete/archive error feedback:** `DeleteHoldingConfirmModal` now shows a translated error message (`errors.archiveFailed`) when `archiveManagedSavingsHolding` returns `ok: false`. Modal stays open for retry.
- **Projection consistency:** Per-row projection columns in `ManagedSavingsTable` (1Y, 5Y, 10Y, 15Y, custom) now use `projectSimulations(investment, customYears)` — the same helper used by summary cards. Monthly contributions and accumulation fees are factored in. Hardcoded multipliers removed.
- **i18n — hardcoded strings:** Removed hardcoded English `sr-only "Expand"`, `sr-only "Actions"`, and `title="Edit"` from `ManagedSavingsTable`. Added translation keys `table.expandSr`, `table.actionsSr`, `table.editTitle` in both `he.json` and `en.json`.
- **i18n — duplicate key:** Removed stale string form `"mockActions": "פעולות"` / `"Mock Actions"` from `managedSavings.expandedView` in both translation files. Object form retained.
- **Pluralization:** `table.investmentsCount` updated to ICU plural syntax. Hebrew: `"{count, plural, one {קרן אחת} other {{count} קרנות}}"`. English: `"{count, plural, one {# fund} other {# funds}}"`. Component updated to use `t()` instead of `t.rich()`.
- **Loading states:** Add modal save button shows `modal.adding` ("מוסיף..." / "Adding...") while pending. Edit modal save button shows `modal.saving` ("שומר..." / "Saving...") while pending.
- **Section heading:** Page `h2` above the holdings table now uses `holdingsTitle` ("ההשקעות שלי" / "Your Holdings") instead of repeating `pageTitle`.
- **Validation hardening:** `CreateManagedSavingsSchema` and `UpdateManagedSavingsSchema` now enforce `currentBalance: max(50_000_000)` and `monthlyContribution: max(500_000)`. Fee max bounds unchanged at 5%.
- **Cleanup:** Removed dead `onInvestmentChange?` prop from `ManagedSavingsTable`. Removed unreachable `archived → inactive` status mapping in serializer (archived records are filtered out before serialization).

### Files Changed

Code:
- `src/components/managed-savings/DeleteHoldingConfirmModal.tsx` — error state
- `src/components/managed-savings/ManagedSavingsTable.tsx` — projections, sr-only, pluralization, dead prop
- `src/components/managed-savings/AddManagedFundModal.tsx` — loading state
- `src/components/managed-savings/EditManagedFundModal.tsx` — loading state
- `src/components/managed-savings/ManagedSavingsPageClient.tsx` — section heading
- `src/lib/validation/managed-savings.ts` — max value bounds
- `src/lib/managed-savings/serializers.ts` — dead code removal

Translations:
- `src/messages/he.json` — pluralization, new keys, duplicate key removal
- `src/messages/en.json` — same

### Non-Scope

- Phase 2C public fund sync
- Data.gov.il / GemelNet / PensionNet
- Auth.js / production multi-user isolation
- SSR raw `<html lang/dir>` fix for English routes
- Admin cache UI
- Import/export
- Pension page
- Visual redesign

### QA Requirements

- `npm run lint` — must pass
- `npx tsc --noEmit` — must pass
- `npm run build` — must pass
- `npm run db:validate` — must pass
- Browser QA on both Hebrew and English managed savings routes

---

## Phase 2C-1: Public Fund Schema and Resource Configuration

### Status

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved. Merged into `master`.

### Goal

Add the database schema and seed/config records needed for future public GemelNet/PensionNet fund sync. Schema/config foundation only.

### Scope

- Prisma models: `PublicFund`, `FundReturn`, `PublicDataResource`, `PublicDataSyncRun`.
- Enums: `PublicDataSource`, `PublicDataSyncStatus`, `PublicDataSyncTrigger`, `PublicFundProductType`.
- Seed: `PublicDataResource` config rows for the six confirmed Data.gov.il resource IDs (3 GemelNet periods + 3 PensionNet periods), idempotent upsert, no Data.gov.il calls made.
- Migration: `prisma/migrations/20260630125534_add_public_fund_schema/`.

### Non-Scope (deferred to later sub-phases)

- Data.gov.il API client / `datastore_search` calls (Phase 2C-2).
- Normalization logic, sync server actions, admin sync UI, scheduled sync (Phase 2C-2).
- Matching/linking UI and FK from `ManagedSavingsHolding` to `PublicFund` (Phase 2C-3).
- Replacing mock/fallback public track performance on the Managed Savings page (Phase 2C-2/2C-3).
- Any UI changes.

### Acceptance Criteria

- Prisma schema includes `PublicFund`, `FundReturn`, `PublicDataResource`, `PublicDataSyncRun` with correct enums, relationships, unique constraints, and indexes.
- Prisma migration created and applied locally.
- `prisma generate` and `prisma validate` pass.
- Existing `ManagedSavingsHolding` model and behavior unchanged; no FK added yet.
- Seed remains idempotent and includes `PublicDataResource` rows.
- No Data.gov.il calls made.
- No UI changes.

### QA Requirements

- `npm run db:validate` — must pass
- `npm run db:generate` — must pass
- `npm run db:migrate:local` — must pass (local DB available)
- `npm run db:seed:local` — must pass (local DB available)
- `npm run lint` — must pass
- `npx tsc --noEmit` — must pass
- `npm run build` — must pass

---

## Phase 2C-2: Public Fund Live Sync

### Status

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report. Merged into `master` from `feature/public-fund-sync`.

### Goal

First live sync from Data.gov.il into `PublicFund`/`FundReturn`, building on the Phase 2C-1 schema. Backend/data-layer only — no matching UI, no link from `ManagedSavingsHolding` to `PublicFund`, no change to the mock/fallback public performance display.

### Scope

- `src/lib/public-data/data-gov-client.ts` — typed CKAN `datastore_search` client (timeout/abort handling, treats HTTP-200-with-`success:false` as an error, sequential pagination via `paginateDatastoreSearch`).
- `src/lib/public-funds/types.ts` — raw GemelNet/PensionNet record types (all fields optional).
- `src/lib/public-funds/parsing.ts` — safe parsing helpers (`parseNumeric`, `parseString`, `parseReportPeriod`, `parseSourceDateTime`).
- `src/lib/public-funds/normalize-public-fund-record.ts` — single normalization function shared by GemelNet and PensionNet, branching only on the fields that actually differ (`PARENT_COMPANY_*` for PensionNet; `TARGET_POPULATION`/`SPECIALIZATION`/`SUB_SPECIALIZATION` for GemelNet). Skips rows missing required core fields (`FUND_ID`, `FUND_NAME`, `MANAGING_CORPORATION`, `REPORT_PERIOD`, `MONTHLY_YIELD`, `YEAR_TO_DATE_YIELD`). Leaves `productType` unset (stays null/unknown).
- `src/lib/public-funds/sync-public-funds.ts` — sync service: reads active `PublicDataResource` rows from DB, paginates CKAN records sequentially, normalizes, upserts `PublicFund` and `FundReturn`, writes `PublicDataSyncRun` lifecycle (`running` → `success`/`failed`), updates `PublicDataResource.lastSyncedAt`.
- `scripts/sync-public-funds.ts` + `npm run sync:public-funds:local` — manual CLI trigger. Defaults to current (`isCurrent=true`) GemelNet and PensionNet resources only. Optional `--source=gemelnet|pensionnet` / `--resourceId=<id>` flags. Prints a concise summary (no raw rows).

### Count strategy

`PublicFund` spans many report periods, so `insertedCount`/`updatedCount`/`skippedCount`/`errorCount` are tracked at `FundReturn` granularity (one CKAN row = one `FundReturn`). A `FundReturn` existence check runs before each upsert to classify insert vs. update. `PublicFund` itself is always upserted per row (to keep `lastSeenAt` current) but is not counted separately.

### Non-Scope (deferred to later sub-phases)

- Matching/linking UI and FK from `ManagedSavingsHolding` to `PublicFund` (Phase 2C-3).
- Replacing mock/fallback public track performance on the Managed Savings page (Phase 2C-3/2C-4).
- Scheduled sync (Vercel Cron).
- Historical (1999–2022) resource backfill by default.
- Admin sync UI (CLI trigger only in this phase).
- Reliable `productType` inference.
- AUM display in UI (units not display-approved).

### Local verification (2026-06-30)

Live sync run against current GemelNet (`a30dcbea-a1d2-482c-ae29-8f781f5025fb`) and PensionNet (`6d47d6b5-cb08-488b-b333-f1e717b1e1bd`) resources:
- GemelNet: inserted=19016, updated=0, skipped=1803, errors=0 (~156s)
- PensionNet: inserted=7804, updated=0, skipped=328, errors=0 (~77s)
- Resulting DB state:
  - `PublicDataResource` count: 6
  - `PublicFund` count: 1,106 (gemelnet=799 / pensionnet=307)
  - `FundReturn` count: 26,820 (gemelnet=19016 / pensionnet=7804)
  - `PublicDataSyncRun` count: 2 success rows
  - `lastSyncedAt` set on both current resources only (historical resources untouched)
- Skipped rows verified as legitimate (e.g., guaranteed-return tracks reporting `null` `MONTHLY_YIELD`/`YEAR_TO_DATE_YIELD` for that period), not a parsing defect.
- `ManagedSavingsHolding` unaffected — no rows created/modified/linked by the sync.

### Acceptance Criteria

- Data.gov.il client calls `datastore_search` only (confirmed: no `datastore_search_sql` usage anywhere in the new code).
- Current GemelNet and PensionNet resources can be synced manually via `npm run sync:public-funds:local`.
- Sync reads `PublicDataResource` config from DB — no resource IDs hardcoded in sync logic.
- Records normalized and upserted into `PublicFund` and `FundReturn`.
- `PublicDataSyncRun` created and completed with status/counts.
- `PublicDataResource.lastSyncedAt` updates on successful sync.
- Bad rows skipped/counted without crashing the whole sync.
- No personal holdings linked or modified.
- No UI behavior changes.

### QA Requirements

- `npm run db:validate` — must pass
- `npm run db:generate` — must pass
- `npm run lint` — must pass
- `npx tsc --noEmit` — must pass
- `npm run build` — must pass
- Local DB: `npm run db:migrate:local`, `npm run db:seed:local`, `npm run sync:public-funds:local` — must pass

---

## Phase 2C-3A: Public Fund Matching Search Backend

### Status

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report. Merged into `master` from `feature/public-fund-matching-search`.

### Goal

Provide a safe, local-DB-only search and candidate ranking layer over synced `PublicFund`/`FundReturn` records, as the backend foundation for a future matching/linking UI (Phase 2C-3B). No link is added from `ManagedSavingsHolding` to `PublicFund` in this phase.

### Scope

- `src/lib/public-funds/search-types.ts` — `PublicFundSearchInput`, `PublicFundMatchCandidate`, and `MatchReasonLabel` types. Internal match reason identifiers only — no user-facing text.
- `src/lib/public-funds/matching-normalization.ts` — local string normalization helpers (`normalizeForMatching`, `tokenizeForMatching`, `isNormalizedEqual`, `normalizedContains`, `trimAndCollapseWhitespace`) for Hebrew/English fund/company name matching. Comparison-only — never mutates stored values.
- `src/lib/public-funds/matching.ts` — `scorePublicFundCandidate`, a pure deterministic scoring function (exact fundId, exact/contains fund name, token overlap, managing company, controlling corporation, parent company, source, product type, recent-return tie-breaker).
- `src/lib/public-funds/search-public-funds.ts` — `searchPublicFundsForMatching`, the main search entry point. Local DB only via Prisma. Exact `fundId` lookup plus a bounded (`take: 200`) case-insensitive `contains` query across `fundName`/`managingCompany`/`controllingCorporation`/`parentCompanyName`, then in-memory scoring/ranking over the combined candidate pool. Enriches each candidate with the latest `FundReturn` (`reportPeriod desc`), excluding AUM fields.
- `src/lib/validation/public-fund-matching.ts` — `PublicFundSearchSchema` (Zod) for the server action.
- `src/lib/actions/public-fund-matching-actions.ts` — `searchPublicFundsForMatchingAction` server action. Validates with Zod, returns `{ ok: true, candidates }` or `{ ok: false, error: "validation" | "server_error" }`. No client/UI wiring in this phase.
- `scripts/search-public-funds.ts` + `npm run search:public-funds:local` — optional CLI smoke test. Prints concise rows only (score, source, fundId, managingCompany, fundName, latestReportPeriod), no raw DB records.

### Search behavior

- Default result limit 10, max 20.
- If both `query` and `fundId` are empty, returns `[]` immediately (no broad table scan).
- Exact `fundId` match always included if present, scored highest (`exact_fund_id`), regardless of whether `query` is also supplied.
- Text search runs only when `query` is non-empty; `source`/`managingCompany`/`productType` are optional narrowing filters. `productType` is not applied unless explicitly supplied, since most `PublicFund` rows have `productType = null`.
- Candidate pool capped at 200 rows from the DB before in-memory scoring (`MAX_CANDIDATE_POOL`).
- Ranking: `matchScore` desc, then `latestReportPeriod` desc, then `fundName` asc.

### Non-Scope (deferred to Phase 2C-3B / 2C-4)

- Matching/confirmation UI (no modal, no page changes).
- Confirm link / unlink actions.
- FK or relation from `ManagedSavingsHolding` to `PublicFund`.
- Replacing the mock/fallback public performance display on the Managed Savings page.
- Reliable `productType` inference.
- AUM display.
- Any Data.gov.il calls (this phase searches the local DB only).
- Prisma schema changes (none made in this phase).

### Acceptance Criteria

- Public fund search function exists and is typed.
- Search can find candidates by `fundId`.
- Search can find candidates by Hebrew fund/company query.
- Search supports `source` filtering.
- Search returns ranked candidates with `matchScore` and `matchReasonLabels`.
- Search enriches candidates with latest `FundReturn` metrics (AUM excluded).
- Search does not call Data.gov.il.
- Search does not modify `ManagedSavingsHolding`.
- No schema migration added.
- No UI changes.

### QA Requirements

- `npm run db:validate` — must pass
- `npm run db:generate` — must pass
- `npm run lint` — must pass
- `npx tsc --noEmit` — must pass
- `npm run build` — must pass
- Manual verification (if local DB has Phase 2C-2 synced data): exact `fundId` search, Hebrew company query (e.g. "הראל", "מגדל"), `source=gemelnet`, `source=pensionnet`.

### Local Search Verification (2026-06-30, re-verified at finalization)

Run against local DB with Phase 2C-2 synced data (`PublicFund`=1,106, `FundReturn`=26,820):
- Exact `fundId` search (`--fundId=101 --source=gemelnet`): 1 candidate returned, top score, correct fund.
- Hebrew query search (`--query="הראל"`): 10 ranked candidates returned, all matching company/fund names.
- `source=gemelnet` filter (`--query="מגדל" --source=gemelnet`): 10 gemelnet-only candidates, no pensionnet leakage.
- `source=pensionnet` filter (`--query="כלל" --source=pensionnet --limit=5`): 5 pensionnet-only candidates, custom limit respected.
- Empty/no-query edge case (no flags): 0 candidates returned, no broad DB scan triggered (confirms the empty-input short-circuit).
- No Data.gov.il calls made during any verification run — confirmed by code inspection (`search-public-funds.ts` only calls `prisma.publicFund`/`prisma.fundReturn`).

---

## Phase 2C-3B: Public Fund Matching UI + Confirm Link / Unlink

### Status

**COMPLETED AND VERIFIED** (2026-07-02). Product Owner browser QA approved. Committed and merged into `master` from `feature/public-fund-linking-ui`.

### Goal

Add a minimal, explicit, user-confirmed link from `ManagedSavingsHolding` to `PublicFund`, expose safe server actions for link/unlink, and add a matching/search UI in the Managed Savings expanded row using the Phase 2C-3A local search backend. Does not replace the mock/fallback public performance display and does not auto-link anything.

### Scope

- **Schema**: `ManagedSavingsHolding.publicFundId String?` (nullable FK to `PublicFund`, `onDelete: SetNull`, indexed). `PublicFund.managedSavingsHoldings` reverse relation added. `officialFundId` unchanged and unrelated — not repurposed. Migration: `prisma/migrations/20260630142325_add_public_fund_linking_to_managed_savings/`.
- **Server actions** (`src/lib/actions/public-fund-linking-actions.ts`): `linkManagedSavingsHoldingToPublicFund` and `unlinkManagedSavingsHoldingFromPublicFund`. Zod-validated (`src/lib/validation/public-fund-linking.ts`, both ids `z.string().min(1)` — `cuid()` was intentionally not used because seeded dev holdings use stable IDs like "hist-001" that fail cuid regex; security gate is the ownership check in the action body), ownership-checked against the dev user, reject linking archived holdings, verify the target `PublicFund` exists, update `publicFundId` only, call `revalidateTag`, return `{ ok: true, holding }` or `{ ok: false, error: "validation" | "not_found" | "unauthorized" | "server_error" }`. No DB errors or stack traces exposed to the client.
- **Data layer**: `src/lib/public-funds/latest-fund-returns.ts` — batch helper (`getLatestReportPeriodsByPublicFundIds`) to resolve each linked fund's latest `FundReturn.reportPeriod` without N+1 queries. `serializeHolding` (`src/lib/managed-savings/serializers.ts`) now accepts the Prisma-included `publicFund` relation and produces an optional `linkedPublicFund` field (`id`, `source`, `fundId`, `fundName`, `managingCompany`, `latestReportPeriod`, `latestMonthlyReturn`, `latestYtdReturn`, `latestAnnualized3YrReturn`, `latestAnnualized5YrReturn`), no AUM, no full `FundReturn` history. `getEffectiveAnnualReturn(investment)` in `src/lib/mock/managed-savings-data.ts` returns the linked fund's `latestAnnualized5YrReturn` when non-null, falling back to `investment.trackPerformance.last5Years` — used by `projectSimulations` so projections reflect live public data when linked. `fetchHoldingsForDevUser` (`src/lib/data/managed-savings.ts`) includes `publicFund` and batch-resolves latest report periods. `createManagedSavingsHolding`/`updateManagedSavingsHolding` (`src/lib/actions/managed-savings-actions.ts`) include `publicFund` and preserve/omit the link correctly (linking/unlinking is a separate action; add/edit never touches `publicFundId`).
- **UI**: `PublicFundMatchModal` (`src/components/managed-savings/PublicFundMatchModal.tsx`) — local-DB-only search via `searchPublicFundsForMatchingAction` (no Data.gov.il calls), prefilled query from track/company name, source filter defaulting to `gemelnet`, candidate cards showing fund identity and return metrics (no AUM), explicit "קשר לקרן זו" / "Link this fund" confirm button. `EditManagedFundModal` is the single management surface for link/change/unlink: shows source badge + action buttons + labelled metadata inset when linked, or a "Link to public fund data" button when unlinked. `ExpandedManagedSavingsRow` is read-only/summary only: shows a unified green card (KPI return metric cells + divider + labelled metadata row with Fund name / Managing company / Fund number / Last fund update + disclaimer) when linked, or a compact amber warning when unlinked — no link/change/unlink controls in the expanded row. Add/Edit modal full visual redesign (`bg-slate-50` outer, `bg-white shadow-sm rounded-2xl` section cards, `bg-slate-100/70` header bands, `h-11 border-slate-300` inputs, `font-bold uppercase` labels, `bg-white shadow-[0_-2px_10px_...]` sticky footer). Modal scrollbar polished with custom `modal-scrollbar` CSS utility (6px thumb, slate-300/400, Firefox `scrollbar-width: thin`). State changes propagate via `onInvestmentUpdate` threaded through `ManagedSavingsTable` → `ManagedSavingsPageClient`.
- **i18n**: New `managedSavings.publicFundLinking` namespace (and nested `sourceLabels`, `linkedSummary`, `modal`, `modal.candidate`) added to both `src/messages/he.json` and `src/messages/en.json`. No hardcoded UI text. Hebrew copy avoids "your return" / "best fund" framing; uses neutral phrasing ("נתוני קרן ציבוריים", "קשר לנתוני קרן ציבוריים") plus explicit disclaimers that linked data is public/fund-level-only and does not change personal balance or contributions.

### Non-Scope (deferred)

- Replacing the mock/fallback public performance display (Phase 2C-4).
- AUM display anywhere in the UI.
- Auto-linking / suggested-match acceptance without explicit user action.
- Any Data.gov.il calls (matching UI searches the local DB only, reusing Phase 2C-3A).
- Financial advice or fund-comparison language.

### Acceptance Criteria

- `publicFundId` FK added, nullable, `onDelete: SetNull`, indexed; `officialFundId` untouched.
- Link/unlink server actions are Zod-validated, ownership-checked, reject archived holdings, verify `PublicFund` existence, and never leak DB errors.
- Linking/unlinking only ever changes `publicFundId` — no other holding fields are touched.
- Matching UI is local-DB-only (no live Data.gov.il calls) and requires explicit user confirmation to link.
- No AUM field displayed anywhere in the matching or linked-summary UI.
- All new UI text sourced from `he.json`/`en.json` — no hardcoded strings.
- Existing add/edit/delete holding flows and the public performance display are unchanged.

### QA Requirements

- `npm run db:validate`, `npm run db:generate`, `npm run db:migrate:local`, `npm run db:seed:local` — must pass.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` — must pass.
- Browser QA on `/managed-savings` and `/en/managed-savings`: open page, expand row, open matching modal, search, link, verify persistence after refresh, change link, unlink, verify add/edit/delete still work, verify no unintended change to the performance card, verify no cross-locale hardcoded text.

### Verification Performed

**Automated checks (final):**
- `npm run db:validate` — passed.
- `npm run db:generate` — passed (Prisma Client v7.8.0 generated cleanly).
- `npm run db:migrate:local` — passed (already in sync, no pending migrations).
- `npm run db:seed:local` — passed (6 PublicDataResource rows confirmed idempotent).
- `npm run lint` — passed, 0 errors/warnings.
- `npx tsc --noEmit` — passed, no errors (exit code 0).
- `npm run build` — passed (all routes compiled, pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only).

**Server action verification (Phase 2C-3B initial):**
- Direct DB verification: linking an active holding to a real `PublicFund` persists `publicFundId`; linking an archived holding rejected (`error: "validation"`); non-existent `publicFundId` rejected by Zod; unlinking clears `publicFundId` to `null`.

**Product Owner browser QA (2026-07-02, final approval):**
- Link/unlink working correctly.
- Regular edit (add/update holding) working correctly.
- Linked 5Y return displayed in table and projections updated correctly.
- Compact unlinked warning shown in expanded row.
- Linked public fund metadata displayed correctly in one labelled horizontal row.
- Add/Edit modal visual redesign accepted.
- Modal scrollbar polish accepted.

---

## Phase 2C-4A: Fund Return Query Hardening + Documentation Correction

### Status

**COMPLETED AND VERIFIED** (2026-07-06). Product Owner browser QA approved. Committed and merged into `master` from `feature/fund-return-query-hardening`.

### Goal

Backend/data-layer hardening of the latest-`FundReturn`-per-fund lookup, plus documentation correction. No UI changes. Follows the Phase 2C-4A Planning + Query Audit Report, which found that the previously-existing lookup pattern fetched every historical `FundReturn` row for a fund-id set and reduced it to "latest" in JS — safe at current data volumes (2 linked holdings, ≤29 rows each) but not scalable if historical backfill or many more linked holdings are added later.

### Scope

- **`getLatestFundReturnSummaries`** (`src/lib/public-funds/latest-fund-returns.ts`): replaced the `findMany({ orderBy: reportPeriod desc })` + JS reduce pattern with a single parameterized raw SQL query: `SELECT DISTINCT ON ("publicFundId") ... FROM "FundReturn" WHERE "publicFundId" = ANY($1::text[]) ORDER BY "publicFundId", "reportPeriod" DESC`, built via `Prisma.sql` (no string interpolation). Returns exactly one row per requested fund id. Empty input array short-circuits to an empty `Map` with no query executed. Output shape (`LatestFundReturnSummary`: `reportPeriod`, `monthlyReturn`, `ytdReturn`, `annualized3YrReturn`, `annualized5YrReturn`) is unchanged; Decimal-to-number conversion behavior preserved (raw numeric columns come back as strings from the pg driver and are converted via `Number()`, same as before).
- **`searchPublicFundsForMatching`** (`src/lib/public-funds/search-public-funds.ts`): the candidate-enrichment step no longer runs its own `prisma.fundReturn.findMany` fetch-all-then-reduce; it now calls the hardened `getLatestFundReturnSummaries` for the candidate fund-id set. `PublicFundMatchCandidate` output shape unchanged. The now-unused `toDecimalNumber` helper was removed as dead code.
- No Prisma schema/migration changes — the existing `@@unique([publicFundId, reportPeriod])` composite index already serves the `DISTINCT ON` query efficiently; no new index was needed.
- No UI changes: `ExpandedManagedSavingsRow`, `EditManagedFundModal`, `PublicFundMatchModal`, link/unlink behavior, `getEffectiveAnnualReturn`, `projectSimulations`, and the table's 5Y return column are all unchanged.
- No AUM, no average fee KPIs, no chart, no monthly history table — all confirmed non-scope for this phase.

### Verification Performed

Read-only local DB verification (no mutation):
- `getLatestFundReturnSummaries` for the 2 currently linked holdings' fund ids returned exactly 1 row per fund id, matching a manual `findFirst({ orderBy: reportPeriod desc })` cross-check for both funds (report period, monthly return values identical).
- Empty fund-id array input returned an empty `Map` with no query executed.
- `searchPublicFundsForMatching({ query: "הראל", source: "gemelnet" })` still returned ranked candidates enriched with latest return metrics (monthly/YTD/3Y/5Y annualized) after the change; no `assetsUnderManagement` key present on any returned candidate.

Automated checks:
- `npm run db:validate` — passed.
- `npm run db:generate` — passed.
- `npx tsc --noEmit` — passed.
- `npm run lint` — passed, 0 errors/warnings.
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only).

### Non-Scope

- No UI redesign, no charts, no monthly history table, no AUM display, no `avgAnnualManagementFee`/`avgDepositFee` UI, no personal realized return calculation, no fund comparison ranking, no recommendations/advice, no automatic linking, no Data.gov.il sync, no scheduled sync, no admin sync UI, no Auth.js/multi-user work, no Open Banking.

### Acceptance Criteria

- Latest `FundReturn` summary lookup no longer fetches all historical rows per fund and reduces in JS — met (`DISTINCT ON` query).
- Search candidate enrichment no longer fetches all historical rows per candidate fund and reduces in JS — met (reuses hardened lookup).
- Existing linked public KPI display remains visually and functionally unchanged — met (no UI files touched).
- Existing matching/linking flow remains unchanged — met.
- Existing projection behavior remains unchanged — met (`getEffectiveAnnualReturn`/`projectSimulations` untouched).
- No AUM is serialized or displayed — confirmed via verification.
- Documentation accurately reflects that linked DB-backed KPI display was already delivered in Phase 2C-3B — corrected in this file and related docs.
- No advisory wording added — confirmed.

### QA Requirements

- `npm run db:validate`, `npm run db:generate`, `npx tsc --noEmit`, `npm run lint`, `npm run build` — all passed.
- Read-only local DB verification — passed (see above).
- Browser QA — smoke-only, since no UI changed; Product Owner should confirm `/managed-savings` and `/en/managed-savings` still load, the linked KPI card and unlinked warning render as before, and the search/link modal still opens.

### Follow-up QA Fix (2026-07-05, same branch)

Product Owner browser smoke QA found two issues in `PublicFundMatchModal` (`src/components/managed-savings/PublicFundMatchModal.tsx`), fixed on `feature/fund-return-query-hardening` without a new branch:

1. **Header/scroll overlap:** the modal header used `bg-gradient-to-r from-asset/15 via-asset/10 to-transparent` — translucent, so scrolled result rows showed through the header, especially near the transparent end of the gradient. Replaced with a fully opaque `bg-white border-b border-border/60 shadow-sm`, `z-20` (raised from `z-10`). Verified via headless-browser screenshot in both Hebrew RTL and English LTR that scrolled result text no longer overlaps the header/title/close button.
2. **PensionNet exposed in a non-pension modal:** the modal previously had a `select` dropdown offering "All / GemelNet / PensionNet". Since Managed Savings covers only non-pension products (Keren Hishtalmut, Kupat Gemel, Gemel LeHashkaa, Savings Policy), and GemelNet/PensionNet are data sources rather than product types, this was confusing and incorrectly allowed selecting a pension-specific source from this modal. The dropdown was removed (Option A from the fix prompt); the modal now always calls `searchPublicFundsForMatchingAction` with `source: "gemelnet"` internally. A new helper note (`modal.gemelnetOnlyNote` in `he.json`/`en.json`) clarifies the search covers the public GemelNet dataset and may include Keren Hishtalmut/Kupat Gemel/Gemel LeHashkaa where available — no claim that all product types are guaranteed present. No product-type filter was added, since `PublicFund.productType` inference remains unresolved/nullable.

Verified via headless-browser script (Playwright, ad hoc — not added as a project dependency) against the local dev server in both locales: no `select` element present in the modal, all returned candidate badges show "GemelNet"/"גמל-נט" only (never PensionNet), zero console errors, linked KPI card and unlinked amber warning both render unchanged, and the "Link this fund" confirm button is present and clickable. The backend (`searchPublicFundsForMatching`, `searchPublicFundsForMatchingAction`, Zod schema) still accepts and supports `pensionnet` for any future screen — only this modal's UI was restricted to GemelNet.

Automated checks re-run after the fix: `npm run db:validate`, `npm run db:generate`, `npx tsc --noEmit`, `npm run lint`, `npm run build` — all passed.
