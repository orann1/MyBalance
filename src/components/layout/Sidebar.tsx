"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
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
  Sparkles,
  ChevronRight,
  ChevronLeft,
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

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const t = useTranslations("nav");
  const tSidebar = useTranslations("sidebar");
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || (href === "/" && pathname === "/");

  return (
    <aside className={cn(
      "hidden md:flex flex-col sticky top-0 h-screen shrink-0 border-s border-border/60 bg-card/60 backdrop-blur transition-[width] duration-200 z-40",
      collapsed ? "w-[78px]" : "w-[280px]"
    )}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-networth text-primary-foreground shadow-soft">
          <Sparkles className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <div className="text-base font-extrabold tracking-tight">MyBalance</div>
            <div className="truncate text-xs text-muted-foreground">{tSidebar("subtitle")}</div>
          </div>
        )}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="ms-auto hidden h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary lg:grid"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-y-auto px-3 pb-3">
        {!collapsed && (
          <div className="px-2 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("navigation") || "ניווט"}
          </div>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                t(item.key as any)
              ) : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-2xl px-2.5 py-3 text-base font-semibold text-muted-foreground transition-all",
                "hover:bg-secondary/60 hover:text-foreground",
                collapsed && "justify-center",
                active && "bg-gradient-to-l from-primary/20 via-primary/12 to-transparent text-foreground"
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-y-2 right-0 w-1 rounded-full bg-gradient-networth"
                />
              )}
              <span
                className={cn(
                  "grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-transform group-hover:scale-105",
                  item.tint,
                  active && "ring-2 ring-primary/30 shadow-soft scale-110"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              {!collapsed && (
                <span className="truncate">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {t(item.key as any)}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-border/60 p-3">
          <div className="rounded-xl bg-secondary/60 px-3 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
            <div className="font-semibold text-foreground/80">MyBalance</div>
            {tSidebar("sampleData")}
          </div>
        </div>
      )}
    </aside>
  );
}
