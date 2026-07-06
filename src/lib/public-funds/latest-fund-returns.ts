import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";

export interface LatestFundReturnSummary {
  reportPeriod: Date;
  // monthlyReturn and ytdReturn are always present in FundReturn rows.
  monthlyReturn: number;
  ytdReturn: number;
  // Annualized multi-year returns are optional in the schema.
  annualized3YrReturn: number | null;
  annualized5YrReturn: number | null;
}

// Raw row shape returned by the DISTINCT ON query below. Decimal columns
// come back as strings from the pg driver (to avoid precision loss) and are
// converted to numbers before being exposed via LatestFundReturnSummary.
interface RawLatestFundReturnRow {
  publicFundId: string;
  reportPeriod: Date;
  monthlyReturn: string;
  ytdReturn: string;
  annualized3YrReturn: string | null;
  annualized5YrReturn: string | null;
}

/**
 * Batch lookup of the latest FundReturn metrics for a set of PublicFund ids.
 * Used to enrich linked-fund summaries and search-candidate enrichment
 * without N+1 queries and without fetching each fund's full return history.
 *
 * Uses a single DISTINCT ON query so exactly one (latest) row per
 * publicFundId is ever read from the database, regardless of how many
 * months of history that fund has.
 *
 * Returns public fund-level return metrics only — never AUM, never personal
 * financial data, never presented as the user's personal return.
 */
export async function getLatestFundReturnSummaries(
  publicFundIds: string[]
): Promise<Map<string, LatestFundReturnSummary>> {
  if (publicFundIds.length === 0) return new Map();

  const rows = await prisma.$queryRaw<RawLatestFundReturnRow[]>(Prisma.sql`
    SELECT DISTINCT ON ("publicFundId")
      "publicFundId",
      "reportPeriod",
      "monthlyReturn",
      "ytdReturn",
      "annualized3YrReturn",
      "annualized5YrReturn"
    FROM "FundReturn"
    WHERE "publicFundId" = ANY(${publicFundIds}::text[])
    ORDER BY "publicFundId", "reportPeriod" DESC
  `);

  const map = new Map<string, LatestFundReturnSummary>();
  for (const row of rows) {
    map.set(row.publicFundId, {
      reportPeriod: row.reportPeriod,
      monthlyReturn: Number(row.monthlyReturn),
      ytdReturn: Number(row.ytdReturn),
      annualized3YrReturn:
        row.annualized3YrReturn !== null ? Number(row.annualized3YrReturn) : null,
      annualized5YrReturn:
        row.annualized5YrReturn !== null ? Number(row.annualized5YrReturn) : null,
    });
  }
  return map;
}
