import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getDirection } from "@/lib/locale/direction";
import { RootLayoutProvider } from "@/components/providers/RootLayoutProvider";
import { SetHtmlAttributes } from "@/components/layout/SetHtmlAttributes";
import type { Locale } from "@/i18n/config";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Locale-specific layout. Provides NextIntlClientProvider + AppShell for
// locale-prefixed routes (/en/*, /he/*). The root html/body come from app/layout.tsx.
// SetHtmlAttributes patches <html lang> and <html dir> client-side for non-Hebrew locales.
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const dir = getDirection(locale as Locale);

  return (
    <>
      <SetHtmlAttributes lang={locale} dir={dir} />
      <RootLayoutProvider locale={locale}>{children}</RootLayoutProvider>
    </>
  );
}
