"use client";

import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { formatCurrency } from "@/lib/locale/formatters";
import { calculateProjectionTotals } from "@/lib/managed-savings/summary";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

interface ManagedSavingsGroupSummaryRowProps {
  investments: ManagedSavingsInvestment[];
  customYears: number;
}

/**
 * Per-group summary/footer row (Phase 2D-2A). Reuses
 * `calculateProjectionTotals` — the same source of truth the global table
 * totals row and top KPI cards rely on — so group and global totals never
 * diverge or duplicate calculation logic. Column layout mirrors
 * ManagedSavingsGroupTable exactly (15 columns).
 */
export function ManagedSavingsGroupSummaryRow({
  investments,
  customYears,
}: ManagedSavingsGroupSummaryRowProps) {
  const t = useTranslations("managedSavings");

  const totals = calculateProjectionTotals(investments, customYears);

  return (
    <tr className="bg-emerald-50/60 border-t-4 border-emerald-300/70 font-bold">
      <td className="h-12 px-2 py-3 border-e border-border/15" />
      <td className="h-12 px-3 py-3 border-e border-border/15" />
      <td className="h-12 px-3 py-3 text-start text-emerald-900 border-e border-border/15">
        <span className="inline-flex items-center gap-1">
          {t("table.totalsLabel")}
          <span
            title={t("table.projectionZeroReturnTitle")}
            aria-label={t("table.projectionZeroReturnTitle")}
            className="inline-flex"
          >
            <Info className="h-3.5 w-3.5 shrink-0 text-emerald-700/70" aria-hidden="true" />
          </span>
        </span>
      </td>
      <td className="h-12 px-3 py-3 border-e border-border/15" />
      <td className="h-12 px-3 py-3 border-e border-border/15" />
      <td className="h-12 px-3 py-3 border-e border-border/15" />
      <td className="h-12 px-3 py-3 text-end font-mono text-asset border-e border-border/15">
        {formatCurrency(totals.currentBalance)}
      </td>
      <td className="h-12 px-3 py-3 border-e border-border/15" />
      <td className="h-12 px-3 py-3 border-e border-border/15" />
      <td className="h-12 px-3 py-3 border-e border-border/15" />
      <td className="h-12 px-3 py-3 text-end font-mono text-goal border-e border-border/15">
        {formatCurrency(totals.in1Year)}
      </td>
      <td className="h-12 px-3 py-3 text-end font-mono text-goal border-e border-border/15">
        {formatCurrency(totals.in5Years)}
      </td>
      <td className="h-12 px-3 py-3 text-end font-mono text-goal border-e border-border/15">
        {formatCurrency(totals.in10Years)}
      </td>
      <td className="h-12 px-3 py-3 text-end font-mono text-networth ps-4 border-s-2 border-networth/40">
        {formatCurrency(totals.inCustomYears)}
      </td>
      <td className="h-12 px-3 py-3" />
    </tr>
  );
}
