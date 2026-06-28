"use client";

import { useTranslations } from "next-intl";
import { Building2, Landmark, CreditCard } from "lucide-react";
import { formatCurrency } from "@/lib/locale/formatters";
import type { LiabilityItem } from "@/types/dashboard";

interface LiabilitiesSectionProps {
  liabilities: LiabilityItem[];
}

function getLiabilityIcon(name: string) {
  switch (name) {
    case "mortgage":
      return Building2;
    case "bankLoan":
      return Landmark;
    case "creditCards":
      return CreditCard;
    default:
      return CreditCard;
  }
}

export function LiabilitiesSection({ liabilities }: LiabilitiesSectionProps) {
  const t = useTranslations("dashboard");
  const tLiabilities = useTranslations("liabilities");

  const total = liabilities.reduce((sum, liability) => sum + liability.value, 0);

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-5 md:p-6">
      <h2 className="text-base md:text-lg font-bold mb-4">
        {t("myLiabilities")}
      </h2>
      <ul className="space-y-3">
        {liabilities.map((liability) => {
          const Icon = getLiabilityIcon(liability.name);
          const pct = Math.round((liability.value / total) * 100);
          return (
            <li key={liability.name} className="rounded-2xl border border-border/60 bg-card p-3">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-liability text-white">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {tLiabilities(liability.name as any)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {pct}% {t("ofTotal") || "من الإجمالي"}
                  </div>
                </div>
                <div className="shrink-0 text-sm font-bold tabular-nums">
                  {formatCurrency(liability.value)}
                </div>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-gradient-liability"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      <div className="border-t border-border/60 mt-3 pt-3">
        <div className="flex justify-between items-center font-semibold">
          <span className="text-muted-foreground text-sm">{t("total")}</span>
          <span className="text-base">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
