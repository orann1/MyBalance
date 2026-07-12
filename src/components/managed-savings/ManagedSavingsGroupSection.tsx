"use client";

import { useTranslations } from "next-intl";
import { PlusCircle } from "lucide-react";
import { ManagedSavingsGroupHeader } from "./ManagedSavingsGroupHeader";
import { ManagedSavingsGroupTable } from "./ManagedSavingsGroupTable";
import { calculateProjectionTotals } from "@/lib/managed-savings/summary";
import type { ManagedSavingsGroupWithHoldings } from "@/lib/data/managed-savings";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

interface ManagedSavingsGroupSectionProps {
  group: ManagedSavingsGroupWithHoldings;
  customYears: number;
  isFirst: boolean;
  isLast: boolean;
  onEditClick: (investment: ManagedSavingsInvestment) => void;
  onDeleteClick: (investment: ManagedSavingsInvestment) => void;
  onReorder: (groupId: string, orderedIds: string[]) => void;
  onRenameGroup: (group: ManagedSavingsGroupWithHoldings) => void;
  onDeleteGroup: (group: ManagedSavingsGroupWithHoldings) => void;
  onMoveGroupUp: (groupId: string) => void;
  onMoveGroupDown: (groupId: string) => void;
  onAddHoldingToGroup: (groupId: string) => void;
}

export function ManagedSavingsGroupSection({
  group,
  customYears,
  isFirst,
  isLast,
  onEditClick,
  onDeleteClick,
  onReorder,
  onRenameGroup,
  onDeleteGroup,
  onMoveGroupUp,
  onMoveGroupDown,
  onAddHoldingToGroup,
}: ManagedSavingsGroupSectionProps) {
  const tGroups = useTranslations("managedSavings.groups");
  const totals = calculateProjectionTotals(group.holdings, customYears);

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card overflow-hidden">
      <ManagedSavingsGroupHeader
        name={group.name}
        holdingsCount={group.holdings.length}
        currentBalanceTotal={totals.currentBalance}
        monthlyContributionTotal={totals.monthlyContribution}
        isFirst={isFirst}
        isLast={isLast}
        onRename={() => onRenameGroup(group)}
        onDelete={() => onDeleteGroup(group)}
        onMoveUp={() => onMoveGroupUp(group.id)}
        onMoveDown={() => onMoveGroupDown(group.id)}
        onAddHolding={() => onAddHoldingToGroup(group.id)}
      />

      {group.holdings.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-semibold text-foreground mb-1">
            {tGroups("emptyGroupTitle")}
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            {tGroups("emptyGroupSubtitle")}
          </p>
          <button
            type="button"
            onClick={() => onAddHoldingToGroup(group.id)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-asset text-white font-medium text-sm hover:bg-asset/90 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            {tGroups("addHoldingToGroup")}
          </button>
        </div>
      ) : (
        <ManagedSavingsGroupTable
          groupId={group.id}
          investments={group.holdings}
          customYears={customYears}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onReorder={(orderedIds) => onReorder(group.id, orderedIds)}
        />
      )}
    </div>
  );
}
