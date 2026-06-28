"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { ManagedSavingsSummaryCards } from "@/components/managed-savings/ManagedSavingsSummaryCards";
import { ManagedSavingsTable } from "@/components/managed-savings/ManagedSavingsTable";
import { ManagedSavingsSummaryTable } from "@/components/managed-savings/ManagedSavingsSummaryTable";
import {
  getMockManagedSavingsData,
  calculateTotalSummary,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";

export default function ManagedSavingsPage() {
  const t = useTranslations("managedSavings");
  const [customYears, setCustomYears] = useState(20);
  const [investments, setInvestments] = useState<ManagedSavingsInvestment[]>(
    getMockManagedSavingsData()
  );

  const handleInvestmentChange = (investment: ManagedSavingsInvestment) => {
    setInvestments((prev) =>
      prev.map((inv) => (inv.id === investment.id ? investment : inv))
    );
  };

  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + inv.currentBalance,
    0
  );
  const totalMonthlyContributions = investments.reduce(
    (sum, inv) => sum + inv.monthlyContribution,
    0
  );

  const fiveYearSummary = calculateTotalSummary(investments, 5);
  const tenYearSummary = calculateTotalSummary(investments, 10);
  const customYearSummary = calculateTotalSummary(investments, customYears);

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {t("pageTitle")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Custom Horizon Selector */}
      <div className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border/40 shadow-card">
        <label className="text-sm font-semibold text-foreground">{t("customHorizon")}</label>
        <input
          type="number"
          min="1"
          max="50"
          value={customYears}
          onChange={(e) => setCustomYears(Math.max(1, Number(e.target.value)))}
          className="w-24 px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-asset"
        />
        <span className="text-sm font-medium text-muted-foreground">{t("years")}</span>
      </div>

      {/* Summary Cards */}
      <ManagedSavingsSummaryCards
        totalCurrentValue={totalCurrentValue}
        totalMonthlyContributions={totalMonthlyContributions}
        projectedIn5Years={fiveYearSummary.total}
        projectedIn10Years={tenYearSummary.total}
        projectedInCustomYears={customYearSummary.total}
        customYears={customYears}
      />

      {/* Main Investments Table */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">
          {t("pageTitle")}
        </h2>
        <ManagedSavingsTable
          investments={investments}
          customYears={customYears}
          onInvestmentChange={handleInvestmentChange}
        />
      </div>

      {/* Summary Table */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">
          {t("projectionsLabel")}
        </h2>
        <ManagedSavingsSummaryTable
          investments={investments}
          customYears={customYears}
        />
      </div>

      {/* Disclaimers */}
      <div className="rounded-3xl bg-card border border-border/60 shadow-card p-4 md:p-6 space-y-4">
        <h3 className="font-bold text-base">Important Information</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.informational")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.noAdvice")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.publicData")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.simulation")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
