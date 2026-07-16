"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BarChart3, Calculator, Info } from "lucide-react";
import { formatPercent, formatDate } from "@/lib/locale/formatters";
import { getDisplayAnnualReturn, type ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";
import type { PeerComparisonRow } from "@/lib/public-funds/peer-comparison";
import { cn } from "@/lib/utils";
import { FundReplacementSimulatorModal } from "./FundReplacementSimulatorModal";

interface SimilarTracksComparisonProps {
  investment: ManagedSavingsInvestment;
}

// Below this, a fee gap is treated as "same as average" rather than
// above/below — avoids labelling a negligible rounding difference as a
// meaningful gap.
const FEE_GAP_EPSILON_PERCENT = 0.01;

// Same epsilon convention as the fee gap, applied to the 5-year/12-month
// return gap summary cards below.
const RETURN_GAP_EPSILON_PERCENT = 0.01;

// Formats a percent value with an explicit sign (+/-), for the summary-card
// gap/delta figures only — table cells use the unsigned formatPercent, since
// only the gap cards are at risk of being misread as a raw return.
function formatSignedPercent(value: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "percent",
    signDisplay: "exceptZero",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

interface BestValues {
  lastMonthReturn: number | null;
  last12MonthReturn: number | null;
  trailing3YrReturn: number | null;
  trailing5YrReturn: number | null;
  avgAnnualManagementFee: number | null;
}

function computeBestValues(rows: PeerComparisonRow[]): BestValues {
  const bestOf = (values: (number | null)[], pick: "max" | "min"): number | null => {
    let best: number | null = null;
    for (const value of values) {
      if (value === null) continue;
      if (best === null || (pick === "max" ? value > best : value < best)) best = value;
    }
    return best;
  };
  return {
    lastMonthReturn: bestOf(rows.map((row) => row.lastMonthReturn), "max"),
    last12MonthReturn: bestOf(rows.map((row) => row.last12MonthReturn), "max"),
    trailing3YrReturn: bestOf(rows.map((row) => row.trailing3YrReturn), "max"),
    trailing5YrReturn: bestOf(rows.map((row) => row.trailing5YrReturn), "max"),
    avgAnnualManagementFee: bestOf(rows.map((row) => row.avgAnnualManagementFee), "min"),
  };
}

function returnCellClassName(value: number | null): string {
  if (value === null) return "text-muted-foreground";
  if (value > 0) return "text-emerald-700";
  if (value < 0) return "text-red-600";
  return "text-foreground";
}

function ReturnCell({ value, isBest }: { value: number | null; isBest: boolean }) {
  if (value === null) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span
      className={cn(
        returnCellClassName(value),
        isBest && "rounded px-1 py-0.5 bg-emerald-50 ring-1 ring-emerald-200 font-bold"
      )}
    >
      {formatPercent(value)}
    </span>
  );
}

function FeeCell({ value, isBest }: { value: number | null; isBest: boolean }) {
  if (value === null) {
    return <span className="text-muted-foreground">—</span>;
  }
  return (
    <span
      className={cn(
        "text-foreground",
        isBest && "rounded px-1 py-0.5 bg-emerald-50 ring-1 ring-emerald-200 font-bold"
      )}
    >
      {formatPercent(value)}
    </span>
  );
}

// Candidate eligibility for the Fund Replacement Simulator entry point
// (Phase 2F-2): requires a real, finite 5-year return and a real, finite
// average management fee — never simulated with a substituted/fallback
// value. The user's own row and the peer-average row are never eligible
// (isTarget rows are filtered out by the caller; the average row is not a
// PeerComparisonRow at all).
function isCandidateSimulationEligible(row: PeerComparisonRow): boolean {
  return (
    !row.isTarget &&
    Number.isFinite(row.annualized5YrReturn) &&
    Number.isFinite(row.avgAnnualManagementFee)
  );
}

export function SimilarTracksComparison({ investment }: SimilarTracksComparisonProps) {
  const t = useTranslations("managedSavings.similarTracks");
  const [simulatorCandidate, setSimulatorCandidate] = useState<PeerComparisonRow | null>(null);

  if (!investment.linkedPublicFund) return null;

  // The current side of the simulator requires a real linked 5-year return —
  // when absent, the simulation action must not be offered on any row for
  // this holding (never a mock/0% fallback for the "current fund" scenario).
  const currentFundSimulationEligible = getDisplayAnnualReturn(investment) != null;

  const comparison = investment.similarTracksComparison;

  if (!comparison || comparison.comparisonStatus !== "available") {
    const status = comparison?.comparisonStatus ?? "not_enough_peers";
    const reasonKey =
      status === "missing_classification"
        ? "missingClassification"
        : status === "unsupported_source"
          ? "unsupportedSource"
          : status === "not_linked"
            ? "notLinked"
            : "notEnoughPeers";

    return (
      <div
        data-testid="similar-tracks-comparison"
        data-comparison-status={status}
        className="rounded-lg bg-card border border-border/40 p-4"
      >
        <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          {t("title")}
        </h3>
        <p className="text-xs text-muted-foreground">{t(reasonKey)}</p>
      </div>
    );
  }

  const myFeePercent = investment.accumulationFeePercent;
  const targetRow = comparison.rows.find((row) => row.isTarget) ?? null;
  const targetAvgFee = targetRow?.avgAnnualManagementFee ?? null;
  const feeDiffPercent = targetAvgFee !== null ? myFeePercent - targetAvgFee : null;

  const feeDiffLabel =
    feeDiffPercent === null
      ? null
      : Math.abs(feeDiffPercent) < FEE_GAP_EPSILON_PERCENT
        ? t("feeDiffSame")
        : feeDiffPercent > 0
          ? t("feeDiffAbove", { diff: formatPercent(feeDiffPercent) })
          : t("feeDiffBelow", { diff: formatPercent(Math.abs(feeDiffPercent)) });

  const averageRow = comparison.averageRow;
  const fiveYearDelta =
    targetRow?.trailing5YrReturn != null && averageRow?.trailing5YrReturn != null
      ? targetRow.trailing5YrReturn - averageRow.trailing5YrReturn
      : null;
  const oneYearDelta =
    targetRow?.last12MonthReturn != null && averageRow?.last12MonthReturn != null
      ? targetRow.last12MonthReturn - averageRow.last12MonthReturn
      : null;

  const returnGapSubtextKey = (delta: number | null): "returnAbovePeerAverage" | "returnBelowPeerAverage" | "returnSameAsPeerAverage" | null => {
    if (delta === null) return null;
    if (Math.abs(delta) < RETURN_GAP_EPSILON_PERCENT) return "returnSameAsPeerAverage";
    return delta > 0 ? "returnAbovePeerAverage" : "returnBelowPeerAverage";
  };
  const fiveYearGapSubtextKey = returnGapSubtextKey(fiveYearDelta);
  const oneYearGapSubtextKey = returnGapSubtextKey(oneYearDelta);

  const peerGroupLabel =
    comparison.matchLevel === "strict" && comparison.subSpecialization
      ? `${comparison.fundClassification} · ${comparison.subSpecialization}`
      : comparison.fundClassification;

  const bestValues = computeBestValues(comparison.rows);
  const showTopPeersNote = comparison.rows.length > 1;

  return (
    <div
      data-testid="similar-tracks-comparison"
      data-comparison-status="available"
      className="rounded-lg bg-card border border-border/40 p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            {t("title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{t("subtitle")}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
            comparison.matchLevel === "strict"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-800"
          )}
        >
          {comparison.matchLevel === "strict" ? t("confidenceHigh") : t("confidenceMedium")}
        </span>
      </div>

      {/* Peer group meta line */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>
          {t("peerGroup")}: <span className="font-semibold text-foreground">{peerGroupLabel}</span>
        </span>
        <span>{t("peerCount", { count: comparison.peerGroupSize })}</span>
        {comparison.latestReportPeriod && (
          <span>
            {t("reportPeriod")}:{" "}
            <span className="font-mono">
              {formatDate(new Date(comparison.latestReportPeriod), undefined, {
                year: "numeric",
                month: "2-digit",
              })}
            </span>
          </span>
        )}
        <span>{comparison.matchLevel === "strict" ? t("matchStrict") : t("matchRelaxed")}</span>
        {showTopPeersNote && <span>{t("topPeersNote")}</span>}
      </div>

      {/* Mini summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-lg bg-secondary/30 border border-border/40 p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1 font-medium">{t("summaryFiveYear")}</p>
          <p className={cn("font-bold", returnCellClassName(fiveYearDelta))}>
            {fiveYearDelta !== null ? formatSignedPercent(fiveYearDelta) : "—"}
          </p>
          {fiveYearGapSubtextKey && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{t(fiveYearGapSubtextKey)}</p>
          )}
        </div>
        <div className="rounded-lg bg-secondary/30 border border-border/40 p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1 font-medium">{t("summaryOneYear")}</p>
          <p className={cn("font-bold", returnCellClassName(oneYearDelta))}>
            {oneYearDelta !== null ? formatSignedPercent(oneYearDelta) : "—"}
          </p>
          {oneYearGapSubtextKey && (
            <p className="text-[11px] text-muted-foreground mt-0.5">{t(oneYearGapSubtextKey)}</p>
          )}
        </div>
        <div className="rounded-lg bg-secondary/30 border border-border/40 p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1 font-medium">{t("summaryMyFee")}</p>
          <p className="font-bold text-foreground">{formatPercent(myFeePercent)}</p>
          {feeDiffLabel && <p className="text-[11px] text-muted-foreground mt-0.5">{feeDiffLabel}</p>}
        </div>
        <div className="rounded-lg bg-secondary/30 border border-border/40 p-3 text-center">
          <p className="text-xs text-muted-foreground mb-1 font-medium">{t("summaryPeerGroup")}</p>
          <p className="font-bold text-foreground">{comparison.peerGroupSize}</p>
        </div>
      </div>

      {/* Full comparison table */}
      <div className="overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-secondary/40 text-muted-foreground">
              <th className="px-2 py-2 text-start font-medium">{t("table.rank")}</th>
              <th className="px-2 py-2 text-start font-medium min-w-[160px]">
                {t("table.fundName")}
              </th>
              <th className="px-2 py-2 text-end font-medium">{t("table.lastMonth")}</th>
              <th className="px-2 py-2 text-end font-medium">{t("table.lastTwelveMonths")}</th>
              <th className="px-2 py-2 text-end font-medium">{t("table.threeYears")}</th>
              <th className="px-2 py-2 text-end font-medium">{t("table.fiveYears")}</th>
              <th className="px-2 py-2 text-end font-medium">{t("table.avgFee")}</th>
              {currentFundSimulationEligible && (
                <th className="px-2 py-2 text-end font-medium">
                  <span className="sr-only">{t("table.actionColumnSr")}</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row: PeerComparisonRow) => (
              <tr
                key={row.publicFundId}
                className={cn(
                  "border-t border-border/30 relative",
                  row.isTarget
                    ? "bg-emerald-100/80 border-y-2 border-emerald-500/70 ring-1 ring-inset ring-emerald-400/50"
                    : "hover:bg-secondary/20"
                )}
              >
                <td
                  className={cn(
                    "px-2 py-2 text-muted-foreground",
                    row.isTarget && "border-s-4 border-emerald-500"
                  )}
                >
                  {row.rank}
                </td>
                <td className="px-2 py-2 font-medium text-foreground">
                  <span className="flex items-center gap-1.5">
                    {row.fundName}
                    {row.isTarget && (
                      <span className="shrink-0 rounded-full bg-emerald-700 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {t("table.yourFund")}
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-2 py-2 text-end">
                  <ReturnCell
                    value={row.lastMonthReturn}
                    isBest={
                      row.lastMonthReturn !== null &&
                      row.lastMonthReturn === bestValues.lastMonthReturn
                    }
                  />
                </td>
                <td className="px-2 py-2 text-end">
                  <ReturnCell
                    value={row.last12MonthReturn}
                    isBest={
                      row.last12MonthReturn !== null &&
                      row.last12MonthReturn === bestValues.last12MonthReturn
                    }
                  />
                </td>
                <td className="px-2 py-2 text-end">
                  <ReturnCell
                    value={row.trailing3YrReturn}
                    isBest={
                      row.trailing3YrReturn !== null &&
                      row.trailing3YrReturn === bestValues.trailing3YrReturn
                    }
                  />
                </td>
                <td className="px-2 py-2 text-end">
                  <ReturnCell
                    value={row.trailing5YrReturn}
                    isBest={
                      row.trailing5YrReturn !== null &&
                      row.trailing5YrReturn === bestValues.trailing5YrReturn
                    }
                  />
                </td>
                <td className="px-2 py-2 text-end">
                  <FeeCell
                    value={row.avgAnnualManagementFee}
                    isBest={
                      row.avgAnnualManagementFee !== null &&
                      row.avgAnnualManagementFee === bestValues.avgAnnualManagementFee
                    }
                  />
                </td>
                {currentFundSimulationEligible && (
                  <td className="px-2 py-2 text-end">
                    {isCandidateSimulationEligible(row) && (
                      <button
                        type="button"
                        onClick={() => setSimulatorCandidate(row)}
                        title={t("action.tooltip")}
                        aria-label={t("action.ariaLabel", { fundName: row.fundName })}
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-asset hover:bg-asset/10 transition-colors"
                      >
                        <Calculator className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {averageRow && (
              <tr className="border-t-2 border-border/50 bg-secondary/30 font-semibold">
                <td className="px-2 py-2" />
                <td className="px-2 py-2 text-foreground">{t("table.peerAverage")}</td>
                <td className="px-2 py-2 text-end">
                  <ReturnCell value={averageRow.lastMonthReturn} isBest={false} />
                </td>
                <td className="px-2 py-2 text-end">
                  <ReturnCell value={averageRow.last12MonthReturn} isBest={false} />
                </td>
                <td className="px-2 py-2 text-end">
                  <ReturnCell value={averageRow.trailing3YrReturn} isBest={false} />
                </td>
                <td className="px-2 py-2 text-end">
                  <ReturnCell value={averageRow.trailing5YrReturn} isBest={false} />
                </td>
                <td className="px-2 py-2 text-end">
                  <FeeCell value={averageRow.avgAnnualManagementFee} isBest={false} />
                </td>
                {currentFundSimulationEligible && <td className="px-2 py-2" />}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/80 border border-blue-100">
        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-600" />
        <p className="text-xs text-muted-foreground">{t("informationalDisclaimer")}</p>
      </div>

      {simulatorCandidate && (
        <FundReplacementSimulatorModal
          investment={investment}
          candidate={simulatorCandidate}
          isOpen={simulatorCandidate !== null}
          onClose={() => setSimulatorCandidate(null)}
        />
      )}
    </div>
  );
}
