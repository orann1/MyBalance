import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "./config";
import type { Locale } from "./config";
import en from "../messages/en.json";
import he from "../messages/he.json";

const messages: Record<Locale, typeof en> = { en, he };

export default getRequestConfig(async ({ requestLocale }) => {
  let locale: Locale = defaultLocale;

  const localeString = String(requestLocale || defaultLocale);
  if (locales.includes(localeString as Locale)) {
    locale = localeString as Locale;
  }

  return {
    locale,
    messages: messages[locale],
    timeZone: "Asia/Jerusalem",
  };
});
