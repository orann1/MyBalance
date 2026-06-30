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
