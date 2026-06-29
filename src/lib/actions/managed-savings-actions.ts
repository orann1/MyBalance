"use server";

import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { getDevUserId } from "@/lib/managed-savings/dev-user";
import { toMinorUnits, percentToBps } from "@/lib/financial/units";
import { MANAGED_SAVINGS_CACHE_TAG } from "@/lib/data/managed-savings";
import { serializeHolding } from "@/lib/managed-savings/serializers";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";
import {
  CreateManagedSavingsSchema,
  UpdateManagedSavingsSchema,
  ArchiveManagedSavingsSchema,
  type CreateManagedSavingsInput,
} from "@/lib/validation/managed-savings";

export type ActionResult = { ok: true } | { ok: false; error: string };
export type ActionResultWithHolding =
  | { ok: true; holding: ManagedSavingsInvestment }
  | { ok: false; error: string };

function toDbFields(input: CreateManagedSavingsInput) {
  return {
    name: input.name,
    type: input.type,
    owner: input.owner,
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
): Promise<ActionResultWithHolding> {
  const parsed = CreateManagedSavingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation_failed" };
  }

  try {
    const userId = await getDevUserId();
    const record = await prisma.managedSavingsHolding.create({
      data: {
        userId,
        status: "active",
        ...toDbFields(parsed.data),
      },
    });
    revalidateTag(MANAGED_SAVINGS_CACHE_TAG, {});
    return { ok: true, holding: serializeHolding(record) };
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
      select: { id: true },
    });
    if (!existing) {
      return { ok: false, error: "not_found" };
    }

    const record = await prisma.managedSavingsHolding.update({
      where: { id: parsed.data.id },
      data: toDbFields(parsed.data),
    });
    revalidateTag(MANAGED_SAVINGS_CACHE_TAG, {});
    return { ok: true, holding: serializeHolding(record) };
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
    revalidateTag(MANAGED_SAVINGS_CACHE_TAG, {});
    return { ok: true };
  } catch {
    return { ok: false, error: "archive_failed" };
  }
}
