import type { Locale } from "./config";

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  he: "rtl",
  en: "ltr",
};

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return localeDirection[locale];
}
