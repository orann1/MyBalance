# MyBalance — Current Feature

## Feature Name

Phase 2A — Managed Savings Mock Experience

### Phase Breakdown

- **Phase 1A: Clean App Foundation** — COMPLETED & APPROVED
- **Phase 1B: Static Dashboard UI** — COMPLETED & APPROVED
- **Phase 2A: Managed Savings Mock Experience** — COMPLETED & APPROVED
- **Phase 2B: TBD** — Not started

## Status

Phase 1A: Complete and Approved
Phase 1B: Complete and Approved
Phase 2A: **COMPLETED AND APPROVED** (2026-06-28)

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
1. **Investment Identity Card** - Shows: name, owner, product type, company, track, fund ID, status, last update date
2. **Editable Assumptions Card** - Client-side editable fields:
   - Current balance
   - Monthly contribution
   - Accumulation fee percentage
   - Deposit fee percentage
   - (Pension-specific fields removed: retirement age, conversion factor)
3. **Public Track Performance Card** - Clearly labeled with: last month, last 1Y, 3Y, 5Y, 10Y returns
4. **Detailed Simulation Card** - Projections for today, 1Y, 5Y, 10Y, 15Y, custom horizon with:
   - Projected value, estimated contributions, estimated fees, estimated net gain
   - (NO estimated monthly pension - pension feature removed)
5. **Mock Actions Row** - Visual-only actions: update balance, add deposit, change fees, change track

**Bottom Summary Table:**
1. **Managed Savings Summary** - Single table by product type and years
   - Rows: Today, In 1 Year, In 5 Years, In 10 Years, In 15 Years, In Custom X Years
   - Columns: Keren Hishtalmut, Kupat Gemel, Gemel LeHashkaa, Savings Policy, Total
   - (NO pension columns, NO monthly pension column)

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
- Proper Hebrew RTL layout (dir="rtl") at `/pension-gemel` and `/he/pension-gemel`
- Proper English LTR layout (dir="ltr") at `/en/pension-gemel`

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

- ✓ `/pension-gemel` renders Hebrew RTL version
- ✓ `/en/pension-gemel` renders English LTR version
- ✓ Page includes top summary cards with 5 KPIs
- ✓ Pension section with expandable rows
- ✓ Managed savings section with expandable rows
- ✓ Expanded rows show investment details and editable fields
- ✓ Editable fields update local state without persistence
- ✓ Public track performance metrics displayed
- ✓ Detailed simulation tables for multiple horizons
- ✓ Bottom summary tables for all investments
- ✓ Pension monthly pension estimates displayed
- ✓ All UI text from i18n translation files
- ✓ Hebrew RTL layout proper
- ✓ English LTR layout proper
- ✓ Responsive on desktop, tablet, mobile
- ✓ No hardcoded visible UI text
- ✓ Mock data only, no backend calls
- ✓ Safe informational language, no financial advice

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
