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

## Phase 2B-2 — Managed Savings DB-backed Actions and UI

Status: Completed (2026-06-29)

Note: Phase 2B-2 builds on Phase 2B-1 (infrastructure / schema / seed). It converts the Managed Savings page from mock data to DB-backed persistence via server actions.

Completed:
- **Data loading:** Managed Savings page now loads holdings from PostgreSQL via a cached server-side data access layer (`getManagedSavingsHoldingsForCurrentDevUser`). `unstable_cache` is used with cache tag `managed-savings:dev-user`. DB is queried only on cache miss or after a write mutation.
- **Server actions:** `createManagedSavingsHolding`, `updateManagedSavingsHolding`, `archiveManagedSavingsHolding` — all implemented as Next.js Server Actions (`"use server"`).
- **Zod validation:** All three server actions validate inputs with dedicated Zod schemas (`CreateManagedSavingsSchema`, `UpdateManagedSavingsSchema`, `ArchiveManagedSavingsSchema`). Validation runs on the server; the client sends UI-friendly values.
- **Unit conversion:** Money values are submitted as ILS amounts and stored as integer agorot (minor units via `toMinorUnits`). Fees are submitted as percentages and stored as basis points (`percentToBps`). Reverse conversions applied on read.
- **Ownership checks:** `updateManagedSavingsHolding` and `archiveManagedSavingsHolding` verify the holding belongs to the dev user before writing.
- **Soft archive:** Archive is implemented as `status = "archived"` (soft delete). No hard DB deletes. Internal wording is "archive"; user-facing wording is "מחק חיסכון" / "Delete holding".
- **Immediate UI updates:** Add and edit server actions return the serialized holding on success. `ManagedSavingsPageClient` updates local `useState` immediately (no manual refresh needed), then calls `router.refresh()` in background to align server-rendered cache.
- **Cache invalidation:** All three server actions call `revalidateTag("managed-savings:dev-user")` after a successful DB write. Next.js 16 requires a second argument: `revalidateTag(tag, {})`.
- **Delete confirmation modal:** Single "מחק חיסכון" / "Delete holding" button in the edit modal footer opens `DeleteHoldingConfirmModal` (z-[60]). Replaces prior two-click inline archive UX.
- **Notes:** Editable in the edit modal. Displayed only in expanded rows — never in the main table. Never exposed in URLs or logs.
- **English LTR and duplicate menu fix (QA Fix Round 2):** Root cause was `[locale]/layout.tsx` rendering nested `<html><body>` + double `AppShell`. Fixed by stripping the locale layout to a minimal pass-through and making `AppShell` direction-aware. `MobileDrawer` and `Sidebar` use `useLocale()` for direction-aware positioning and logical Tailwind properties.
- **Locale resolution fix (QA Fix Round 3):** Root cause was `getLocale()` in `app/layout.tsx` always returning "he" because it ran before `setRequestLocale("en")` in nested layouts. Fixed with a `(root)` route group: root layout is now truly minimal; Hebrew routes use `(root)/layout.tsx` for their shell; English routes use `[locale]/layout.tsx` for their shell. `SetHtmlAttributes` client component patches `<html lang/dir>` after hydration for English routes. `AppShell` applies `dir={dir}` on its container div from `useLocale()` so layout direction is correct from first SSR paint.

Out of Scope (Not Implemented in Phase 2B-2):
- Auth.js or production multi-user isolation (dev-user stub retained)
- Data.gov.il / GemelNet / PensionNet sync
- PublicFund or FundReturn models
- Public track performance (remains mock/fallback until Phase 2C)
- Admin cache UI
- localStorage as source of truth for financial data
- Net worth snapshot integration
- Neon remote DB migration

Known Deferred Item:
- For English routes (`/en/*`), the `<html lang/dir>` attributes in the initial server-rendered HTML are `he/rtl` (from the root layout). They are corrected to `en/ltr` after client hydration by `SetHtmlAttributes`. No visible layout flash occurs because `AppShell` renders with `dir="ltr"` in SSR HTML. This should be revisited in a dedicated i18n hardening task.

Automated Checks:
- ESLint: clean (0 errors, 0 warnings)
- TypeScript: no errors (`npx tsc --noEmit`)
- Build: successful (`npm run build`, 24 routes, pre-existing `ENVIRONMENT_FALLBACK` warning only)
- Prisma validate: schema valid
- Prisma generate: client generated cleanly

Browser QA (user-confirmed):
- `/en/managed-savings` renders English text, LTR layout, sidebar on left
- `document.documentElement.lang` returns `"en"` after hydration
- `document.documentElement.dir` returns `"ltr"` after hydration
- Hebrew routes unaffected

Branch History:
- Feature branch: feature/managed-savings-actions
- Merged into: master
- Commit: feat: persist managed savings holdings

## Phase 2B-3 — Managed Savings Hardening & QA Audit

Status: **Completed and Verified** (2026-06-29)

This phase addressed audit findings from Phase 2B-2 and hardened the Managed Savings feature for production readiness. No new features, no schema changes, no external APIs.

Completed:
- **Delete/archive error feedback:** `DeleteHoldingConfirmModal` now shows translated error message (`errors.archiveFailed`) when archive action fails. Modal stays open for retry. Error state added to component; reuses existing translation key.

- **Projection consistency:** Per-row projection columns (1Y, 5Y, 10Y, 15Y, custom) in `ManagedSavingsTable` replaced hardcoded multipliers with `projectSimulations(investment, years)` — same helper used by summary cards. Now correctly includes:
  - Current balance growth
  - Monthly contributions compounding
  - Accumulation fee deductions
  - Results are consistent with summary card totals

- **i18n — hardcoded string removal:** Removed three hardcoded English accessibility strings from `ManagedSavingsTable`:
  - `sr-only "Expand"` → `t("table.expandSr")`
  - `sr-only "Actions"` → `t("table.actionsSr")`
  - `title="Edit"` → `title={t("table.editTitle")}`
  - All added to both `he.json` and `en.json`

- **i18n — duplicate key cleanup:** Removed stale string form of `"mockActions": "פעולות"` / `"Mock Actions"` from `managedSavings.expandedView` in both translation files. Only object form remains.

- **Pluralization fix:** `table.investmentsCount` updated to ICU plural format:
  - Hebrew: `"{count, plural, one {קרן אחת} other {{count} קרנות}}"` — grammatically correct singular and plural
  - English: `"{count, plural, one {# fund} other {# funds}}"` — correct "1 fund" vs "N funds"
  - Component updated from `t.rich()` to `t()` for ICU string support

- **Loading states:** Add and Edit modals now show pending/loading text during server action:
  - Add modal: "מוסיף..." / "Adding..." (from `modal.adding`)
  - Edit modal: "שומר..." / "Saving..." (from `modal.saving`)
  - Buttons remain disabled during pending

- **Distinct section heading:** Page `h2` above holdings table now uses `holdingsTitle` ("ההשקעות שלי" / "Your Holdings") instead of repeating `pageTitle`. Fixes h1/h2 duplication.

- **Validation hardening:** Zod schemas for Create/Update now enforce:
  - `currentBalance: max(50_000_000)` ILS
  - `monthlyContribution: max(500_000)` ILS
  - Prevents implausibly large inputs from reaching DB

- **Code cleanup:**
  - Removed dead `onInvestmentChange?` prop from `ManagedSavingsTable`
  - Removed unreachable `archived → inactive` status mapping from serializer (archived records are filtered before serialization)

Files Changed:
- Code: `DeleteHoldingConfirmModal.tsx`, `ManagedSavingsTable.tsx`, `AddManagedFundModal.tsx`, `EditManagedFundModal.tsx`, `ManagedSavingsPageClient.tsx`, `serializers.ts`, `managed-savings.ts` (validation)
- Translations: `he.json`, `en.json`
- Documentation: `Context/current-feature.md` (scope, status, phase breakdown)

Product QA Approval:
Product Owner confirmed all scenarios work correctly:
- Hebrew `/managed-savings`: load, add, edit, delete, persistence, notes, projections, pluralization — all passed
- English `/en/managed-savings`: load, LTR layout, sidebar, CRUD, pluralization — all passed
- Dashboard `/`: no regressions — passed

Automated Checks:
- `npm run lint` — passed (0 errors, 0 warnings)
- `npx tsc --noEmit` — passed (no type errors)
- `npm run build` — passed (24 routes generated)
- `npm run db:validate` — passed (schema valid)

Known Deferred Items:
- SSR `<html lang/dir>` for English routes remains statically Hebrew/RTL in initial render; `SetHtmlAttributes` corrects after hydration — no visible flash
- Auth.js and production multi-user isolation are future scope; dev-user stub remains
- Public fund performance remains mock/fallback until Phase 2C connects Data.gov.il
- Custom horizon for years 2–4, 6–9, 11–14 returns 0 (edge case in Phase 2A projection model; normal usage defaults to 20 years)

Branch History:
- Feature branch: `fix/managed-savings-hardening`
- Merged into: `master`
- Commit: `feat: harden managed savings persistence UX`

## Phase 2C-1 — Public Fund Schema and Resource Configuration

Status: **Completed and Verified** (2026-06-30)

This phase added the database schema and seed/config foundation needed for future public GemelNet/PensionNet fund sync. Schema/config only — no live Data.gov.il sync, matching UI, admin sync UI, or replacement of mock/fallback public performance.

Completed:
- **`PublicFund` model:** Represents a public GemelNet/PensionNet fund (fund-level, not personal data). Fields: `source`, `fundId`, `fundName`, `managingCompany`, `managingCompanyLegalId?`, `controllingCorporation?`, `parentCompanyId?`, `parentCompanyName?`, `productType?` (nullable — GemelNet has no clean product type column), `fundClassification?`, `specialization?`, `subSpecialization?`, `targetPopulation?`, `inceptionDate?`, `firstSeenAt`, `lastSeenAt`, `createdAt`, `updatedAt`. `@@unique([source, fundId])`. Indexes on `source`, `fundId`, `fundName`, `managingCompany`.
- **`FundReturn` model:** Monthly public return data for a `PublicFund`. Fields: `publicFundId` (FK), `reportPeriod`, `monthlyReturn`, `ytdReturn`, `trailing3YrReturn?`, `trailing5YrReturn?`, `annualized3YrReturn?`, `annualized5YrReturn?`, `assetsUnderManagement?`, `assetsUnderManagementRaw?`, `avgAnnualManagementFee?`, `avgDepositFee?`, `sourceResourceId`, `sourceSnapshotDate?`, `createdAt`, `updatedAt`. `@@unique([publicFundId, reportPeriod])`. Decimal types used for return/fee percentages and AUM — never floats.
- **`PublicDataResource` model:** Config record for a known Data.gov.il resource (dataset period), so resource IDs are stored in config rather than hardcoded in future sync logic. Fields: `source`, `label`, `resourceId`, `periodStart?`, `periodEnd?`, `isCurrent`, `isActive`, `lastSyncedAt?`, `createdAt`, `updatedAt`. `@@unique([source, resourceId])`.
- **`PublicDataSyncRun` model:** Audit/history record for a sync run, to be used later by the Admin sync UI (Phase 2C-2+). Fields: `source`, `resourceId`, `startedAt`, `finishedAt?`, `status`, `insertedCount`, `updatedCount`, `skippedCount`, `errorCount`, `errorMessage?`, `triggeredBy`, `createdAt`, `updatedAt`. No rows written in this phase — no sync logic exists yet.
- **New enums:** `PublicDataSource` (`gemelnet`, `pensionnet`), `PublicDataSyncStatus` (`running`, `success`, `failed`), `PublicDataSyncTrigger` (`manual`, `scheduled`), `PublicFundProductType` (`hishtalmut`, `gemel`, `hashkaa`, `pension`, `unknown`).
- **Seeded resource config:** `prisma/seed.ts` upserts 6 `PublicDataResource` rows from the Phase 2C Discovery Audit Report — 3 GemelNet periods (1999–2022, 2023, 2024–today) and 3 PensionNet periods (1999–2022, 2023, 2024–today). The `2024–today` resource is marked `isCurrent=true` for each source; all six are `isActive=true`. Seeding is idempotent (upsert) and makes no Data.gov.il calls.
- **Migration:** `prisma/migrations/20260630125534_add_public_fund_schema/` — created and applied to the local PostgreSQL database.

Out of Scope (Not Implemented in Phase 2C-1):
- Live Data.gov.il calls — no API client, no `datastore_search` requests.
- `ManagedSavingsHolding` relation to `PublicFund` — `officialFundId` remains a plain optional string; linking is deferred to Phase 2C-3.
- Any UI changes — no matching UI, no admin sync UI, no public performance display changes.
- Sync server actions, normalization logic, scheduled sync (Phase 2C-2).

Automated Checks:
- `npm run db:validate` — passed
- `npm run db:generate` — passed
- `npm run db:migrate:local` — passed (migration applied to local Docker PostgreSQL, port 5433)
- `npm run db:seed:local` — passed (run twice to confirm idempotency)
- `npm run lint` — passed (0 errors, 0 warnings)
- `npx tsc --noEmit` — passed (no type errors)
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only)

Known Deferred Items:
- Phase 2C-2 live Data.gov.il sync not implemented.
- Matching UI not implemented.
- `ManagedSavingsHolding` relation to `PublicFund` not added yet.
- Product type inference unresolved (kept nullable/`unknown` by design).
- AUM units not display-approved yet.
- Admin sync UI not implemented.
- Public performance display still uses fallback/mock data.
- Custom horizon projection edge case remains deferred (pre-existing, unrelated to this phase).

Branch History:
- Feature branch: `feature/public-fund-schema`
- Merged into: `master`
- Commit: `feat: add public fund schema foundation`

## Phase 2C-2 — Manual Public Fund Live Sync + Normalization

Status: **Completed and Verified** (2026-06-30)

This phase implemented the first live public fund sync from Data.gov.il, building on the Phase 2C-1 schema. Backend/data-layer only — no matching UI, no link from `ManagedSavingsHolding` to `PublicFund`, no change to the mock/fallback public performance display, no admin UI beyond the CLI trigger, no scheduled sync.

Completed:
- **Data.gov.il `datastore_search` client** (`src/lib/public-data/data-gov-client.ts`): calls `https://data.gov.il/api/3/action/datastore_search` only — `datastore_search_sql` is never used. Supports `resource_id`, `limit`, `offset`, optional `filters`, optional `q`. Treats an HTTP 200 response carrying `{ success: false }` as an error (`DataGovApiError`). Uses an `AbortController` timeout (default 20s). Sequential, low-concurrency pagination via `paginateDatastoreSearch` (default page size 5,000) — no parallel page fetches.
- **Typed raw record handling** (`src/lib/public-funds/types.ts`): `RawGemelNetRecord`/`RawPensionNetRecord`/`RawPublicFundRecord` types covering all spec fields as optional, since fields may be missing depending on source/period.
- **Normalization layer** (`src/lib/public-funds/normalize-public-fund-record.ts`, `src/lib/public-funds/parsing.ts`): single shared `normalizePublicFundRecord` function for both GemelNet and PensionNet, branching only where field names differ (`PARENT_COMPANY_*` for PensionNet; `TARGET_POPULATION`/`SPECIALIZATION`/`SUB_SPECIALIZATION` for GemelNet). Safe parsing helpers (`parseNumeric`, `parseString`, `parseReportPeriod` for `YYYYMM`, `parseSourceDateTime` for `YYYY-MM-DD HH:MM:SS`) never throw. Rows missing required core fields (`FUND_ID`, `FUND_NAME`, `MANAGING_CORPORATION`, `REPORT_PERIOD`, `MONTHLY_YIELD`, `YEAR_TO_DATE_YIELD`) are skipped and counted, not thrown. `productType` is never set by normalization — stays null/unknown by design.
- **`PublicFund`/`FundReturn` upsert behavior** (`src/lib/public-funds/sync-public-funds.ts`): `PublicFund` upserted via `@@unique([source, fundId])`; `FundReturn` upserted via `@@unique([publicFundId, reportPeriod])`. Counts (`insertedCount`/`updatedCount`/`skippedCount`/`errorCount`) tracked at `FundReturn` granularity (one source row = one `FundReturn`), using an existence check before each upsert to classify insert vs. update.
- **`PublicDataSyncRun` lifecycle tracking:** a sync run row is created with `status=running` before fetching, then updated to `success` (with final counts) or `failed` (with `errorMessage`) once the resource's sync completes or a fatal error occurs. Row-level DB errors are caught per row and counted without aborting the whole sync; only a fatal pipeline error (e.g., CKAN unreachable) aborts a resource's sync.
- **Manual CLI trigger:** `npm run sync:public-funds:local` (`scripts/sync-public-funds.ts`). Defaults to syncing `isCurrent=true` resources only (current GemelNet + current PensionNet) — resource config is read from the `PublicDataResource` table, not hardcoded. Optional `--source=gemelnet|pensionnet` / `--resourceId=<id>` flags. Prints a concise per-resource summary (source, label, resource ID, status, counts, duration, `syncRunId`) — no raw rows logged. `PublicDataResource.lastSyncedAt` updates only on successful sync.
- **Current-resource default:** historical 1999–2022 and yearly-archive resources are not synced by default in this phase.

Live Local Sync Verification (2026-06-30):
- `PublicDataResource` count: 6
- `PublicFund` count: 1,106 (gemelnet=799 / pensionnet=307)
- `FundReturn` count: 26,820 (gemelnet=19016 / pensionnet=7804)
- `PublicDataSyncRun` count: 2 success rows
- GemelNet: inserted=19016, updated=0, skipped=1803, errors=0
- PensionNet: inserted=7804, updated=0, skipped=328, errors=0
- Skipped rows verified as legitimate (e.g., guaranteed-return tracks reporting `null` yield for that period), not a parsing defect.
- `lastSyncedAt` set only on the two current resources synced; both historical resources remain untouched.

Out of Scope (Not Implemented in Phase 2C-2):
- `ManagedSavingsHolding` changes — no holdings modified, no FK/link added, `officialFundId` unchanged.
- Any UI changes — no matching UI, no admin sync UI, no public performance display changes (still mock/fallback).
- Matching/linking `PublicFund` to `ManagedSavingsHolding` (Phase 2C-3).
- Scheduled sync (Vercel Cron).
- Historical (1999–2022) resource backfill.

Automated Checks:
- `npm run db:validate` — passed
- `npm run db:generate` — passed
- `npm run lint` — passed (0 errors)
- `npx tsc --noEmit` — passed (no type errors)
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only)
- `npm run db:migrate:local` — passed (no pending migrations, schema unchanged)
- `npm run db:seed:local` — passed (idempotent)
- `npm run sync:public-funds:local` — passed, live sync verified against Data.gov.il (see counts above)

Known Deferred Items:
- Matching UI not implemented.
- Public performance display still fallback/mock.
- `ManagedSavingsHolding` relation to `PublicFund` not added.
- Scheduled sync not implemented.
- Historical backfill not default.
- Product type inference unresolved (kept nullable/`unknown` by design).
- AUM units not display-approved yet.
- `ACTUARIAL_ADJUSTMENT` (PensionNet) observed in live data but not mapped — no corresponding schema column.
- No automated tests added — no Vitest/test infrastructure exists yet in the repo. Normalization/parsing functions are pure and isolated, ready to test once Vitest is introduced.
- Custom horizon projection edge case remains deferred (pre-existing, unrelated to this phase).

Branch History:
- Feature branch: `feature/public-fund-sync`
- Merged into: `master`
- Commit: `feat: add manual public fund sync`

## Phase 2C-3A — Public Fund Matching Search Backend

Status: **Completed and Verified** (2026-06-30)

This phase implemented a safe, local-DB-only search and candidate ranking layer over the `PublicFund`/`FundReturn` records synced in Phase 2C-2, as the backend foundation for a future matching/linking UI. Backend/data-layer only — no matching UI, no FK from `ManagedSavingsHolding` to `PublicFund`, no replacement of the mock/fallback public performance display, no calls to Data.gov.il, no schema/migration changes.

Completed:
- **Typed search input/output** (`src/lib/public-funds/search-types.ts`): `PublicFundSearchInput` (`query`, `source`, `productType`, `managingCompany`, `fundId`, `limit`) and `PublicFundMatchCandidate` (fund identity/classification fields, latest return metrics, `matchScore`, `matchReasonLabels`). `MatchReasonLabel` is an internal string-identifier enum, not user-facing text.
- **Hebrew-aware matching normalization** (`src/lib/public-funds/matching-normalization.ts`): `normalizeForMatching`, `tokenizeForMatching`, `isNormalizedEqual`, `normalizedContains`, `trimAndCollapseWhitespace`. Trims, collapses whitespace, strips geresh/gershayim and quote variants and punctuation noise, lowercases Latin characters. Comparison-only — never mutates stored or displayed values.
- **Exact fundId matching**: an exact `PublicFund.fundId` lookup (optionally scoped by `source`) always runs when `fundId` is supplied, independent of `query`, and scores highest (`exact_fund_id` reason, weight 1000).
- **Local DB query strategy** (`src/lib/public-funds/search-public-funds.ts`): Prisma-only, case-insensitive `contains` query across `fundName`/`managingCompany`/`controllingCorporation`/`parentCompanyName`, capped at 200 candidate rows (`MAX_CANDIDATE_POOL`) before in-memory scoring — avoids loading the full `PublicFund` table for broad queries. `productType` filter only applied when explicitly supplied (most rows are null). Returns `[]` immediately, without any DB scan, when both `query` and `fundId` are empty.
- **Deterministic candidate scoring** (`src/lib/public-funds/matching.ts`): `scorePublicFundCandidate`, a pure function combining exact fundId, exact/contains fund name, query/fund-name token overlap, managing company, controlling corporation, parent company, source, product type, and a small recent-return-data tie-breaker. Ranking: `matchScore` desc → `latestReportPeriod` desc → `fundName` asc.
- **Latest `FundReturn` enrichment**: each candidate is enriched with the latest `FundReturn` row (`reportPeriod desc`) — `latestReportPeriod`, `latestMonthlyReturn`, `latestYtdReturn`, `latestAnnualized3YrReturn`, `latestAnnualized5YrReturn`. AUM fields are intentionally excluded (not display-approved).
- **Zod-validated server action** (`src/lib/actions/public-fund-matching-actions.ts`, `src/lib/validation/public-fund-matching.ts`): `searchPublicFundsForMatchingAction` validates input with `PublicFundSearchSchema` and returns `{ ok: true, candidates }` or `{ ok: false, error: "validation" | "server_error" }`. Not yet wired to any client/UI.
- **Optional CLI smoke test**: `npm run search:public-funds:local` (`scripts/search-public-funds.ts`). Prints concise rows only (score, source, fundId, managingCompany, fundName, latestReportPeriod) — no raw DB records.

Local Search Verification (2026-06-30, against Phase 2C-2 synced data: `PublicFund`=1,106 / `FundReturn`=26,820):
- Exact `fundId` search (`--fundId=101 --source=gemelnet`): 1 candidate, top score, correct fund.
- Hebrew query search (`--query="הראל"`): 10 ranked candidates, correctly matched.
- `source=gemelnet` filter (`--query="מגדל" --source=gemelnet`): 10 gemelnet-only candidates.
- `source=pensionnet` filter (`--query="כלל" --source=pensionnet --limit=5`): 5 pensionnet-only candidates, custom limit respected.
- Empty/no-query edge case: 0 candidates, no broad DB scan triggered.
- No Data.gov.il calls made — confirmed by code inspection.

Out of Scope (Not Implemented in Phase 2C-3A):
- Matching/confirmation UI (no modal, no page changes) — planned for Phase 2C-3B.
- Confirm link / unlink actions.
- FK or relation from `ManagedSavingsHolding` to `PublicFund`.
- Replacing the mock/fallback public performance display on the Managed Savings page (Phase 2C-4).
- Reliable `productType` inference.
- AUM display.
- Any Data.gov.il calls.
- Prisma schema/migration changes.

Automated Checks:
- `npm run db:validate` — passed
- `npm run db:generate` — passed
- `npm run lint` — passed (0 errors)
- `npx tsc --noEmit` — passed (no type errors)
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only)

Known Deferred Items:
- Matching UI not implemented.
- Confirm link/unlink not implemented.
- `ManagedSavingsHolding` relation to `PublicFund` not added.
- Public performance display still fallback/mock.
- Product type inference remains unresolved.
- AUM still not displayed.
- Historical backfill not default.
- Scheduled sync not implemented.
- Custom horizon projection edge case remains deferred (pre-existing, unrelated to this phase).

Branch History:
- Feature branch: `feature/public-fund-matching-search`
- Merged into: `master`
- Commit: `feat: add public fund matching search`

## Phase 2C-3B — Public Fund Matching UI + Confirm Link / Unlink

Status: **Completed and Verified** (2026-07-02)

This phase added the user-confirmed link between `ManagedSavingsHolding` and `PublicFund`, the link/change/unlink management surface in `EditManagedFundModal`, a read-only public fund returns summary in `ExpandedManagedSavingsRow`, linked 5Y return as a projection assumption, and a full visual redesign of the Add/Edit modals with scrollbar polish.

Completed:
- **Prisma schema change:** `ManagedSavingsHolding.publicFundId String?` — nullable FK to `PublicFund`, `onDelete: SetNull`, indexed. `PublicFund.managedSavingsHoldings` reverse relation added. `officialFundId` unchanged and unrelated.
- **Migration:** `prisma/migrations/20260630142325_add_public_fund_linking_to_managed_savings/` — adds the FK column, index, and foreign key constraint.
- **Server actions** (`src/lib/actions/public-fund-linking-actions.ts`): `linkManagedSavingsHoldingToPublicFund` and `unlinkManagedSavingsHoldingFromPublicFund`. Zod-validated (`z.string().min(1)`, not `cuid()` — seeded IDs like "hist-001" fail cuid regex; ownership check is the security gate), ownership-checked, reject archived holdings, verify `PublicFund` exists, update `publicFundId` only.
- **Data layer additions:** `LinkedPublicFund` type extended with return metrics (`latestMonthlyReturn`, `latestYtdReturn`, `latestAnnualized3YrReturn`, `latestAnnualized5YrReturn`). `getEffectiveAnnualReturn(investment)` helper: returns linked fund `latestAnnualized5YrReturn` when non-null, else `investment.trackPerformance.last5Years`. `projectSimulations` uses `getEffectiveAnnualReturn` — projections now reflect live public data when a fund is linked. Batch `getLatestReportPeriodsByPublicFundIds` prevents N+1 queries.
- **`PublicFundMatchModal`** (`src/components/managed-savings/PublicFundMatchModal.tsx`): local-DB-only search via Phase 2C-3A `searchPublicFundsForMatchingAction`, explicit confirm button required to link — no auto-linking. Z-index `z-[70]` renders above the Edit modal's `z-50`.
- **`EditManagedFundModal` as single management surface:** link/change/unlink controls live here. Linked state: source badge + change/unlink buttons + labelled metadata inset (`Fund name: X | Managing company: Y | Fund number: Z | Last fund update: W`). Unlinked state: "Link to public fund data" button.
- **`ExpandedManagedSavingsRow` as read-only summary:** unified green card when linked (KPI return metric cells + divider + labelled metadata row with visible `label: value` pairs + disclaimer); compact amber warning only when unlinked.
- **Add/Edit modal visual redesign:** `bg-slate-50` outer container, `bg-white border-b border-slate-200` header, `rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden` section cards, `bg-slate-100/70 border-b border-slate-200` header bands, `rounded-full bg-white border border-slate-200` icon circles, `h-11 border-slate-300 bg-white` inputs, `font-bold text-slate-700 uppercase tracking-wide` labels, `bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)]` sticky footer.
- **Scrollbar polish:** `modal-scrollbar` `@utility` in `globals.css` — 6px WebKit scrollbar with `slate-300/400` thumb, rounded, `scrollbar-width: thin` Firefox support. Applied to both modals' scroll container.
- **i18n:** `managedSavings.publicFundLinking` namespace (and nested `sourceLabels`, `linkedSummary`, `modal`, `linkedPerformance`) in both `he.json` and `en.json`. `linkedSummary.fundId` = "Fund number" / "מספר קרן"; `linkedSummary.latestReportPeriod` = "Last fund update" / "עדכון אחרון". No hardcoded UI text.

Product Owner browser QA:
- Link/unlink working correctly.
- Regular edit (add/update holding) working correctly.
- Linked 5Y return displayed in table column and projection assumptions updated.
- Compact unlinked warning shown correctly in expanded row.
- Linked public fund metadata displayed in one labelled horizontal row.
- Add/Edit modal visual redesign accepted.
- Modal scrollbar polish accepted.

Automated checks (final):
- `npm run db:validate` — passed.
- `npm run db:generate` — passed.
- `npm run db:migrate:local` — passed (already in sync).
- `npm run db:seed:local` — passed (idempotent).
- `npm run lint` — passed, 0 errors/warnings.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed.

Product boundary confirmed:
- Public returns are fund-level only — not personal realized returns.
- Linked `latestAnnualized5YrReturn` is a projection assumption only, not a claimed personal return.
- AUM not displayed anywhere in the UI.
- No financial advice wording added.
- No Data.gov.il calls in this phase (matching UI uses local DB via Phase 2C-3A backend).
- No Phase 2C-4 implementation (public performance display replacement not started).

Known Deferred Items (carried forward):
- Phase 2C-4: full public performance display replacement / richer analytics not implemented.
- Scheduled sync not implemented.
- Admin sync UI not implemented.
- Historical resource backfill not default.
- Product type inference unresolved (stays nullable/unknown).
- AUM not displayed (units not approved).
- Auth.js/multi-user support future scope.
- Custom horizon projection edge case (years 2–4, 6–9, 11–14 return 0 in the Phase 2A model) remains deferred.

Branch History:
- Feature branch: `feature/public-fund-linking-ui`
- Merged into: `master`
- Commit: `feat: link managed savings to public funds`

## Phase 2C-4A — Fund Return Query Hardening + Documentation Correction

Status: **COMPLETED AND VERIFIED** (2026-07-06). Product Owner browser QA approved. Committed and merged into `master`.

This phase followed a Phase 2C-4A Planning + Query Audit (audit-only, no code changes) that found the linked-holding public performance display was already fully delivered in Phase 2C-3B (real DB-backed KPIs, not mock/fallback), and that the underlying "latest FundReturn per fund" lookup used an unbounded fetch-all-then-reduce-in-JS pattern that would not scale if historical backfill or many more linked holdings were added later.

Completed:
- **`getLatestFundReturnSummaries`** (`src/lib/public-funds/latest-fund-returns.ts`): replaced the `findMany({ orderBy: reportPeriod desc })` + JS-reduce pattern with a single parameterized raw SQL query using PostgreSQL `DISTINCT ON ("publicFundId") ... ORDER BY "publicFundId", "reportPeriod" DESC`, built via `Prisma.sql` (no string interpolation) and executed with `prisma.$queryRaw`. Returns exactly one row per requested fund id regardless of history depth. Empty input short-circuits to an empty `Map`. Output shape and Decimal-to-number conversion behavior unchanged.
- **`searchPublicFundsForMatching`** (`src/lib/public-funds/search-public-funds.ts`): candidate-enrichment step now reuses the hardened `getLatestFundReturnSummaries` instead of its own separate fetch-all-then-reduce query. Removed the now-unused `toDecimalNumber` helper. `PublicFundMatchCandidate` output shape unchanged.
- **No schema/migration changes** — the existing `@@unique([publicFundId, reportPeriod])` composite index already serves the `DISTINCT ON` query.
- **Documentation correction** — `Context/current-feature.md`, `Context/data-model.md`, `Context/Features/pension-gemel-sync-feature-spec.md`, and `Context/Algorithms/pension-return-calculation.md` updated to remove the stale claim that the linked public performance display is still mock/fallback; clarified it was delivered in Phase 2C-3B and that only the calculation fallback for unlinked holdings remains mock-driven.

**Follow-up QA fix (same branch, before merge):** Product Owner browser QA on `PublicFundMatchModal` found two issues, fixed on the same branch:
1. **Header/scroll overlap** — the modal header used a translucent gradient background (`bg-gradient-to-r from-asset/15 via-asset/10 to-transparent`), letting scrolled result rows show through it. Replaced with a fully opaque `bg-white border-b border-border/60 shadow-sm`, raised to `z-20`. No change to header height, title, subtitle, or close button.
2. **PensionNet exposed in a non-pension modal** — the modal previously offered a "All / GemelNet / PensionNet" source dropdown. Since Managed Savings covers only non-pension products (Keren Hishtalmut, Kupat Gemel, Gemel LeHashkaa, Savings Policy) and GemelNet/PensionNet are data sources rather than product types, this incorrectly allowed selecting a pension-specific source from a non-pension page. The dropdown was removed; the modal now always searches `source: "gemelnet"` internally via a `MANAGED_SAVINGS_SOURCE` constant. New helper copy (`modal.gemelnetOnlyNote` in `he.json`/`en.json`) clarifies the search covers the public GemelNet dataset and may include Keren Hishtalmut/Kupat Gemel/Gemel LeHashkaa where available — no claim that all product types are guaranteed present, and no product-type filter was added (`PublicFund.productType` inference remains unresolved/nullable). The now-unused `modal.sourceAll` i18n key was removed from both message files. **The backend (`searchPublicFundsForMatching`, `searchPublicFundsForMatchingAction`, `PublicFundSearchSchema`) still fully supports `source: "pensionnet"`** for any other future screen — only this modal's UI was restricted to GemelNet.

Verified via a headless-browser (Playwright, ad hoc — not a project dependency) run against both `/managed-savings` (Hebrew RTL) and `/en/managed-savings` (English LTR): zero `<select>` elements in the modal, all candidate badges show GemelNet only (11 GemelNet / 0 PensionNet badges observed), scrolled screenshots confirm no header overlap in either locale, zero console errors, linked KPI card and unlinked amber warning both render unchanged, "Link this fund" confirm button present and enabled.

Read-only local DB verification performed:
- `getLatestFundReturnSummaries` for the 2 currently linked holdings returned exactly 1 row per fund, matching a manual `findFirst` cross-check.
- Empty fund-id array returned an empty map with no query executed.
- `searchPublicFundsForMatching` search still returned candidates enriched with latest return metrics; no `assetsUnderManagement` key present on any candidate.

Automated checks (final, before merge):
- `npm run db:validate` — passed.
- `npm run db:generate` — passed.
- `npx tsc --noEmit` — passed.
- `npm run lint` — passed, 0 errors/warnings.
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only).

Product Owner browser QA (final approval):
- Linked KPI card still works and looks unchanged.
- Unlinked warning still works.
- `PublicFundMatchModal` no longer has scroll/header overlap.
- `PublicFundMatchModal` no longer exposes a PensionNet selector; Managed Savings matching is GemelNet-only.
- Search still works.
- No visual or locale regression observed.

Product boundary confirmed:
- No AUM serialized or displayed.
- Linked `latestAnnualized5YrReturn` remains a projection assumption only, never a personal return.
- No advisory wording added.
- No Data.gov.il calls, no new sync logic.
- PensionNet backend/schema support was not removed globally.

Known Deferred Items (carried forward):
- No chart or monthly history table (Option A KPI-only display remains the approved MVP).
- No AUM display.
- No `avgAnnualManagementFee`/`avgDepositFee` UI.
- No personal realized return calculation.
- No product type inference.
- Scheduled sync, admin sync UI, historical resource backfill still future scope.
- Auth.js/multi-user support still future scope.
- Custom horizon projection edge case (years 2–4, 6–9, 11–14 return 0 in the Phase 2A model) remains deferred.

Branch History:
- Feature branch: `feature/fund-return-query-hardening`
- Merged into: `master`
- Commit: `perf: harden public fund return lookups`

## Phase 2D-1 — Managed Savings Summary + Ordering

Status: **COMPLETED AND VERIFIED** (2026-07-09). Product Owner browser QA approved after several fix rounds. Committed and merged into `master`.

Completed:
- **Ordering**: `ManagedSavingsHolding.displayOrder Int @default(0)` (migration `20260706125519_add_managed_savings_display_order`, backfilled to preserve existing order). Drag-and-drop reordering (`@dnd-kit`) with an up/down-button fallback for mobile/accessibility, persisted via a new `reorderManagedSavingsHoldings` server action, with a save-status toast.
- **Summary layer**: `src/lib/managed-savings/summary.ts` computes linked/unlinked counts, linked balance coverage, a balance-weighted linked 5Y return assumption, and a per-type breakdown. Top KPI cards (current/1Y/5Y/10Y savings value) and a breakdown-by-type section added to the page.
- **"Other" holding type**: `ManagedSavingsType.other` added via an additive migration (`20260709125444_add_managed_savings_type_other`), wired through validation, UI, and breakdown for private investments/bank accounts not covered by the four original types.
- **Seed safety**: `prisma/seed.ts`'s `ManagedSavingsHolding` seeding changed from destructive upsert to create-if-missing only — re-running `db:seed:local` never resets an existing holding's status, balance, order, or link.
- **Projection behavior (final)**: the 5-Year Return display column shows the real linked public fund return (`getDisplayAnnualReturn`) or "—" when no link exists — never a mock percentage. Currency-valued projections (1Y/5Y/10Y/custom-horizon, top KPI cards, table totals, legacy summary table) use `getProjectionAnnualReturn`/`projectWithAvailableReturnOrZero`: linked holdings project with their real return; holdings without one project with an explicit 0% assumption (current balance + contributions, no growth, no fee) — always a real amount, never hidden and never mock-derived.
- **Public fund linking**: available from both Add and Edit flows (`PublicFundMatchModal`, GemelNet-only, no PensionNet selector in this modal).
- **Other UI fixes along the way**: unlinked-state styling changed to red/error (from amber), linked/unlinked table badges, linked-company display cleanup, search result completeness fix (raised modal result limit so ties don't hide valid candidates), reorder toast visibility fix, `displayOrder` collision cleanup from earlier seed damage.

Known Deferred Items (carried forward):
- Groups/sections (e.g. "My investments" / "Spouse investments") — recommended as a future Phase 2D-2 planning task, not implemented.
- Peer comparison, fund classifier, beta/volatility metrics — not implemented.
- No AUM display; no Data.gov.il live sync introduced by this phase.
- Table horizontal scroll partially minimized but not fully eliminated at common viewport widths.
- Earlier seed-damage-overwritten row values are not recoverable without backup/manual correction.

Branch History:
- Feature branch: `feature/managed-savings-summary-ordering`
- Merged into: `master`
- Commit: `feat: enhance managed savings ordering and projections`

## Phase 2D-2A — Managed Savings Groups Foundation

Status: **COMPLETED AND VERIFIED** (2026-07-12). Product Owner browser QA approved after one fix round. Committed and merged into `master`.

This phase introduced user-defined groups for the Managed Savings page, built following the Phase 2D-2 planning/audit report. It is the first of three planned sub-phases (2D-2A foundation, 2D-2B move-between-groups + delete-with-transfer, 2D-2C cross-group drag-and-drop) — only 2D-2A scope was implemented.

Completed:
- **Schema**: new `ManagedSavingsGroup` model (`id`, `userId`, `name` unique per user via `@@unique([userId, name])`, `displayOrder`, timestamps). `ManagedSavingsHolding` gained a required `groupId` (FK to `ManagedSavingsGroup`, `onDelete: Restrict` — a group can never be deleted while holdings still reference it) and a required `ownershipLabel` (free-text String, trimmed, max 80 chars, replacing the fixed ownership selector). The legacy `owner` column and `OwnerLabel` enum were intentionally **not** dropped — kept in the schema for rollback safety; the live app no longer reads or writes them.
- **Migration** (`prisma/migrations/20260712090000_add_managed_savings_groups/`): creates `ManagedSavingsGroup`, backfills one deterministic default group per user (id `default-group-${userId}`, name "כל החסכונות"/"All Holdings"), assigns **every** existing holding — active, inactive, and archived — to it without touching `displayOrder` (visible order preserved exactly), and backfills `ownershipLabel` from the legacy `owner` enum values. Verified locally: all 24 holdings in the dev DB (7 canonical seed + 17 from prior QA sessions, including archived rows) ended up with a valid `groupId`/`ownershipLabel`, all correctly bucketed into the single default group.
- **Seed safety**: `prisma/seed.ts` gained a create-if-missing default-group step using the same deterministic id as the migration — never upserts, matching the Phase 2D-1 seed-safety precedent for `ManagedSavingsHolding`. Verified non-destructive: re-running seed against an already-migrated DB reported the group as "already exists — left untouched" and all 8 canonical holdings as skipped.
- **Server actions**: new `src/lib/actions/managed-savings-group-actions.ts` — `createManagedSavingsGroup`, `renameManagedSavingsGroup` (both reject duplicate names with a closed `duplicate_name` error), `reorderManagedSavingsGroups`, `deleteEmptyManagedSavingsGroup` (rejects with `group_not_empty` if the group has any holdings of any status — deleting a non-empty group with a transfer flow is Phase 2D-2B, not implemented here). `createManagedSavingsHolding`/`updateManagedSavingsHolding` now require and ownership-check `groupId`; changing a holding's group on update appends it to the end of the target group.
- **UI**: the Managed Savings page renders grouped sections (`ManagedSavingsGroups` → `ManagedSavingsGroupSection` → `ManagedSavingsGroupHeader`/`ManagedSavingsGroupTable`/`ManagedSavingsGroupSummaryRow`) instead of one flat table. The former `ManagedSavingsTable` component was removed; its row-rendering logic now lives in `ManagedSavingsGroupTable`, scoped per group with its own `@dnd-kit` drag-and-drop context (same-group reorder and up/down accessibility fallback both preserved, working per group — cross-group drag-and-drop is Phase 2D-2C). Empty groups remain visible with an empty state and a group-preselected "Add holding" action. `CreateManagedSavingsGroupModal`/`RenameManagedSavingsGroupModal`/`DeleteManagedSavingsGroupModal` added. Add/Edit modals gained a required group `<select>` and a free-text ownership `<input>` (replacing the old fixed ownership `<select>` and its orphaned `ownerLabels.*`/`modal.ownership` translation keys, which were removed).
- **Calculation**: `src/lib/managed-savings/summary.ts` gained `calculateProjectionTotals` — the single shared aggregation helper (built on the existing `projectWithAvailableReturnOrZero`) used by each group's summary row; global KPI cards and table-level totals continue to use the pre-existing `calculateTotalSummary`/`calculateManagedSavingsSummary` over the full flattened holdings list, so group and global totals are computed from the same per-holding source of truth and never diverge. The 0%-return assumption for holdings without a usable linked return is unchanged.
- **QA fix round (same day, same branch)** — four Product Owner findings fixed before approval:
  1. **Required-field indicators and validation**: Add/Edit holding modals and Create/Rename group modals now show a red `*` next to every required label plus a "fields marked with * are required" helper line. Submit is no longer blocked purely by a disabled button — clicking Save/Add/Create with a missing required field now shows inline field-level and form-level validation messages (new `managedSavings.validation.*` i18n keys) and blocks the server call, instead of silently doing nothing.
  2. **Group reorder save feedback**: verified already correctly wired to the same fixed toast used by holding reorder; no separate bug found (the "missing toast" perception was a symptom of issue 3 below).
  3. **Stale state requiring two browser refreshes (root cause found and fixed)**: every Managed Savings server action called `revalidateTag(MANAGED_SAVINGS_CACHE_TAG, {})`. Reading Next.js 16.2.9's own shipped source showed this only performs an immediate cache purge when the second argument is falsy or `{ expire: 0 }` — an empty object `{}` satisfies neither, so it silently fell back to a stale-while-revalidate-style update instead. Fixed by switching all 10 call sites (across `managed-savings-actions.ts`, `managed-savings-group-actions.ts`, and `public-fund-linking-actions.ts`) to `updateTag(MANAGED_SAVINGS_CACHE_TAG)` — the Next.js API documented specifically for immediate, read-your-own-writes cache invalidation from a Server Action. `router.refresh()` was also added to the group create/rename/reorder/delete and holding-reorder client handlers as defense-in-depth.
  4. **Confusing top-level "Add Fund" button**: removed from the page entirely — every holding must belong to a group, so adding is now always initiated from inside a specific group ("Add holding to group"). "New Group" is unchanged. The orphaned `addFundButton` translation key was removed from both locales.

Out of Scope (Not Implemented in Phase 2D-2A):
- Cross-group drag-and-drop (Phase 2D-2C).
- Delete-with-transfer for non-empty groups (Phase 2D-2B).
- A dedicated "Move to group" quick action outside the Edit modal (Phase 2D-2B).
- Dropping the legacy `owner` column or `OwnerLabel` enum.
- Group colors, icons, or charts.
- Family-member profiles, household accounts, invitations, or permissions.
- Auth.js or multi-user isolation.
- Any change to public fund sync, Data.gov.il, or projection formulas beyond the cache-invalidation fix.

Automated Checks (final):
- `npm run db:validate` — passed.
- `npm run db:generate` — passed.
- `npm run db:migrate:local` — passed (migration applied cleanly, no schema drift).
- `npm run db:seed:local` — passed (non-destructive, verified).
- `npm run lint` — passed, 0 errors/warnings.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only).

Product Owner browser QA (final approval):
- Add/Edit modal required-field markers and validation messages verified.
- Create/Rename group modal validation verified.
- Group reorder: success toast appears, order correct after one refresh.
- Holding row reorder within a group: success toast appears, order correct after one refresh.
- Group rename: new name correct after one refresh.
- Top-level Add Fund button confirmed removed; group-level "Add holding to group" confirmed still working.
- English route (`/en/managed-savings`) verified — required markers/messages render correctly, no layout regression.

Product boundary confirmed:
- Groups are fully user-defined — never derived from product type, ownership, managing company, or GemelNet classification.
- Ownership free text is stored and displayed verbatim, never translated.
- No AUM display, no advisory wording, no Data.gov.il calls introduced by this phase.

Known Deferred Items (carried forward):
- Phase 2D-2B (move-between-groups without drag-and-drop, delete-with-transfer for non-empty groups) and Phase 2D-2C (cross-group drag-and-drop) — not started, no scope defined yet.
- Legacy `owner`/`OwnerLabel` column/enum remain in the schema, unused by the live app — dropping them is a future follow-up once the free-text field has been in production use.
- Default group name ("כל החסכונות") is not locale-translated on `/en/*` routes — free-text group names are user data, never translated by design; this is expected but worth noting for future UX polish.
- No automated tests added — consistent with the rest of the repo, which has no Vitest/Playwright infrastructure yet.

Branch History:
- Feature branch: `feature/managed-savings-groups-foundation`
- Merged into: `master`
- Commit: `feat: add managed savings groups foundation`

## Phase 2E-1 — Similar Tracks Comparison Core

Status: **COMPLETED AND VERIFIED** (2026-07-13). Product Owner browser QA approved after two focused fix rounds. Committed and merged into `master`.

This phase added the first real fund/track comparison feature to the Managed Savings page, built following a dedicated Phase 2E audit/planning report. It compares a linked holding's GemelNet fund against similar tracks using data already stored as of Phase 2C-1 — no schema changes, no new Prisma migrations, no Sharpe/Alpha/AUM/exposure/asset-composition data (explicitly out of scope, deferred to a future data-enrichment phase).

Completed:
- **Peer comparison backend** (`src/lib/public-funds/peer-comparison.ts`, new): `getPeerComparisonForPublicFund(publicFundId)` groups GemelNet funds by `fundClassification` + `subSpecialization` (strict match; falls back to `fundClassification`-only when the strict group has fewer than 5 funds; returns a safe `not_enough_peers` result when even the relaxed group has fewer than 3). Also returns `missing_classification` and `unsupported_source` (PensionNet-linked funds are out of scope for this comparison) as safe no-comparison states. Comparison is always computed at the target fund's own latest `FundReturn.reportPeriod`; peers without a return row for that exact period are excluded — no cross-period comparisons.
- **Relevance filtering by target population**: after classification matching, peers are further filtered by `PublicFund.targetPopulation` relevance — a generic/public target fund (local data pattern: "כלל האוכלוסיה") is compared only against other generic/public peers; a sector/employer-specific target fund is compared only against peers sharing that exact population value. This was added in a QA fix round after the Product Owner found the initial peer lists too broad/irrelevant.
- **Return/fee metrics**: last-month and 3-/5-year returns read directly from `FundReturn`; a true rolling 12-month return is computed by compounding (not summing) the last 12 monthly `FundReturn.monthlyReturn` rows via a batched SQL window-function query. Management fee falls back to the latest available 2025 value when the selected period has none. Default ranking is 5-year return descending. Display is capped to the top 10 relevant peers, with the user's own linked fund always shown (appended with its true rank) even if it falls outside that range.
- **UI** (`src/components/managed-savings/SimilarTracksComparison.tsx`, new): renders inside the linked holding's expanded row, below the existing linked-fund performance card, for linked GemelNet holdings only — unlinked holdings and PensionNet-linked/unclassified funds show a compact neutral empty state instead of a table, never fake data. Includes a peer-group header (classification/population label, peer count, report period, strict/relaxed confidence badge), summary cards (5-year and 12-month return **gaps** vs. peer average — explicitly labelled "gap" and signed with +/- to avoid being misread as a raw return, plus the user's own annual fee with a neutral above/below/same-as-average subtext), and a comparison table (rank, fund name, last month/12-month/3-year/5-year return, avg. management fee) with the user's row visually prominent (stronger tint, border, badge) and a peer-average row. The single highest return value and lowest fee value per column are subtly highlighted.
- **Data layer**: `src/lib/data/managed-savings.ts` computes the peer comparison once per distinct linked `PublicFund` (not per holding) during the existing cached holdings fetch, attaching it as an optional `similarTracksComparison` field on the serialized investment.
- **i18n**: new `managedSavings.similarTracks.*` namespace in both `he.json`/`en.json` — all comparison copy, confidence/match labels, empty-state reasons, and neutral wording ("above/below/same as peer average", "informational only") sourced from translation files; no hardcoded UI text.

Out of Scope (Not Implemented in Phase 2E-1):
- Sharpe, Alpha, standard deviation — observed in the live GemelNet source but not persisted; would require a schema migration.
- AUM display — units remain unverified/not display-approved.
- Equity/foreign/FX exposure and asset-composition breakdowns — not available in the current GemelNet resource in a usable form.
- Any Prisma schema changes or migrations.
- Data.gov.il live calls (comparison is local-DB-only).
- Managed Savings group-management work (Phase 2D-2B/2D-2C remain separately deferred, unrelated to this phase).

Automated Checks (final):
- `npm run lint` — passed, 0 errors/warnings.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only).
- `npm run db:validate` — passed, schema unchanged.

Product Owner browser QA (final approval, after two fix rounds):
- Table relevance, top-10 cap, and the user-fund-outside-top-10 edge case verified.
- Managing company/my-fee/fee-gap columns removed from the table; fee moved to a summary card.
- User's own fund row confirmed clearly distinct in its true ranked position.
- Best-value highlighting confirmed subtle, not noisy.
- 5-year/12-month summary cards confirmed to read clearly as gaps vs. peer average, with correct +/- signs and neutral subtext.
- Hebrew (`/managed-savings`) and English (`/en/managed-savings`) both verified, zero console errors.
- Unlinked holdings confirmed to show no comparison table.

Product boundary confirmed:
- Comparison is local-DB-only — no personal data sent to Data.gov.il or any external service.
- Wording is informational only ("above/below/same as peer average", "informational only") — no "recommended", "best", "you should switch/move", or "guaranteed" language anywhere.
- Public fund returns are never presented as the user's personal return.
- No AUM, Sharpe, Alpha, or exposure data displayed.

Known Deferred Items (carried forward):
- A future data-enrichment phase (Sharpe/Alpha/AUM/exposure investigation) was explicitly separated from this phase by the Product Lead and is not started.
- Fund/track profile cards and asset-composition visualization (from the original Phase 2E audit's later-phase recommendations) are not implemented.
- Managed Savings group-management work (Phase 2D-2B move-between-groups + delete-with-transfer, Phase 2D-2C cross-group drag-and-drop) remains not started, unrelated to this phase.
- Auth.js/multi-user isolation remains future scope.

Branch History:
- Feature branch: `feature/similar-tracks-comparison`
- Merged into: `master`
- Commit: `feat: add similar tracks comparison`

## Phase 2F-1 — Projection Engine Refactor

Status: **COMPLETED AND VERIFIED** (2026-07-14). Product Owner browser QA approved. Committed and merged into `master` from `feature/projection-engine-refactor`.

This phase was a behavior-preserving refactor: it extracted the existing Managed Savings projection formula into a reusable, pure, scalar-input projection engine, in preparation for the future Fund Replacement Simulator (Phase 2F-2+). No product behavior, UI, schema, database, or i18n changed.

Completed:
- **New pure scalar engine** (`src/lib/financial/projection.ts`, new file): `projectCompoundingWithFee(input)` (fee-adjusted monthly-compounding projection, including the pre-existing zero-effective-rate guard — when the annual return exactly offsets the fee, the formula falls back to a linear sum instead of dividing by zero) and `projectLinearWithoutFee(input)` (the approved 0%-return fallback: `currentBalance + monthlyContribution × months`, no fee, no growth). Both take/return plain scalar types only — no React, i18n, Prisma, `ManagedSavingsInvestment`, or any other domain type. No comparison function, candidate-fund selection, or simulator UI was added — explicitly out of scope for this phase.
- **Domain adapter layer unchanged in shape**: `src/lib/mock/managed-savings-data.ts`'s internal `runProjection`/`runZeroReturnProjection` helpers now map a `ManagedSavingsInvestment` + year list to/from the new engine's scalar input/output instead of computing the formula inline — the math is bit-for-bit identical, only extracted into a reusable module. `getDisplayAnnualReturn`, `getProjectionAnnualReturn`, `projectWithAvailableReturnOrZero`, `projectSimulations`, and `calculateTotalSummary` are unchanged in signature and behavior; they still decide which return rate/mode a holding uses (linked-fund return vs. 0% fallback) — the engine itself has no knowledge of `linkedPublicFund`, `trackPerformance`, product type, group, or peer data.
- **All existing live call sites unchanged**: no call site outside `managed-savings-data.ts` was modified — `ManagedSavingsGroupTable.tsx` (per-row table cells), `src/lib/managed-savings/summary.ts`'s `calculateProjectionTotals` (group + global totals row) and `calculateManagedSavingsSummary`, `ManagedSavingsGroupSummaryRow.tsx`, `ManagedSavingsPageClient.tsx` (top KPI cards), and the legacy `ManagedSavingsSummaryTable.tsx` all continue to call the same existing adapter functions with the same signatures and outputs.
- **Approved 0%-return fallback preserved exactly**: current balance remains included, monthly contributions accumulate linearly, no fee drag is applied, no mock return is used — verified both by regression comparison and live browser QA (an unlinked holding with 0 monthly contribution projects to exactly its current balance at every horizon).

Regression Verification:
- No Vitest is configured in this repo (no `test` script, no `vitest` dependency). A temporary script (`scripts/tmp-verify-projection.ts`) was created, run via `npx tsx`, and deleted before completion — it compared a byte-for-byte inlined copy of the pre-refactor formulas against the new engine across 13 representative scenarios (zero balance/contribution, balance-only at 0%, contributions at 0%, positive return with/without fee, return-equals-fee zero-rate guard, 1-year and 30/40-year horizons, custom horizons 12 and 22, negative effective rate, decimal inputs, always-flat zero-contribution holding) at multiple year offsets each.
- Result: **91 comparisons run, 0 failures.**
- No permanent test file was added to the repo.

Out of Scope (Not Implemented in Phase 2F-1):
- Fund Replacement Simulator modal/UI.
- `compareFundProjections` or any candidate-fund selection/comparison logic.
- Any new i18n strings or UI change.
- Any Prisma schema change or migration.

Automated Checks (final):
- `npm run lint` — passed, 0 errors/warnings.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` log line during static generation only).
- `npm run db:validate` — passed, schema unchanged.

Product Owner browser QA (final approval):
- `/managed-savings` and `/en/managed-savings` both verified via a temporary Playwright script (deleted after use): zero console/page errors, correct `dir` (`rtl` / `ltr`), KPI cards, per-row projections, group totals, and table totals all rendered with values matching pre-refactor behavior.
- Linked holdings confirmed to still show their real 5-year return and compound correctly; unlinked/no-return holdings confirmed to show "—" for the percentage column but a real 0%-assumption projected amount, never hidden and never mock-derived.

Known Limitations (carried forward):
- Negative effective-rate behavior (accumulation fee exceeding the annual return) remains unguarded — this was true before the refactor as well and produces a mathematically valid (if unusual) shrinking projection; not changed or newly introduced by this phase.
- Phase 2F-2 (Fund Replacement Simulator UI) and Phase 2F-3 (interactive scenarios) are not started — no scope defined or approved yet.

Branch History:
- Feature branch: `feature/projection-engine-refactor`
- Merged into: `master`
- Commit: `refactor: extract reusable projection engine`

## Phase 2F-2 — Fund Scenario Comparison MVP

Status: **COMPLETED AND VERIFIED** (2026-07-16). Product Owner browser QA approved, including two focused fix rounds. Committed and merged into `master` from `feature/fund-replacement-simulator`.

User-facing feature name: **Fund Scenario Comparison** (Hebrew: **השוואת תרחישי קרנות**). Internal component file (`FundReplacementSimulatorModal.tsx`), the i18n namespace key (`fundReplacementSimulator`), and the branch name still say "Fund Replacement Simulator" — only user-facing text was renamed during the QA fix rounds; a broad internal rename was explicitly out of scope for those fix rounds and was not performed during Finish Work either.

This phase connects the linked-holding personal data, the Phase 2E-1 Similar Tracks peer data, and the Phase 2F-1 shared projection engine into an informational current-vs-candidate fund comparison. No schema changes, no persisted simulation state, no external calls.

Completed:
- **Entry point**: a compact calculator icon action on eligible candidate rows within `SimilarTracksComparison`'s existing peer table. Never shown for the user's own linked-fund row, the peer-average row, candidates with no usable annualized 5-year return, or candidates with no usable public average management fee. The entire action column is omitted when the current linked fund itself has no usable annualized 5-year return.
- **Comparison layer** (`src/lib/financial/fund-comparison.ts`, new): `compareFundProjections({ currentScenario, candidateScenario })` — pure, reuses `projectCompoundingWithFee` for both scenarios (no formula duplication), returns `{ years, currentProjectedValue, candidateProjectedValue, difference }` where `difference = candidate − current`. `buildSimulatorHorizons(customYears)` returns the de-duplicated `[1, 5, 10, customYears?]` horizon list.
- **Candidate data**: `PeerComparisonRow` (`src/lib/public-funds/peer-comparison.ts`) gained `managingCompany` (modal identity only, not a new table column) and `annualized5YrReturn` (the projection input). A real correctness issue was found and fixed during initial implementation: the table's existing `trailing5YrReturn` column is a *cumulative* 5-year return, not an annual rate — using it directly in the compounding formula produced a nonsensical result (an apparent 111.83% "annual return" for a real local candidate). `annualized5YrReturn` is a separate, correctly-annualized column on the same `FundReturn` row and is what the comparison actually uses.
- **Modal** (`src/components/managed-savings/FundReplacementSimulatorModal.tsx`, new): current-vs-candidate fund identity (holding/fund name, managing company, fund number), a read-only assumptions table (same balance/contribution for both scenarios; different return/fee per scenario, each fee value captioned "Your entered fee" vs. "Reported public average"; an explicit note distinguishing the comparison's annualized 5-year return from the Similar Tracks table's cumulative 5-year return), an editable custom horizon (1–50, default 15, immediate recalculation, no duplicate row when it matches a baseline horizon), a results table (1/5/10/custom years — current, candidate, signed difference), a neutral custom-horizon summary sentence ("higher/lower by X" / "no difference", never "profit"/"gain"/"switch"), a compact three-point information list (historical-data caveat, candidate-fee-is-a-public-average caveat, excluded-factors caveat), and a short explicit non-recommendation disclaimer.
- **RTL/LTR fix**: fund-identity rows changed from a `justify-between` split layout (label at one edge, value at the opposite edge) to a stacked label-then-value layout, both `text-start`; assumption/result table value columns changed from `text-end` to `text-start`; a small `Num` helper wraps only pure numeric/currency/percent tokens in `dir="ltr"` (never mixed number+word phrases, which would reverse their natural reading order).
- **Mobile modal containment**: `FundReplacementSimulatorModal` is rendered via `createPortal(..., document.body)` — required because it can be opened from inside `ExpandedManagedSavingsRow`, whose `expanded-row-in` CSS animation uses `animation: ... both`, leaving `transform: translateY(0)` permanently applied after the animation completes; a non-`none` transform on an ancestor creates a new containing block for `position: fixed` descendants, which broke the modal's fixed backdrop positioning at narrow viewports before the portal fix. First portal usage in this codebase.
- **Mobile document-overflow fix** (found via Product Owner browser QA after the above, root-caused via Playwright DOM bisection, two independent unrelated causes): (1) `MobileDrawer`'s closed-state off-canvas `position: fixed` + `translateX` panel was a genuinely unclipped layout box (fixed elements anchor to the viewport, not to an ordinary ancestor's overflow) — fixed by wrapping the panel in a same-size `fixed inset-0 overflow-hidden` container and changing the panel itself from `fixed` to `absolute` relative to that wrapper. (2) `ManagedSavingsGroupTable`'s intentionally-wide holdings table, inside an `overflow-x-auto` wrapper, was still inflating `document.documentElement.scrollWidth` because `@dnd-kit/core`'s `DndContext` always renders a hidden `position: fixed` accessibility live-region inside that subtree, and ordinary `overflow` does not establish a containing block for fixed descendants — fixed by adding `contain: paint` (Tailwind `contain-paint`) alongside `overflow-x-auto` on the wrapper. A secondary `overflow-x: clip` was also added to `html`/`body` as a defense-in-depth safety net (verified not sufficient alone for either bug). Verified: `document.documentElement.scrollWidth` went from 1276px (he) / 1367px (en) to exactly 390px on a 390px-wide mobile viewport, with modal closed, modal open, and drawer open, while the intentionally-wide table wrapper still correctly reports `scrollWidth (1305px) > clientWidth (356px)` — confirming local table scrolling was never suppressed.
- **i18n**: `managedSavings.fundReplacementSimulator` namespace (title/subtitle, identity/assumption/result labels, info block, disclaimer) plus `managedSavings.similarTracks.action.*`/`table.actionColumnSr`, added to both `he.json`/`en.json`. All visible text translated; no hardcoded strings.

Out of Scope (Not Implemented in Phase 2F-2):
- Phase 2F-3 interactive scenario editing — balance, monthly contribution, return, and fee remain read-only; only the custom horizon is editable.
- Saved/exported scenarios, comparing multiple candidates simultaneously, charts, historical backtesting, Monte Carlo simulation.
- Tax, inflation, transfer costs, contribution escalation, or volatility/confidence-range modeling.
- Any fund-switching, transfer, or linking action from the modal.
- Any Prisma schema change, migration, or database write — no simulation state is ever persisted.
- Any external API call — all data comes from already-loaded holding and Similar Tracks peer data.
- A broad internal rename of the component file, i18n namespace key, or branch name to match the "Fund Scenario Comparison" product-facing name.

Automated Checks (final):
- `npm run lint` — passed, 0 errors/warnings.
- `npx tsc --noEmit` — passed.
- `npm run build` — passed, exit 0.
- `npm run db:validate` — passed, schema unchanged.
- Calculation verification: a temporary script (`scripts/tmp-verify-fund-comparison.ts`, run via `npx tsx`, deleted before completion) covered all 17 required scenarios (equal/higher/lower return, lower/higher fee, zero balance with contributions, positive balance with zero contribution, 1/5/10-year horizons matching direct engine calls, custom horizons 12/22, custom horizon matching a baseline value with no duplicate row, decimal inputs, signed negative/zero currency formatting) — 24 checks, 0 failures. Not rerun during later presentation-only/layout-only QA fix rounds, since no calculation source file changed after this initial verification.

Product Owner browser QA (final approval, after fix rounds):
- Eligible candidate action visible and correctly gated; ineligible rows/peer-average/self-row correctly show no action.
- Current and candidate fund identity, assumptions, and results verified correct against underlying DB values in both locales.
- Custom horizon (including values matching/not matching baseline horizons) updates immediately with no duplicate rows.
- Hebrew RTL and English LTR alignment verified correct throughout the modal (identity cards, assumptions table, results table, summary).
- Mobile (390px) modal fits viewport with no horizontal overflow, in both locales.
- Mobile document-level horizontal overflow eliminated: Hebrew initial page shows visible header/content immediately (no blank canvas, no scroll needed to find the app); English initial page has no root horizontal scroll; drawer opens from the correct side per locale and does not expand the document when closed or open; intentionally wide tables remain locally horizontally scrollable.
- Desktop regression confirmed: sidebar, tables, expanded rows, Similar Tracks table, calculator actions, and modal centering all unaffected.
- Zero browser console errors across all verified locales/viewports.

Product boundary confirmed:
- Neutral scenario-comparison wording throughout ("Projected difference under these assumptions...", "the compared fund scenario is higher/lower by...") — no "recommended", "best", "you should switch/move", "profit", "gain", or "guaranteed" language.
- Candidate management fee is always labelled as a reported public average, never presented as available/guaranteed to the user.
- The comparison's annualized 5-year return input is explicitly distinguished, in-UI, from the Similar Tracks table's cumulative 5-year return.
- Combined personal-plus-public simulation inputs/results are not logged, not placed in URLs, not persisted, and not sent to any external service.

Known Deferred Items (carried forward):
- Phase 2F-3 (interactive scenario editing) — not started, no scope defined or approved.
- Internal component/i18n-key/branch renaming to match the product-facing "Fund Scenario Comparison" name — deferred, not required for correctness.
- All previously-carried-forward known limitations (dev-user stub, `<html lang/dir>` SSR for English routes, product-type inference for `PublicFund`, AUM units, scheduled sync, Managed Savings groups move/cross-group work) remain unchanged and unrelated to this phase.

Branch History:
- Feature branch: `feature/fund-replacement-simulator` (deleted after merge)
- Merged into: `master` (fast-forward, conflict-free)
- Commit: `feat: add fund scenario comparison`
- Commit hash: `4dbaa99de7742adb0fc367e8bfaca19632d8a2ad`
