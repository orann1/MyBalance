"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, PiggyBank, Landmark } from "lucide-react";
import { formatCurrency } from "@/lib/locale/formatters";

interface PensionGemelSummaryCardsProps {
  totalCurrentValue: number;
  totalMonthlyContributions: number;
  projectedIn10Years: number;
  projectedInCustomYears: number;
  customYears: number;
  estimatedMonthlyPension: number;
}

export function PensionGemelSummaryCards({
  totalCurrentValue,
  totalMonthlyContributions,
  projectedIn10Years,
  projectedInCustomYears,
  customYears,
  estimatedMonthlyPension,
}: PensionGemelSummaryCardsProps) {
  const t = useTranslations("pensionGemel");

  const cards = [
    {
      label: t("summaryCards.totalCurrentValue"),
      value: formatCurrency(totalCurrentValue),
      icon: PiggyBank,
      gradient: "bg-gradient-pension",
    },
    {
      label: t("summaryCards.totalMonthlyContributions"),
      value: formatCurrency(totalMonthlyContributions),
      icon: TrendingUp,
      gradient: "bg-gradient-asset",
    },
    {
      label: t("summaryCards.projectedIn10Years"),
      value: formatCurrency(projectedIn10Years),
      icon: TrendingUp,
      gradient: "bg-gradient-goal",
    },
    {
      label: t.rich("summaryCards.projectedInCustomYears", {
        years: customYears,
      }),
      value: formatCurrency(projectedInCustomYears),
      icon: TrendingUp,
      gradient: "bg-gradient-asset",
    },
    {
      label: t("summaryCards.estimatedMonthlyPension"),
      value: formatCurrency(estimatedMonthlyPension),
      icon: Landmark,
      gradient: "bg-gradient-pension",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="rounded-3xl p-4 md:p-5 text-white shadow-card transition-all hover:shadow-soft hover:scale-105 border-0"
            style={{
              backgroundImage:
                card.gradient === "bg-gradient-pension"
                  ? "linear-gradient(135deg, oklch(0.74 0.12 220), oklch(0.7 0.13 200))"
                  : card.gradient === "bg-gradient-asset"
                    ? "linear-gradient(135deg, oklch(0.78 0.13 175), oklch(0.72 0.15 155))"
                    : "linear-gradient(135deg, oklch(0.72 0.16 310), oklch(0.6 0.18 285))",
            }}
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white/85 line-clamp-2">{card.label}</p>
                </div>
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/20 backdrop-blur">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-lg sm:text-xl font-extrabold tracking-tight truncate">{card.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
