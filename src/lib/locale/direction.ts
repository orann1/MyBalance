import type { Locale } from "@/i18n/config";

const directionMap: Record<Locale, "ltr" | "rtl"> = {
  he: "rtl",
  en: "ltr",
};

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return directionMap[locale];
}
