import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import { RootLayoutProvider } from "@/components/providers/RootLayoutProvider";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["latin", "hebrew"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "MyBalance",
  description: "Complete visibility of your full financial picture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${heebo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <RootLayoutProvider locale="he">{children}</RootLayoutProvider>
      </body>
    </html>
  );
}
