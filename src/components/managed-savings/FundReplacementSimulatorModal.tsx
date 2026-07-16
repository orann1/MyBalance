"use client";

import { useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Calculator, Info, Minus, TrendingDown, TrendingUp, X } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/locale/formatters";
import { type ManagedSavingsInvestment, getDisplayAnnualReturn } from "@/lib/mock/managed-savings-data";
import type { PeerComparisonRow } from "@/lib/public-funds/peer-comparison";
import {
  buildSimulatorHorizons,
  compareFundProjections,
  type FundProjectionComparison,
} from "@/lib/financial/fund-comparison";
import { cn } from "@/lib/utils";

interface FundReplacementSimulatorModalProps {
  investment: ManagedSavingsInvestment;
  candidate: PeerComparisonRow;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CUSTOM_HORIZON = 15;
const MIN_HORIZON = 1;
const MAX_HORIZON = 50;
const BASELINE_HORIZONS = [1, 5, 10];

// Explicit sign (+/-) so a positive/negative difference is never ambiguous —
// zero renders neutrally via signDisplay: "exceptZero".
function formatSignedCurrency(value: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    signDisplay: "exceptZero",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function differenceClassName(value: number): string {
  if (value > 0) return "text-emerald-700";
  if (value < 0) return "text-red-600";
  return "text-foreground";
}

// Numeric/currency/percent tokens keep correct digit/symbol ordering (+/-, %,
// ₪, comma grouping) regardless of surrounding text direction — the wrapping
// container still aligns to the locale's logical start (see Num below), only
// the token itself is forced LTR so it never mirrors in RTL contexts.
function Num({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span dir="ltr" className={cn("inline-block", className)}>
      {children}
    </span>
  );
}

// Stacked label-then-value layout so both read from the same logical side —
// avoids the "label at one edge, value at the opposite edge" RTL bug that a
// justify-between row produces.
function IdentityRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-xs text-start">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function FundReplacementSimulatorModal({
  investment,
  candidate,
  isOpen,
  onClose,
}: FundReplacementSimulatorModalProps) {
  const t = useTranslations("managedSavings.fundReplacementSimulator");
  const tYears = useTranslations("managedSavings");

  const [customHorizon, setCustomHorizon] = useState(DEFAULT_CUSTOM_HORIZON);

  const currentReturnPercent = getDisplayAnnualReturn(investment);
  // Annualized (not cumulative trailing5YrReturn) — the compounding
  // projection formula requires an annual rate. See peer-comparison.ts.
  const candidateReturnPercent = candidate.annualized5YrReturn;
  const candidateFeePercent = candidate.avgAnnualManagementFee;

  const comparisons: FundProjectionComparison[] = useMemo(() => {
    if (currentReturnPercent == null || candidateReturnPercent == null || candidateFeePercent == null) {
      return [];
    }
    const horizons = buildSimulatorHorizons(customHorizon);
    return horizons.map((years) =>
      compareFundProjections({
        currentScenario: {
          currentBalance: investment.currentBalance,
          monthlyContribution: investment.monthlyContribution,
          annualReturnPercent: currentReturnPercent,
          annualFeePercent: investment.accumulationFeePercent,
          years,
        },
        candidateScenario: {
          currentBalance: investment.currentBalance,
          monthlyContribution: investment.monthlyContribution,
          annualReturnPercent: candidateReturnPercent,
          annualFeePercent: candidateFeePercent,
          years,
        },
      })
    );
  }, [
    currentReturnPercent,
    candidateReturnPercent,
    candidateFeePercent,
    customHorizon,
    investment.currentBalance,
    investment.monthlyContribution,
    investment.accumulationFeePercent,
  ]);

  if (!isOpen) return null;

  // Assumptions section requires eligible current + candidate data — if the
  // action was somehow triggered without it, close rather than render a
  // misleading empty simulation.
  if (currentReturnPercent == null || candidateReturnPercent == null || candidateFeePercent == null) {
    return null;
  }

  const customComparison = comparisons.find((c) => c.years === customHorizon) ?? null;

  // Portalled to document.body: this modal can be opened from inside
  // ExpandedManagedSavingsRow, whose `expanded-row-in` entrance animation
  // uses `animation: ... both`, which leaves `transform: translateY(0)`
  // permanently applied after the animation completes. A non-none transform
  // creates a new containing block for `position: fixed` descendants, so
  // without a portal this modal's fixed backdrop would be positioned
  // relative to that ancestor's box instead of the viewport — breaking
  // layout entirely on narrower viewports. No other modal in this codebase
  // is ever mounted inside an animated/transformed ancestor, so this is the
  // first place a portal is needed.
  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-md modal-backdrop-in">
      <div className="rounded-3xl bg-white border border-border/40 shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto modal-panel-in">
        {/* Header */}
        <div className="sticky top-0 z-20 border-b border-border/60 bg-white px-6 py-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="rounded-lg bg-asset/20 p-2">
                  <Calculator className="h-5 w-5 text-asset" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
              </div>
              <p className="text-sm text-muted-foreground ms-11">{t("subtitle")}</p>
            </div>
            <button
              onClick={onClose}
              aria-label={t("close")}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Fund identity — current vs candidate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-2">
              <p className="text-xs font-bold text-foreground mb-1">{t("sections.currentFund")}</p>
              <IdentityRow label={t("identity.holdingLabel")} value={investment.name} />
              {investment.linkedPublicFund && (
                <>
                  <IdentityRow
                    label={t("identity.fundNameLabel")}
                    value={investment.linkedPublicFund.fundName}
                  />
                  <IdentityRow
                    label={t("identity.managingCompanyLabel")}
                    value={investment.linkedPublicFund.managingCompany}
                  />
                  <IdentityRow
                    label={t("identity.fundNumberLabel")}
                    value={investment.linkedPublicFund.fundId}
                  />
                </>
              )}
            </div>
            <div className="rounded-xl border border-border/40 bg-secondary/20 p-4 space-y-2">
              <p className="text-xs font-bold text-foreground mb-1">{t("sections.candidateFund")}</p>
              <IdentityRow label={t("identity.fundNameLabel")} value={candidate.fundName} />
              <IdentityRow label={t("identity.managingCompanyLabel")} value={candidate.managingCompany} />
              <IdentityRow label={t("identity.fundNumberLabel")} value={candidate.fundId} />
            </div>
          </div>

          {/* Assumptions section */}
          <div className="rounded-xl border border-border/40 bg-card p-4 space-y-3">
            <p className="text-xs font-bold text-foreground">{t("assumptions.title")}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-start font-medium py-1.5" />
                    <th className="text-start font-medium py-1.5">{t("sections.currentFund")}</th>
                    <th className="text-start font-medium py-1.5">{t("sections.candidateFund")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/30">
                    <td className="py-1.5 text-muted-foreground">{t("assumptions.startingBalance")}</td>
                    <td className="py-1.5 text-start font-semibold" colSpan={2}>
                      <Num>{formatCurrency(investment.currentBalance)}</Num>
                    </td>
                  </tr>
                  <tr className="border-t border-border/30">
                    <td className="py-1.5 text-muted-foreground">
                      {t("assumptions.monthlyContribution")}
                    </td>
                    <td className="py-1.5 text-start font-semibold" colSpan={2}>
                      <Num>{formatCurrency(investment.monthlyContribution)}</Num>
                    </td>
                  </tr>
                  <tr className="border-t border-border/30">
                    <td className="py-1.5 text-muted-foreground align-top">{t("assumptions.annualReturn")}</td>
                    <td className="py-1.5 text-start font-semibold align-top">
                      <Num>{formatPercent(currentReturnPercent)}</Num>
                    </td>
                    <td className="py-1.5 text-start font-semibold align-top">
                      <Num>{formatPercent(candidateReturnPercent)}</Num>
                    </td>
                  </tr>
                  <tr className="border-t border-border/30">
                    <td className="py-1.5 text-muted-foreground align-top">{t("assumptions.annualFee")}</td>
                    <td className="py-1.5 text-start font-semibold align-top">
                      <Num>{formatPercent(investment.accumulationFeePercent)}</Num>
                      <span className="block text-[10px] font-normal text-muted-foreground">
                        {t("assumptions.currentFeeSourceLabel")}
                      </span>
                    </td>
                    <td className="py-1.5 text-start font-semibold align-top">
                      <Num>{formatPercent(candidateFeePercent)}</Num>
                      <span className="block text-[10px] font-normal text-muted-foreground">
                        {t("assumptions.candidateFeeSourceLabel")}
                      </span>
                    </td>
                  </tr>
                  <tr className="border-t border-border/30">
                    <td className="py-1.5 text-muted-foreground">{t("assumptions.horizon")}</td>
                    <td className="py-1.5 text-start font-semibold" colSpan={2}>
                      <Num>{customHorizon}</Num> {tYears("years")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cumulative-vs-annualized return methodology — kept visible and
                readable, not a tiny footnote, since it explains a real
                numeric discrepancy with the Similar Tracks table. */}
            <div className="flex items-start gap-2 rounded-lg bg-secondary/30 border border-border/30 p-2.5">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground text-start">
                {t("assumptions.returnMethodologyNote")}
              </p>
            </div>

            {/* Custom horizon control — the only editable assumption */}
            <div className="flex items-center gap-2 pt-1">
              <label
                htmlFor="fund-replacement-simulator-custom-horizon"
                className="text-xs font-semibold text-foreground whitespace-nowrap"
              >
                {t("horizon.customLabel")}
              </label>
              <input
                id="fund-replacement-simulator-custom-horizon"
                type="number"
                min={MIN_HORIZON}
                max={MAX_HORIZON}
                value={customHorizon}
                onChange={(e) =>
                  setCustomHorizon(
                    Math.min(MAX_HORIZON, Math.max(MIN_HORIZON, Number(e.target.value) || MIN_HORIZON))
                  )
                }
                className="w-16 px-2 py-1 rounded-md border border-border bg-background text-xs font-mono font-semibold text-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-asset"
              />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {tYears("years")}
              </span>
            </div>
          </div>

          {/* Results table */}
          <div className="rounded-xl border border-border/40 overflow-hidden">
            <p className="text-xs font-bold text-foreground px-4 pt-4 pb-2">{t("results.title")}</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-secondary/40 text-muted-foreground">
                    <th className="px-3 py-2 text-start font-medium">{t("results.horizon")}</th>
                    <th className="px-3 py-2 text-start font-medium">{t("results.currentFund")}</th>
                    <th className="px-3 py-2 text-start font-medium">{t("results.candidateFund")}</th>
                    <th className="px-3 py-2 text-start font-medium">{t("results.difference")}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((comparison) => (
                    <tr
                      key={comparison.years}
                      className={cn(
                        "border-t border-border/30",
                        comparison.years === customHorizon &&
                          !BASELINE_HORIZONS.includes(comparison.years) &&
                          "bg-secondary/20"
                      )}
                    >
                      <td className="px-3 py-2 font-medium text-foreground text-start">
                        <Num>{comparison.years}</Num> {tYears("years")}
                      </td>
                      <td className="px-3 py-2 text-start">
                        <Num>{formatCurrency(comparison.currentProjectedValue)}</Num>
                      </td>
                      <td className="px-3 py-2 text-start">
                        <Num>{formatCurrency(comparison.candidateProjectedValue)}</Num>
                      </td>
                      <td className={cn("px-3 py-2 text-start font-bold", differenceClassName(comparison.difference))}>
                        <Num>{formatSignedCurrency(comparison.difference)}</Num>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Custom horizon summary — neutral base style; sign shown via a
              small icon + text accent, never a strong filled green/red card. */}
          {customComparison && (
            <div className="rounded-xl bg-secondary/20 border border-border/40 p-4 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                {t("results.summaryPrefix", { years: customHorizon })}
              </p>
              <p className={cn("text-lg font-bold flex items-center justify-center gap-1.5", differenceClassName(customComparison.difference))}>
                {customComparison.difference > 0 && <TrendingUp className="h-4 w-4" />}
                {customComparison.difference < 0 && <TrendingDown className="h-4 w-4" />}
                {customComparison.difference === 0 && <Minus className="h-4 w-4" />}
                <Num>{formatSignedCurrency(customComparison.difference)}</Num>
              </p>
              <p className="text-xs text-muted-foreground">
                {customComparison.difference > 0
                  ? t("results.summaryPositive", { amount: formatCurrency(customComparison.difference) })
                  : customComparison.difference < 0
                    ? t("results.summaryNegative", {
                        amount: formatCurrency(Math.abs(customComparison.difference)),
                      })
                    : t("results.summaryZero")}
              </p>
            </div>
          )}

          {/* Important information — three short, readable items */}
          <div className="rounded-lg border border-border/40 bg-secondary/20 p-3 space-y-2">
            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              {t("info.heading")}
            </p>
            <ul className="space-y-1.5 ps-5 list-disc text-xs text-muted-foreground">
              <li>{t("info.point1")}</li>
              <li>{t("info.point2")}</li>
              <li>{t("info.point3")}</li>
            </ul>
          </div>

          {/* Disclaimer — short, separate from the information items above */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/80 border border-blue-100">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-600" />
            <p className="text-xs text-muted-foreground">{t("disclaimer")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border/20 bg-gradient-to-t from-secondary/10 to-transparent px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-foreground border border-border/40 rounded-lg hover:bg-secondary/30 transition-colors duration-150"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
