"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/locale/formatters";
import {
  calculateTotalSummary,
  calculatePensionMonthlyPension,
  type PensionGemelInvestment,
} from "@/lib/mock/pension-gemel-data";

interface PensionGemelSummaryTablesProps {
  investments: PensionGemelInvestment[];
  customYears: number;
}

export function PensionGemelSummaryTables({
  investments,
  customYears,
}: PensionGemelSummaryTablesProps) {
  const t = useTranslations("pensionGemel");

  const periods = [
    { year: 0, label: t("summaryTables.today") },
    { year: 1, label: t("summaryTables.in1Year") },
    { year: 5, label: t("summaryTables.in5Years") },
    { year: 10, label: t("summaryTables.in10Years") },
    { year: 15, label: t("summaryTables.in15Years") },
    ...(customYears && customYears > 15
      ? [{ year: customYears, label: t.rich("summaryTables.inCustomYears", {years: customYears}) }]
      : []),
  ];

  return (
    <div className="space-y-8">
      {/* Accumulated Value Summary */}
      <div className="rounded-3xl bg-card border border-border/60 shadow-card p-4 md:p-6 overflow-x-auto">
        <h3 className="font-bold text-base md:text-lg mb-4">
          {t("summaryTables.accumulatedValueTitle")}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40">
              <th className="h-10 px-3 text-start font-semibold text-muted-foreground">
                {t("summaryTables.period")}
              </th>
              <th className="h-10 px-3 text-end font-semibold text-muted-foreground">
                {t("summaryTables.pension")}
              </th>
              <th className="h-10 px-3 text-end font-semibold text-muted-foreground hidden sm:table-cell">
                {t("summaryTables.hishtalmut")}
              </th>
              <th className="h-10 px-3 text-end font-semibold text-muted-foreground hidden sm:table-cell">
                {t("summaryTables.gemel")}
              </th>
              <th className="h-10 px-3 text-end font-semibold text-muted-foreground hidden md:table-cell">
                {t("summaryTables.hashkaa")}
              </th>
              <th className="h-10 px-3 text-end font-semibold text-muted-foreground hidden md:table-cell">
                {t("summaryTables.savings")}
              </th>
              <th className="h-10 px-3 text-end font-semibold text-muted-foreground font-bold">
                {t("summaryTables.total")}
              </th>
            </tr>
          </thead>
          <tbody>
            {periods.map((period) => {
              const summary = calculateTotalSummary(investments, period.year);
              return (
                <tr key={period.year} className="border-b border-border/40 hover:bg-secondary/20">
                  <td className="h-12 px-3 font-medium">{period.label}</td>
                  <td className="h-12 px-3 text-end font-mono text-pension">
                    {formatCurrency(summary.pension)}
                  </td>
                  <td className="h-12 px-3 text-end font-mono hidden sm:table-cell">
                    {formatCurrency(summary.hishtalmut)}
                  </td>
                  <td className="h-12 px-3 text-end font-mono hidden sm:table-cell">
                    {formatCurrency(summary.gemel)}
                  </td>
                  <td className="h-12 px-3 text-end font-mono hidden md:table-cell">
                    {formatCurrency(summary.savings)}
                  </td>
                  <td className="h-12 px-3 text-end font-mono hidden md:table-cell">
                    {formatCurrency(summary.savings)}
                  </td>
                  <td className="h-12 px-3 text-end font-mono font-bold text-networth">
                    {formatCurrency(summary.total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pension Monthly Summary */}
      {investments.some((inv) => inv.type === "pension") && (
        <div className="rounded-3xl bg-card border border-border/60 shadow-card p-4 md:p-6 overflow-x-auto">
          <h3 className="font-bold text-base md:text-lg mb-4">
            {t("summaryTables.pensionSummaryTitle")}
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40">
                <th className="h-10 px-3 text-start font-semibold text-muted-foreground">
                  {t("summaryTables.period")}
                </th>
                <th className="h-10 px-3 text-end font-semibold text-muted-foreground">
                  {t("expandedView.simulation.projectedValue")}
                </th>
                <th className="h-10 px-3 text-end font-semibold text-muted-foreground font-bold">
                  {t("summaryTables.monthlyPension")}
                </th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period) => {
                const summary = calculateTotalSummary(investments, period.year);
                const monthlyPension = calculatePensionMonthlyPension(investments, period.year);
                return (
                  <tr key={period.year} className="border-b border-border/40 hover:bg-secondary/20">
                    <td className="h-12 px-3 font-medium">{period.label}</td>
                    <td className="h-12 px-3 text-end font-mono text-pension">
                      {formatCurrency(summary.pension)}
                    </td>
                    <td className="h-12 px-3 text-end font-mono font-bold text-networth">
                      {formatCurrency(monthlyPension)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
