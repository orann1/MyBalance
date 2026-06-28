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

export default async function RootPage() {
  return (
    <>
      <GreetingHero />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KPICard
          label="הון נטו"
          value={formatCurrency(mockDashboardData.kpis.netWorth.value)}
          trend={`טרנד חודשי: +${formatCurrency(mockDashboardData.kpis.netWorth.trend || 0)}`}
          className="bg-gradient-networth"
        />
        <KPICard
          label="סך נכסים"
          value={formatCurrency(mockDashboardData.kpis.totalAssets.value)}
          trend={`טרנד חודשי: +${formatCurrency(mockDashboardData.kpis.totalAssets.trend || 0)}`}
          className="bg-gradient-asset"
        />
        <KPICard
          label="סך התחייבויות"
          value={formatCurrency(mockDashboardData.kpis.totalLiabilities.value)}
          trend={`טרנד חודשי: ${mockDashboardData.kpis.totalLiabilities.trend || 0 > 0 ? "+" : ""}${formatCurrency(mockDashboardData.kpis.totalLiabilities.trend || 0)}`}
          className="bg-gradient-liability"
        />
        <KPICard
          label="שינוי חודשי"
          value={formatPercent(mockDashboardData.kpis.monthlyChange.value)}
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
