# MyBalance — API Data Sources

## Public Israeli Data Sources

Initial public data sources:

- Data.gov.il
- PensionNet / פנסיה-נט
- GemelNet / גמל-נט

## PensionNet

Used for:
- Pension fund monthly returns
- Fund-level historical performance
- Assets under management
- Track metadata when available

Important:
- This is public fund-level data.
- It does not provide the user's personal pension balance.

## GemelNet

Used for:
- Keren Hishtalmut returns
- Kupat Gemel returns
- Gemel LeHashkaa returns
- Fund-level historical performance
- Assets under management
- Track metadata when available

Important:
- This is public fund-level data.
- It does not provide the user's personal balance.

## Data.gov.il Resource Strategy

Data is usually split by period, for example:

- historical data
- 2023
- 2024-today

The app should store resource IDs in config, not hardcode them throughout the codebase.

## Sync Strategy

Do not call Data.gov.il directly from every page view.

Preferred flow:

1. Scheduled or manual sync reads public data.
2. Data is normalized and stored in MyBalance DB.
3. UI reads from local DB.
4. UI shows source and freshness.

## Reliability

Data.gov.il is a public data source, not a commercial SLA-backed API.

The app should handle:

- API downtime
- changed schema
- missing months
- duplicate rows
- delayed reporting
- Hebrew field names / inconsistent naming
