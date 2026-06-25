# MyBalance — Sync Workflows

## Principle

Sync public data into the local database.
Do not depend on external APIs at page render time.

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
