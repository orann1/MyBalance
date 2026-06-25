# Import / Export Feature Spec

## Goal

Allow users to import and export financial data.

## Initial Ideas

- CSV import
- Excel import
- Manual preview before save
- Export snapshots
- Export asset/liability list

## Important Rule

All imports must use validation and preview before writing to DB.

## Additional Required Reading

- `Context/security-and-privacy.md`
- `Context/data-model.md`

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
