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
