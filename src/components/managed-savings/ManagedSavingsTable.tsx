"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, TrendingUp, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/locale/formatters";
import { ExpandedManagedSavingsRow } from "./ExpandedManagedSavingsRow";
import {
  projectSimulations,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";

interface ManagedSavingsTableProps {
  investments: ManagedSavingsInvestment[];
  customYears: number;
  onEditClick?: (investment: ManagedSavingsInvestment) => void;
}

function getProductColor(type: string): string {
  const colors: Record<string, string> = {
    hishtalmut: "bg-blue-100 text-blue-700",
    gemel: "bg-green-100 text-green-700",
    hashkaa: "bg-purple-100 text-purple-700",
    savings: "bg-orange-100 text-orange-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}

export function ManagedSavingsTable({
  investments,
  customYears,
  onEditClick,
}: ManagedSavingsTableProps) {
  const t = useTranslations("managedSavings");
  const tOwner = useTranslations("managedSavings.ownerLabels");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pre-compute projections for every investment row using the same model as summary cards.
  // projectSimulations handles balance + monthly contributions + accumulation fee.
  const projections = useMemo(() => {
    const map: Record<string, Record<number, number>> = {};
    investments.forEach((inv) => {
      const sims = projectSimulations(inv, customYears);
      map[inv.id] = {
        1: sims[1]?.projectedValue ?? 0,
        5: sims[5]?.projectedValue ?? 0,
        10: sims[10]?.projectedValue ?? 0,
        15: sims[15]?.projectedValue ?? 0,
        [customYears]: sims[customYears]?.projectedValue ?? 0,
      };
    });
    return map;
  }, [investments, customYears]);

  const typeLabels: Record<string, string> = {
    hishtalmut: t("tableColumns.typeHishtalmut"),
    gemel: t("tableColumns.typeGemel"),
    hashkaa: t("tableColumns.typeHashkaa"),
    savings: t("tableColumns.typeSavings"),
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-secondary/60 to-secondary/30 border-b border-border/40 p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-asset" />
            {t("pageTitle")}
          </h3>
          <span className="text-sm font-medium text-muted-foreground">
            {t("table.investmentsCount", { count: investments.length })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-secondary/40 border-b-2 border-border/80">
              <th className="h-12 px-4 py-3 text-start font-semibold text-muted-foreground w-10 border-e border-border/30">
                <span className="sr-only">{t("table.expandSr")}</span>
              </th>
              <th className="h-12 px-4 py-3 text-start font-bold text-foreground border-e border-border/30">
                {t("tableColumns.name")}
              </th>
              <th className="h-12 px-4 py-3 text-start font-semibold text-muted-foreground border-e border-border/30">
                {t("tableColumns.ownership")}
              </th>
              <th className="h-12 px-4 py-3 text-start font-semibold text-muted-foreground border-e border-border/30">
                {t("tableColumns.type")}
              </th>
              <th className="h-12 px-4 py-3 text-start font-semibold text-muted-foreground text-xs border-e border-border/30">
                {t("tableColumns.company")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-semibold text-muted-foreground border-e border-border/30">
                {t("tableColumns.currentBalance")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-semibold text-muted-foreground border-e border-border/30">
                {t("tableColumns.monthlyContribution")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-semibold text-muted-foreground text-xs border-e border-border/30">
                {t("tableColumns.accumulationFee")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-semibold text-asset border-e border-border/30">
                {t("tableColumns.last5YearReturn")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-semibold text-goal border-e border-border/30">
                {t("tableColumns.in1Year")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-semibold text-goal border-e border-border/30">
                {t("tableColumns.in5Years")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-semibold text-goal border-e border-border/30">
                {t("tableColumns.in10Years")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-semibold text-goal border-e border-border/30">
                {t("tableColumns.in15Years")}
              </th>
              <th className="h-12 px-4 py-3 text-end font-bold text-networth ps-6 border-s-2 border-networth/40">
                {t.rich("tableColumns.inCustomYears", { years: customYears })}
              </th>
              <th className="h-12 px-4 py-3 text-center font-semibold text-muted-foreground w-12">
                <span className="sr-only">{t("table.actionsSr")}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {investments.map((investment, idx) => (
              <React.Fragment key={investment.id}>
                <tr
                  className={cn(
                    "border-b border-border/50 transition-all cursor-pointer",
                    expandedId === investment.id
                      ? "bg-asset/8 border-b-2 border-asset/40 ring-1 ring-asset/30"
                      : "hover:bg-secondary/50",
                    idx % 2 === 0 ? "bg-white/70" : "bg-secondary/8"
                  )}
                  onClick={() => handleToggleExpand(investment.id)}
                >
                  <td className="h-14 px-4 py-3 text-start border-e border-border/15">
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        expandedId === investment.id && "rotate-180"
                      )}
                    />
                  </td>
                  <td className="h-14 px-4 py-3 text-start border-e border-border/15">
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">
                        {investment.name}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5">
                        {investment.officialFundId}
                      </span>
                    </div>
                  </td>
                  <td className="h-14 px-4 py-3 text-start border-e border-border/15">
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-secondary/80 text-foreground border border-border/40">
                      {tOwner(investment.owner)}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-start border-e border-border/15">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                        getProductColor(investment.type)
                      )}
                    >
                      {typeLabels[investment.type] ?? investment.type}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-start border-e border-border/15">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium">
                        {investment.managingCompany}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {investment.track}
                      </span>
                    </div>
                  </td>
                  <td className="h-14 px-4 py-3 text-end border-e border-border/15">
                    <span className="font-mono font-bold text-asset">
                      {formatCurrency(investment.currentBalance)}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-end border-e border-border/15">
                    <span className="font-mono text-sm text-muted-foreground">
                      {formatCurrency(investment.monthlyContribution)}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-end border-e border-border/15">
                    <span className="font-mono text-xs text-muted-foreground">
                      {investment.accumulationFeePercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-end border-e border-border/15">
                    <span className="font-mono text-sm text-green-600 font-semibold">
                      {formatPercent(investment.trackPerformance.last5Years)}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-end border-e border-border/15">
                    <span className="font-mono text-sm font-semibold text-goal">
                      {formatCurrency(projections[investment.id]?.[1] ?? 0)}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-end border-e border-border/15">
                    <span className="font-mono text-sm font-semibold text-goal">
                      {formatCurrency(projections[investment.id]?.[5] ?? 0)}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-end border-e border-border/15">
                    <span className="font-mono text-sm font-semibold text-goal">
                      {formatCurrency(projections[investment.id]?.[10] ?? 0)}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-end border-e border-border/15">
                    <span className="font-mono text-sm font-semibold text-goal">
                      {formatCurrency(projections[investment.id]?.[15] ?? 0)}
                    </span>
                  </td>
                  <td className="h-14 px-4 py-3 text-end font-mono font-bold text-networth ps-6 border-s-2 border-networth/40">
                    {formatCurrency(projections[investment.id]?.[customYears] ?? 0)}
                  </td>
                  <td className="h-14 px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditClick?.(investment);
                      }}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors"
                      title={t("table.editTitle")}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>

                {expandedId === investment.id && (
                  <tr>
                    <td colSpan={15} className="p-0">
                      <ExpandedManagedSavingsRow investment={investment} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
