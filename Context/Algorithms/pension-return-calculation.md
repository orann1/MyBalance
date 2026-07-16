# Pension Return Calculation

## Goal

Handle public fund monthly return data.

## Important Boundary

Public PensionNet/GemelNet returns are fund-level returns.
They are not the user's personal realized return unless combined with user balance and cashflow data.

## Initial Metrics

- Monthly return
- YTD return
- Last 12 months return
- 3-year annualized return
- 5-year annualized return

## Data Quality

Handle:
- Missing months
- Delayed reporting
- Duplicate rows
- Fund name changes
- Resource period splits

## Managed Savings Linking Boundary (Phase 2C-3B / 2C-4A)

When a `ManagedSavingsHolding` is linked to a `PublicFund` (Phase 2C-3B, `linkManagedSavingsHoldingToPublicFund`), the linked fund's `latestAnnualized5YrReturn` may be used by `getEffectiveAnnualReturn` as a **projection assumption only** — it feeds the table's 5Y return column and `projectSimulations`. It is still fund-level public data and must never be presented or labeled as the user's personal realized return.

If the holding is unlinked, or linked to a fund with a null `latestAnnualized5YrReturn`, `getEffectiveAnnualReturn` falls back to the holding's own mock `trackPerformance.last5Years` value. This mock fallback may remain in place until a future product decision replaces it — no such replacement is scoped as of Phase 2C-4A.

Phase 2C-4A (query hardening only) did not change this calculation boundary — it only optimized how the latest `FundReturn` row per fund is fetched from the database.

## Fund Scenario Comparison Boundary (Phase 2F-2 — COMPLETED)

The Fund Scenario Comparison feature (product-facing name; internal file `src/components/managed-savings/FundReplacementSimulatorModal.tsx`, comparison math in `src/lib/financial/fund-comparison.ts`) projects a current-fund scenario against a candidate public-fund scenario using the shared `projectCompoundingWithFee` engine (Phase 2F-1). Both scenarios require a real **annualized** 5-year return — never a mock, 0%, or substituted value:

- Current fund: `getDisplayAnnualReturn(investment)` — the linked fund's `latestAnnualized5YrReturn`, same value already used elsewhere for display/projection.
- Candidate fund: `PeerComparisonRow.annualized5YrReturn` — the same `FundReturn.annualized5YrReturn` column, newly selected by `peer-comparison.ts` for this purpose.

**Important**: `PeerComparisonRow.trailing5YrReturn` (the field the Similar Tracks Comparison table displays as "5-year return", unchanged since Phase 2E-1) is a **cumulative** 5-year return, not an annual rate, and must never be used as `annualReturnPercent` input to a compounding projection — doing so during implementation produced a nonsensical result (an apparent "111.83% annual return" for a real candidate fund). The simulator therefore reads `annualized5YrReturn` instead, which is a separate, correctly-annualized field on the same underlying `FundReturn` row.

The candidate's management fee (`PeerComparisonRow.avgAnnualManagementFee`) is a public average — distinct from the user's personal `accumulationFeePercent` — and is never presented as a guaranteed/available rate.

**QA fix round (2026-07-16)**: this cumulative-vs-annualized distinction is now explicitly surfaced in the modal UI itself (not just this doc) — a visible note directly under the assumptions table states that the comparison uses the annualized 5-year return while the Similar Tracks table shows the cumulative 5-year return. The fee distinction is also now shown inline: a small caption under each fee value labels it "Your entered fee" (current) or "Reported public average" (candidate).

## Documentation Impact

If pension/gemel return logic changes, update:
- This file
- `Context/Features/pension-gemel-sync-feature-spec.md`
- `Context/api-data-sources.md`
