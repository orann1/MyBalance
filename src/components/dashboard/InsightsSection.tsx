"use client";

import { useTranslations } from "next-intl";
import type { Insight } from "@/types/dashboard";

interface InsightsSectionProps {
  insights: Insight[];
}

export function InsightsSection({ insights }: InsightsSectionProps) {
  const t = useTranslations("dashboard");
  const tInsights = useTranslations("insights");

  const getInsightStyle = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "warning":
        return "bg-orange-50 border-orange-200 text-orange-900";
      case "neutral":
        return "bg-gray-50 border-gray-200 text-gray-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-6 md:p-8">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        {t("insightsToReview")}
      </h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`border rounded-2xl p-4 ${getInsightStyle(insight.type)}`}
          >
            <p className="text-sm leading-relaxed">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {tInsights(insight.text as any)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
