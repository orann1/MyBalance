// Manual developer/local trigger for Phase 2C-2 public fund sync.
//
// Usage:
//   npm run sync:public-funds:local
//   npm run sync:public-funds:local -- --source=gemelnet
//   npm run sync:public-funds:local -- --source=pensionnet
//   npm run sync:public-funds:local -- --resourceId=<id>
//
// Defaults to syncing the current (isCurrent=true) GemelNet and PensionNet
// resources. Does not sync historical 1999-2022 resources by default.

import "dotenv/config";
import { PublicDataSource, PublicDataSyncTrigger } from "@prisma/client";
import { syncPublicFunds } from "../src/lib/public-funds/sync-public-funds";
import { prisma } from "../src/lib/db/prisma";

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Cannot run sync.");
  console.error("See .env.example for the required format.");
  process.exit(1);
}

function parseArgs(argv: string[]): { source?: PublicDataSource; resourceId?: string } {
  const result: { source?: PublicDataSource; resourceId?: string } = {};

  for (const arg of argv) {
    const [key, value] = arg.replace(/^--/, "").split("=");
    if (key === "source" && (value === "gemelnet" || value === "pensionnet")) {
      result.source = value as PublicDataSource;
    }
    if (key === "resourceId" && value) {
      result.resourceId = value;
    }
  }

  return result;
}

async function main() {
  const { source, resourceId } = parseArgs(process.argv.slice(2));

  console.log("Starting Phase 2C-2 public fund sync (current resources only)...");
  if (source) console.log(`  source filter: ${source}`);
  if (resourceId) console.log(`  resource filter: ${resourceId}`);

  const results = await syncPublicFunds({
    source,
    resourceId,
    currentOnly: true,
    triggeredBy: PublicDataSyncTrigger.manual,
  });

  if (results.length === 0) {
    console.log("No matching active PublicDataResource rows found. Nothing synced.");
    return;
  }

  console.log("");
  console.log("Sync summary:");
  for (const result of results) {
    console.log(`- ${result.source} / ${result.resourceLabel} (${result.resourceId})`);
    console.log(`  status: ${result.status}`);
    console.log(
      `  inserted=${result.insertedCount} updated=${result.updatedCount} skipped=${result.skippedCount} errors=${result.errorCount}`,
    );
    console.log(`  duration: ${result.durationMs}ms`);
    console.log(`  syncRunId: ${result.syncRunId}`);
    if (result.errorMessage) {
      console.log(`  errorMessage: ${result.errorMessage}`);
    }
    console.log("");
  }

  const anyFailed = results.some((r) => r.status === "failed");
  if (anyFailed) {
    process.exitCode = 1;
  }
}

main()
  .catch((err) => {
    console.error("Sync script failed:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
