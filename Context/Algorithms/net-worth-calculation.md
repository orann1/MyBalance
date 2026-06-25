# Net Worth Calculation

## Goal

Define the source-of-truth logic for net worth.

## Formula

Net Worth = Total Assets - Total Liabilities

## Initial Rules

- Use latest known value for each active asset.
- Use latest known balance for each active liability.
- Convert currencies only when FX infrastructure exists.
- Until FX exists, prefer showing separate currency totals or require ILS for MVP.

## MVP Currency Rule

Default currency is ILS.
Multi-currency support should be prepared conceptually but not required in Phase 1.

## Documentation Impact

If calculation logic changes, update:
- `Context/Algorithms/net-worth-calculation.md`
- `Context/data-model.md` if persisted fields change
- Relevant feature specs
