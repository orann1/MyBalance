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

Represents a public pension/gemel/hishtalmut track. **Phase 2C — not implemented in Phase 2B.**

Planned fields:
- id
- productType
- fundId
- fundName
- managingCompany
- trackName
- source
- createdAt
- updatedAt

### FundReturn

Monthly public return data for a fund/track. **Phase 2C — not implemented in Phase 2B.**

Planned fields:
- id
- fundId
- reportPeriod
- monthlyReturn
- ytdReturn
- assetsUnderManagement
- sourceResourceId
- sourceUpdatedAt
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

## Important Notes

Do not assume public PensionNet/GemelNet data includes the user's personal balance.
Public data usually provides fund-level returns and metadata only.

PublicFund and FundReturn (formerly named Fund and FundReturn) are planned for Phase 2C when Data.gov.il / GemelNet sync is implemented. They are not part of Phase 2B.

In Phase 2B, ManagedSavingsHolding is the only new model. Public track performance remains mock/fallback data until Phase 2C.
