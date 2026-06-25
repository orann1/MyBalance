# Pension and Gemel Sync Feature Spec

## Goal

Sync public Israeli pension/gemel/hishtalmut fund return data from Data.gov.il.

## Sources

- PensionNet / פנסיה-נט
- GemelNet / גמל-נט

## Important Boundary

This sync provides fund-level public returns only.
It does not provide personal balances.

## Planned Capabilities

- Store data source resource IDs
- Fetch records by resource
- Normalize fund identifiers
- Store monthly returns
- Store YTD returns when available
- Store assets under management when available
- Show freshness/source metadata
- Handle multiple resource periods

## Initial Trigger

Manual admin/developer sync.

## Later Trigger

Scheduled Vercel Cron.

## Additional Required Reading

- `Context/api-data-sources.md`
- `Context/sync-workflows.md`
- `Context/Algorithms/pension-return-calculation.md`

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
