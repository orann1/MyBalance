# MyBalance — Sync Workflows

## Principle

Sync public data into the local database.
Do not depend on external APIs at page render time.

## Phase 2C-1 Status (2026-06-30)

Phase 2C-1 added only the schema and config foundation for the workflows below:
- `PublicFund`, `FundReturn` models to store normalized synced data.
- `PublicDataResource` model, seeded with the six confirmed Data.gov.il resource IDs (see `Context/api-data-sources.md`).
- `PublicDataSyncRun` model to record sync history/audit (no rows are written yet — no sync logic exists).

No Data.gov.il API client, `datastore_search` calls, normalization logic, sync server actions, admin sync button, or scheduled sync are implemented yet. Actual sync execution is planned for Phase 2C-2. Matching/linking synced `PublicFund` records to `ManagedSavingsHolding` is planned for Phase 2C-3.

## Phase 2C-2 Status (2026-06-30)

Phase 2C-2 implements the manual sync workflow below, via a CLI trigger only (no admin UI yet).

- `src/lib/public-data/data-gov-client.ts` — calls `datastore_search` only, with timeout/abort handling. Treats an HTTP 200 response carrying `{ success: false }` as an error.
- `src/lib/public-funds/sync-public-funds.ts` — reads `PublicDataResource` config from the DB (no hardcoded resource IDs), paginates sequentially (default page size 5,000), normalizes each row, upserts `PublicFund`/`FundReturn`, and writes a `PublicDataSyncRun` row for every resource synced.
- `scripts/sync-public-funds.ts` (`npm run sync:public-funds:local`) — manual trigger. **Defaults to `isCurrent=true` resources only** (current GemelNet + current PensionNet). Historical 1999–2022 and yearly-archive resources are not synced by default; pass `--resourceId=<id>` to sync a specific resource explicitly.
- Sync run history: every sync call creates a `PublicDataSyncRun` row with `status=running`, then updates it to `success` (with counts) or `failed` (with `errorMessage`) when the resource finishes. `PublicDataResource.lastSyncedAt` is updated only on success.
- Counts are tracked at `FundReturn` granularity (one source row = one `FundReturn`); see `Context/current-feature.md` Phase 2C-2 for the full count-strategy explanation.
- Bad rows (missing required fields) are skipped and counted, not thrown — verified locally against live data, see `Context/current-feature.md`.

Not implemented in Phase 2C-2: admin sync UI/button, scheduled sync, matching/linking to `ManagedSavingsHolding` (Phase 2C-3).

## Initial Workflows

### Manual Public Fund Sync

Admin/user triggers sync manually.

Steps:
1. Select data source: PensionNet or GemelNet
2. Select resource period
3. Fetch data from Data.gov.il
4. Normalize records
5. Upsert Fund rows
6. Upsert FundReturn rows
7. Store sync status and timestamps
8. Report inserted/updated/skipped/error counts

Implemented in Phase 2C-2 as a CLI script (`npm run sync:public-funds:local`); source/resource selection is via optional CLI flags rather than a UI. Admin UI selection is a future phase.

### Scheduled Public Fund Sync

Future workflow using Vercel Cron.

Suggested cadence:
- Monthly after expected publication date
- Optional daily check for new data

### Net Worth Snapshot Creation

Manual first.

Future:
- Monthly scheduled snapshot
- User notification before creating snapshot
- Snapshot based on latest entered/known values

## Non-Scope for MVP

- Open Banking sync
- Brokerage API sync
- Automatic pension personal balance sync
- Scraping private websites
- AI-based financial advice
