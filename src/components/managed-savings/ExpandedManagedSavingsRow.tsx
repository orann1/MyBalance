"use client";

import { useTranslations } from "next-intl";
import { Info, TrendingUp, StickyNote, AlertTriangle } from "lucide-react";
import { formatPercent, formatDate } from "@/lib/locale/formatters";
import { type ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

interface ExpandedManagedSavingsRowProps {
  investment: ManagedSavingsInvestment;
}

export function ExpandedManagedSavingsRow({
  investment,
}: ExpandedManagedSavingsRowProps) {
  const t = useTranslations("managedSavings");
  const tLink = useTranslations("managedSavings.publicFundLinking");
  const tLinkPerf = useTranslations("managedSavings.publicFundLinking.linkedPerformance");

  const linkedFund = investment.linkedPublicFund;

  const hasLinkedMetrics =
    linkedFund != null &&
    (linkedFund.latestMonthlyReturn != null ||
      linkedFund.latestYtdReturn != null ||
      linkedFund.latestAnnualized3YrReturn != null ||
      linkedFund.latestAnnualized5YrReturn != null);

  return (
    <div className="bg-gradient-to-b from-secondary/15 to-secondary/5 border-t border-border/30 p-5 expanded-row-in">
      <div className="space-y-4">

        {/* PUBLIC FUND — unified card (linked) or compact warning (unlinked) */}
        {linkedFund ? (
          <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 p-4 space-y-4">

            {/* Section title */}
            <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-700" />
              {tLinkPerf("sectionTitle")}
            </h3>

            {/* KPI cells */}
            {hasLinkedMetrics ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {linkedFund.latestMonthlyReturn != null && (
                  <div className="rounded-lg bg-white/80 border border-green-100 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                      {tLinkPerf("monthlyReturn")}
                    </p>
                    <p className="font-bold text-green-700">
                      {formatPercent(linkedFund.latestMonthlyReturn)}
                    </p>
                  </div>
                )}
                {linkedFund.latestYtdReturn != null && (
                  <div className="rounded-lg bg-white/80 border border-green-100 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                      {tLinkPerf("ytdReturn")}
                    </p>
                    <p className="font-bold text-green-700">
                      {formatPercent(linkedFund.latestYtdReturn)}
                    </p>
                  </div>
                )}
                {linkedFund.latestAnnualized3YrReturn != null && (
                  <div className="rounded-lg bg-white/80 border border-green-100 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                      {tLinkPerf("annualized3Yr")}
                    </p>
                    <p className="font-bold text-green-700">
                      {formatPercent(linkedFund.latestAnnualized3YrReturn)}
                    </p>
                  </div>
                )}
                {linkedFund.latestAnnualized5YrReturn != null && (
                  <div className="rounded-lg bg-white/80 border border-green-100 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1 font-medium">
                      {tLinkPerf("annualized5Yr")}
                    </p>
                    <p className="font-bold text-green-700">
                      {formatPercent(linkedFund.latestAnnualized5YrReturn)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">{tLinkPerf("noMetrics")}</p>
            )}

            {/* Divider */}
            <div className="border-t border-green-200/50" />

            {/* Labelled fund metadata — one horizontal row on desktop, wraps on mobile */}
            <div className="flex flex-wrap items-center gap-y-2">

              <div className="flex items-center gap-1.5 pe-3">
                <span className="text-xs text-green-900/60 whitespace-nowrap shrink-0 font-medium">
                  {tLink("linkedSummary.fundName")}:
                </span>
                <span className="text-xs font-bold text-foreground">
                  {linkedFund.fundName}
                </span>
              </div>

              <span aria-hidden="true" className="hidden sm:block w-px h-3.5 bg-green-300/70 shrink-0 me-3" />

              <div className="flex items-center gap-1.5 pe-3">
                <span className="text-xs text-green-900/60 whitespace-nowrap shrink-0 font-medium">
                  {tLink("linkedSummary.managingCompany")}:
                </span>
                <span className="text-xs font-semibold text-foreground">
                  {linkedFund.managingCompany}
                </span>
              </div>

              <span aria-hidden="true" className="hidden sm:block w-px h-3.5 bg-green-300/70 shrink-0 me-3" />

              <div className="flex items-center gap-1.5 pe-3">
                <span className="text-xs text-green-900/60 whitespace-nowrap shrink-0 font-medium">
                  {tLink("linkedSummary.fundId")}:
                </span>
                <span className="text-xs font-mono font-bold text-foreground">
                  {linkedFund.fundId}
                </span>
              </div>

              {linkedFund.latestReportPeriod && (
                <>
                  <span aria-hidden="true" className="hidden sm:block w-px h-3.5 bg-green-300/70 shrink-0 me-3" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-green-900/60 whitespace-nowrap shrink-0 font-medium">
                      {tLink("linkedSummary.latestReportPeriod")}:
                    </span>
                    <span className="text-xs font-mono font-bold text-foreground">
                      {formatDate(new Date(linkedFund.latestReportPeriod), undefined, {
                        year: "numeric",
                        month: "2-digit",
                      })}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/80 border border-blue-100">
              <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-600" />
              <p className="text-xs text-muted-foreground">
                {tLinkPerf("publicDataNote")}
              </p>
            </div>
          </div>
        ) : (
          /* Not linked — compact amber warning only */
          <div className="flex items-start gap-2.5 rounded-lg bg-amber-50 border border-amber-200/70 px-4 py-3">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <p className="text-xs text-amber-900">
              {tLink("notLinkedCompactWarning")}
            </p>
          </div>
        )}

        {/* NOTES — personal, sensitive, shown in expanded row only */}
        <div className="rounded-lg bg-card border border-border/40 p-4">
          <h3 className="text-xs font-bold text-foreground mb-2 flex items-center gap-2">
            <StickyNote className="h-4 w-4 text-muted-foreground" />
            {t("expandedView.notes")}
          </h3>
          {investment.notes ? (
            <p className="text-sm text-foreground whitespace-pre-wrap">
              {investment.notes}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              {t("expandedView.noNotes")}
            </p>
          )}
        </div>

        {/* METADATA */}
        <div className="text-xs text-muted-foreground px-1">
          {t("lastUpdated")}: {investment.lastUpdateDate}
        </div>
      </div>
    </div>
  );
}
