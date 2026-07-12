"use client";

import { useTranslations } from "next-intl";
import { ArrowUp, ArrowDown, Pencil, Trash2, Plus, Layers } from "lucide-react";
import { formatCurrency } from "@/lib/locale/formatters";

interface ManagedSavingsGroupHeaderProps {
  name: string;
  holdingsCount: number;
  currentBalanceTotal: number;
  monthlyContributionTotal: number;
  isFirst: boolean;
  isLast: boolean;
  onRename: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onAddHolding: () => void;
}

export function ManagedSavingsGroupHeader({
  name,
  holdingsCount,
  currentBalanceTotal,
  monthlyContributionTotal,
  isFirst,
  isLast,
  onRename,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddHolding,
}: ManagedSavingsGroupHeaderProps) {
  const t = useTranslations("managedSavings");
  const tGroups = useTranslations("managedSavings.groups");

  return (
    <div className="bg-gradient-to-r from-secondary/60 to-secondary/30 border-b border-border/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="rounded-full bg-white/70 border border-border/40 p-2 shrink-0 mt-0.5">
            <Layers className="h-4 w-4 text-asset" />
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-foreground truncate">{name}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
              <span>{t("table.investmentsCount", { count: holdingsCount })}</span>
              <span className="font-mono font-semibold text-asset">
                {tGroups("balanceLabel")}: {formatCurrency(currentBalanceTotal)}
              </span>
              <span className="font-mono">
                {tGroups("contributionLabel")}: {formatCurrency(monthlyContributionTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={onMoveUp}
              disabled={isFirst}
              className="p-1 rounded text-muted-foreground hover:bg-white/60 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
              title={tGroups("moveGroupUp")}
              aria-label={tGroups("moveGroupUp")}
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onMoveDown}
              disabled={isLast}
              className="p-1 rounded text-muted-foreground hover:bg-white/60 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
              title={tGroups("moveGroupDown")}
              aria-label={tGroups("moveGroupDown")}
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={onAddHolding}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-asset hover:bg-asset/90 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            {tGroups("addHoldingToGroup")}
          </button>
          <button
            type="button"
            onClick={onRename}
            className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-white/60 hover:text-foreground transition-colors"
            title={tGroups("renameGroup")}
            aria-label={tGroups("renameGroup")}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
            title={tGroups("deleteGroup")}
            aria-label={tGroups("deleteGroup")}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
