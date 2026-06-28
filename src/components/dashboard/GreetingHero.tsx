"use client";

import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";

export function GreetingHero() {
  const t = useTranslations("dashboard");

  const currentTime = new Date();
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hour.toString().padStart(2, "0")}:${minute}`;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-1">
            {t("greeting")}
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">{t("subtitle")}</p>
        </div>
        <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-xl whitespace-nowrap">
          {t("mockDataBadge")}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs md:text-sm text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
        <span>{t("updatedToday")}, {timeStr}</span>
      </div>
    </div>
  );
}
