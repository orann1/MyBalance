import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getDirection } from "@/lib/locale/direction";
import { Heebo } from "next/font/google";
import { RootLayoutProvider } from "@/components/providers/RootLayoutProvider";
import "../globals.css";
import type { Locale } from "@/i18n/config";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MyBalance",
  description: "Complete visibility of your full financial picture",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const direction = getDirection(locale as Locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${heebo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootLayoutProvider locale={locale}>{children}</RootLayoutProvider>
      </body>
    </html>
  );
}
