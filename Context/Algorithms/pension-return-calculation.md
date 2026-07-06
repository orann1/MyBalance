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

## Documentation Impact

If pension/gemel return logic changes, update:
- This file
- `Context/Features/pension-gemel-sync-feature-spec.md`
- `Context/api-data-sources.md`
