"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import type { NetWorthDataPoint } from "@/types/dashboard";
import { formatCurrency } from "@/lib/locale/formatters";
import { cn } from "@/lib/utils";

interface NetWorthChartProps {
  data: NetWorthDataPoint[];
}

export function NetWorthChart({ data }: NetWorthChartProps) {
  const t = useTranslations("dashboard");
  const [range, setRange] = useState<3 | 6 | 12>(6);

  const filteredData = data.slice(-range);
  const ranges = [3, 6, 12] as const;

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-5 md:p-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-base md:text-lg font-bold">
            {t("netWorthTimeline")}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">12 החודשים האחרונים · נתוני דוגמה</p>
        </div>
        <div className="hidden gap-1 rounded-full bg-secondary p-1 text-xs sm:flex">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-3 py-1 font-semibold rounded-full transition-colors",
                range === r
                  ? "bg-card text-foreground shadow-card"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {r} ח׳
            </button>
          ))}
        </div>
      </div>
      <div dir="ltr" className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="nw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.6 0.18 275)" stopOpacity={0.45} />
                <stop offset="100%" stopColor="oklch(0.6 0.18 275)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="oklch(0.9 0.02 280)" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "oklch(0.5 0.03 270)" }}
            />
            <YAxis
              tickFormatter={(v) => `${Math.round(v / 1000)}K`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "oklch(0.5 0.03 270)" }}
              width={44}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid oklch(0.9 0.02 280)",
                fontSize: 12,
              }}
              formatter={(v: number) => [formatCurrency(v), "הון נטו"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="oklch(0.55 0.19 275)"
              strokeWidth={2.5}
              fill="url(#nw)"
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
