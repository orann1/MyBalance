"use client";

import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/locale/formatters";
import type { AssetCategory } from "@/types/dashboard";

interface AssetAllocationChartProps {
  data: AssetCategory[];
}

export function AssetAllocationChart({ data }: AssetAllocationChartProps) {
  const t = useTranslations("dashboard");
  const tAssets = useTranslations("assets");

  const chartData = data.map((item) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: tAssets(item.name as any),
    value: item.percentage,
    color: item.color,
  }));

  const totalAssets = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card p-5 md:p-6">
      <div className="mb-4">
        <h2 className="text-base md:text-lg font-bold">
          {t("assetAllocation")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">פילוח לפי קטגוריה</p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Chart */}
        <div dir="ltr" className="h-44 w-44 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={48}
                outerRadius={78}
                paddingAngle={2}
                stroke="white"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number, _n, p) => [
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatCurrency((p.payload as any).value),
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (p.payload as any).name,
                ]}
                contentStyle={{ borderRadius: 10, fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <ul className="min-w-0 flex-1 space-y-1.5 text-sm">
          {chartData.map((item, index) => {
            const assetData = data[index];
            const pct = Math.round((assetData.value / totalAssets) * 100);
            return (
              <li key={item.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />
                <span className="truncate">{item.name}</span>
                <span className="ms-auto text-xs text-muted-foreground">{pct}%</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
