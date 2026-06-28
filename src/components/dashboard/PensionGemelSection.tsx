"use client";

import { useTranslations } from "next-intl";
import { Info, Landmark, PiggyBank, CircleDollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/locale/formatters";

interface PensionGemelSectionProps {
  pension: number;
  hishtalmut: number;
  gemel: number;
}

export function PensionGemelSection({
  pension,
  hishtalmut,
  gemel,
}: PensionGemelSectionProps) {
  const t = useTranslations("dashboard");
  const tAssets = useTranslations("assets");
  const insight = useTranslations("insights");

  const items = [
    { key: "pension", value: pension, icon: Landmark, sub: "תשואה ציבורית: +4.8% ב-12 ח׳" },
    { key: "hishtalmut", value: hishtalmut, icon: PiggyBank, sub: "פטור מס בעוד 2 שנים" },
    { key: "gemel", value: gemel, icon: CircleDollarSign, sub: "עוד לא חובר" },
  ];

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-5 md:p-6">
      <h2 className="text-base md:text-lg font-bold mb-4">
        {t("pensionAndGemel")}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-secondary/40 p-3"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-pension text-white">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="text-xs font-semibold text-muted-foreground">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {tAssets(item.key as any)}
                </div>
              </div>
              <div className="text-lg font-extrabold tabular-nums mb-1">
                {formatCurrency(item.value)}
              </div>
              <div className="text-[11px] leading-relaxed text-muted-foreground">
                {item.sub}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-start gap-2 rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-pension" />
        <span>{insight("disclaimer")}</span>
      </div>
    </div>
  );
}
