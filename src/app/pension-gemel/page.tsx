"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Info } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PensionGemelSummaryCards } from "@/components/pension-gemel/PensionGemelSummaryCards";
import { PensionGemelTable } from "@/components/pension-gemel/PensionGemelTable";
import { PensionGemelSummaryTables } from "@/components/pension-gemel/PensionGemelSummaryTables";
import {
  getMockPensionGemelData,
  calculateTotalSummary,
  calculatePensionMonthlyPension,
  type PensionGemelInvestment,
} from "@/lib/mock/pension-gemel-data";

export default function PensionGemelPage() {
  const t = useTranslations("pensionGemel");
  const [customYears, setCustomYears] = useState(20);
  const [investments, setInvestments] = useState<PensionGemelInvestment[]>(
    getMockPensionGemelData()
  );

  const handleInvestmentChange = (investment: PensionGemelInvestment) => {
    setInvestments((prev) =>
      prev.map((inv) => (inv.id === investment.id ? investment : inv))
    );
  };

  const pensionInvestments = investments.filter((inv) => inv.type === "pension");
  const managedSavingsInvestments = investments.filter(
    (inv) => inv.type !== "pension"
  );

  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + inv.currentBalance,
    0
  );
  const totalMonthlyContributions = investments.reduce(
    (sum, inv) => sum + inv.monthlyContribution,
    0
  );

  const tenYearSummary = calculateTotalSummary(investments, 10);
  const customYearSummary = calculateTotalSummary(investments, customYears);
  const estimatedMonthlyPension = calculatePensionMonthlyPension(
    investments,
    customYears
  );

  return (
    <AppShell>
      <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {t("pageTitle")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Custom Horizon Control */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">{t("customHorizon")}</label>
        <input
          type="number"
          min="1"
          max="50"
          value={customYears}
          onChange={(e) => setCustomYears(Math.max(1, Number(e.target.value)))}
          className="w-20 px-3 py-2 rounded-lg border border-border bg-card text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pension"
        />
        <span className="text-sm text-muted-foreground">{t("years")}</span>
      </div>

      {/* Summary Cards */}
      <PensionGemelSummaryCards
        totalCurrentValue={totalCurrentValue}
        totalMonthlyContributions={totalMonthlyContributions}
        projectedIn10Years={tenYearSummary.total}
        projectedInCustomYears={customYearSummary.total}
        customYears={customYears}
        estimatedMonthlyPension={estimatedMonthlyPension}
      />

      {/* Pension Section */}
      {pensionInvestments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {t("sections.pensionTitle")}
          </h2>
          <PensionGemelTable
            investments={pensionInvestments}
            customYears={customYears}
            onInvestmentChange={handleInvestmentChange}
          />
        </div>
      )}

      {/* Managed Savings Section */}
      {managedSavingsInvestments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {t("sections.managedSavingsTitle")}
          </h2>
          <PensionGemelTable
            investments={managedSavingsInvestments}
            customYears={customYears}
            onInvestmentChange={handleInvestmentChange}
          />
        </div>
      )}

      {/* Summary Tables */}
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">
          {t("projectionsLabel")}
        </h2>
        <PensionGemelSummaryTables
          investments={investments}
          customYears={customYears}
        />
      </div>

      {/* Disclaimers */}
      <div className="rounded-3xl bg-card border border-border/60 shadow-card p-4 md:p-6 space-y-4">
        <h3 className="font-bold text-base">Important Information</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.informational")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.noAdvice")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.publicData")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.simulation")}
            </p>
          </div>
        </div>
      </div>
      </div>
    </AppShell>
  );
}
