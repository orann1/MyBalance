# Pension and Gemel Sync Feature Spec

## Goal

Sync public Israeli pension/gemel/hishtalmut fund return data from Data.gov.il.

## Sources

- PensionNet / פנסיה-נט
- GemelNet / גמל-נט

## Important Boundary

This sync provides fund-level public returns only.
It does not provide personal balances.

This feature is public fund-level only — `PublicFund`/`FundReturn` records are never combined with a user's `ManagedSavingsHolding` balance. As of Phase 2C-3B, a `ManagedSavingsHolding` may carry an identity-only link (`publicFundId`) to a `PublicFund`, but that link only ever exists when the user explicitly confirms it via the matching UI; it is never created automatically, and it does not change the personal balance, contributions, or any other field on the holding.

## Phase 2C-1 Status (2026-06-30)

Phase 2C-1 implemented schema and config only:
- `PublicFund`, `FundReturn`, `PublicDataResource`, `PublicDataSyncRun` Prisma models and related enums.
- `PublicDataResource` seeded with the six confirmed GemelNet/PensionNet resource IDs.

Not implemented in Phase 2C-1: Data.gov.il API client, `datastore_search` calls, normalization logic, sync server actions, admin sync UI, scheduled sync, matching UI, or any link from `ManagedSavingsHolding` to `PublicFund`.

## Phase 2C-2 Status (2026-06-30)

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved; merged into `master`. Implemented: the Data.gov.il `datastore_search` client, GemelNet/PensionNet normalization (`normalizePublicFundRecord`), the sync service (`syncPublicFunds`/`syncPublicFundResource`), and a manual CLI trigger (`npm run sync:public-funds:local`). Verified locally against live current GemelNet and PensionNet resources — see `Context/current-feature.md` Phase 2C-2 for counts.

Still not implemented: admin sync UI, scheduled sync, matching/linking UI, and any FK from `ManagedSavingsHolding` to `PublicFund` (Phase 2C-3B). The public fund-level boundary is unchanged — synced `PublicFund`/`FundReturn` records are never combined with or linked to a user's `ManagedSavingsHolding` balance.

## Phase 2C-3A Status (2026-06-30)

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved; merged into `master` from `feature/public-fund-matching-search`. Implemented the local-DB-only search/ranking backend that a future matching UI will call:

- `searchPublicFundsForMatching` (`src/lib/public-funds/search-public-funds.ts`) — searches local `PublicFund` records by exact `fundId` and/or text query (fund name, managing company, controlling corporation, parent company name), with optional `source`/`managingCompany`/`productType` filters, scored and ranked via `scorePublicFundCandidate` (`src/lib/public-funds/matching.ts`) and Hebrew-aware normalization helpers (`src/lib/public-funds/matching-normalization.ts`).
- `searchPublicFundsForMatchingAction` (`src/lib/actions/public-fund-matching-actions.ts`) — Zod-validated server action wrapping the search, not yet wired to any client/UI.
- Optional CLI smoke test: `npm run search:public-funds:local -- --query="הראל" --source=gemelnet`.

**No matching/confirmation UI, no confirm-link/unlink actions, and no FK from `ManagedSavingsHolding` to `PublicFund` are implemented in Phase 2C-3A.** User confirmation will still be required before any future link is created — this phase only returns ranked candidates for a future UI to present. See `Context/current-feature.md` Phase 2C-3A for full scope/acceptance criteria and local verification results.

## Phase 2C-3B Status (2026-07-02)

**COMPLETED AND VERIFIED** (2026-07-02). Product Owner browser QA approved. Committed and merged into `master` from `feature/public-fund-linking-ui`. Implemented the matching/linking UI and confirm-link/unlink actions described as future work in Phase 2C-3A:

- `ManagedSavingsHolding.publicFundId` — nullable FK to `PublicFund`, `onDelete: SetNull`. User-confirmed only via `EditManagedFundModal`; never set by sync or any automatic process.
- `linkManagedSavingsHoldingToPublicFund` / `unlinkManagedSavingsHoldingFromPublicFund` (`src/lib/actions/public-fund-linking-actions.ts`) — Zod-validated (`z.string().min(1)` — seeded dev IDs fail cuid regex), ownership-checked, reject archived holdings, verify the target `PublicFund` exists, update `publicFundId` only. Linking/unlinking never changes balance, contributions, fees, or notes.
- `PublicFundMatchModal` (`src/components/managed-savings/PublicFundMatchModal.tsx`) — search UI calling `searchPublicFundsForMatchingAction` (Phase 2C-3A backend, local DB only). Requires an explicit "קשר לקרן זו" / "Link this fund" click — no auto-linking.
- `EditManagedFundModal` as single management surface: link/change/unlink controls. Linked state shows source badge + action buttons + labelled metadata inset row (`Fund name: X | Managing company: Y | Fund number: Z | Last fund update: W`).
- `ExpandedManagedSavingsRow` is read-only: unified green card (KPI return metrics + labelled metadata row + disclaimer) when linked; compact amber warning when unlinked. No link/change/unlink controls in the expanded row.
- Linked `latestAnnualized5YrReturn` used as a projection assumption by `getEffectiveAnnualReturn` — not presented as personal realized return.
- Add/Edit modal visual redesign (slate-based hierarchy) and modal scrollbar polish also included.

The fund-level public data boundary is unchanged: no AUM displayed, public returns are never presented as personal returns, and the mock/fallback public performance card is untouched. Phase 2C-4 (full performance display replacement) is not started. See `Context/current-feature.md` Phase 2C-3B and `Context/feature-history.md` for full scope, acceptance criteria, and verification results.

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
