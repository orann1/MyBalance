# MyBalance — Current Feature

## Feature Name

Phase 1 — Foundation and Static Hebrew RTL Dashboard

## Status

Not Started

## Context

This phase builds the first implementation foundation for MyBalance.

The app should prove the core experience:

A user opens MyBalance and immediately understands:

- Total net worth
- Total assets
- Total liabilities
- Monthly change
- Asset allocation
- Major asset categories
- Major liability categories
- Recent snapshots / freshness indicators

Use mock data only.

## Required Reading Before Implementation

Claude must read:

- `Context/README.md`
- `Context/CLAUDE.md`
- `Context/project-overview.md`
- `Context/product-lead-workflow.md`
- `Context/coding-standards.md`
- `Context/i18n-and-localization.md`
- `Context/security-and-privacy.md`
- `Context/current-feature.md`
- `Context/Features/dashboard-feature-spec.md`

## Build in This Phase

- Next.js App Router foundation
- TypeScript
- Tailwind CSS
- Hebrew-first UI
- RTL-first layout
- Locale-aware structure
- Translation/message files
- Mock financial data
- App shell
- Sidebar/navigation
- Top bar/header
- Dashboard summary cards
- Net worth chart
- Allocation chart
- Asset category breakdown
- Liability category breakdown
- Recent snapshots / data freshness section

## Do Not Build in This Phase

- Real database persistence
- Prisma schema changes
- Authentication
- CRUD forms
- Pension/Gemel API sync
- Open Banking
- AI recommendations
- Import/export
- Admin settings
- User roles
- Billing
- Production deployment configuration

## Acceptance Criteria

- App runs locally.
- Dashboard displays Hebrew UI.
- Layout is RTL.
- All user-facing text comes from translation messages.
- Mock data renders correctly.
- Layout works on desktop and basic mobile widths.
- No financial advice language appears.
- No DB/API/Auth implementation is added.

## QA Requirements

Run available checks:

- `npm run lint`
- `npm run build`
- `npm run typecheck` if available

Perform browser QA if possible.

## Documentation Checklist

Before reporting completion, Claude must check whether these need updates:

- `Context/current-feature.md`
- `Context/Features/dashboard-feature-spec.md`
- `Context/i18n-and-localization.md`
- `Context/coding-standards.md`
- `Context/security-and-privacy.md`

Report all MD files changed.
