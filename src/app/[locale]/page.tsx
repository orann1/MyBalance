import { createTranslation } from "@/lib/locale/get-translations";
import type { Locale } from "@/i18n/config";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = createTranslation(locale as Locale);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 dark:bg-black px-4">
      <main className="flex flex-col items-center justify-center gap-8 py-16 text-center">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
            {t("app.name")}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            {t("app.subtitle")}
          </p>
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-2">
            {t("foundation.title")}
          </h2>
          <p className="max-w-md text-base text-zinc-600 dark:text-zinc-400">
            {t("foundation.description")}
          </p>
        </div>
      </main>
    </div>
  );
}
