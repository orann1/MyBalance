// Manual developer/local smoke test for Phase 2C-3A public fund matching
// search. Local DB only — does not call Data.gov.il.
//
// Usage:
//   npm run search:public-funds:local -- --query="הראל" --source=gemelnet
//   npm run search:public-funds:local -- --fundId=101 --source=gemelnet

import "dotenv/config";
import { PublicDataSource, PublicFundProductType } from "@prisma/client";
import { searchPublicFundsForMatching } from "../src/lib/public-funds/search-public-funds";
import { prisma } from "../src/lib/db/prisma";

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Cannot run search.");
  console.error("See .env.example for the required format.");
  process.exit(1);
}

interface CliArgs {
  query?: string;
  source?: PublicDataSource;
  productType?: PublicFundProductType;
  managingCompany?: string;
  fundId?: string;
  limit?: number;
}

function parseArgs(argv: string[]): CliArgs {
  const result: CliArgs = {};

  for (const arg of argv) {
    const [key, value] = arg.replace(/^--/, "").split("=");
    if (key === "query" && value) result.query = value;
    if (key === "source" && (value === "gemelnet" || value === "pensionnet")) {
      result.source = value as PublicDataSource;
    }
    if (
      key === "productType" &&
      (value === "hishtalmut" ||
        value === "gemel" ||
        value === "hashkaa" ||
        value === "pension" ||
        value === "unknown")
    ) {
      result.productType = value as PublicFundProductType;
    }
    if (key === "managingCompany" && value) result.managingCompany = value;
    if (key === "fundId" && value) result.fundId = value;
    if (key === "limit" && value) result.limit = Number(value);
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  console.log("Running Phase 2C-3A public fund matching search (local DB only)...");
  console.log(`  args: ${JSON.stringify(args)}`);

  const candidates = await searchPublicFundsForMatching(args);

  console.log("");
  console.log(`Found ${candidates.length} candidate(s):`);
  console.log("");

  for (const candidate of candidates) {
    const period = candidate.latestReportPeriod
      ? candidate.latestReportPeriod.toISOString().slice(0, 7)
      : "n/a";
    console.log(
      `score=${candidate.matchScore} source=${candidate.source} fundId=${candidate.fundId} ` +
        `managingCompany="${candidate.managingCompany}" fundName="${candidate.fundName}" latestReportPeriod=${period}`,
    );
  }
}

main()
  .catch((err) => {
    console.error("Search script failed:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
