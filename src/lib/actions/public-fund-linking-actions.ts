"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getDevUserId } from "@/lib/managed-savings/dev-user";
import { MANAGED_SAVINGS_CACHE_TAG } from "@/lib/data/managed-savings";
import { serializeHolding } from "@/lib/managed-savings/serializers";
import { getLatestFundReturnSummaries } from "@/lib/public-funds/latest-fund-returns";
import {
  LinkPublicFundSchema,
  UnlinkPublicFundSchema,
} from "@/lib/validation/public-fund-linking";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

export type PublicFundLinkActionResult =
  | { ok: true; holding: ManagedSavingsInvestment }
  | { ok: false; error: "validation" | "not_found" | "unauthorized" | "server_error" };

/**
 * Links a ManagedSavingsHolding to a PublicFund. User-confirmed only — this
 * action is only ever called after explicit user selection in the matching
 * modal. Updates publicFundId only; no other holding fields are touched.
 */
export async function linkManagedSavingsHoldingToPublicFund(
  raw: unknown
): Promise<PublicFundLinkActionResult> {
  const parsed = LinkPublicFundSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  try {
    const userId = await getDevUserId();

    const holding = await prisma.managedSavingsHolding.findFirst({
      where: { id: parsed.data.holdingId, userId },
      select: { id: true, status: true },
    });
    if (!holding) {
      return { ok: false, error: "not_found" };
    }
    if (holding.status === "archived") {
      return { ok: false, error: "validation" };
    }

    const publicFund = await prisma.publicFund.findUnique({
      where: { id: parsed.data.publicFundId },
      select: { id: true },
    });
    if (!publicFund) {
      return { ok: false, error: "not_found" };
    }

    const record = await prisma.managedSavingsHolding.update({
      where: { id: parsed.data.holdingId },
      data: { publicFundId: parsed.data.publicFundId },
      include: { publicFund: true },
    });

    const latestSummaries = record.publicFund
      ? await getLatestFundReturnSummaries([record.publicFund.id])
      : new Map();

    revalidateTag(MANAGED_SAVINGS_CACHE_TAG, {});
    return {
      ok: true,
      holding: serializeHolding(
        record,
        record.publicFund ? latestSummaries.get(record.publicFund.id) ?? null : null
      ),
    };
  } catch {
    return { ok: false, error: "server_error" };
  }
}

/**
 * Unlinks a ManagedSavingsHolding from its PublicFund. Clears publicFundId
 * only — officialFundId and all personal financial fields are untouched.
 */
export async function unlinkManagedSavingsHoldingFromPublicFund(
  raw: unknown
): Promise<PublicFundLinkActionResult> {
  const parsed = UnlinkPublicFundSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  try {
    const userId = await getDevUserId();

    const holding = await prisma.managedSavingsHolding.findFirst({
      where: { id: parsed.data.holdingId, userId },
      select: { id: true },
    });
    if (!holding) {
      return { ok: false, error: "not_found" };
    }

    const record = await prisma.managedSavingsHolding.update({
      where: { id: parsed.data.holdingId },
      data: { publicFundId: null },
      include: { publicFund: true },
    });

    revalidateTag(MANAGED_SAVINGS_CACHE_TAG, {});
    return { ok: true, holding: serializeHolding(record, null) };
  } catch {
    return { ok: false, error: "server_error" };
  }
}
