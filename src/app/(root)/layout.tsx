import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { RootLayoutProvider } from "@/components/providers/RootLayoutProvider";

// Hebrew route group layout. Provides NextIntlClientProvider + AppShell for
// the canonical Hebrew routes: /, /managed-savings, /pension-gemel.
// Does not add a URL segment.
export default function HebrewLayout({ children }: { children: ReactNode }) {
  setRequestLocale("he");
  return <RootLayoutProvider locale="he">{children}</RootLayoutProvider>;
}
