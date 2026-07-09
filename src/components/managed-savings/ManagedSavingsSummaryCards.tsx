"use client";

import { useTranslations } from "next-intl";
import { PiggyBank, TrendingUp, Target, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/locale/formatters";

interface ManagedSavingsSummaryCardsProps {
  totalCurrentValue: number;
  projectedIn1Year: number;
  projectedIn5Years: number;
  projectedIn10Years: number;
}

export function ManagedSavingsSummaryCards({
  totalCurrentValue,
  projectedIn1Year,
  projectedIn5Years,
  projectedIn10Years,
}: ManagedSavingsSummaryCardsProps) {
  const t = useTranslations("managedSavings");
  const zeroReturnHint = t("summaryCards.zeroReturnAssumptionHint");

  // Top KPI row shows a clear savings-value progression over time:
  // current -> 1 year -> 5 years -> 10 years. The three projected cards sum
  // every active holding — holdings with a linked return use it, holdings
  // without one use a transparent 0%-growth assumption (current balance +
  // contributions), never a mock/default rate (Phase 2D-1 zero-return-
  // assumption fix). These cards only show "—" when there are genuinely no
  // holdings at all, which formatCurrency(0) already handles naturally.
  const cards = [
    {
      label: t("summaryCards.totalCurrentValue"),
      value: formatCurrency(totalCurrentValue),
      icon: PiggyBank,
      gradient: "from-[oklch(0.78_0.13_175)] to-[oklch(0.72_0.15_155)]",
      hint: undefined as string | undefined,
    },
    {
      label: t("summaryCards.projectedIn1Year"),
      value: formatCurrency(projectedIn1Year),
      icon: Sparkles,
      gradient: "from-[oklch(0.85_0.14_60)] to-[oklch(0.75_0.15_45)]",
      hint: zeroReturnHint,
    },
    {
      label: t("summaryCards.projectedIn5Years"),
      value: formatCurrency(projectedIn5Years),
      icon: Target,
      gradient: "from-[oklch(0.75_0.16_260)] to-[oklch(0.65_0.18_240)]",
      hint: zeroReturnHint,
    },
    {
      label: t("summaryCards.projectedIn10Years"),
      value: formatCurrency(projectedIn10Years),
      icon: TrendingUp,
      gradient: "from-[oklch(0.72_0.16_310)] to-[oklch(0.6_0.18_285)]",
      hint: zeroReturnHint,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`rounded-3xl bg-gradient-to-br ${card.gradient} p-6 text-white shadow-card transition-all hover:shadow-soft hover:scale-105 border-0 relative overflow-hidden`}
          >
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-white line-clamp-2 leading-snug tracking-wide">
                    {card.label}
                  </p>
                </div>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/25 backdrop-blur-sm">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">{card.value}</p>
              <div className="mt-3 h-0.5 w-12 bg-white/30 rounded-full" />
              {card.hint && (
                <p className="mt-2 text-xs font-medium text-white/75">{card.hint}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
