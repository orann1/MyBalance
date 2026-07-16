"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { X, Sparkles } from "lucide-react";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  CreditCard,
  PieChart,
  Landmark,
  Target,
  ArrowDownUp,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  key: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
};

const navItems: NavItem[] = [
  { key: "dashboard", href: "/", icon: LayoutDashboard, tint: "bg-[oklch(0.93_0.06_275)] text-[oklch(0.4_0.18_275)]" },
  { key: "accounts", href: "/accounts", icon: Wallet, tint: "bg-[oklch(0.93_0.06_185)] text-[oklch(0.4_0.12_195)]" },
  { key: "assets", href: "/assets", icon: TrendingUp, tint: "bg-[oklch(0.93_0.07_165)] text-[oklch(0.38_0.13_165)]" },
  { key: "liabilities", href: "/liabilities", icon: CreditCard, tint: "bg-[oklch(0.94_0.07_40)] text-[oklch(0.45_0.15_35)]" },
  { key: "snapshots", href: "/snapshots", icon: PieChart, tint: "bg-[oklch(0.93_0.07_300)] text-[oklch(0.42_0.17_300)]" },
  { key: "managedSavings", href: "/managed-savings", icon: Landmark, tint: "bg-[oklch(0.93_0.06_220)] text-[oklch(0.4_0.13_220)]" },
  { key: "goals", href: "/goals", icon: Target, tint: "bg-[oklch(0.93_0.08_320)] text-[oklch(0.42_0.18_320)]" },
  { key: "importExport", href: "/import-export", icon: ArrowDownUp, tint: "bg-[oklch(0.94_0.06_140)] text-[oklch(0.4_0.13_150)]" },
  { key: "settings", href: "/settings", icon: Settings, tint: "bg-[oklch(0.94_0.02_280)] text-[oklch(0.4_0.04_280)]" },
];

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const t = useTranslations("nav");
  const tSidebar = useTranslations("sidebar");
  const pathname = usePathname();
  const locale = useLocale();
  const isRTL = locale === "he";

  const isActive = (href: string) => pathname === href || (href === "/" && pathname === "/");

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/*
        Clipping wrapper: `position: fixed; inset: 0` matches the viewport
        exactly, and `overflow: hidden` on it clips the off-canvas `<aside>`
        below. This matters because the `<aside>` itself is no longer
        `position: fixed` (see below) — a `position: fixed` element is
        anchored to the viewport/initial containing block directly and
        ignores an ordinary ancestor's `overflow: hidden`/`clip`, so its
        translated-off-canvas box was inflating
        `document.documentElement.scrollWidth` even while fully invisible
        (verified: closed drawer bounding box extended to x=690 on a 390px
        viewport). Making the `<aside>` `position: absolute` relative to
        this exactly-viewport-sized `overflow-hidden` wrapper preserves the
        identical slide-in/out visual behavior while making the off-canvas
        position genuinely clipped, not just visually hidden.
      */}
      <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none md:hidden">
        <aside
          className={cn(
            "absolute top-16 bottom-0 w-[300px] border-e border-border/60 bg-card overflow-y-auto transition-transform duration-300 pointer-events-auto",
            isRTL ? "right-0" : "left-0",
            isOpen ? "translate-x-0" : (isRTL ? "translate-x-full" : "-translate-x-full")
          )}
        >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="text-sm font-semibold text-muted-foreground">{t("navigation")}</div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg hover:bg-secondary"
            aria-label={tSidebar("close")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-networth text-primary-foreground shadow-soft">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-extrabold tracking-tight">MyBalance</div>
            <div className="truncate text-xs text-muted-foreground">{tSidebar("subtitle")}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 pb-3">
          <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("navigation")}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-2xl px-2.5 py-2.5 text-sm font-medium text-muted-foreground transition-all",
                  "hover:bg-secondary/60 hover:text-foreground",
                  active && (isRTL
                    ? "bg-gradient-to-l from-primary/12 via-primary/8 to-transparent text-foreground"
                    : "bg-gradient-to-r from-primary/12 via-primary/8 to-transparent text-foreground"
                  )
                )}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-y-2 start-0 w-1 rounded-full bg-gradient-networth"
                  />
                )}
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105",
                    item.tint,
                    active && "ring-2 ring-primary/25 shadow-soft"
                  )}
                >
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="truncate">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {t(item.key as any)}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border/60 p-3">
          <div className="rounded-xl bg-secondary/60 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
            <div className="font-semibold text-foreground/80">MyBalance</div>
            {tSidebar("sampleData")}
          </div>
        </div>
      </aside>
      </div>
    </>
  );
}
