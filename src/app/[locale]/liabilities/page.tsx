"use client";

import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/AppShell";

export default function LiabilitiesPage() {
  const t = useTranslations("nav");
  const dashboard = useTranslations("dashboard");

  return (
    <AppShell>
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {t("liabilities")}
            </h1>
            <p className="text-gray-600 mb-6">
              Manage your debts and liabilities
            </p>
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
              {dashboard("coming_soon")}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
