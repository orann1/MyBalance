# Pension and Gemel Sync Feature Spec

## Goal

Sync public Israeli pension/gemel/hishtalmut fund return data from Data.gov.il.

## Sources

- PensionNet / פנסיה-נט
- GemelNet / גמל-נט

## Important Boundary

This sync provides fund-level public returns only.
It does not provide personal balances.

This feature is public fund-level only — `PublicFund`/`FundReturn` records are never combined with or linked to a user's `ManagedSavingsHolding` balance unless a future matching phase explicitly does so with user confirmation.

## Phase 2C-1 Status (2026-06-30)

Phase 2C-1 implemented schema and config only:
- `PublicFund`, `FundReturn`, `PublicDataResource`, `PublicDataSyncRun` Prisma models and related enums.
- `PublicDataResource` seeded with the six confirmed GemelNet/PensionNet resource IDs.

Not implemented in Phase 2C-1: Data.gov.il API client, `datastore_search` calls, normalization logic, sync server actions, admin sync UI, scheduled sync, matching UI, or any link from `ManagedSavingsHolding` to `PublicFund`.

## Phase 2C-2 Status (2026-06-30)

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved; merged into `master`. Implemented: the Data.gov.il `datastore_search` client, GemelNet/PensionNet normalization (`normalizePublicFundRecord`), the sync service (`syncPublicFunds`/`syncPublicFundResource`), and a manual CLI trigger (`npm run sync:public-funds:local`). Verified locally against live current GemelNet and PensionNet resources — see `Context/current-feature.md` Phase 2C-2 for counts.

Still not implemented: admin sync UI, scheduled sync, matching/linking UI, and any FK from `ManagedSavingsHolding` to `PublicFund` (Phase 2C-3). The public fund-level boundary is unchanged — synced `PublicFund`/`FundReturn` records are never combined with or linked to a user's `ManagedSavingsHolding` balance.

### Product Type Inference Risk

GemelNet does not expose a clean product type column. `PublicFund.productType` (enum `PublicFundProductType`: `hishtalmut`, `gemel`, `hashkaa`, `pension`, `unknown`) is nullable and must allow `unknown` rather than being confidently inferred during a future sync. Any inference logic implemented in Phase 2C-2+ should be treated as best-effort and reviewed before being relied on for matching.

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
