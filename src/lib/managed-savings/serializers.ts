import type { ManagedSavingsHolding } from "@prisma/client";
import { fromMinorUnits, bpsToPercent } from "@/lib/financial/units";
import type {
  ManagedSavingsInvestment,
  TrackPerformance,
} from "@/lib/mock/managed-savings-data";

// Phase 2B fallback: public track performance is mock data until Phase 2C connects Data.gov.il.
const FALLBACK_PERFORMANCE: Record<string, TrackPerformance> = {
  hishtalmut: {
    lastMonth: 0.9,
    last1Year: 7.0,
    last3Years: 5.3,
    last5Years: 5.1,
    last10Years: 5.3,
  },
  gemel: {
    lastMonth: 0.88,
    last1Year: 6.8,
    last3Years: 5.0,
    last5Years: 4.9,
    last10Years: 5.1,
  },
  hashkaa: {
    lastMonth: 1.1,
    last1Year: 8.0,
    last3Years: 6.0,
    last5Years: 5.8,
    last10Years: 6.0,
  },
  savings: {
    lastMonth: 0.75,
    last1Year: 5.8,
    last3Years: 4.3,
    last5Years: 4.2,
    last10Years: 4.7,
  },
};

// Maps a Prisma ManagedSavingsHolding record to the UI domain type.
// Converts BigInt money fields to numbers and bps fees to percent values.
// trackPerformance is mock fallback until Phase 2C.
export function serializeHolding(
  record: ManagedSavingsHolding
): ManagedSavingsInvestment {
  const type = record.type as ManagedSavingsInvestment["type"];
  const dateSource = record.valuationDate ?? record.updatedAt;

  return {
    id: record.id,
    name: record.name,
    type,
    managingCompany: record.managingCompany ?? "",
    track: record.trackName ?? "",
    currentBalance: fromMinorUnits(record.currentBalanceMinor),
    monthlyContribution: fromMinorUnits(record.monthlyContributionMinor),
    accumulationFeePercent: bpsToPercent(record.accumulationFeeBps),
    depositFeePercent: bpsToPercent(record.depositFeeBps),
    owner: record.owner as ManagedSavingsInvestment["owner"],
    lastUpdateDate: dateSource.toISOString().split("T")[0],
    // The data access layer filters out archived holdings before serialization,
    // so only "active" and "inactive" records arrive here.
    status: record.status as "active" | "inactive",
    officialFundId: record.officialFundId ?? undefined,
    trackPerformance: FALLBACK_PERFORMANCE[type] ?? FALLBACK_PERFORMANCE.gemel,
    notes: record.notes ?? undefined,
  };
}
