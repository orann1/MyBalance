"use client";

import { useTranslations } from "next-intl";
import { FolderPlus, TrendingUp } from "lucide-react";
import { ManagedSavingsGroupSection } from "./ManagedSavingsGroupSection";
import type { ManagedSavingsGroupWithHoldings } from "@/lib/data/managed-savings";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

interface ManagedSavingsGroupsProps {
  groups: ManagedSavingsGroupWithHoldings[];
  customYears: number;
  onCustomYearsChange: (years: number) => void;
  onEditClick: (investment: ManagedSavingsInvestment) => void;
  onDeleteClick: (investment: ManagedSavingsInvestment) => void;
  onReorder: (groupId: string, orderedIds: string[]) => void;
  onCreateGroup: () => void;
  onRenameGroup: (group: ManagedSavingsGroupWithHoldings) => void;
  onDeleteGroup: (group: ManagedSavingsGroupWithHoldings) => void;
  onMoveGroupUp: (groupId: string) => void;
  onMoveGroupDown: (groupId: string) => void;
  onAddHoldingToGroup: (groupId: string) => void;
}

export function ManagedSavingsGroups({
  groups,
  customYears,
  onCustomYearsChange,
  onEditClick,
  onDeleteClick,
  onReorder,
  onCreateGroup,
  onRenameGroup,
  onDeleteGroup,
  onMoveGroupUp,
  onMoveGroupDown,
  onAddHoldingToGroup,
}: ManagedSavingsGroupsProps) {
  const t = useTranslations("managedSavings");
  const tGroups = useTranslations("managedSavings.groups");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-lg bg-card border border-border/40 px-3 py-1.5 shadow-sm">
          <TrendingUp className="h-4 w-4 text-asset shrink-0" />
          <label htmlFor="managed-savings-groups-custom-years" className="text-xs font-semibold text-foreground whitespace-nowrap">
            {t("customHorizon")}
          </label>
          <input
            id="managed-savings-groups-custom-years"
            type="number"
            min="1"
            max="50"
            value={customYears}
            onChange={(e) => onCustomYearsChange(Math.max(1, Number(e.target.value)))}
            className="w-16 px-2 py-1 rounded-md border border-border bg-background text-xs font-mono font-semibold text-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-asset"
          />
          <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
            {t("years")}
          </span>
        </div>

        <button
          type="button"
          onClick={onCreateGroup}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-asset/40 text-asset bg-asset/5 font-medium text-sm hover:bg-asset/10 transition-colors"
        >
          <FolderPlus className="h-4 w-4" />
          {tGroups("createGroup")}
        </button>
      </div>

      <div className="space-y-6">
        {groups.map((group, idx) => (
          <ManagedSavingsGroupSection
            key={group.id}
            group={group}
            customYears={customYears}
            isFirst={idx === 0}
            isLast={idx === groups.length - 1}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onReorder={onReorder}
            onRenameGroup={onRenameGroup}
            onDeleteGroup={onDeleteGroup}
            onMoveGroupUp={onMoveGroupUp}
            onMoveGroupDown={onMoveGroupDown}
            onAddHoldingToGroup={onAddHoldingToGroup}
          />
        ))}
      </div>
    </div>
  );
}
