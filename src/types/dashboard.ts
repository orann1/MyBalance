export interface KPICard {
  label: string;
  value: number;
  trend?: number;
  icon: string;
  color: string;
}

export interface AssetCategory {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

export interface LiabilityItem {
  name: string;
  value: number;
  color: string;
}

export interface FinancialGoal {
  name: string;
  current: number;
  target: number;
  percentage: number;
}

export interface NetWorthDataPoint {
  month: string;
  value: number;
}

export interface DataFreshnessItem {
  label: string;
  status: "fresh" | "stale" | "informational";
  date?: string;
}

export interface Insight {
  id: string;
  text: string;
  type: "info" | "warning" | "neutral";
}

export interface DashboardData {
  kpis: {
    netWorth: KPICard;
    totalAssets: KPICard;
    totalLiabilities: KPICard;
    monthlyChange: KPICard;
  };
  assetAllocation: AssetCategory[];
  assets: {
    name: string;
    value: number;
    color: string;
  }[];
  liabilities: LiabilityItem[];
  pension: {
    pension: number;
    hishtalmut: number;
    gemel: number;
  };
  goals: FinancialGoal[];
  netWorthTimeline: NetWorthDataPoint[];
  freshness: DataFreshnessItem[];
  insights: Insight[];
}
