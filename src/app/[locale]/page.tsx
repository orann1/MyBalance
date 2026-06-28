import { redirect } from "next/navigation";
import { Wallet, TrendingUp, CreditCard, LineChart as LineChartIcon } from "lucide-react";
import { GreetingHero } from "@/components/dashboard/GreetingHero";
import { KPICard } from "@/components/dashboard/KPICard";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { AssetAllocationChart } from "@/components/dashboard/AssetAllocationChart";
import { AssetsSection } from "@/components/dashboard/AssetsSection";
import { LiabilitiesSection } from "@/components/dashboard/LiabilitiesSection";
import { PensionGemelSection } from "@/components/dashboard/PensionGemelSection";
import { GoalsSection } from "@/components/dashboard/GoalsSection";
import { FreshnessSection } from "@/components/dashboard/FreshnessSection";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { formatCurrency, formatPercent } from "@/lib/locale/formatters";
import { mockDashboardData } from "@/lib/mock/dashboard-data";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (locale === "he") {
    redirect("/");
  }

  return (
    <>
      <GreetingHero />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="הון נטו"
          value={formatCurrency(mockDashboardData.kpis.netWorth.value)}
          trend={`+${formatCurrency(mockDashboardData.kpis.netWorth.trend || 0)}`}
          icon={<Wallet className="h-5 w-5" />}
          className="bg-gradient-networth"
        />
        <KPICard
          label="סך נכסים"
          value={formatCurrency(mockDashboardData.kpis.totalAssets.value)}
          trend="+1.1%"
          icon={<TrendingUp className="h-5 w-5" />}
          className="bg-gradient-asset"
        />
        <KPICard
          label="סך התחייבויות"
          value={formatCurrency(mockDashboardData.kpis.totalLiabilities.value)}
          trend="-0.4%"
          icon={<CreditCard className="h-5 w-5" />}
          className="bg-gradient-liability"
        />
        <KPICard
          label="שינוי חודשי"
          value={formatPercent(mockDashboardData.kpis.monthlyChange.value)}
          trend="חודש על חודש"
          icon={<LineChartIcon className="h-5 w-5" />}
          className="bg-gradient-goal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <NetWorthChart data={mockDashboardData.netWorthTimeline} />
        <AssetAllocationChart data={mockDashboardData.assetAllocation} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <AssetsSection assets={mockDashboardData.assets} />
        <LiabilitiesSection liabilities={mockDashboardData.liabilities} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <PensionGemelSection
          pension={mockDashboardData.pension.pension}
          hishtalmut={mockDashboardData.pension.hishtalmut}
          gemel={mockDashboardData.pension.gemel}
        />
        <GoalsSection goals={mockDashboardData.goals} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <FreshnessSection items={mockDashboardData.freshness} />
        <InsightsSection insights={mockDashboardData.insights} />
      </div>
    </>
  );
}
