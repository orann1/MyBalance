"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getDevUserId } from "@/lib/managed-savings/dev-user";
import { toMinorUnits, percentToBps } from "@/lib/financial/units";
import { MANAGED_SAVINGS_CACHE_TAG } from "@/lib/data/managed-savings";
import { serializeHolding } from "@/lib/managed-savings/serializers";
import { getLatestFundReturnSummaries } from "@/lib/public-funds/latest-fund-returns";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";
import {
  CreateManagedSavingsSchema,
  UpdateManagedSavingsSchema,
  ArchiveManagedSavingsSchema,
  ReorderManagedSavingsSchema,
  type CreateManagedSavingsInput,
} from "@/lib/validation/managed-savings";

export type ActionResult = { ok: true } | { ok: false; error: string };
export type ActionResultWithHolding =
  | { ok: true; holding: ManagedSavingsInvestment }
  | { ok: false; error: string };
export type CreateActionResult =
  | { ok: true; holding: ManagedSavingsInvestment }
  | {
      ok: false;
      error: "validation_failed" | "invalid_public_fund" | "invalid_group" | "create_failed";
    };

export type ReorderActionResult =
  | { ok: true; holdings: ManagedSavingsInvestment[] }
  | { ok: false; error: "validation" | "not_found" | "unauthorized" | "server_error" };

function toDbFields(input: CreateManagedSavingsInput) {
  return {
    name: input.name,
    type: input.type,
    // Free-text ownership label (Phase 2D-2A) — the legacy "owner" enum
    // column is left untouched (keeps its default) and is no longer written
    // here.
    ownershipLabel: input.ownershipLabel,
    groupId: input.groupId,
    currency: "ILS",
    currentBalanceMinor: toMinorUnits(input.currentBalance),
    monthlyContributionMinor: toMinorUnits(input.monthlyContribution),
    accumulationFeeBps: percentToBps(input.accumulationFeePercent),
    depositFeeBps: percentToBps(input.depositFeePercent),
    managingCompany: input.managingCompany ?? null,
    trackName: input.trackName ?? null,
    officialFundId: input.officialFundId ?? null,
    valuationDate: input.valuationDate ? new Date(input.valuationDate) : null,
    // Notes are personal and sensitive — not logged anywhere in this function.
    notes: input.notes ?? null,
  };
}

export async function createManagedSavingsHolding(
  raw: unknown
): Promise<CreateActionResult> {
  const parsed = CreateManagedSavingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed" };
  }

  try {
    const userId = await getDevUserId();

    // The target group must exist and belong to the dev user — never
    // trusted from the client as-is.
    const group = await prisma.managedSavingsGroup.findFirst({
      where: { id: parsed.data.groupId, userId },
      select: { id: true },
    });
    if (!group) {
      return { ok: false, error: "invalid_group" };
    }

    // Optional initial public fund link — the user explicitly selected this
    // fund in the Add modal's matching UI before saving (never auto-linked).
    // Verified here rather than trusted from the client: must be an existing
    // PublicFund, and since Managed Savings is GemelNet-only, must be a
    // GemelNet record.
    let validatedPublicFundId: string | undefined;
    if (parsed.data.publicFundId) {
      const publicFund = await prisma.publicFund.findUnique({
        where: { id: parsed.data.publicFundId },
        select: { id: true, source: true },
      });
      if (!publicFund || publicFund.source !== "gemelnet") {
        return { ok: false, error: "invalid_public_fund" };
      }
      validatedPublicFundId = publicFund.id;
    }

    const record = await prisma.$transaction(async (tx) => {
      // New holdings are appended to the end of their target group's active
      // list — displayOrder is only ever compared among holdings sharing the
      // same groupId (Phase 2D-2A).
      const last = await tx.managedSavingsHolding.findFirst({
        where: { userId, groupId: parsed.data.groupId, status: { not: "archived" } },
        orderBy: { displayOrder: "desc" },
        select: { displayOrder: true },
      });
      const nextDisplayOrder = (last?.displayOrder ?? 0) + 1;

      return tx.managedSavingsHolding.create({
        data: {
          userId,
          status: "active",
          displayOrder: nextDisplayOrder,
          ...toDbFields(parsed.data),
          publicFundId: validatedPublicFundId ?? null,
        },
        include: { publicFund: true },
      });
    });

    const latestSummaries = record.publicFund
      ? await getLatestFundReturnSummaries([record.publicFund.id])
      : new Map();

    updateTag(MANAGED_SAVINGS_CACHE_TAG);
    return {
      ok: true,
      holding: serializeHolding(
        record,
        record.publicFund ? latestSummaries.get(record.publicFund.id) ?? null : null
      ),
    };
  } catch {
    return { ok: false, error: "create_failed" };
  }
}

export async function updateManagedSavingsHolding(
  raw: unknown
): Promise<ActionResultWithHolding> {
  const parsed = UpdateManagedSavingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed" };
  }

  try {
    const userId = await getDevUserId();
    // Ownership check: the holding must belong to the dev user.
    const existing = await prisma.managedSavingsHolding.findFirst({
      where: { id: parsed.data.id, userId },
      select: { id: true, groupId: true },
    });
    if (!existing) {
      return { ok: false, error: "not_found" };
    }

    // The target group must exist and belong to the dev user.
    const group = await prisma.managedSavingsGroup.findFirst({
      where: { id: parsed.data.groupId, userId },
      select: { id: true },
    });
    if (!group) {
      return { ok: false, error: "invalid_group" };
    }

    // If the group changed, append the holding to the end of the target
    // group's active list (Phase 2D-2A — positioned cross-group moves are a
    // later sub-phase). If the group is unchanged, displayOrder is left as-is
    // so an in-group edit never disturbs its position.
    let displayOrderOverride: { displayOrder: number } | Record<string, never> = {};
    if (existing.groupId !== parsed.data.groupId) {
      const last = await prisma.managedSavingsHolding.findFirst({
        where: { userId, groupId: parsed.data.groupId, status: { not: "archived" } },
        orderBy: { displayOrder: "desc" },
        select: { displayOrder: true },
      });
      displayOrderOverride = { displayOrder: (last?.displayOrder ?? 0) + 1 };
    }

    const record = await prisma.managedSavingsHolding.update({
      where: { id: parsed.data.id },
      // publicFundId is intentionally not in toDbFields — edit/add does not
      // touch the public fund link; linking/unlinking is a separate action.
      data: { ...toDbFields(parsed.data), ...displayOrderOverride },
      include: { publicFund: true },
    });
    const latestSummaries = record.publicFund
      ? await getLatestFundReturnSummaries([record.publicFund.id])
      : new Map();
    updateTag(MANAGED_SAVINGS_CACHE_TAG);
    return {
      ok: true,
      holding: serializeHolding(
        record,
        record.publicFund ? latestSummaries.get(record.publicFund.id) ?? null : null
      ),
    };
  } catch {
    return { ok: false, error: "update_failed" };
  }
}

export async function archiveManagedSavingsHolding(
  raw: unknown
): Promise<ActionResult> {
  const parsed = ArchiveManagedSavingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed" };
  }

  try {
    const userId = await getDevUserId();
    // Ownership check: the holding must belong to the dev user.
    const existing = await prisma.managedSavingsHolding.findFirst({
      where: { id: parsed.data.id, userId },
      select: { id: true },
    });
    if (!existing) {
      return { ok: false, error: "not_found" };
    }

    // Soft delete: set status to archived, do not hard-delete.
    await prisma.managedSavingsHolding.update({
      where: { id: parsed.data.id },
      data: { status: "archived" },
    });
    updateTag(MANAGED_SAVINGS_CACHE_TAG);
    return { ok: true };
  } catch {
    return { ok: false, error: "archive_failed" };
  }
}

/**
 * Persists user-controlled row order (Phase 2D-1). The client submits the
 * full set of currently visible (active) holding ids in the desired order.
 * All ids must belong to the dev user and must not be archived — otherwise
 * the whole batch is rejected (no partial reorder). Does not log balances
 * or notes.
 */
export async function reorderManagedSavingsHoldings(
  raw: unknown
): Promise<ReorderActionResult> {
  const parsed = ReorderManagedSavingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  const { orderedIds } = parsed.data;

  try {
    const userId = await getDevUserId();

    const holdings = await prisma.managedSavingsHolding.findMany({
      where: { id: { in: orderedIds }, userId },
      select: { id: true, status: true },
    });

    // Every submitted id must belong to this user — a mismatched count means
    // at least one id is missing or belongs to another user.
    if (holdings.length !== orderedIds.length) {
      return { ok: false, error: "not_found" };
    }
    if (holdings.some((holding) => holding.status === "archived")) {
      return { ok: false, error: "validation" };
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.managedSavingsHolding.update({
          where: { id },
          data: { displayOrder: index + 1 },
        })
      )
    );

    updateTag(MANAGED_SAVINGS_CACHE_TAG);

    // Return the authoritative, re-sorted active holdings so the client can
    // reconcile optimistic UI state against the server's persisted order.
    const records = await prisma.managedSavingsHolding.findMany({
      where: { userId, status: { not: "archived" } },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      include: { publicFund: true },
    });
    const publicFundIds = records
      .map((record) => record.publicFund?.id)
      .filter((id): id is string => Boolean(id));
    const latestSummaries = await getLatestFundReturnSummaries(publicFundIds);

    return {
      ok: true,
      holdings: records.map((record) =>
        serializeHolding(
          record,
          record.publicFund ? latestSummaries.get(record.publicFund.id) ?? null : null
        )
      ),
    };
  } catch {
    return { ok: false, error: "server_error" };
  }
}
