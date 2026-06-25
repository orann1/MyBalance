export const locales = ["he", "en"] as const;
export const defaultLocale = "he" as const;

export type Locale = (typeof locales)[number];
