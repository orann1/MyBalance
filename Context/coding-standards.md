# MyBalance — Coding Standards

## Required Reading

This file should be read before implementation work.

Also read:

- `Context/README.md`
- `Context/CLAUDE.md`
- `Context/project-overview.md`
- `Context/current-feature.md`
- Relevant feature spec

## Language

- TypeScript everywhere.
- Avoid `any` unless justified.
- Use explicit domain types for financial data.
- Code, comments, commit messages, and technical reports must be in English.

## UI Text

- No hardcoded user-facing UI text in components.
- Use i18n message files.
- Hebrew is the default UI language.
- Prepare English keys even if English copy is incomplete.

## Styling

- Tailwind CSS.
- Prefer logical spacing utilities:
  - `ms-*` / `me-*`
  - `ps-*` / `pe-*`
- Avoid hardcoded `left` / `right` assumptions unless direction-specific behavior is intentional.

### Overflow/layout containment (added Phase 2F-2, 2026-07-16)

Two reusable gotchas found and fixed during a mobile document-overflow investigation — relevant whenever adding a `position: fixed` off-canvas panel/modal, or a horizontally-scrollable table wrapper:

- **Off-canvas `position: fixed` panels** (drawers, custom modals not using the existing modal pattern): `position: fixed` anchors to the viewport, not to an ordinary ancestor — translating such an element off-screen makes it invisible but its box is still an unclipped layout box that can inflate `document.documentElement.scrollWidth`. If a panel needs to slide off-canvas while closed, wrap it in a same-size `fixed inset-0 overflow-hidden` container and make the panel itself `position: absolute` relative to that wrapper (see `MobileDrawer.tsx`), or use `createPortal(..., document.body)` if the element must remain genuinely `position: fixed` (see `FundReplacementSimulatorModal.tsx` — needed because it can be mounted inside `ExpandedManagedSavingsRow`'s animated, permanently-transformed row).
- **Wide/locally-scrollable table wrappers** (`overflow-x-auto` around an intentionally-wider-than-viewport table): if the table's subtree contains any `position: fixed` descendant (e.g. `@dnd-kit/core`'s built-in accessibility live-region, always rendered inside `DndContext`), plain `overflow-x-auto` is not sufficient to prevent the table's full intrinsic width from leaking into `document.documentElement.scrollWidth`, even though the table remains visually/interactively scoped correctly. Add `contain: paint` (Tailwind `contain-paint`) alongside `overflow-x-auto` on the wrapper — it both clips overflow and establishes the wrapper as the containing block for fixed/absolute descendants. See `ManagedSavingsGroupTable.tsx`.

## Financial Data

- Store money values in integer minor units when practical.
- Keep currency explicit.
- Keep source and freshness timestamps for values.
- Avoid floating point for persisted money calculations where precision matters.
- Never assume public fund returns equal personal performance.

## Validation

Use Zod for:

- Server actions
- Forms
- Imports
- API payloads
- Financial numeric input
- Dates and reporting periods

## Forms

Use React Hook Form + Zod.

## Charts

Use Recharts initially.

Charts must be reviewed carefully for RTL behavior.
Financial time-series charts should usually remain chronological left-to-right.

## Testing

Use:

- Vitest for calculation logic
- Playwright for browser flows
- TypeScript checks
- Lint checks

## Security

Do not log sensitive financial values unnecessarily.
Do not expose balances in URLs.
Do not send private financial data to external AI providers unless explicitly approved.
