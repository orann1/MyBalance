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
- officialFundId (optional — future Data.gov.il / GemelNet matching)
- valuationDate
- notes (optional — personal, user-owned, displayed in expanded row only)
- createdAt
- updatedAt

### PublicFund

Represents a public GemelNet/PensionNet fund (fund-level, not personal data). **Implemented in Phase 2C-1 (schema/config only — no live sync, no UI, no `ManagedSavingsHolding` link).**

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

Constraints: `@@unique([source, fundId])`. Indexes on `source`, `fundId`, `fundName`, `managingCompany`.

`ManagedSavingsHolding` is NOT linked to `PublicFund` in Phase 2C-1. `officialFundId` on `ManagedSavingsHolding` remains unchanged. Matching/linking is planned for Phase 2C-3.

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

## Important Notes

Do not assume public PensionNet/GemelNet data includes the user's personal balance.
Public data usually provides fund-level returns and metadata only.

`PublicFund` and `FundReturn` schema is implemented as of Phase 2C-1. Live Data.gov.il sync (Phase 2C-2, see `Context/sync-workflows.md`) is implemented and populates these tables for current GemelNet/PensionNet resources. Matching/linking to `ManagedSavingsHolding` (Phase 2C-3) is not yet implemented — no schema changes were needed for Phase 2C-2.

Public track performance on the Managed Savings page remains mock/fallback data until Phase 2C-2/2C-3 replace it.
