-- Phase 2D-2A: Managed Savings Groups foundation.
--
-- 1. Create ManagedSavingsGroup.
-- 2. Create one default group per existing user that has Managed Savings
--    holdings (active or archived) — never inferred from ownership values.
-- 3. Add ManagedSavingsHolding.groupId (nullable), backfill every existing
--    holding (including archived) to that user's default group, then make it
--    required. Existing visible order is preserved exactly: no displayOrder
--    values are touched by this migration.
-- 4. Add ManagedSavingsHolding.ownershipLabel (nullable), backfill from the
--    existing OwnerLabel enum values, then make it required. The legacy
--    "owner" column and OwnerLabel enum are intentionally NOT dropped in this
--    migration — kept for rollback safety (see Context/data-model.md).

-- CreateTable
CREATE TABLE "ManagedSavingsGroup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ManagedSavingsGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ManagedSavingsGroup_userId_name_key" ON "ManagedSavingsGroup"("userId", "name");

-- CreateIndex
CREATE INDEX "ManagedSavingsGroup_userId_displayOrder_idx" ON "ManagedSavingsGroup"("userId", "displayOrder");

-- AddForeignKey
ALTER TABLE "ManagedSavingsGroup" ADD CONSTRAINT "ManagedSavingsGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Data migration: one default group per user that currently owns at least one
-- ManagedSavingsHolding (any status). Groups are never inferred from owner —
-- this is a single flat "All Holdings" bucket per user. Raw SQL cannot use
-- Prisma's client-side cuid() default, so a deterministic, guaranteed-unique
-- id is constructed per user instead (any unique TEXT value is a valid @id).
INSERT INTO "ManagedSavingsGroup" ("id", "userId", "name", "displayOrder", "createdAt", "updatedAt")
SELECT 'default-group-' || u."userId", u."userId", 'כל החסכונות', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (SELECT DISTINCT "userId" FROM "ManagedSavingsHolding") u;

-- AlterTable: add groupId nullable first so existing rows can be backfilled
-- before the NOT NULL constraint is applied.
ALTER TABLE "ManagedSavingsHolding" ADD COLUMN "groupId" TEXT;

-- Backfill: every existing holding (active and archived) moves to its user's
-- default group. Preserves existing displayOrder values exactly — no visible
-- reordering occurs.
UPDATE "ManagedSavingsHolding"
SET "groupId" = 'default-group-' || "userId";

-- Every holding must belong to exactly one group.
ALTER TABLE "ManagedSavingsHolding" ALTER COLUMN "groupId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "ManagedSavingsHolding_groupId_idx" ON "ManagedSavingsHolding"("groupId");

-- CreateIndex
CREATE INDEX "ManagedSavingsHolding_userId_groupId_displayOrder_idx" ON "ManagedSavingsHolding"("userId", "groupId", "displayOrder");

-- AddForeignKey: Restrict — a group can never be deleted while holdings
-- (active or archived) still reference it.
ALTER TABLE "ManagedSavingsHolding" ADD CONSTRAINT "ManagedSavingsHolding_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ManagedSavingsGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable: add ownershipLabel nullable first, backfill from the existing
-- OwnerLabel enum, then make required. The legacy "owner" enum column is
-- intentionally left in place and untouched — not dropped in this phase.
ALTER TABLE "ManagedSavingsHolding" ADD COLUMN "ownershipLabel" TEXT;

UPDATE "ManagedSavingsHolding"
SET "ownershipLabel" = CASE "owner"
  WHEN 'self' THEN 'עצמי'
  WHEN 'spouse' THEN 'בן/בת זוג'
  WHEN 'child' THEN 'ילד/ה'
  WHEN 'shared' THEN 'משותף'
  WHEN 'family' THEN 'משפחה'
  WHEN 'other' THEN 'אחר'
END;

ALTER TABLE "ManagedSavingsHolding" ALTER COLUMN "ownershipLabel" SET NOT NULL;
