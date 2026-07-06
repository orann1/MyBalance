# MyBalance — Data Model

## Purpose

This file defines planned database/domain models.
It must be updated whenever Prisma schema or domain relationships change.

## Initial Domain Entities

### User

Represents an authenticated user. In Phase 2B this is a single-user dev stub. In production it will integrate with Auth.js (NextAuth).

Planned fields:
- id
- email
- name
- createdAt
- updatedAt

### Account

Represents a financial container.

Examples:
- Bank account
- Brokerage account
- Pension provider account
- Real estate container
- Manual account

Planned fields:
- id
- userId
- name
- accountType
- institutionName
- currency
- isActive
- createdAt
- updatedAt

### Asset

Represents a positive-value financial item.

Examples:
- Cash
- Stock portfolio
- Pension balance
- Keren Hishtalmut balance
- Kupat Gemel balance
- Real estate
- Other asset

Planned fields:
- id
- userId
- accountId
- name
- assetType
- currentValueMinor
- currency
- valuationDate
- sourceType
- notes
- createdAt
- updatedAt

### Liability

Represents a debt or obligation.

Examples:
- Mortgage
- Loan
- Credit card debt
- Other liability

Planned fields:
- id
- userId
- name
- liabilityType
- currentBalanceMinor
- currency
- interestRate
- monthlyPaymentMinor
- maturityDate
- sourceType
- notes
- createdAt
- updatedAt

### ManagedSavingsHolding

Represents a user's personal managed savings holding (Phase 2B).

This model stores the user's own managed savings products: Keren Hishtalmut, Kupat Gemel, Gemel LeHashkaa, and Savings Policies. It does not store pension funds — those are a future dedicated model.

Money values use integer minor units (agorot). Fee values use basis points (bps).

Planned fields:
- id
- userId
- name
- type (ManagedSavingsType enum)
- owner (OwnerLabel enum)
- status (HoldingStatus enum)
- currentBalanceMinor (BigInt — agorot)
- monthlyContributionMinor (BigInt — agorot)
- currency (default: ILS)
- accumulationFeeBps (Int — basis points)
- depositFeeBps (Int — basis points)
- managingCompany
- trackName
- officialFundId (optional — raw/official fund identifier as entered by the user; unrelated to `publicFundId`, never repurposed for matching)
- publicFundId (optional FK to `PublicFund`. **Added in Phase 2C-3B.** User-confirmed only — never auto-linked. `onDelete: SetNull`, indexed, so a personal holding is never deleted as a side effect of `PublicFund` changes.)
- valuationDate
- notes (optional — personal, user-owned, displayed in expanded row only)
- createdAt
- updatedAt

### PublicFund

Represents a public GemelNet/PensionNet fund (fund-level, not personal data). **Schema/config implemented in Phase 2C-1; live sync in Phase 2C-2; local search/matching backend in Phase 2C-3A; user-confirmed link from `ManagedSavingsHolding` in Phase 2C-3B.**

Fields:
- id
- source (`PublicDataSource` enum)
- fundId
- fundName
- managingCompany
- managingCompanyLegalId (optional)
- controllingCorporation (optional)
- parentCompanyId (optional)
- parentCompanyName (optional)
- productType (`PublicFundProductType` enum, optional — GemelNet does not expose a clean product type column, so this must stay nullable / allow `unknown`)
- fundClassification (optional)
- specialization (optional)
- subSpecialization (optional)
- targetPopulation (optional)
- inceptionDate (optional)
- firstSeenAt
- lastSeenAt
- createdAt
- updatedAt

Constraints: `@@unique([source, fundId])`. Indexes on `source`, `fundId`, `fundName`, `managingCompany`. Reverse relation: `managedSavingsHoldings ManagedSavingsHolding[]` (added Phase 2C-3B).

`ManagedSavingsHolding.publicFundId` links to this model as of Phase 2C-3B — nullable, user-confirmed only via the `linkManagedSavingsHoldingToPublicFund` server action, never set automatically. `officialFundId` on `ManagedSavingsHolding` remains a separate, unrelated plain optional string.

### FundReturn

Monthly public return data for a `PublicFund`. **Implemented in Phase 2C-1 (schema/config only).**

Fields:
- id
- publicFundId (FK to `PublicFund`)
- reportPeriod
- monthlyReturn (Decimal)
- ytdReturn (Decimal)
- trailing3YrReturn (optional, Decimal)
- trailing5YrReturn (optional, Decimal)
- annualized3YrReturn (optional, Decimal)
- annualized5YrReturn (optional, Decimal)
- assetsUnderManagement (optional, Decimal)
- assetsUnderManagementRaw (optional, String — AUM units are not display-approved yet; do not infer/display units in UI)
- avgAnnualManagementFee (optional, Decimal)
- avgDepositFee (optional, Decimal)
- sourceResourceId
- sourceSnapshotDate (optional)
- createdAt
- updatedAt

Constraints: `@@unique([publicFundId, reportPeriod])`. Indexes on `publicFundId`, `reportPeriod`.

### PublicDataResource

Config record for a known Data.gov.il resource (dataset period). **Implemented in Phase 2C-1.** Exists so resource IDs are stored in config and not hardcoded in future sync logic.

Fields:
- id
- source (`PublicDataSource` enum)
- label
- resourceId
- periodStart (optional)
- periodEnd (optional)
- isCurrent
- isActive
- lastSyncedAt (optional)
- createdAt
- updatedAt

Constraints: `@@unique([source, resourceId])`.

Seeded in Phase 2C-1 with the six verified GemelNet/PensionNet resource IDs (see `Context/api-data-sources.md`). Seeding is idempotent (upsert) and does not call Data.gov.il.

### PublicDataSyncRun

Audit/history record for a public data sync run. **Implemented in Phase 2C-1 (schema only — no sync logic).** Used later by the Admin sync UI (Phase 2C-2+).

Fields:
- id
- source (`PublicDataSource` enum)
- resourceId
- startedAt
- finishedAt (optional)
- status (`PublicDataSyncStatus` enum)
- insertedCount (default 0)
- updatedCount (default 0)
- skippedCount (default 0)
- errorCount (default 0)
- errorMessage (optional)
- triggeredBy (`PublicDataSyncTrigger` enum)
- createdAt
- updatedAt

### NetWorthSnapshot

Point-in-time snapshot of the user's financial picture.

Planned fields:
- id
- userId
- snapshotDate
- totalAssetsMinor
- totalLiabilitiesMinor
- netWorthMinor
- currency
- sourceType
- createdAt

### Goal

Represents a financial goal.

Planned fields:
- id
- userId
- title
- goalType
- targetValueMinor
- currentValueMinor
- currency
- targetDate
- status
- createdAt
- updatedAt

## Enums

### PublicDataSource

Public fund data source for `PublicFund`, `PublicDataResource`, `PublicDataSyncRun`:

- `gemelnet`
- `pensionnet`

### PublicDataSyncStatus

Lifecycle status for a `PublicDataSyncRun`:

- `running`
- `success`
- `failed`

### PublicDataSyncTrigger

Trigger source for a `PublicDataSyncRun`:

- `manual`
- `scheduled`

### PublicFundProductType

Best-effort product type classification for a `PublicFund`. Optional/nullable — GemelNet/PensionNet do not expose a clean product type column, so inference is not confident:

- `hishtalmut`
- `gemel`
- `hashkaa`
- `pension`
- `unknown`

### ManagedSavingsType

Product type for a managed savings holding:

- `hishtalmut` — Keren Hishtalmut
- `gemel` — Kupat Gemel
- `hashkaa` — Gemel LeHashkaa
- `savings` — Savings Policy / managed savings

### OwnerLabel

Ownership label for a holding:

- `self`
- `spouse`
- `child`
- `shared`
- `family`
- `other`

### HoldingStatus

Lifecycle status for a holding:

- `active`
- `inactive`
- `archived`

## Source Type

Values may include:

- manual
- import
- public_api
- calculated
- future_bank_sync

## Phase 2B Implementation Notes

### Prisma Version

Prisma v7 is used. Key differences from earlier versions:
- The `datasource` block in `schema.prisma` does NOT include `url`. Connection URL is configured in `prisma.config.ts`.
- The `PrismaClient` is initialized with a `@prisma/adapter-pg` adapter, not a plain connection string.

### Implemented in Phase 2B-1 (2026-06-29)

Files created:
- `prisma/schema.prisma` — User and ManagedSavingsHolding models with all planned fields.
- `prisma.config.ts` — Prisma v7 config (schema path + datasource URL from env).
- `src/lib/db/prisma.ts` — Singleton Prisma client, hot-reload safe, adapter pattern.
- `src/lib/financial/units.ts` — `toMinorUnits`, `fromMinorUnits`, `percentToBps`, `bpsToPercent`.
- `prisma/seed.ts` — 1 dev user (`dev@mybalance.local`) + 8 managed savings holdings.
- `.env.example` — Local DB URL (matches Docker Compose) + Neon placeholder.
- `docker-compose.yml` — Local PostgreSQL 16 container for development.

Money representation: `currentBalanceMinor` and `monthlyContributionMinor` are `BigInt` (agorot = ILS × 100).
Fee representation: `accumulationFeeBps` and `depositFeeBps` are `Int` basis points (bps = percent × 100).
Seed uses stable mock IDs (`hist-001`, `gemel-001`, etc.) so upsert is idempotent.

### Database Environments

**Local (development):** Docker Compose PostgreSQL (`mybalance_local`, host port 5433 → container port 5432).
- Host port 5433 is used because native PostgreSQL 18 is installed on this machine and occupies port 5432.
- Same Prisma migrations as Neon, but data is completely separate.
- Use `db:migrate:local` (`prisma migrate dev`) for schema changes during development.

**Remote (Neon / production):** Neon PostgreSQL, connection string via `DATABASE_URL` in a secure env file.
- Never run `prisma migrate dev` against Neon.
- Apply approved migrations with `db:migrate:deploy` (`prisma migrate deploy`) only.

### To set up the local DB

```bash
cp .env.example .env           # uses port 5433 to avoid conflict with native PostgreSQL 18
npm run db:local:up             # start Docker PostgreSQL (host port 5433)
npm run db:migrate:local        # apply migration (npx prisma migrate dev)
npm run db:seed:local           # seed dev user + 8 holdings
npm run db:studio:local         # inspect data in Prisma Studio
```

### To apply a migration to Neon

```bash
# 1. Set DATABASE_URL to Neon connection string in a secure env file (not committed)
# 2. Run:
npm run db:migrate:deploy      # npx prisma migrate deploy
```

## Phase 2C-1 Implementation Notes (2026-06-30)

Schema/config only. No live Data.gov.il sync, matching UI, or replacement of mock performance data.

Added: `PublicFund`, `FundReturn`, `PublicDataResource`, `PublicDataSyncRun` models. Added enums: `PublicDataSource`, `PublicDataSyncStatus`, `PublicDataSyncTrigger`, `PublicFundProductType`.

Migration: `prisma/migrations/20260630125534_add_public_fund_schema/`.

Seed: `prisma/seed.ts` now also upserts 6 `PublicDataResource` rows (3 GemelNet + 3 PensionNet periods) from the Phase 2C Discovery Audit Report. Seeding makes no Data.gov.il calls.

`ManagedSavingsHolding` is unchanged — no FK to `PublicFund` added yet. `officialFundId` remains a plain optional string. Linking is planned for Phase 2C-3.

## Phase 2C-3B Implementation Notes (2026-06-30)

Adds a nullable `publicFundId` FK on `ManagedSavingsHolding` referencing `PublicFund`, plus the reverse relation `PublicFund.managedSavingsHoldings`.

Migration: `prisma/migrations/20260630142325_add_public_fund_linking_to_managed_savings/`.

```sql
ALTER TABLE "ManagedSavingsHolding" ADD COLUMN "publicFundId" TEXT;
CREATE INDEX "ManagedSavingsHolding_publicFundId_idx" ON "ManagedSavingsHolding"("publicFundId");
ALTER TABLE "ManagedSavingsHolding" ADD CONSTRAINT "ManagedSavingsHolding_publicFundId_fkey"
  FOREIGN KEY ("publicFundId") REFERENCES "PublicFund"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

The link is set only via the user-confirmed `linkManagedSavingsHoldingToPublicFund` server action (never automatically) and cleared via `unlinkManagedSavingsHoldingFromPublicFund`. `onDelete: SetNull` means deleting a `PublicFund` record never deletes or archives the personal holding — only clears the link. `officialFundId` is unrelated and untouched by this phase.

When linked, `serializeHolding` populates `linkedPublicFund` with identity and the latest public return metrics (`latestMonthlyReturn`, `latestYtdReturn`, `latestAnnualized3YrReturn`, `latestAnnualized5YrReturn`). The `getEffectiveAnnualReturn` helper returns `latestAnnualized5YrReturn` from the linked fund when non-null, falling back to the holding's own `trackPerformance.last5Years`. This value is used by `projectSimulations` as a projection assumption — it is a public fund-level figure, not the user's personal realized return. `latestAnnualized5YrReturn` must never be relabeled or presented as the user's personal return in any future UI work.

`ExpandedManagedSavingsRow` already renders these linked KPI metrics directly (monthly/YTD/3Y/5Y annualized return, plus a metadata row and disclaimer) as of Phase 2C-3B — this is real DB-backed data, not mock/fallback. AUM (`FundReturn.assetsUnderManagement`/`assetsUnderManagementRaw`) is never included in `linkedPublicFund` and must not be displayed anywhere in the UI.

### Phase 2C-4A Implementation Notes (2026-07-05)

Query-hardening only — no schema/migration change. The latest-`FundReturn`-per-fund lookup (`getLatestFundReturnSummaries` in `src/lib/public-funds/latest-fund-returns.ts`) previously fetched every historical `FundReturn` row for a set of `publicFundId`s and reduced them to the latest row per fund in application code. This is replaced with a single parameterized raw SQL query using PostgreSQL's `DISTINCT ON`:

```sql
SELECT DISTINCT ON ("publicFundId")
  "publicFundId", "reportPeriod", "monthlyReturn", "ytdReturn",
  "annualized3YrReturn", "annualized5YrReturn"
FROM "FundReturn"
WHERE "publicFundId" = ANY($1::text[])
ORDER BY "publicFundId", "reportPeriod" DESC
```

Built via Prisma's `Prisma.sql` tagged helper (parameterized, no string interpolation) and executed with `prisma.$queryRaw`. This returns exactly one row per requested fund id regardless of how many months of history exist for that fund — the existing `@@unique([publicFundId, reportPeriod])` composite index already serves this query efficiently as an index-driven scan, so no new index was required. `searchPublicFundsForMatching` (`src/lib/public-funds/search-public-funds.ts`) now reuses this same hardened lookup for its candidate-enrichment step instead of its own separate fetch-all-then-reduce query. Output shapes (`LatestFundReturnSummary`, `PublicFundMatchCandidate`) are unchanged; AUM fields are still never selected or exposed by this query.

## Important Notes

Do not assume public PensionNet/GemelNet data includes the user's personal balance.
Public data usually provides fund-level returns and metadata only.

`PublicFund` and `FundReturn` schema is implemented as of Phase 2C-1. Live Data.gov.il sync (Phase 2C-2, see `Context/sync-workflows.md`) is implemented and populates these tables for current GemelNet/PensionNet resources. Phase 2C-3A adds a local-DB-only search/ranking layer that reads `PublicFund`/`FundReturn` (no schema changes). Phase 2C-3B adds the user-confirmed `ManagedSavingsHolding.publicFundId` link (FK to `PublicFund`) plus link/unlink server actions and a matching UI — the link is identity-only (no AUM, no full `FundReturn` history).

Public track performance on the Managed Savings page for **linked** holdings is real DB-backed `FundReturn` data as of Phase 2C-3B, rendered directly in `ExpandedManagedSavingsRow` — this is not mock/fallback. **Unlinked** holdings show a compact warning with no performance numbers displayed. The mock `trackPerformance` object survives only as a calculation fallback inside `getEffectiveAnnualReturn` (feeding the table 5Y column and `projectSimulations`) when a holding is unlinked, or linked to a fund with a null `latestAnnualized5YrReturn`. Phase 2C-4A (2026-07-05) hardened the underlying latest-return query layer and corrected this documentation; it made no UI changes.
