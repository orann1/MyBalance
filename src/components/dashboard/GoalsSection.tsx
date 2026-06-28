"use client";

import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/locale/formatters";
import type { FinancialGoal } from "@/types/dashboard";

interface GoalsSectionProps {
  goals: FinancialGoal[];
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  const t = useTranslations("dashboard");
  const tGoals = useTranslations("goals");

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        {t("financialGoals")}
      </h2>
      <div className="space-y-6">
        {goals.map((goal) => (
          <div key={goal.name}>
            <div className="flex justify-between items-end mb-3">
              <p className="font-medium text-foreground">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {tGoals(goal.name as any)}
              </p>
              <p className="text-sm text-muted-foreground">
                {goal.percentage}%
              </p>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-goal transition-all"
                style={{ width: `${goal.percentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>{formatCurrency(goal.current)}</span>
              <span>{formatCurrency(goal.target)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
