import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getDevUserId } from "@/lib/managed-savings/dev-user";
import { serializeHolding } from "@/lib/managed-savings/serializers";
import { getLatestFundReturnSummaries } from "@/lib/public-funds/latest-fund-returns";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

// TODO: Replace with `managed-savings:user:${userId}` when Auth.js is introduced.
export const MANAGED_SAVINGS_CACHE_TAG = "managed-savings:dev-user";

export interface ManagedSavingsGroupWithHoldings {
  id: string;
  name: string;
  displayOrder: number;
  holdings: ManagedSavingsInvestment[];
}

// Fetches active (non-archived) holdings for the dev user from the database.
// Sorted by the user-controlled displayOrder (Phase 2D-1), with createdAt asc
// as a deterministic fallback for any rows that happen to share a displayOrder.
async function fetchHoldingsForDevUser(): Promise<ManagedSavingsInvestment[]> {
  const userId = await getDevUserId();
  const records = await prisma.managedSavingsHolding.findMany({
    where: {
      userId,
      status: { not: "archived" },
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
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
// Invalidated by updateTag(MANAGED_SAVINGS_CACHE_TAG) after any write mutation
// (Phase 2D-2A QA fix: revalidateTag(tag, {}) only performs a stale-while-
// revalidate-style update — it does not synchronously purge the cache entry
// or mark the client router cache as stale, which caused saved changes to
// require two browser refreshes to appear. updateTag() always performs an
// immediate invalidation and is documented for exactly this
// read-your-own-writes use case from within a Server Action.)
// Repeated page loads skip the DB until the cache is invalidated.
// TODO: Replace cache key with user-specific key when Auth.js is introduced.
export const getManagedSavingsHoldingsForCurrentDevUser = unstable_cache(
  fetchHoldingsForDevUser,
  ["managed-savings-dev-user"],
  { tags: [MANAGED_SAVINGS_CACHE_TAG] }
);

// Fetches all of the dev user's groups (Phase 2D-2A) together with their
// active holdings, both sorted by displayOrder asc / createdAt asc. Reuses
// fetchHoldingsForDevUser (already sorted, active-only) and buckets the
// result by groupId with a stable partition — this preserves each group's
// relative holding order even though displayOrder values are only ever
// compared within a single group, never guaranteed unique across groups.
// Empty groups are included with an empty holdings array.
async function fetchGroupedHoldingsForDevUser(): Promise<ManagedSavingsGroupWithHoldings[]> {
  const userId = await getDevUserId();
  const [groups, holdings] = await Promise.all([
    prisma.managedSavingsGroup.findMany({
      where: { userId },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
    }),
    fetchHoldingsForDevUser(),
  ]);

  const holdingsByGroup = new Map<string, ManagedSavingsInvestment[]>();
  for (const holding of holdings) {
    const list = holdingsByGroup.get(holding.groupId);
    if (list) {
      list.push(holding);
    } else {
      holdingsByGroup.set(holding.groupId, [holding]);
    }
  }

  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    displayOrder: group.displayOrder,
    holdings: holdingsByGroup.get(group.id) ?? [],
  }));
}

// Cached version of the grouped fetch — same tag/invalidation as the flat
// holdings cache, so any holding or group mutation refreshes both.
export const getManagedSavingsGroupsForCurrentDevUser = unstable_cache(
  fetchGroupedHoldingsForDevUser,
  ["managed-savings-groups-dev-user"],
  { tags: [MANAGED_SAVINGS_CACHE_TAG] }
);
