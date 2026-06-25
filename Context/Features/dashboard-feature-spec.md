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

## Documentation Impact

If this feature changes behavior, update this spec and any related docs listed in `Context/README.md`.
