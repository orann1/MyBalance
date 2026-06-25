# Accounts Feature Spec

## Goal

Allow users to define financial containers such as bank accounts, brokerage accounts, pension providers, and manual accounts.

## Initial Scope

Planned for Phase 2.

Users should be able to:
- Add account
- Edit account
- Disable/archive account
- Associate assets with accounts

## Account Types

- Bank
- Brokerage
- Pension
- Keren Hishtalmut
- Kupat Gemel
- Real estate
- Manual
- Other

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
