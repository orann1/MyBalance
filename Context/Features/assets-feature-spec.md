# Assets Feature Spec

## Goal

Allow users to track positive-value financial items.

## Asset Types

- Cash
- Investment portfolio
- Pension
- Keren Hishtalmut
- Kupat Gemel
- Gemel LeHashkaa
- Real estate
- Other asset

## Initial Scope

Planned for Phase 2.

Users should be able to:
- Add asset
- Edit value
- Set currency
- Set valuation date
- Add notes
- Associate asset with account

## Important Rule

Public fund returns do not equal the user's personal balance.
Personal balances are manually entered in early phases.

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
