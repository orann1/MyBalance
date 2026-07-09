-- AlterTable
ALTER TABLE "ManagedSavingsHolding" ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;

-- Backfill: preserve today's visible order (createdAt asc, per user) so
-- existing holdings do not visibly reshuffle when displayOrder-based sorting
-- is introduced. Assigns sequential values per user, starting at 1.
WITH ordered AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "userId" ORDER BY "createdAt" ASC) AS rn
  FROM "ManagedSavingsHolding"
)
UPDATE "ManagedSavingsHolding" AS h
SET "displayOrder" = ordered.rn
FROM ordered
WHERE h."id" = ordered."id";

-- CreateIndex
CREATE INDEX "ManagedSavingsHolding_userId_displayOrder_idx" ON "ManagedSavingsHolding"("userId", "displayOrder");
