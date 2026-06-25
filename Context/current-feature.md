# MyBalance — Current Feature

## Feature Name

Phase 1 — Foundation and Static Hebrew RTL Dashboard

### Phase Breakdown

- **Phase 1A: Clean App Foundation** — COMPLETED, ready for Product QA
- **Phase 1B: Static Dashboard UI** — NOT STARTED, pending external mockup approval

## Status

Phase 1A: Complete (foundation implemented and tested)
Phase 1B: Not Started (dashboard design pending)

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

### Phase 1B (Pending)
Static dashboard UI with mock data showing:
- Total net worth
- Total assets
- Total liabilities
- Monthly change
- Asset allocation
- Major asset categories
- Major liability categories
- Recent snapshots / freshness indicators

**Note:** Dashboard UI will use mock data only and is not started until external mockup is approved.

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

## Phase 1B: To Build (Not Started, Pending)

Will add (pending external mockup approval):
- Dashboard summary cards
- Net worth display
- Asset/liability overview
- Charts and visualizations
- Sidebar/navigation
- Top bar/header
- Mock financial data display

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
- ✓ `/he` displays Hebrew UI with RTL direction (locale-specific route)
- ✓ `/en` displays English UI with LTR direction (locale-specific route)
- ✓ All user-facing text comes from translation files
- ✓ HTML lang and dir attributes set correctly for each route
- ✓ Layout works on desktop and mobile widths
- ✓ No financial advice language appears
- ✓ No DB/API/Auth/Dashboard implementation added
- ✓ No runtime errors on routes
- ✓ ESLint, TypeScript, build all pass

## Phase 1B Acceptance Criteria (NOT STARTED)

To be updated when Phase 1B begins:
- Dashboard displays with Hebrew UI and RTL
- Summary cards show total net worth, assets, liabilities
- Charts render correctly
- Mock financial data displays appropriately
- No real data persistence or authentication

## QA Requirements — Phase 1A (COMPLETED)

Checks run:
- ✓ `npm run lint` — passed
- ✓ `npm run build` — successful
- ✓ `npx tsc --noEmit` — no errors

Browser QA performed:
- ✓ `/` renders with Hebrew and RTL (direct, no redirect)
- ✓ `/` has lang="he" and dir="rtl" attributes
- ✓ `/he` renders with Hebrew and RTL
- ✓ `/he` has lang="he" and dir="rtl" attributes
- ✓ `/en` renders with English and LTR
- ✓ `/en` has lang="en" and dir="ltr" attributes
- ✓ No runtime errors

## Documentation Checklist

Updated for Phase 1A:
- ✓ `Context/current-feature.md` — Updated to reflect unprefixed Hebrew at root and new routing structure
- ✓ `Context/i18n-and-localization.md` — Updated to document unprefixed Hebrew at root and localePrefix: "as-needed"

Checked but not updated:
- `Context/coding-standards.md` — Standards being followed
- `Context/security-and-privacy.md` — No security/privacy issues in Phase 1A

No changes needed to `Context/Features/dashboard-feature-spec.md` — Dashboard not started yet.
