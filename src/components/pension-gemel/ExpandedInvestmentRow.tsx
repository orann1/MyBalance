"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Info, Edit2 } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/locale/formatters";
import {
  projectSimulations,
  getTrackPerformance,
  type PensionGemelInvestment,
} from "@/lib/mock/pension-gemel-data";

interface ExpandedInvestmentRowProps {
  investment: PensionGemelInvestment;
  customYears: number;
  onInvestmentChange?: (investment: PensionGemelInvestment) => void;
}

export function ExpandedInvestmentRow({
  investment,
  customYears,
  onInvestmentChange,
}: ExpandedInvestmentRowProps) {
  const t = useTranslations("pensionGemel");
  const [editedInvestment, setEditedInvestment] = useState(investment);

  const performance = getTrackPerformance(investment.officialFundId || investment.track);
  const simulations = projectSimulations(investment, customYears);

  const handleFieldChange = (field: string, value: string | number) => {
    const updated = { ...editedInvestment, [field]: value };
    setEditedInvestment(updated);
    onInvestmentChange?.(updated);
  };

  return (
    <div className="bg-secondary/20 border-y border-border/40 p-4 md:p-6 space-y-6">
      {/* Investment Details */}
      <div>
        <h4 className="font-semibold text-sm mb-4">
          {t("expandedView.investmentDetails")}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("expandedView.name")}
            </label>
            <p className="text-sm font-medium">{editedInvestment.name}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("expandedView.owner")}
            </label>
            <p className="text-sm font-medium">
              {t(`ownerLabels.${editedInvestment.owner}`)}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("expandedView.productType")}
            </label>
            <p className="text-sm font-medium capitalize">
              {editedInvestment.type === "hishtalmut"
                ? "קרן השתלמות"
                : editedInvestment.type === "gemel"
                  ? "קופת גמל"
                  : editedInvestment.type === "pension"
                    ? "פנסיה"
                    : "חיסכון"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("expandedView.managingCompany")}
            </label>
            <p className="text-sm font-medium">{editedInvestment.managingCompany}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("expandedView.track")}
            </label>
            <p className="text-sm font-medium">{editedInvestment.track}</p>
          </div>
          {editedInvestment.officialFundId && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("expandedView.fundId")}
              </label>
              <p className="text-sm font-mono text-muted-foreground">
                {editedInvestment.officialFundId}
              </p>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("expandedView.lastUpdate")}
            </label>
            <p className="text-sm font-medium">{editedInvestment.lastUpdateDate}</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("expandedView.status")}
            </label>
            <p className="text-sm font-medium">
              {editedInvestment.status === "active"
                ? t("expandedView.active")
                : t("expandedView.inactive")}
            </p>
          </div>
        </div>
      </div>

      {/* Editable Inputs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h4 className="font-semibold text-sm flex items-center gap-1">
            <Edit2 className="h-4 w-4" />
            {t("expandedView.editableInputs")}
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("tableColumns.currentBalance")}
            </label>
            <input
              type="number"
              value={editedInvestment.currentBalance}
              onChange={(e) =>
                handleFieldChange(
                  "currentBalance",
                  Math.max(0, Number(e.target.value))
                )
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pension"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("tableColumns.monthlyContribution")}
            </label>
            <input
              type="number"
              value={editedInvestment.monthlyContribution}
              onChange={(e) =>
                handleFieldChange(
                  "monthlyContribution",
                  Math.max(0, Number(e.target.value))
                )
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pension"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("tableColumns.accumulationFee")} (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={editedInvestment.accumulationFeePercent}
              onChange={(e) =>
                handleFieldChange(
                  "accumulationFeePercent",
                  Math.max(0, Number(e.target.value))
                )
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pension"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">
              {t("tableColumns.depositFee")} (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={editedInvestment.depositFeePercent}
              onChange={(e) =>
                handleFieldChange(
                  "depositFeePercent",
                  Math.max(0, Number(e.target.value))
                )
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pension"
            />
          </div>
          {editedInvestment.type === "pension" && editedInvestment.retirementAge && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("expandedView.retirementAge")}
              </label>
              <input
                type="number"
                value={editedInvestment.retirementAge}
                onChange={(e) =>
                  handleFieldChange("retirementAge", Math.max(50, Number(e.target.value)))
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pension"
              />
            </div>
          )}
          {editedInvestment.type === "pension" && editedInvestment.pensionConversionFactor && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("expandedView.pensionConversionFactor")}
              </label>
              <input
                type="number"
                step="0.1"
                value={editedInvestment.pensionConversionFactor}
                onChange={(e) =>
                  handleFieldChange(
                    "pensionConversionFactor",
                    Math.max(1, Number(e.target.value))
                  )
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-pension"
              />
            </div>
          )}
        </div>
      </div>

      {/* Public Track Performance */}
      <div>
        <h4 className="font-semibold text-sm mb-4">
          {t("expandedView.publicTrackPerformance")}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-lg border border-border/40 bg-card p-3">
            <p className="text-xs text-muted-foreground mb-1">
              {t("expandedView.performance.lastMonth")}
            </p>
            <p className="font-semibold text-green-600">
              {formatPercent(performance.lastMonth)}
            </p>
          </div>
          <div className="rounded-lg border border-border/40 bg-card p-3">
            <p className="text-xs text-muted-foreground mb-1">
              {t("expandedView.performance.last1Year")}
            </p>
            <p className="font-semibold text-green-600">
              {formatPercent(performance.last1Year)}
            </p>
          </div>
          <div className="rounded-lg border border-border/40 bg-card p-3">
            <p className="text-xs text-muted-foreground mb-1">
              {t("expandedView.performance.last3Years")}
            </p>
            <p className="font-semibold text-green-600">
              {formatPercent(performance.last3Years)}
            </p>
          </div>
          <div className="rounded-lg border border-border/40 bg-card p-3">
            <p className="text-xs text-muted-foreground mb-1">
              {t("expandedView.performance.last5Years")}
            </p>
            <p className="font-semibold text-green-600">
              {formatPercent(performance.last5Years)}
            </p>
          </div>
          {performance.last10Years && (
            <div className="rounded-lg border border-border/40 bg-card p-3">
              <p className="text-xs text-muted-foreground mb-1">
                {t("expandedView.performance.last10Years")}
              </p>
              <p className="font-semibold text-green-600">
                {formatPercent(performance.last10Years)}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-secondary/60 p-3 mt-3 text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-pension" />
          <span>{t("disclaimers.publicData")}</span>
        </div>
      </div>

      {/* Detailed Simulation */}
      <div>
        <h4 className="font-semibold text-sm mb-4">
          {t("expandedView.detailedSimulation")}
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-3 py-2 text-start font-semibold text-muted-foreground">
                  {t("expandedView.simulation.period")}
                </th>
                <th className="px-3 py-2 text-end font-semibold text-muted-foreground">
                  {t("expandedView.simulation.projectedValue")}
                </th>
                <th className="px-3 py-2 text-end font-semibold text-muted-foreground">
                  {t("expandedView.simulation.totalContributions")}
                </th>
                <th className="px-3 py-2 text-end font-semibold text-muted-foreground">
                  {t("expandedView.simulation.estimatedFees")}
                </th>
                <th className="px-3 py-2 text-end font-semibold text-muted-foreground">
                  {t("expandedView.simulation.estimatedNetGain")}
                </th>
                {editedInvestment.type === "pension" && (
                  <th className="px-3 py-2 text-end font-semibold text-muted-foreground">
                    {t("expandedView.simulation.estimatedMonthlyPension")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {[
                { year: 0, label: t("expandedView.simulation.today") },
                { year: 1, label: t("summaryTables.in1Year") },
                { year: 5, label: t("summaryTables.in5Years") },
                { year: 10, label: t("summaryTables.in10Years") },
                { year: 15, label: t("summaryTables.in15Years") },
                ...(customYears && customYears > 15
                  ? [{ year: customYears, label: t.rich("summaryTables.inCustomYears", {years: customYears}) }]
                  : []),
              ].map((period) => {
                const sim = simulations[period.year];
                if (!sim) return null;
                return (
                  <tr key={period.year} className="border-b border-border/40 hover:bg-secondary/20">
                    <td className="px-3 py-2 font-medium">{period.label}</td>
                    <td className="px-3 py-2 text-end font-mono">
                      {formatCurrency(sim.projectedValue)}
                    </td>
                    <td className="px-3 py-2 text-end font-mono text-muted-foreground text-xs">
                      {formatCurrency(sim.estimatedContributions)}
                    </td>
                    <td className="px-3 py-2 text-end font-mono text-muted-foreground text-xs">
                      {formatCurrency(sim.estimatedFees)}
                    </td>
                    <td className="px-3 py-2 text-end font-mono text-green-600">
                      {formatCurrency(sim.estimatedNetGain)}
                    </td>
                    {editedInvestment.type === "pension" && (
                      <td className="px-3 py-2 text-end font-mono">
                        {sim.estimatedMonthlyPension
                          ? formatCurrency(sim.estimatedMonthlyPension)
                          : "-"}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 rounded-lg bg-accent/20 p-3 text-xs text-muted-foreground">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-accent-foreground" />
        <span>{t("disclaimers.simulation")}</span>
      </div>
    </div>
  );
}
