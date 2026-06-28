# MyBalance — Current Feature

## Feature Name

Phase 1 — Foundation and Static Hebrew RTL Dashboard

### Phase Breakdown

- **Phase 1A: Clean App Foundation** — COMPLETED, ready for Product QA
- **Phase 1B: Static Dashboard UI** — COMPLETED, ready for Product QA

## Status

Phase 1A: Complete (foundation implemented and tested)
Phase 1B: **COMPLETED & APPROVED** (dashboard UI and app shell implemented and product-reviewed)

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

Checked but not updated:
- `Context/coding-standards.md` — Standards being followed
- `Context/security-and-privacy.md` — No security/privacy issues identified
- `Context/i18n-and-localization.md` — Locale architecture unchanged
