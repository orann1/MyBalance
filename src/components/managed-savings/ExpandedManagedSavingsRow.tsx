"use client";

import { useTranslations } from "next-intl";
import { Info, TrendingUp, StickyNote } from "lucide-react";
import { formatPercent } from "@/lib/locale/formatters";
import {
  getTrackPerformance,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";

interface ExpandedManagedSavingsRowProps {
  investment: ManagedSavingsInvestment;
}

export function ExpandedManagedSavingsRow({
  investment,
}: ExpandedManagedSavingsRowProps) {
  const t = useTranslations("managedSavings");
  const performance = getTrackPerformance(investment);

  return (
    <div className="bg-gradient-to-b from-secondary/15 to-secondary/5 border-t border-border/30 p-5 expanded-row-in">
      <div className="space-y-4">
        {/* PUBLIC TRACK PERFORMANCE */}
        <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 p-4">
          <h3 className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-700" />
            {t("publicTrackPerformance")}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { label: t("lastMonth"), value: performance.lastMonth },
              { label: t("last1Year"), value: performance.last1Year },
              { label: t("last3Years"), value: performance.last3Years },
              { label: t("last5Years"), value: performance.last5Years },
              ...(performance.last10Years
                ? [{ label: t("last10Years"), value: performance.last10Years }]
                : []),
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg bg-white/80 border border-green-100 p-3 text-center"
              >
                <p className="text-xs text-muted-foreground mb-1 font-medium">
                  {item.label}
                </p>
                <p className="font-bold text-green-700">
                  {formatPercent(item.value)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-blue-50 border border-blue-100">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-blue-600" />
            <p className="text-xs text-muted-foreground">{t("publicDataNote")}</p>
          </div>
        </div>

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
