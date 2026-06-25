# Admin Feature Spec

## Goal

Provide controlled developer/admin tools for data sync and diagnostics.

## Possible Sections

- Public data sync
- Sync history
- Data source resource IDs
- Cache/freshness status
- Debug tools

## Non-Scope

Admin should not become a cluttered catch-all page.
Keep it focused and organized.

## Additional Required Reading

- `Context/sync-workflows.md`
- `Context/api-data-sources.md`

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
