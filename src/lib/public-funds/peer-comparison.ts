import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

// Local-DB-only peer comparison for the "Similar Tracks Comparison" feature
// (Phase 2E-1). Groups GemelNet funds by fundClassification + subSpecialization
// (+ targetPopulation relevance), and compares fund-level return/fee data for
// a shared report period. Never calls Data.gov.il, never reads/writes personal
// balances. Sharpe, Alpha, AUM, and exposure/composition data are
// intentionally out of scope for this phase.

export type ComparisonStatus =
  | "available"
  | "not_enough_peers"
  | "missing_classification"
  | "not_linked"
  | "unsupported_source";

export type MatchLevel = "strict" | "relaxed" | null;

const STRICT_MIN_PEER_GROUP_SIZE = 5;
const RELAXED_MIN_PEER_GROUP_SIZE = 3;
const ROLLING_12_MONTH_COUNT = 12;
const TOP_PEER_DISPLAY_LIMIT = 10;

// Known phrasing for a "general/public" GemelNet target population. Local
// data currently shows exactly one generic value ("כלל האוכלוסיה") alongside
// two sector/employer-specific values ("עובדי סקטור מסויים",
// "עובדי מפעל/גוף מסויים") — see the Phase 2E-1 QA fix audit. Null/empty is
// also treated as generic (no sector restriction implied). Kept as an
// extensible list rather than assuming this is the only possible phrasing.
const GENERIC_TARGET_POPULATION_VALUES = ["כלל האוכלוסיה", "כלל הציבור"];

function isGenericTargetPopulation(value: string | null | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (trimmed.length === 0) return true;
  return GENERIC_TARGET_POPULATION_VALUES.includes(trimmed);
}

export interface PeerComparisonRow {
  publicFundId: string;
  fundId: string;
  fundName: string;
  // Added Phase 2F-2 for Fund Replacement Simulator modal identity only —
  // intentionally not rendered as a SimilarTracksComparison table column.
  managingCompany: string;
  isTarget: boolean;
  rank: number | null;
  lastMonthReturn: number | null;
  last12MonthReturn: number | null;
  trailing3YrReturn: number | null;
  trailing5YrReturn: number | null;
  // Added Phase 2F-2: the annualized (not cumulative) 5-year return. Required
  // for the Fund Replacement Simulator's compounding projection — the
  // existing trailing5YrReturn above is a cumulative 5-year return and must
  // never be used as an annual rate input. Not rendered as a
  // SimilarTracksComparison table column (that column intentionally keeps
  // showing trailing5YrReturn, unchanged from Phase 2E-1).
  annualized5YrReturn: number | null;
  avgAnnualManagementFee: number | null;
}

export interface PeerComparisonAverageRow {
  peerGroupSize: number;
  lastMonthReturn: number | null;
  last12MonthReturn: number | null;
  trailing3YrReturn: number | null;
  trailing5YrReturn: number | null;
  avgAnnualManagementFee: number | null;
}

export interface PeerComparisonResult {
  comparisonStatus: ComparisonStatus;
  matchLevel: MatchLevel;
  peerGroupSize: number;
  fundClassification: string | null;
  subSpecialization: string | null;
  latestReportPeriod: string | null;
  // Display rows only: the top TOP_PEER_DISPLAY_LIMIT relevant peers by
  // trailing5YrReturn, plus the target's own row appended if it falls outside
  // that range. `rank` always reflects the fund's true position within the
  // full relevant (population-filtered) peer set, not its position in this
  // trimmed array.
  rows: PeerComparisonRow[];
  averageRow: PeerComparisonAverageRow | null;
}

function noComparison(status: ComparisonStatus): PeerComparisonResult {
  return {
    comparisonStatus: status,
    matchLevel: null,
    peerGroupSize: 0,
    fundClassification: null,
    subSpecialization: null,
    latestReportPeriod: null,
    rows: [],
    averageRow: null,
  };
}

interface ReportPeriodRow {
  publicFundId: string;
  reportPeriod: Date;
  monthlyReturn: string;
  trailing3YrReturn: string | null;
  trailing5YrReturn: string | null;
  annualized5YrReturn: string | null;
  avgAnnualManagementFee: string | null;
}

interface FeeFallbackRow {
  publicFundId: string;
  avgAnnualManagementFee: string | null;
}

interface RollingReturnRow {
  publicFundId: string;
  reportPeriod: Date;
  monthlyReturn: string;
}

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

/**
 * Computes a true rolling N-month cumulative return via compounding (not
 * simple summation) from an ordered (most-recent-first) list of monthly
 * return percentages. Returns null if fewer than the required number of
 * months of history is available.
 */
function computeRolling12MonthReturn(monthlyReturnsDesc: number[]): number | null {
  if (monthlyReturnsDesc.length < ROLLING_12_MONTH_COUNT) return null;
  const last12 = monthlyReturnsDesc.slice(0, ROLLING_12_MONTH_COUNT);
  const compounded = last12.reduce((acc, monthlyReturn) => acc * (1 + monthlyReturn / 100), 1);
  return (compounded - 1) * 100;
}

/**
 * Builds a Similar Tracks Comparison for the given linked PublicFund id.
 * Peer grouping: source = gemelnet, fundClassification (+ subSpecialization
 * when the strict group is large enough), further narrowed by
 * targetPopulation relevance (generic-vs-generic, or exact sector/employer
 * match for specific-population funds — see isGenericTargetPopulation).
 * Only compares funds at the same FundReturn.reportPeriod as the target
 * fund's latest available period, so no two funds in the table are ever
 * compared across different periods.
 */
export async function getPeerComparisonForPublicFund(
  publicFundId: string
): Promise<PeerComparisonResult> {
  const targetFund = await prisma.publicFund.findUnique({
    where: { id: publicFundId },
    select: {
      id: true,
      source: true,
      fundId: true,
      fundName: true,
      fundClassification: true,
      subSpecialization: true,
      targetPopulation: true,
    },
  });

  if (!targetFund) {
    return noComparison("not_linked");
  }

  if (targetFund.source !== "gemelnet") {
    return noComparison("unsupported_source");
  }

  if (!targetFund.fundClassification || !targetFund.subSpecialization) {
    return noComparison("missing_classification");
  }

  const [strictCount, relaxedCount] = await Promise.all([
    prisma.publicFund.count({
      where: {
        source: "gemelnet",
        fundClassification: targetFund.fundClassification,
        subSpecialization: targetFund.subSpecialization,
      },
    }),
    prisma.publicFund.count({
      where: { source: "gemelnet", fundClassification: targetFund.fundClassification },
    }),
  ]);

  let matchLevel: MatchLevel;
  if (strictCount >= STRICT_MIN_PEER_GROUP_SIZE) {
    matchLevel = "strict";
  } else if (relaxedCount >= RELAXED_MIN_PEER_GROUP_SIZE) {
    matchLevel = "relaxed";
  } else {
    return noComparison("not_enough_peers");
  }

  const classificationGroupFunds = await prisma.publicFund.findMany({
    where:
      matchLevel === "strict"
        ? {
            source: "gemelnet",
            fundClassification: targetFund.fundClassification,
            subSpecialization: targetFund.subSpecialization,
          }
        : { source: "gemelnet", fundClassification: targetFund.fundClassification },
    select: {
      id: true,
      fundId: true,
      fundName: true,
      managingCompany: true,
      targetPopulation: true,
    },
  });

  // Relevance filter: a generic/public target fund is only compared against
  // other generic/public funds (excluding sector/employer-specific tracks
  // that would otherwise dilute the comparison); a sector/employer-specific
  // target fund is only compared against peers with that exact same
  // targetPopulation value. The target fund itself always passes.
  const targetIsGeneric = isGenericTargetPopulation(targetFund.targetPopulation);
  const groupFunds = classificationGroupFunds.filter((fund) => {
    if (fund.id === targetFund.id) return true;
    return targetIsGeneric
      ? isGenericTargetPopulation(fund.targetPopulation)
      : fund.targetPopulation === targetFund.targetPopulation;
  });

  const groupFundIds = groupFunds.map((fund) => fund.id);

  // Fair-comparison period: the target fund's own latest reportPeriod. Peers
  // without a FundReturn row for this exact period are excluded rather than
  // compared across mismatched periods.
  const latestTargetReturn = await prisma.fundReturn.findFirst({
    where: { publicFundId: targetFund.id },
    orderBy: { reportPeriod: "desc" },
    select: { reportPeriod: true },
  });

  if (!latestTargetReturn) {
    return noComparison("not_enough_peers");
  }

  const latestReportPeriod = latestTargetReturn.reportPeriod;

  const periodRows = await prisma.$queryRaw<ReportPeriodRow[]>(Prisma.sql`
    SELECT "publicFundId", "reportPeriod", "monthlyReturn", "trailing3YrReturn",
      "trailing5YrReturn", "annualized5YrReturn", "avgAnnualManagementFee"
    FROM "FundReturn"
    WHERE "publicFundId" = ANY(${groupFundIds}::text[]) AND "reportPeriod" = ${latestReportPeriod}
  `);

  if (periodRows.length === 0) {
    return noComparison("not_enough_peers");
  }

  const periodRowByFundId = new Map(periodRows.map((row) => [row.publicFundId, row]));
  const includedFundIds = periodRows.map((row) => row.publicFundId);

  // Guard: even when the raw classification counts met the threshold, actual
  // relevant-peer data availability for this exact period may be sparser —
  // re-check the hard floor after population + period filtering so the table
  // never renders a misleadingly small comparison.
  if (includedFundIds.length < RELAXED_MIN_PEER_GROUP_SIZE) {
    return noComparison("not_enough_peers");
  }
  if (!includedFundIds.includes(targetFund.id)) {
    return noComparison("not_enough_peers");
  }

  // Fee fallback: latest available 2025 avgAnnualManagementFee, for funds
  // whose selected-period row has no fee value.
  const fundIdsMissingFee = periodRows
    .filter((row) => row.avgAnnualManagementFee === null)
    .map((row) => row.publicFundId);

  const feeFallbackRows =
    fundIdsMissingFee.length > 0
      ? await prisma.$queryRaw<FeeFallbackRow[]>(Prisma.sql`
          SELECT DISTINCT ON ("publicFundId") "publicFundId", "avgAnnualManagementFee"
          FROM "FundReturn"
          WHERE "publicFundId" = ANY(${fundIdsMissingFee}::text[])
            AND "reportPeriod" >= '2025-01-01'::timestamp
            AND "reportPeriod" < '2026-01-01'::timestamp
            AND "avgAnnualManagementFee" IS NOT NULL
          ORDER BY "publicFundId", "reportPeriod" DESC
        `)
      : [];
  const feeFallbackByFundId = new Map(
    feeFallbackRows.map((row) => [row.publicFundId, row.avgAnnualManagementFee])
  );

  // Rolling 12-month return: batched window-function lookup of each
  // included fund's last 12 monthly FundReturn rows up to and including the
  // selected report period.
  const rollingRows = await prisma.$queryRaw<RollingReturnRow[]>(Prisma.sql`
    SELECT "publicFundId", "reportPeriod", "monthlyReturn" FROM (
      SELECT "publicFundId", "reportPeriod", "monthlyReturn",
        ROW_NUMBER() OVER (PARTITION BY "publicFundId" ORDER BY "reportPeriod" DESC) AS rn
      FROM "FundReturn"
      WHERE "publicFundId" = ANY(${includedFundIds}::text[]) AND "reportPeriod" <= ${latestReportPeriod}
    ) ranked
    WHERE rn <= ${ROLLING_12_MONTH_COUNT}
    ORDER BY "publicFundId", "reportPeriod" DESC
  `);
  const monthlyReturnsByFundId = new Map<string, number[]>();
  for (const row of rollingRows) {
    const list = monthlyReturnsByFundId.get(row.publicFundId) ?? [];
    list.push(Number(row.monthlyReturn));
    monthlyReturnsByFundId.set(row.publicFundId, list);
  }

  const rowsWithoutRank: Omit<PeerComparisonRow, "rank">[] = groupFunds
    .filter((fund) => periodRowByFundId.has(fund.id))
    .map((fund) => {
      const periodRow = periodRowByFundId.get(fund.id)!;
      const rawFee = periodRow.avgAnnualManagementFee ?? feeFallbackByFundId.get(fund.id) ?? null;
      return {
        publicFundId: fund.id,
        fundId: fund.fundId,
        fundName: fund.fundName,
        managingCompany: fund.managingCompany,
        isTarget: fund.id === targetFund.id,
        lastMonthReturn: Number(periodRow.monthlyReturn),
        last12MonthReturn: computeRolling12MonthReturn(
          monthlyReturnsByFundId.get(fund.id) ?? []
        ),
        trailing3YrReturn:
          periodRow.trailing3YrReturn !== null ? Number(periodRow.trailing3YrReturn) : null,
        trailing5YrReturn:
          periodRow.trailing5YrReturn !== null ? Number(periodRow.trailing5YrReturn) : null,
        annualized5YrReturn:
          periodRow.annualized5YrReturn !== null ? Number(periodRow.annualized5YrReturn) : null,
        avgAnnualManagementFee: rawFee !== null ? Number(rawFee) : null,
      };
    });

  // Default ranking (also the full relevant-peer ordering, used for rank
  // numbers regardless of how many rows are ultimately displayed):
  // trailing5YrReturn descending, missing values sorted last.
  const fullRanked: PeerComparisonRow[] = [...rowsWithoutRank]
    .sort((a, b) => {
      if (a.trailing5YrReturn === null && b.trailing5YrReturn === null) return 0;
      if (a.trailing5YrReturn === null) return 1;
      if (b.trailing5YrReturn === null) return -1;
      return b.trailing5YrReturn - a.trailing5YrReturn;
    })
    .map((row, index) => ({ ...row, rank: index + 1 }));

  // Peer average is computed over the full relevant peer set (excluding the
  // target's own fund) — not just the displayed top N — so it represents the
  // whole comparable universe, not only what's visibly rendered.
  const peerOnlyRows = fullRanked.filter((row) => !row.isTarget);

  const averageRow: PeerComparisonAverageRow = {
    peerGroupSize: peerOnlyRows.length,
    lastMonthReturn: average(
      peerOnlyRows.map((row) => row.lastMonthReturn).filter((v): v is number => v !== null)
    ),
    last12MonthReturn: average(
      peerOnlyRows.map((row) => row.last12MonthReturn).filter((v): v is number => v !== null)
    ),
    trailing3YrReturn: average(
      peerOnlyRows.map((row) => row.trailing3YrReturn).filter((v): v is number => v !== null)
    ),
    trailing5YrReturn: average(
      peerOnlyRows.map((row) => row.trailing5YrReturn).filter((v): v is number => v !== null)
    ),
    avgAnnualManagementFee: average(
      peerOnlyRows.map((row) => row.avgAnnualManagementFee).filter((v): v is number => v !== null)
    ),
  };

  // Display cap: top N relevant peers by rank, plus the target's own row
  // appended (with its true rank preserved) if it fell outside that range.
  const topRows = fullRanked.slice(0, TOP_PEER_DISPLAY_LIMIT);
  const targetInTopRows = topRows.some((row) => row.isTarget);
  const targetRow = fullRanked.find((row) => row.isTarget);
  const displayRows = targetInTopRows || !targetRow ? topRows : [...topRows, targetRow];

  return {
    comparisonStatus: "available",
    matchLevel,
    peerGroupSize: peerOnlyRows.length,
    fundClassification: targetFund.fundClassification,
    subSpecialization: targetFund.subSpecialization,
    latestReportPeriod: latestReportPeriod.toISOString().split("T")[0],
    rows: displayRows,
    averageRow,
  };
}
