"use client";

import { useTranslations } from "next-intl";
import { Banknote, TrendingUp, Landmark, PiggyBank, Building2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/locale/formatters";
import type { DashboardData } from "@/types/dashboard";

interface AssetsSectionProps {
  assets: DashboardData["assets"];
}

function getAssetIcon(name: string) {
  switch (name) {
    case "cash":
      return Banknote;
    case "investments":
      return TrendingUp;
    case "pension":
      return Landmark;
    case "hishtalmut":
      return PiggyBank;
    case "realEstate":
      return Building2;
    default:
      return Package;
  }
}

function getAssetTint(name: string) {
  switch (name) {
    case "cash":
      return "bg-gradient-cash";
    case "investments":
      return "bg-gradient-asset";
    case "pension":
      return "bg-gradient-pension";
    case "hishtalmut":
      return "bg-gradient-pension";
    case "realEstate":
      return "bg-gradient-networth";
    default:
      return "bg-gradient-asset";
  }
}

export function AssetsSection({ assets }: AssetsSectionProps) {
  const t = useTranslations("dashboard");
  const tAssets = useTranslations("assets");

  const total = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-5 md:p-6">
      <h2 className="text-base md:text-lg font-bold mb-4">
        {t("myAssets")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {assets.map((asset) => {
          const Icon = getAssetIcon(asset.name);
          const pct = ((asset.value / total) * 100).toFixed(1);
          return (
            <div
              key={asset.name}
              className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3"
            >
              <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white", getAssetTint(asset.name))}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {tAssets(asset.name as any)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {pct}% {t("ofTotal") || "من الإجمالي"}
                </div>
              </div>
              <div className="shrink-0 text-sm font-bold tabular-nums">
                {formatCurrency(asset.value)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border/60 pt-3">
        <div className="flex justify-between items-center font-semibold">
          <span className="text-muted-foreground text-sm">{t("total")}</span>
          <span className="text-base">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
