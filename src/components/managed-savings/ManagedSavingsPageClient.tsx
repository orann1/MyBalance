"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Info, CheckCircle2, XCircle } from "lucide-react";
import { ManagedSavingsSummaryCards } from "./ManagedSavingsSummaryCards";
import { ManagedSavingsBreakdownByType } from "./ManagedSavingsBreakdownByType";
import { ManagedSavingsGroups } from "./ManagedSavingsGroups";
import { ManagedSavingsSummaryTable } from "./ManagedSavingsSummaryTable";
import { EditManagedFundModal } from "./EditManagedFundModal";
import { AddManagedFundModal } from "./AddManagedFundModal";
import { DeleteHoldingConfirmModal } from "./DeleteHoldingConfirmModal";
import { CreateManagedSavingsGroupModal } from "./CreateManagedSavingsGroupModal";
import { RenameManagedSavingsGroupModal } from "./RenameManagedSavingsGroupModal";
import { DeleteManagedSavingsGroupModal } from "./DeleteManagedSavingsGroupModal";
import { reorderManagedSavingsHoldings } from "@/lib/actions/managed-savings-actions";
import { reorderManagedSavingsGroups } from "@/lib/actions/managed-savings-group-actions";
import { calculateManagedSavingsSummary } from "@/lib/managed-savings/summary";
import { cn } from "@/lib/utils";
import {
  calculateTotalSummary,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";
import type { ManagedSavingsGroupWithHoldings } from "@/lib/data/managed-savings";

interface ManagedSavingsPageClientProps {
  initialGroups: ManagedSavingsGroupWithHoldings[];
}

type GroupSummary = { id: string; name: string; displayOrder: number };

// Re-buckets a flat, already-sorted active holdings list (as returned by
// reorderManagedSavingsHoldings) back into each group's holdings array,
// preserving group identity/order. displayOrder values are only ever
// compared among holdings sharing the same groupId, so a stable partition of
// a globally-sorted list still yields correctly-ordered per-group lists.
function rebucketHoldings(
  groups: ManagedSavingsGroupWithHoldings[],
  holdings: ManagedSavingsInvestment[]
): ManagedSavingsGroupWithHoldings[] {
  const byGroup = new Map<string, ManagedSavingsInvestment[]>();
  for (const holding of holdings) {
    const list = byGroup.get(holding.groupId);
    if (list) {
      list.push(holding);
    } else {
      byGroup.set(holding.groupId, [holding]);
    }
  }
  return groups.map((group) => ({ ...group, holdings: byGroup.get(group.id) ?? [] }));
}

function addHoldingToGroups(
  groups: ManagedSavingsGroupWithHoldings[],
  holding: ManagedSavingsInvestment
): ManagedSavingsGroupWithHoldings[] {
  return groups.map((group) =>
    group.id === holding.groupId
      ? { ...group, holdings: [...group.holdings, holding] }
      : group
  );
}

function removeHoldingFromGroups(
  groups: ManagedSavingsGroupWithHoldings[],
  holdingId: string
): ManagedSavingsGroupWithHoldings[] {
  return groups.map((group) => ({
    ...group,
    holdings: group.holdings.filter((h) => h.id !== holdingId),
  }));
}

function replaceHoldingInGroups(
  groups: ManagedSavingsGroupWithHoldings[],
  holding: ManagedSavingsInvestment
): ManagedSavingsGroupWithHoldings[] {
  const sourceGroup = groups.find((g) => g.holdings.some((h) => h.id === holding.id));
  const sameGroup = sourceGroup?.id === holding.groupId;

  if (!sourceGroup || sameGroup) {
    // In-place replace — preserves the holding's position within its group.
    return groups.map((group) =>
      group.id === holding.groupId
        ? { ...group, holdings: group.holdings.map((h) => (h.id === holding.id ? holding : h)) }
        : group
    );
  }

  // Group changed: remove from the source group, append to the end of the
  // target group (matches the server's append-to-end-of-target-group move).
  return groups.map((group) => {
    if (group.id === sourceGroup.id) {
      return { ...group, holdings: group.holdings.filter((h) => h.id !== holding.id) };
    }
    if (group.id === holding.groupId) {
      return { ...group, holdings: [...group.holdings, holding] };
    }
    return group;
  });
}

export function ManagedSavingsPageClient({
  initialGroups,
}: ManagedSavingsPageClientProps) {
  const t = useTranslations("managedSavings");
  const tOrdering = useTranslations("managedSavings.ordering");
  const router = useRouter();
  // Default custom horizon is 15 years — matches the table's dynamic
  // projection column default (Product QA fix round, 2026-07-06).
  const [customYears, setCustomYears] = useState(15);
  const [groups, setGroups] = useState<ManagedSavingsGroupWithHoldings[]>(initialGroups);
  const [editingInvestment, setEditingInvestment] =
    useState<ManagedSavingsInvestment | null>(null);
  const [deletingInvestment, setDeletingInvestment] =
    useState<ManagedSavingsInvestment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalDefaultGroupId, setAddModalDefaultGroupId] = useState<string | undefined>(
    undefined
  );
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [renamingGroup, setRenamingGroup] = useState<GroupSummary | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<GroupSummary | null>(null);
  const [statusMessage, setStatusMessage] = useState<"saved" | "failed" | null>(null);
  const statusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const allHoldings = useMemo(() => groups.flatMap((group) => group.holdings), [groups]);
  const groupOptions = useMemo(
    () => groups.map((group) => ({ id: group.id, name: group.name })),
    [groups]
  );

  const summary = calculateManagedSavingsSummary(allHoldings);

  const totalCurrentValue = allHoldings.reduce((sum, inv) => sum + inv.currentBalance, 0);

  // Top KPI row shows a clear progression over time (current -> 1Y -> 5Y ->
  // 10Y); monthly contributions remain visible per-row and in each group's
  // totals row, just not as a top colored card (Product QA final visual round).
  const oneYearSummary = calculateTotalSummary(allHoldings, 1);
  const fiveYearSummary = calculateTotalSummary(allHoldings, 5);
  const tenYearSummary = calculateTotalSummary(allHoldings, 10);

  const showStatus = (status: "saved" | "failed") => {
    if (statusTimeout.current) clearTimeout(statusTimeout.current);
    setStatusMessage(status);
    statusTimeout.current = setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAddSuccess = (holding: ManagedSavingsInvestment) => {
    setGroups((prev) => addHoldingToGroups(prev, holding));
    setShowAddModal(false);
    router.refresh();
  };

  const handleEditSuccess = (holding: ManagedSavingsInvestment) => {
    setGroups((prev) => replaceHoldingInGroups(prev, holding));
    setEditingInvestment(null);
    router.refresh();
  };

  const handleDeleteRequest = (investment: ManagedSavingsInvestment) => {
    setEditingInvestment(null);
    setDeletingInvestment(investment);
  };

  const handleDeleteSuccess = (id: string) => {
    setGroups((prev) => removeHoldingFromGroups(prev, id));
    setDeletingInvestment(null);
    router.refresh();
  };

  const handleInvestmentUpdate = (holding: ManagedSavingsInvestment) => {
    setGroups((prev) => replaceHoldingInGroups(prev, holding));
    router.refresh();
  };

  const handleReorder = async (groupId: string, orderedIds: string[]) => {
    const previousGroups = groups;
    // Optimistic update: reorder the affected group's local holdings immediately.
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== groupId) return group;
        const reordered = orderedIds
          .map((id) => group.holdings.find((h) => h.id === id))
          .filter((h): h is ManagedSavingsInvestment => Boolean(h));
        return { ...group, holdings: reordered };
      })
    );

    const result = await reorderManagedSavingsHoldings({ orderedIds });
    if (result.ok) {
      setGroups((prev) => rebucketHoldings(prev, result.holdings));
      showStatus("saved");
      // Defense-in-depth: the server action already invalidates the shared
      // cache tag (updateTag), but explicitly refreshing here also clears
      // the client router cache, matching the pattern used by add/edit/delete.
      router.refresh();
    } else {
      setGroups(previousGroups);
      showStatus("failed");
    }
  };

  const handleCreateGroupSuccess = (group: GroupSummary) => {
    setGroups((prev) => [...prev, { ...group, holdings: [] }]);
    setShowCreateGroupModal(false);
    router.refresh();
  };

  const handleRenameGroupSuccess = (group: GroupSummary) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === group.id ? { ...g, name: group.name } : g))
    );
    setRenamingGroup(null);
    router.refresh();
  };

  const handleDeleteGroupSuccess = (groupId: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
    setDeletingGroup(null);
    router.refresh();
  };

  const handleMoveGroup = async (groupId: string, direction: "up" | "down") => {
    const index = groups.findIndex((g) => g.id === groupId);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= groups.length) return;

    const previousGroups = groups;
    const reordered = [...groups];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setGroups(reordered);

    const result = await reorderManagedSavingsGroups({
      orderedIds: reordered.map((g) => g.id),
    });
    if (result.ok) {
      setGroups((prev) =>
        result.groups.map((g) => {
          const existing = prev.find((x) => x.id === g.id);
          return { ...g, holdings: existing?.holdings ?? [] };
        })
      );
      showStatus("saved");
      router.refresh();
    } else {
      setGroups(previousGroups);
      showStatus("failed");
    }
  };

  const handleAddHoldingToGroup = (groupId: string) => {
    setAddModalDefaultGroupId(groupId);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {t("pageTitle")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Summary Cards — compact, top-of-page KPIs only. */}
      <ManagedSavingsSummaryCards
        totalCurrentValue={totalCurrentValue}
        projectedIn1Year={oneYearSummary.total}
        projectedIn5Years={fiveYearSummary.total}
        projectedIn10Years={tenYearSummary.total}
      />

      {/* Status toast — reorder (holdings or groups) save feedback. Fixed
          near the top of the viewport so it stays clearly visible even if
          the user has scrolled down. */}
      {statusMessage && (
        <div className="fixed top-4 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none">
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "pointer-events-auto flex items-center gap-2.5 rounded-2xl border px-5 py-3 shadow-lg text-sm md:text-base font-semibold",
              statusMessage === "saved"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            )}
          >
            {statusMessage === "saved" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            {statusMessage === "saved"
              ? tOrdering("orderSaved")
              : tOrdering("orderSaveFailed")}
          </div>
        </div>
      )}

      {/* Grouped Holdings — no top-level "Add Fund" action here: every
          holding must belong to a group, so adding is always initiated from
          inside a specific group ("Add holding to group") via
          ManagedSavingsGroups/ManagedSavingsGroupHeader. */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold">{t("holdingsTitle")}</h2>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-3xl bg-card border border-border/60 shadow-card p-12 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">
              {t("emptyState")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("emptyStateSubtitle")}
            </p>
          </div>
        ) : (
          <ManagedSavingsGroups
            groups={groups}
            customYears={customYears}
            onCustomYearsChange={setCustomYears}
            onEditClick={setEditingInvestment}
            onDeleteClick={handleDeleteRequest}
            onReorder={handleReorder}
            onCreateGroup={() => setShowCreateGroupModal(true)}
            onRenameGroup={(group) => setRenamingGroup(group)}
            onDeleteGroup={(group) => setDeletingGroup(group)}
            onMoveGroupUp={(groupId) => handleMoveGroup(groupId, "up")}
            onMoveGroupDown={(groupId) => handleMoveGroup(groupId, "down")}
            onAddHoldingToGroup={handleAddHoldingToGroup}
          />
        )}
      </div>

      {/* Breakdown by Product Type — orthogonal to groups, unchanged. */}
      <ManagedSavingsBreakdownByType summary={summary} />

      {/* Summary Table */}
      {allHoldings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {t("projectionsLabel")}
          </h2>
          <ManagedSavingsSummaryTable
            investments={allHoldings}
            customYears={customYears}
          />
        </div>
      )}

      {/* Disclaimers */}
      <div className="rounded-3xl bg-card border border-border/60 shadow-card p-4 md:p-6 space-y-4">
        <h3 className="font-bold text-base">{t("disclaimers.informational")}</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.noAdvice")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.publicData")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.simulation")}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingInvestment && (
        <EditManagedFundModal
          investment={editingInvestment}
          isOpen={!!editingInvestment}
          onClose={() => setEditingInvestment(null)}
          onSaveSuccess={handleEditSuccess}
          onDeleteRequest={handleDeleteRequest}
          onInvestmentUpdate={handleInvestmentUpdate}
          groups={groupOptions}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingInvestment && (
        <DeleteHoldingConfirmModal
          investment={deletingInvestment}
          isOpen={!!deletingInvestment}
          onClose={() => setDeletingInvestment(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {/* Add Modal — remounted (via key) on every open so the preselected
          group is always re-applied, even when opened repeatedly from
          different groups without the page remounting. */}
      {showAddModal && (
        <AddManagedFundModal
          key={addModalDefaultGroupId ?? "default"}
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAddSuccess={handleAddSuccess}
          groups={groupOptions}
          defaultGroupId={addModalDefaultGroupId}
        />
      )}

      {/* Group Management Modals */}
      <CreateManagedSavingsGroupModal
        isOpen={showCreateGroupModal}
        onClose={() => setShowCreateGroupModal(false)}
        onSuccess={handleCreateGroupSuccess}
      />
      {renamingGroup && (
        <RenameManagedSavingsGroupModal
          group={renamingGroup}
          isOpen={!!renamingGroup}
          onClose={() => setRenamingGroup(null)}
          onSuccess={handleRenameGroupSuccess}
        />
      )}
      {deletingGroup && (
        <DeleteManagedSavingsGroupModal
          group={deletingGroup}
          isOpen={!!deletingGroup}
          onClose={() => setDeletingGroup(null)}
          onSuccess={handleDeleteGroupSuccess}
        />
      )}
    </div>
  );
}
