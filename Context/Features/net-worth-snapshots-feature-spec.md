# Net Worth Snapshots Feature Spec

## Goal

Store point-in-time snapshots of the user's full financial picture.

## Snapshot Includes

- Total assets
- Total liabilities
- Net worth
- Currency
- Snapshot date
- Source type
- Asset breakdown
- Liability breakdown

## Initial Scope

Manual snapshot creation.

## Later Scope

- Monthly scheduled snapshot creation
- Change driver analysis

## Additional Required Reading

- `Context/Algorithms/net-worth-calculation.md`
- `Context/Algorithms/allocation-analysis.md`

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
