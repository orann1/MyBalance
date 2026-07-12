"use server";

import { updateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { getDevUserId } from "@/lib/managed-savings/dev-user";
import { MANAGED_SAVINGS_CACHE_TAG } from "@/lib/data/managed-savings";
import {
  CreateManagedSavingsGroupSchema,
  RenameManagedSavingsGroupSchema,
  ReorderManagedSavingsGroupsSchema,
  DeleteEmptyManagedSavingsGroupSchema,
} from "@/lib/validation/managed-savings";

export type GroupActionResult =
  | { ok: true; group: { id: string; name: string; displayOrder: number } }
  | { ok: false; error: "validation" | "not_found" | "duplicate_name" | "server_error" };

export type ReorderGroupsActionResult =
  | { ok: true; groups: { id: string; name: string; displayOrder: number }[] }
  | { ok: false; error: "validation" | "not_found" | "server_error" };

export type DeleteGroupActionResult =
  | { ok: true }
  | { ok: false; error: "validation" | "not_found" | "group_not_empty" | "server_error" };

// Prisma's unique-constraint violation code — used to detect a duplicate
// (userId, name) pair without leaking the raw DB error to the client.
const UNIQUE_CONSTRAINT_VIOLATION = "P2002";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === UNIQUE_CONSTRAINT_VIOLATION
  );
}

export async function createManagedSavingsGroup(
  raw: unknown
): Promise<GroupActionResult> {
  const parsed = CreateManagedSavingsGroupSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  try {
    const userId = await getDevUserId();

    const group = await prisma.$transaction(async (tx) => {
      const last = await tx.managedSavingsGroup.findFirst({
        where: { userId },
        orderBy: { displayOrder: "desc" },
        select: { displayOrder: true },
      });
      const nextDisplayOrder = (last?.displayOrder ?? 0) + 1;

      return tx.managedSavingsGroup.create({
        data: { userId, name: parsed.data.name, displayOrder: nextDisplayOrder },
        select: { id: true, name: true, displayOrder: true },
      });
    });

    updateTag(MANAGED_SAVINGS_CACHE_TAG);
    return { ok: true, group };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "duplicate_name" };
    }
    return { ok: false, error: "server_error" };
  }
}

export async function renameManagedSavingsGroup(
  raw: unknown
): Promise<GroupActionResult> {
  const parsed = RenameManagedSavingsGroupSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  try {
    const userId = await getDevUserId();
    const existing = await prisma.managedSavingsGroup.findFirst({
      where: { id: parsed.data.id, userId },
      select: { id: true },
    });
    if (!existing) {
      return { ok: false, error: "not_found" };
    }

    const group = await prisma.managedSavingsGroup.update({
      where: { id: parsed.data.id },
      data: { name: parsed.data.name },
      select: { id: true, name: true, displayOrder: true },
    });

    updateTag(MANAGED_SAVINGS_CACHE_TAG);
    return { ok: true, group };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { ok: false, error: "duplicate_name" };
    }
    return { ok: false, error: "server_error" };
  }
}

/**
 * Persists user-controlled group order. Same shape/semantics as the
 * existing reorderManagedSavingsHoldings action: the client submits the full
 * set of the dev user's group ids in the desired order; the whole batch is
 * rejected if any id is missing or belongs to another user.
 */
export async function reorderManagedSavingsGroups(
  raw: unknown
): Promise<ReorderGroupsActionResult> {
  const parsed = ReorderManagedSavingsGroupsSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  const { orderedIds } = parsed.data;

  try {
    const userId = await getDevUserId();

    const groups = await prisma.managedSavingsGroup.findMany({
      where: { id: { in: orderedIds }, userId },
      select: { id: true },
    });
    if (groups.length !== orderedIds.length) {
      return { ok: false, error: "not_found" };
    }

    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.managedSavingsGroup.update({
          where: { id },
          data: { displayOrder: index + 1 },
        })
      )
    );

    updateTag(MANAGED_SAVINGS_CACHE_TAG);

    const records = await prisma.managedSavingsGroup.findMany({
      where: { userId },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, displayOrder: true },
    });
    return { ok: true, groups: records };
  } catch {
    return { ok: false, error: "server_error" };
  }
}

/**
 * Deletes a group only if it has zero holdings (any status — active,
 * inactive, or archived). Deleting a non-empty group with a transfer
 * destination is a later sub-phase (Phase 2D-2B) — this action never moves,
 * archives, or deletes holdings.
 */
export async function deleteEmptyManagedSavingsGroup(
  raw: unknown
): Promise<DeleteGroupActionResult> {
  const parsed = DeleteEmptyManagedSavingsGroupSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "validation" };
  }

  try {
    const userId = await getDevUserId();
    const existing = await prisma.managedSavingsGroup.findFirst({
      where: { id: parsed.data.id, userId },
      select: { id: true, _count: { select: { holdings: true } } },
    });
    if (!existing) {
      return { ok: false, error: "not_found" };
    }
    if (existing._count.holdings > 0) {
      return { ok: false, error: "group_not_empty" };
    }

    await prisma.managedSavingsGroup.delete({ where: { id: parsed.data.id } });

    updateTag(MANAGED_SAVINGS_CACHE_TAG);
    return { ok: true };
  } catch {
    return { ok: false, error: "server_error" };
  }
}
