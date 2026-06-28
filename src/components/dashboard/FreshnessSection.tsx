"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { DataFreshnessItem } from "@/types/dashboard";

interface FreshnessSectionProps {
  items: DataFreshnessItem[];
}

export function FreshnessSection({ items }: FreshnessSectionProps) {
  const t = useTranslations("dashboard");
  const tFreshness = useTranslations("freshness");

  const getStatusDot = (status: string) => {
    switch (status) {
      case "fresh":
        return "bg-positive";
      case "stale":
        return "bg-liability";
      case "informational":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-5 md:p-6">
      <h2 className="text-base md:text-lg font-bold mb-4">
        {t("dataFreshness")}
      </h2>
      <ul className="space-y-2.5">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5"
          >
            <span
              className={cn(
                "h-2.5 w-2.5 shrink-0 rounded-full",
                getStatusDot(item.status),
              )}
            />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {tFreshness(item.label as any)}
              </div>
              <div className="text-xs text-muted-foreground">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {tFreshness(item.date as any)}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
