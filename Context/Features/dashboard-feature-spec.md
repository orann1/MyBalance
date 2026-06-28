# Dashboard Feature Spec

## Goal

Provide the main MyBalance overview screen.

The dashboard should answer:

- What is my current net worth?
- What are my total assets?
- What are my total liabilities?
- How did my net worth change recently?
- Where is my money allocated?
- What data is fresh or stale?

## Phase 1 Scope

Static dashboard with mock data.

Sections:
- Header
- Total Net Worth card
- Total Assets card
- Total Liabilities card
- Monthly Change card
- Net Worth timeline chart
- Asset allocation chart
- Asset categories
- Liability categories
- Recent snapshots
- Data freshness labels

## UI Requirements

- Hebrew text
- RTL layout
- All UI text from translation messages
- Modern financial dashboard feel
- No financial advice language

## Non-Scope

- Real DB data
- CRUD
- Auth
- API sync
- User settings

## Implementation Rules for AI Agents

Before implementing this feature, read:

- `Context/README.md`
- `Context/CLAUDE.md`
- `Context/project-overview.md`
- `Context/product-lead-workflow.md`
- `Context/coding-standards.md`
- `Context/i18n-and-localization.md`
- `Context/security-and-privacy.md`
- `Context/current-feature.md`
- This feature spec

Development rules:

- Keep changes incremental.
- Preserve Hebrew-first and RTL-first behavior.
- Do not hardcode user-facing UI strings.
- Do not add DB/schema changes unless explicitly in scope.
- Do not add external APIs unless explicitly in scope.
- Do not add financial advice language.
- Run relevant checks before completion.
- Do not commit without user approval.

## Visual Design System

### Design Foundation
The dashboard uses the Lovable fintech design system adapted for Next.js with Tailwind CSS:
- Soft, pastel app gradient background (oklch color space)
- Hebrew-first typography with Heebo font
- Semantic financial category gradients
- Soft shadows and modern rounded corners

### Typography
- Main greeting: 32-36px bold/extrabold (desktop), 28-32px (mobile)
- Section titles: 20-24px bold (desktop), 18-20px (mobile)
- KPI values: 30-36px bold/extrabold (desktop), 28-32px (mobile)
- Navigation labels: 14-15px medium/semibold
- Secondary text: 12-14px muted

### Color System (OKLch)
#### App Background
- Gradient: lavender (280°) → light cyan (200°) → soft mint (160°)

#### Semantic Financial Gradients
- Net worth: oklch(0.6 0.18 275) → oklch(0.65 0.17 235)
- Assets: oklch(0.78 0.13 175) → oklch(0.72 0.15 155)
- Liabilities: oklch(0.82 0.13 50) → oklch(0.74 0.16 30)
- Goals: oklch(0.72 0.16 310) → oklch(0.6 0.18 285)
- Pension/Gemel: oklch(0.74 0.12 220) → oklch(0.7 0.13 200)
- Cash: oklch(0.85 0.1 185) → oklch(0.78 0.13 175)

### Layout
- Desktop sidebar (right side, RTL): 280px fixed width
- Desktop main content padding: 32px
- Tablet padding: 24px
- Mobile padding: 16px
- Card radius: 3rem (48px)
- Base shadow: soft 4px/20px with 18% opacity

### Card System
- Section cards: white/near-white, subtle border, shadow-card
- KPI cards: gradient backgrounds, white text, rounded-3xl
- Icon containers: colorful oklch backgrounds, 40px diameter

### Navigation & Sidebar
- Desktop sidebar: fixed right side, brand section, navigation items with real lucide icons
- Mobile drawer: slides in from right, overlay backdrop
- Active state: gradient background + right-side accent bar
- Icon colors: semantic category colors, unique for each navigation item

### Chart Styling
- Line charts: oklch primary color strokes, soft grid lines
- Pie charts: semantic category colors, polished legend
- Tooltip styling: rounded-3xl containers, oklch borders

## Implemented Sections

All dashboard sections are implemented with polished Lovable-inspired styling:
1. **Greeting/Hero**: Large bold title with timestamp and sample data badge
2. **KPI Cards**: Gradient backgrounds (networth, asset, liability, goal) with values and trends
3. **Net Worth Timeline**: Line chart with 12-month history
4. **Asset Allocation**: Donut chart with asset categories
5. **Assets Summary**: Asset categories with percentages and values
6. **Liabilities Summary**: Liability categories with values
7. **Pension/Gemel Section**: Pension, Hishtalmut, Gemel with disclaimer
8. **Financial Goals**: Progress bars with current/target values
9. **Data Freshness**: Status indicators for data sources
10. **Insights Section**: Informational insights cards

## Mock Data
- All data is static and clearly marked as "sample data"
- No persistence, DB, or API integration
- Example values: ₪1.8M net worth, ₪2.3M assets, ₪497K liabilities

## RTL & i18n
- Hebrew-first routing (/ is canonical)
- All UI text from translation files (he.json, en.json)
- RTL flex layouts with dir="rtl" attribute
- Logical CSS properties (me-, ms-, pe-, ps-) for RTL support

## Documentation Impact

If this feature changes behavior, update this spec and any related docs listed in `Context/README.md`.
