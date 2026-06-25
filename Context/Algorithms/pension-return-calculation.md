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

## Documentation Impact

If pension/gemel return logic changes, update:
- This file
- `Context/Features/pension-gemel-sync-feature-spec.md`
- `Context/api-data-sources.md`
