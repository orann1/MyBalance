"use client";

import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { AppShell } from "@/components/layout/AppShell";
import he from "@/messages/he.json";
import en from "@/messages/en.json";

const messages = { he, en };

interface RootLayoutProviderProps {
  children: ReactNode;
  locale?: string;
}

export function RootLayoutProvider({ children, locale = "he" }: RootLayoutProviderProps) {
  const validLocale = (locale === "he" || locale === "en") ? locale : "he";

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages[validLocale]}>
      <AppShell>{children}</AppShell>
    </NextIntlClientProvider>
  );
}
