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
- owner (OwnerLabel enum). **Legacy as of Phase 2D-2A** — kept in the schema for migration/rollback safety only. The live application no longer reads or writes this field; see `ownershipLabel` below.
- ownershipLabel (String, required. **Added in Phase 2D-2A.** Free-text ownership label, e.g. "אורן", "משותף", "Maya" — trimmed, max 80 chars. Replaces the fixed `owner` enum as the live ownership field. Distinct from group membership. Never translated — stored and displayed verbatim.)
- groupId (String, required FK to `ManagedSavingsGroup`. **Added in Phase 2D-2A.** Every holding — active, inactive, or archived — belongs to exactly one user-defined group. `onDelete: Restrict` — a group can never be deleted while holdings still reference it.)
- status (HoldingStatus enum)
- displayOrder (Int — user-controlled row order, Phase 2D-1. Lower values render first. Indexed via `@@index([userId, displayOrder])` and, as of Phase 2D-2A, `@@index([userId, groupId, displayOrder])`. Backfilled from `createdAt` ascending on introduction so existing holdings did not visibly reshuffle; new holdings are appended via `max(existing active displayOrder for user/group) + 1`. Persisted by the `reorderManagedSavingsHoldings` server action. As of Phase 2D-2A, values are only ever compared among holdings sharing the same `groupId` — cross-group displayOrder collisions are harmless.)
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

### ManagedSavingsGroup

User-defined grouping of Managed Savings holdings. **Added in Phase 2D-2A.** Groups are fully user-defined — never derived from product type, ownership, managing company, or any `PublicFund`/GemelNet classification. Every holding belongs to exactly one group; a group may be empty.

Fields:
- id
- userId (FK to `User`)
- name (String, required, trimmed, max 60 chars. Unique per user — `@@unique([userId, name])`, case-sensitive.)
- displayOrder (Int — user-controlled group order, same pattern as `ManagedSavingsHolding.displayOrder`.)
- createdAt
- updatedAt

Constraints: `@@unique([userId, name])`, `@@index([userId, displayOrder])`. Reverse relation: `holdings ManagedSavingsHolding[]`.

Deletion (Phase 2D-2A scope): `deleteEmptyManagedSavingsGroup` only deletes a group with zero holdings (any status). Deleting a non-empty group with a transfer-destination flow is planned for a later sub-phase (Phase 2D-2B) — not implemented yet.

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
- `other` — Private investment / bank account / anything not covered above (added Phase 2D-1, 2026-07-09, additive migration `ALTER TYPE "ManagedSavingsType" ADD VALUE 'other'`, no existing data affected). Behaves identically to any other type; may remain unlinked to a public fund.

### OwnerLabel

**Legacy as of Phase 2D-2A.** Kept in the schema (and the `ManagedSavingsHolding.owner` column) for migration/rollback safety only — the live application no longer reads or writes this field. Ownership is now a free-text field (`ManagedSavingsHolding.ownershipLabel`, String). This enum and column are intentionally not dropped in Phase 2D-2A; dropping them is a deferred follow-up once the free-text field has been in production use.

Legacy values:

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
Seed uses stable mock IDs (`hist-001`, `gemel-001`, etc.) to identify the 8 canonical holdings. **As of the Phase 2D-1 seed safety fix (2026-07-09), seeding `ManagedSavingsHolding` is create-if-missing only, not upsert** — if a canonical id already exists, it is left completely untouched (including `status`, `displayOrder`, balances, and `publicFundId`); only missing ids are created. This was changed because the previous upsert-based seed silently reset those fields on every run, which could reactivate archived holdings and overwrite manual QA edits/reordering. Re-running `db:seed:local` is safe at any time and must not be used as a QA data reset mechanism.

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

## Phase 2D-1 Implementation Notes (2026-07-06)

Adds `ManagedSavingsHolding.displayOrder Int @default(0)` plus a composite index `@@index([userId, displayOrder])`.

Migration: `prisma/migrations/20260706125519_add_managed_savings_display_order/`.

```sql
ALTER TABLE "ManagedSavingsHolding" ADD COLUMN "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- Backfill: preserve today's visible order (createdAt asc, per user).
WITH ordered AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt" ASC) AS rn
  FROM "ManagedSavingsHolding"
)
UPDATE "ManagedSavingsHolding" AS h
SET "displayOrder" = ordered.rn
FROM ordered
WHERE h."id" = ordered."id";

CREATE INDEX "ManagedSavingsHolding_userId_displayOrder_idx" ON "ManagedSavingsHolding"("userId", "displayOrder");
```

`fetchHoldingsForDevUser` (`src/lib/data/managed-savings.ts`) now sorts active holdings by `[{ displayOrder: "asc" }, { createdAt: "asc" }]` (the `createdAt` clause is a deterministic tie-breaker only). `createManagedSavingsHolding` assigns new holdings `max(existing active displayOrder for the user) + 1` inside a transaction, so new holdings are always appended to the end. A new server action, `reorderManagedSavingsHoldings({ orderedIds })` (`src/lib/actions/managed-savings-actions.ts`), persists user-controlled ordering: Zod-validated (no duplicates, non-empty), ownership-checked against every submitted id, rejects the whole batch if any id is missing/foreign/archived, updates `displayOrder` transactionally, revalidates the managed savings cache tag, and returns the authoritative re-sorted active holdings.

`src/lib/managed-savings/summary.ts` (new) computes the Managed Savings summary layer (`calculateManagedSavingsSummary`) from already-serialized active holdings: total balance, total monthly contributions, linked/unlinked counts, linked balance coverage percent, a balance-weighted `weightedLinkedAnnualized5YrReturn` (linked holdings with non-null `latestAnnualized5YrReturn` only — never the mock/fallback `trackPerformance`), and a per-type breakdown. This is a pure function over data already fetched by the data layer — it does not query the database or any external API itself.

UI: `ManagedSavingsTable` now renders a linked/unlinked badge next to each holding's name and supports drag-and-drop reordering (`@dnd-kit/core` + `@dnd-kit/sortable`, desktop drag handle) with an up/down-button fallback (mobile/accessibility). `ExpandedManagedSavingsRow`'s unlinked state changed from amber to a red/error data-completeness style — still shows no public return numbers for unlinked holdings. `ManagedSavingsSummaryCards` gained a linked-coverage card, a weighted-5Y-assumption card (hidden/neutral when no eligible linked data exists), and a breakdown-by-type row. No AUM exposure, no peer/fund comparison, no advisory wording introduced.

### Phase 2D-1 projection calculation update (2026-07-09)

The projection calculation described above (`getEffectiveAnnualReturn`/`projectSimulations`, falling back to mock `trackPerformance` for unlinked holdings) is superseded for all live display surfaces. `src/lib/mock/managed-savings-data.ts` now exposes:

- `getDisplayAnnualReturn(investment): number | null` — the linked fund's `latestAnnualized5YrReturn`, or `null`. Drives the "5-Year Return" table column, which shows "—" when null. Never falls back to mock data.
- `getProjectionAnnualReturn(investment): number` — the linked return if available, otherwise `0` (a transparent "no growth assumed" projection rate, not a historical return). Never null, never mock.
- `projectWithAvailableReturnOrZero(investment, years): Record<number, SimulationYear>` — always returns a result (never `null`). Linked holdings use the existing fee-adjusted compounding formula unchanged. Holdings with no linked return use a separate zero-return path (`runZeroReturnProjection`) that returns `currentBalance + monthlyContribution × months` with no fee applied — this guarantees a 0-contribution unlinked holding projects to exactly its current balance at every horizon, and avoids a division-by-zero in the compounding formula's annuity term when the effective rate is exactly 0.

`calculateTotalSummary` (feeding the top KPI cards, the table totals row, and the legacy `ManagedSavingsSummaryTable`) now calls `projectWithAvailableReturnOrZero`, so every active holding contributes to these totals — holdings without a linked return contribute their 0%-assumption value, never an exclusion. `getEffectiveAnnualReturn`/`projectSimulations` remain in the file for potential future mock/demo use but are no longer called by any live display path.

## Phase 2D-2A Implementation Notes (2026-07-12)

Adds `ManagedSavingsGroup` (see model definition above) and two new fields on `ManagedSavingsHolding`: `groupId` (required FK, `onDelete: Restrict`) and `ownershipLabel` (required String, free text). The legacy `owner` enum column and `OwnerLabel` enum type are intentionally **not** dropped in this phase.

Migration: `prisma/migrations/20260712090000_add_managed_savings_groups/`.

```sql
CREATE TABLE "ManagedSavingsGroup" ( ... );
CREATE UNIQUE INDEX "ManagedSavingsGroup_userId_name_key" ON "ManagedSavingsGroup"("userId", "name");
CREATE INDEX "ManagedSavingsGroup_userId_displayOrder_idx" ON "ManagedSavingsGroup"("userId", "displayOrder");
ALTER TABLE "ManagedSavingsGroup" ADD CONSTRAINT "ManagedSavingsGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- One default group per user with existing holdings — never inferred from ownership.
INSERT INTO "ManagedSavingsGroup" ("id", "userId", "name", "displayOrder", "createdAt", "updatedAt")
SELECT 'default-group-' || u."userId", u."userId", 'כל החסכונות', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "userId" FROM "ManagedSavingsHolding") u;

ALTER TABLE "ManagedSavingsHolding" ADD COLUMN "groupId" TEXT;
UPDATE "ManagedSavingsHolding" SET "groupId" = 'default-group-' || "userId";
ALTER TABLE "ManagedSavingsHolding" ALTER COLUMN "groupId" SET NOT NULL;
CREATE INDEX "ManagedSavingsHolding_groupId_idx" ON "ManagedSavingsHolding"("groupId");
CREATE INDEX "ManagedSavingsHolding_userId_groupId_displayOrder_idx" ON "ManagedSavingsHolding"("userId", "groupId", "displayOrder");
ALTER TABLE "ManagedSavingsHolding" ADD CONSTRAINT "ManagedSavingsHolding_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ManagedSavingsGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ManagedSavingsHolding" ADD COLUMN "ownershipLabel" TEXT;
UPDATE "ManagedSavingsHolding" SET "ownershipLabel" = CASE "owner"
  WHEN 'self' THEN 'עצמי' WHEN 'spouse' THEN 'בן/בת זוג' WHEN 'child' THEN 'ילד/ה'
  WHEN 'shared' THEN 'משותף' WHEN 'family' THEN 'משפחה' WHEN 'other' THEN 'אחר' END;
ALTER TABLE "ManagedSavingsHolding" ALTER COLUMN "ownershipLabel" SET NOT NULL;
```

Every existing holding — active, inactive, and archived — was backfilled into a single deterministic default group per user (id `default-group-${userId}`, name "כל החסכונות"). Existing `displayOrder` values were not touched, so visible order was preserved exactly. Verified locally after migration: 24 holdings (7 active canonical + 17 archived from prior QA sessions), all with a valid `groupId` and `ownershipLabel`, all in the single default group.

`prisma/seed.ts` gained a create-if-missing default-group seeding step (same deterministic id as the migration) so a fresh local DB ends up correct even if seeded before the migration's data backfill ran. Never upserts — matches the existing Phase 2D-1 seed-safety precedent for `ManagedSavingsHolding`.

Data layer: `src/lib/data/managed-savings.ts` adds `getManagedSavingsGroupsForCurrentDevUser` (cached, same `MANAGED_SAVINGS_CACHE_TAG`), returning each group with its active holdings, both sorted `displayOrder asc, createdAt asc`. Holdings are bucketed by `groupId` from the existing flat active-holdings query — `displayOrder` is only ever compared among holdings sharing the same `groupId`, so cross-group `displayOrder` collisions are harmless.

Server actions: `src/lib/actions/managed-savings-group-actions.ts` (new) — `createManagedSavingsGroup`, `renameManagedSavingsGroup`, `reorderManagedSavingsGroups`, `deleteEmptyManagedSavingsGroup` (rejects with `group_not_empty` if the group has any holdings — no transfer flow yet, deferred to Phase 2D-2B). `createManagedSavingsHolding`/`updateManagedSavingsHolding` (`src/lib/actions/managed-savings-actions.ts`) now require and validate `groupId` (ownership-checked against the dev user) and `ownershipLabel`; changing a holding's group on update appends it to the end of the target group.

UI: the Managed Savings page (`ManagedSavingsPageClient`) now renders `ManagedSavingsGroups` → `ManagedSavingsGroupSection` (one per group, each with its own `ManagedSavingsGroupHeader`, `ManagedSavingsGroupTable`, and `ManagedSavingsGroupSummaryRow`) instead of a single flat table. The former `ManagedSavingsTable` component was removed and its row-rendering logic carried into `ManagedSavingsGroupTable`, scoped per group with its own `@dnd-kit` `DndContext`/`SortableContext` (same-group reorder only — cross-group drag-and-drop is Phase 2D-2C). Empty groups remain visible with an empty state and an "Add holding" action that preselects that group. Add/Edit modals gained a required group `<select>` and replaced the old fixed ownership `<select>` with a free-text input. `src/lib/managed-savings/summary.ts` gained `calculateProjectionTotals` — the single shared aggregation helper used by both the per-group summary row and (indirectly, via the same underlying `projectWithAvailableReturnOrZero`) the global totals, so group and global totals never diverge.

Non-scope confirmed: no cross-group drag-and-drop, no delete-with-transfer for non-empty groups, no dedicated "Move to group" quick action outside Edit, no group colors/icons/charts, no family-member profiles, no Auth.js. The legacy `owner`/`OwnerLabel` enum column/type were intentionally not dropped.

### Phase 2D-2A QA fix round (2026-07-12) — cache invalidation correction

All Managed Savings server actions (`managed-savings-actions.ts`, `managed-savings-group-actions.ts`, `public-fund-linking-actions.ts`) previously called `revalidateTag(MANAGED_SAVINGS_CACHE_TAG, {})` after every mutation. This caused saved changes (group rename/reorder, holding reorder) to sometimes require two browser refreshes before appearing — Next.js 16's `revalidateTag(tag, profile)` only performs an immediate cache purge when `profile` is falsy or `profile.expire === 0`; an empty object profile is neither, so it fell back to a stale-while-revalidate-style update. All call sites now use `updateTag(MANAGED_SAVINGS_CACHE_TAG)` instead — the Next.js-documented API for immediate, read-your-own-writes cache invalidation from within a Server Action. `unstable_cache`/the cache tag itself are unchanged; only the invalidation call changed.

## Important Notes

Do not assume public PensionNet/GemelNet data includes the user's personal balance.
Public data usually provides fund-level returns and metadata only.

`PublicFund` and `FundReturn` schema is implemented as of Phase 2C-1. Live Data.gov.il sync (Phase 2C-2, see `Context/sync-workflows.md`) is implemented and populates these tables for current GemelNet/PensionNet resources. Phase 2C-3A adds a local-DB-only search/ranking layer that reads `PublicFund`/`FundReturn` (no schema changes). Phase 2C-3B adds the user-confirmed `ManagedSavingsHolding.publicFundId` link (FK to `PublicFund`) plus link/unlink server actions and a matching UI — the link is identity-only (no AUM, no full `FundReturn` history).

Public track performance on the Managed Savings page for **linked** holdings is real DB-backed `FundReturn` data as of Phase 2C-3B, rendered directly in `ExpandedManagedSavingsRow` — this is not mock/fallback. **Unlinked** holdings show a compact warning with no performance numbers displayed. Phase 2C-4A (2026-07-05) hardened the underlying latest-return query layer and corrected this documentation; it made no UI changes. As of the Phase 2D-1 projection calculation update (2026-07-09, see above), no live display path uses the mock `trackPerformance` object or `getEffectiveAnnualReturn`/`projectSimulations` — the 5-Year Return column and every currency-valued projection surface use `getDisplayAnnualReturn`/`getProjectionAnnualReturn`/`projectWithAvailableReturnOrZero` instead.
