"use client";

import { useTranslations } from "next-intl";
import { formatCurrency, formatPercent } from "@/lib/locale/formatters";
import type { ManagedSavingsSummary } from "@/lib/managed-savings/summary";

interface ManagedSavingsBreakdownByTypeProps {
  summary: ManagedSavingsSummary;
}

const TYPE_LABEL_KEYS: Record<string, string> = {
  hishtalmut: "tableColumns.typeHishtalmut",
  gemel: "tableColumns.typeGemel",
  hashkaa: "tableColumns.typeHashkaa",
  savings: "tableColumns.typeSavings",
  other: "tableColumns.typeOther",
};

// Rendered below the main holdings table (Product QA fix round, 2026-07-06)
// — was previously part of ManagedSavingsSummaryCards, above the table,
// which delayed the table too far down the page.
export function ManagedSavingsBreakdownByType({ summary }: ManagedSavingsBreakdownByTypeProps) {
  const t = useTranslations("managedSavings");
  const tSummary = useTranslations("managedSavings.summary");

  if (summary.holdingsCount === 0) return null;

  const visibleTypes = summary.holdingsByType.filter((breakdown) => breakdown.count > 0);
  if (visibleTypes.length === 0) return null;

  return (
    <div className="rounded-2xl bg-card border border-border/60 shadow-card p-5">
      <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-3">
        {tSummary("breakdownByType")}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleTypes.map((breakdown) => (
          <div
            key={breakdown.type}
            className="rounded-xl bg-secondary/30 border border-border/40 p-3"
          >
            <p className="text-xs font-semibold text-foreground mb-1">
              {t(TYPE_LABEL_KEYS[breakdown.type])}
            </p>
            <p className="font-mono font-bold text-sm text-asset">
              {formatCurrency(breakdown.totalBalance)}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              {breakdown.percentOfTotalBalance != null
                ? formatPercent(breakdown.percentOfTotalBalance, undefined, 0)
                : "—"}{" "}
              · {breakdown.linkedCount}/{breakdown.count}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
