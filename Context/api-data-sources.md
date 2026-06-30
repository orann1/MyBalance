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

### Confirmed Resource IDs (Phase 2C Discovery Audit, seeded in Phase 2C-1)

Verified and stored as `PublicDataResource` config rows. No live sync uses these yet.

GemelNet:
- 1999–2022: `91c849ed-ddc4-472b-bd09-0f5486cea35c`
- 2023: `2016d770-f094-4a2e-983e-797c26479720`
- 2024–today: `a30dcbea-a1d2-482c-ae29-8f781f5025fb` (current)

PensionNet:
- 1999–2022: `a66926f3-e396-4984-a4db-75486751c2f7`
- 2023: `4694d5a7-5284-4f3d-a2cb-5887f43fb55e`
- 2024–today: `6d47d6b5-cb08-488b-b333-f1e717b1e1bd` (current)

### API Method Notes

- `datastore_search_sql` is blocked/unreliable on Data.gov.il and should not be used.
- `datastore_search` is the approved API method for fetching records.
- No API key is currently required.

### Phase 2C-2 Implementation Notes (2026-06-30)

Live client implemented in `src/lib/public-data/data-gov-client.ts`:
- Endpoint: `https://data.gov.il/api/3/action/datastore_search` only.
- Params supported: `resource_id`, `limit`, `offset`, optional `filters` (JSON-encoded), optional `q`.
- An HTTP 200 response can still carry `{ "success": false }` — this is treated as an error (`DataGovApiError`) rather than a valid result.
- Requests use an `AbortController` timeout (default 20s).
- Pagination is sequential, page by page (`paginateDatastoreSearch`), with a default page size of 5,000 records. No concurrent/parallel page fetches.
- No raw response bodies are logged by default.

Confirmed live record shape (sampled 2026-06-30):
- GemelNet rows include `TARGET_POPULATION`, `SPECIALIZATION`, `SUB_SPECIALIZATION`; no `PARENT_COMPANY_ID`/`PARENT_COMPANY_NAME`.
- PensionNet rows include `PARENT_COMPANY_ID`, `PARENT_COMPANY_NAME`, `ACTUARIAL_ADJUSTMENT`; no `TARGET_POPULATION`/`SPECIALIZATION`/`SUB_SPECIALIZATION`.
- `REPORT_PERIOD` is numeric `YYYYMM` (e.g. `202401`).
- `INCEPTION_DATE`/`CURRENT_DATE` are text datetimes (`YYYY-MM-DD HH:MM:SS`).
- Some funds (e.g. guaranteed-return tracks) legitimately report `null` for `MONTHLY_YIELD`/`YEAR_TO_DATE_YIELD` in a given period — these rows are skipped, not treated as errors.

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
