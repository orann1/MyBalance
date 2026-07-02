import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getDevUserId } from "@/lib/managed-savings/dev-user";
import { serializeHolding } from "@/lib/managed-savings/serializers";
import { getLatestFundReturnSummaries } from "@/lib/public-funds/latest-fund-returns";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

// TODO: Replace with `managed-savings:user:${userId}` when Auth.js is introduced.
export const MANAGED_SAVINGS_CACHE_TAG = "managed-savings:dev-user";

// Fetches active (non-archived) holdings for the dev user from the database.
// Sorted by createdAt ascending to preserve insertion order — most intuitive for users
// who added holdings over time and expect to see them in the order they were entered.
async function fetchHoldingsForDevUser(): Promise<ManagedSavingsInvestment[]> {
  const userId = await getDevUserId();
  const records = await prisma.managedSavingsHolding.findMany({
    where: {
      userId,
      status: { not: "archived" },
    },
    orderBy: { createdAt: "asc" },
    include: { publicFund: true },
  });

  const publicFundIds = records
    .map((record) => record.publicFund?.id)
    .filter((id): id is string => Boolean(id));
  const latestSummaries = await getLatestFundReturnSummaries(publicFundIds);

  return records.map((record) =>
    serializeHolding(
      record,
      record.publicFund ? latestSummaries.get(record.publicFund.id) ?? null : null
    )
  );
}

// Cached version — server-side cache keyed by a stable tag.
// Invalidated by revalidateTag(MANAGED_SAVINGS_CACHE_TAG) after any write mutation.
// Repeated page loads skip the DB until the cache is invalidated.
// TODO: Replace cache key with user-specific key when Auth.js is introduced.
export const getManagedSavingsHoldingsForCurrentDevUser = unstable_cache(
  fetchHoldingsForDevUser,
  ["managed-savings-dev-user"],
  { tags: [MANAGED_SAVINGS_CACHE_TAG] }
);
