"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/locale/formatters";
import { ExpandedInvestmentRow } from "./ExpandedInvestmentRow";
import type { PensionGemelInvestment } from "@/lib/mock/pension-gemel-data";

interface PensionGemelTableProps {
  investments: PensionGemelInvestment[];
  customYears: number;
  onInvestmentChange?: (investment: PensionGemelInvestment) => void;
}

export function PensionGemelTable({
  investments,
  customYears,
  onInvestmentChange,
}: PensionGemelTableProps) {
  const t = useTranslations("pensionGemel");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-4 md:p-6 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/40">
            <th className="h-10 px-2 text-start font-semibold text-muted-foreground">
              <span className="sr-only">Expand</span>
            </th>
            <th className="h-10 px-2 text-start font-semibold text-muted-foreground">
              {t("tableColumns.name")}
            </th>
            <th className="h-10 px-2 text-start font-semibold text-muted-foreground hidden sm:table-cell">
              {t("tableColumns.type")}
            </th>
            <th className="h-10 px-2 text-end font-semibold text-muted-foreground hidden md:table-cell">
              {t("tableColumns.currentBalance")}
            </th>
            <th className="h-10 px-2 text-end font-semibold text-muted-foreground hidden md:table-cell">
              {t("tableColumns.monthlyContribution")}
            </th>
            <th className="h-10 px-2 text-end font-semibold text-muted-foreground hidden lg:table-cell">
              {t("tableColumns.in10Years")}
            </th>
            <th className="h-10 px-2 text-end font-semibold text-muted-foreground hidden xl:table-cell">
              {t("tableColumns.estimatedMonthlyPension")}
            </th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => (
            <div key={investment.id}>
              <tr
                className="border-b border-border/40 hover:bg-secondary/30 transition-colors cursor-pointer"
                onClick={() => handleToggleExpand(investment.id)}
              >
                <td className="h-14 px-2">
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform",
                      expandedId === investment.id && "rotate-180"
                    )}
                  />
                </td>
                <td className="h-14 px-2 font-medium truncate">
                  <div className="flex flex-col">
                    <span className="font-semibold">{investment.name}</span>
                    <span className="text-xs text-muted-foreground sm:hidden">
                      {investment.type === "pension"
                        ? "פנסיה"
                        : investment.type === "hishtalmut"
                          ? "קרן השתלמות"
                          : investment.type === "gemel"
                            ? "קופת גמל"
                            : "חיסכון"}
                    </span>
                  </div>
                </td>
                <td className="h-14 px-2 hidden sm:table-cell text-muted-foreground text-xs">
                  {investment.type === "pension"
                    ? "פנסיה"
                    : investment.type === "hishtalmut"
                      ? "קרן השתלמות"
                      : investment.type === "gemel"
                        ? "קופת גמל"
                        : "חיסכון"}
                </td>
                <td className="h-14 px-2 hidden md:table-cell text-end font-mono">
                  {formatCurrency(investment.currentBalance)}
                </td>
                <td className="h-14 px-2 hidden md:table-cell text-end font-mono">
                  {formatCurrency(investment.monthlyContribution)}
                </td>
                <td className="h-14 px-2 hidden lg:table-cell text-end font-mono">
                  {/* Placeholder for 10-year projection */}
                  {formatCurrency(
                    investment.currentBalance * 1.8
                  )}
                </td>
                <td className="h-14 px-2 hidden xl:table-cell text-end font-mono">
                  {investment.type === "pension"
                    ? formatCurrency(
                        investment.type === "pension" && investment.pensionConversionFactor
                          ? (investment.currentBalance / investment.pensionConversionFactor) * 1000
                          : 0
                      )
                    : "-"}
                </td>
              </tr>

              {expandedId === investment.id && (
                <tr>
                  <td colSpan={7} className="p-0">
                    <ExpandedInvestmentRow
                      investment={investment}
                      customYears={customYears}
                      onInvestmentChange={onInvestmentChange}
                    />
                  </td>
                </tr>
              )}
            </div>
          ))}
        </tbody>
      </table>
    </div>
  );
}
