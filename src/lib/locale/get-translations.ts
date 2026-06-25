import en from "@/messages/en.json";
import he from "@/messages/he.json";
import type { Locale } from "@/i18n/config";

const messages: Record<Locale, typeof en> = { en, he };

export function createTranslation(locale: Locale) {
  return (key: string): string => {
    const keys = key.split(".");
    let value: unknown = messages[locale];
    for (const k of keys) {
      if (typeof value === "object" && value !== null && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return key;
      }
    }
    return typeof value === "string" ? value : key;
  };
}
