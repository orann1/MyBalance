"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/locale/formatters";
import {
  calculateTotalSummary,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";

interface ManagedSavingsSummaryTableProps {
  investments: ManagedSavingsInvestment[];
  customYears: number;
}

export function ManagedSavingsSummaryTable({
  investments,
  customYears,
}: ManagedSavingsSummaryTableProps) {
  const t = useTranslations("managedSavings");

  const periods = [
    { year: 0, label: t("summaryTable.today") },
    { year: 1, label: t("summaryTable.in1Year") },
    { year: 5, label: t("summaryTable.in5Years") },
    { year: 10, label: t("summaryTable.in10Years") },
    { year: 15, label: t("summaryTable.in15Years") },
    ...(customYears && customYears > 15
      ? [{ year: customYears, label: t.rich("summaryTable.inCustomYears", {years: customYears}) }]
      : []),
  ];

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card overflow-hidden">
      <div className="p-6 border-b border-border/40 bg-secondary/30">
        <h3 className="font-bold text-base">{t("summaryTable.title")}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-secondary/20">
              <th className="h-10 px-4 text-start font-semibold text-muted-foreground">
                {t("summaryTable.period")}
              </th>
              <th className="h-10 px-4 text-end font-semibold text-muted-foreground">
                {t("summaryTable.hishtalmut")}
              </th>
              <th className="h-10 px-4 text-end font-semibold text-muted-foreground">
                {t("summaryTable.gemel")}
              </th>
              <th className="h-10 px-4 text-end font-semibold text-muted-foreground">
                {t("summaryTable.hashkaa")}
              </th>
              <th className="h-10 px-4 text-end font-semibold text-muted-foreground">
                {t("summaryTable.savings")}
              </th>
              <th className="h-10 px-4 text-end font-semibold text-foreground font-bold">
                {t("summaryTable.total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => {
              const summary = calculateTotalSummary(investments, period.year);
              return (
                <tr key={period.year} className="border-b border-border/30 hover:bg-secondary/20 transition-colors">
                  <td className="h-12 px-4 font-medium text-foreground">{period.label}</td>
                  <td className="h-12 px-4 text-end font-mono text-asset">
                    {formatCurrency(summary.hishtalmut)}
                  </td>
                  <td className="h-12 px-4 text-end font-mono text-asset">
                    {formatCurrency(summary.gemel)}
                  </td>
                  <td className="h-12 px-4 text-end font-mono text-goal">
                    {formatCurrency(summary.hashkaa)}
                  </td>
                  <td className="h-12 px-4 text-end font-mono text-goal">
                    {formatCurrency(summary.savings)}
                  </td>
                  <td className="h-12 px-4 text-end font-mono font-bold text-networth">
                    {formatCurrency(summary.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
