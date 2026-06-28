import type { DashboardData } from "@/types/dashboard";

export const mockDashboardData: DashboardData = {
  kpis: {
    netWorth: {
      label: "heiron_neto",
      value: 1842500,
      trend: 24300,
      icon: "wallet",
      color: "from-blue-500 to-indigo-600",
    },
    totalAssets: {
      label: "sach_nacasim",
      value: 2340000,
      trend: 45000,
      icon: "trending-up",
      color: "from-emerald-500 to-teal-600",
    },
    totalLiabilities: {
      label: "sach_hitheyabuyot",
      value: 497500,
      trend: -20700,
      icon: "layers",
      color: "from-orange-500 to-red-500",
    },
    monthlyChange: {
      label: "shinui_chodshi",
      value: 1.34,
      trend: 0.34,
      icon: "arrow-up",
      color: "from-purple-500 to-pink-600",
    },
  },
  assetAllocation: [
    {
      name: "cash",
      value: 185000,
      color: "#06B6D4",
      percentage: 7.9,
    },
    {
      name: "investments",
      value: 420000,
      color: "#8B5CF6",
      percentage: 17.9,
    },
    {
      name: "pension",
      value: 610000,
      color: "#06B6D4",
      percentage: 26.1,
    },
    {
      name: "hishtalmut",
      value: 220000,
      color: "#14B8A6",
      percentage: 9.4,
    },
    {
      name: "realEstate",
      value: 850000,
      color: "#F97316",
      percentage: 36.3,
    },
    {
      name: "other",
      value: 55000,
      color: "#A78BFA",
      percentage: 2.4,
    },
  ],
  assets: [
    {
      name: "cash",
      value: 185000,
      color: "#06B6D4",
    },
    {
      name: "investments",
      value: 420000,
      color: "#8B5CF6",
    },
    {
      name: "pension",
      value: 610000,
      color: "#06B6D4",
    },
    {
      name: "hishtalmut",
      value: 220000,
      color: "#14B8A6",
    },
    {
      name: "realEstate",
      value: 850000,
      color: "#F97316",
    },
    {
      name: "other",
      value: 55000,
      color: "#A78BFA",
    },
  ],
  liabilities: [
    {
      name: "mortgage",
      value: 430000,
      color: "#FB923C",
    },
    {
      name: "bankLoan",
      value: 42500,
      color: "#FCA5A5",
    },
    {
      name: "creditCards",
      value: 25000,
      color: "#FECACA",
    },
  ],
  pension: {
    pension: 610000,
    hishtalmut: 220000,
    gemel: 0,
  },
  goals: [
    {
      name: "emergencyFund",
      current: 185000,
      target: 250000,
      percentage: 74,
    },
    {
      name: "netWorthTarget",
      current: 1842500,
      target: 3000000,
      percentage: 61,
    },
    {
      name: "debtReduction",
      current: 467500,
      target: 300000,
      percentage: 38,
    },
  ],
  netWorthTimeline: [
    { month: "2025-07", value: 1620000 },
    { month: "2025-08", value: 1635000 },
    { month: "2025-09", value: 1628000 },
    { month: "2025-10", value: 1645000 },
    { month: "2025-11", value: 1665000 },
    { month: "2025-12", value: 1692000 },
    { month: "2026-01", value: 1708000 },
    { month: "2026-02", value: 1725000 },
    { month: "2026-03", value: 1745000 },
    { month: "2026-04", value: 1812000 },
    { month: "2026-05", value: 1818200 },
    { month: "2026-06", value: 1842500 },
  ],
  freshness: [
    {
      label: "manualAssets",
      status: "stale",
      date: "twoDaysAgo",
    },
    {
      label: "liabilities",
      status: "stale",
      date: "oneWeekAgo",
    },
    {
      label: "pensionPublicData",
      status: "informational",
      date: "lastMonth",
    },
    {
      label: "lastSnapshot",
      status: "fresh",
      date: "specificDate",
    },
  ],
  insights: [
    {
      id: "1",
      text: "realEstateExposure",
      type: "info",
    },
    {
      id: "2",
      text: "liquidityStable",
      type: "neutral",
    },
    {
      id: "3",
      text: "liabilityTracking",
      type: "info",
    },
  ],
};
