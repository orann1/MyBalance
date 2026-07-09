import { PrismaClient, ManagedSavingsType, OwnerLabel, HoldingStatus, PublicDataSource } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { toMinorUnits, percentToBps } from "../src/lib/financial/units";

if (!process.env.DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Cannot run seed.");
  console.error("See .env.example for the required format.");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Stable dev user email. Single-user/dev only — Auth.js is a future phase.
const DEV_USER_EMAIL = "dev@mybalance.local";

async function main() {
  console.log("Seeding dev user...");

  const user = await prisma.user.upsert({
    where: { email: DEV_USER_EMAIL },
    update: {},
    create: {
      email: DEV_USER_EMAIL,
      name: "Dev User",
    },
  });

  console.log(`Dev user ready: ${user.id} (${user.email})`);
  console.log("Seeding managed savings holdings...");

  // Holdings are seeded with stable IDs matching the mock data ids.
  // This makes the seed idempotent: re-running upserts existing records by id.
  // Source of truth: src/lib/mock/managed-savings-data.ts (8 holdings as of Phase 2A).
  // Money values: ILS * 100 = agorot (BigInt minor units).
  // Fee values: percent * 100 = basis points (Int).

  // displayOrder is deterministic and matches the seed array order (Phase 2D-1).
  const holdings = [
    {
      id: "hist-001",
      userId: user.id,
      name: "קרן השתלמות שלי",
      type: ManagedSavingsType.hishtalmut,
      owner: OwnerLabel.self,
      status: HoldingStatus.active,
      currentBalanceMinor: toMinorUnits(285000),
      monthlyContributionMinor: toMinorUnits(650),
      currency: "ILS",
      accumulationFeeBps: percentToBps(0.45),
      depositFeeBps: percentToBps(0.0),
      managingCompany: "בנק לאומי",
      trackName: 'קרן עו"ש ממוצעת',
      officialFundId: "BL-UH-0045",
      valuationDate: new Date("2026-06-27"),
      notes: "קרן השתלמות עיקרית — כדאי לבדוק מסלול כל שנה",
      displayOrder: 1,
    },
    {
      id: "hist-002",
      userId: user.id,
      name: "קרן השתלמות אשתי",
      type: ManagedSavingsType.hishtalmut,
      owner: OwnerLabel.spouse,
      status: HoldingStatus.active,
      currentBalanceMinor: toMinorUnits(265000),
      monthlyContributionMinor: toMinorUnits(600),
      currency: "ILS",
      accumulationFeeBps: percentToBps(0.48),
      depositFeeBps: percentToBps(0.0),
      managingCompany: "בנק דיסקונט",
      trackName: 'קרן עו"ש ממוצעת',
      officialFundId: "BD-UH-0048",
      valuationDate: new Date("2026-06-27"),
      notes: null,
      displayOrder: 2,
    },
    {
      id: "gemel-001",
      userId: user.id,
      name: "קופת גמל - ילד 1",
      type: ManagedSavingsType.gemel,
      owner: OwnerLabel.child,
      status: HoldingStatus.active,
      currentBalanceMinor: toMinorUnits(75000),
      monthlyContributionMinor: toMinorUnits(200),
      currency: "ILS",
      accumulationFeeBps: percentToBps(0.38),
      depositFeeBps: percentToBps(0.0),
      managingCompany: "הבנק הבינלאומי",
      trackName: "קופת גמל ממוצעת",
      officialFundId: "IB-GEMEL-0038",
      valuationDate: new Date("2026-06-26"),
      notes: "פתוחה עד גיל 18",
      displayOrder: 3,
    },
    {
      id: "gemel-002",
      userId: user.id,
      name: "קופת גמל - ילד 2",
      type: ManagedSavingsType.gemel,
      owner: OwnerLabel.child,
      status: HoldingStatus.active,
      currentBalanceMinor: toMinorUnits(68000),
      monthlyContributionMinor: toMinorUnits(175),
      currency: "ILS",
      accumulationFeeBps: percentToBps(0.38),
      depositFeeBps: percentToBps(0.0),
      managingCompany: "הבנק הבינלאומי",
      trackName: "קופת גמל ממוצעת",
      officialFundId: "IB-GEMEL-0038",
      valuationDate: new Date("2026-06-26"),
      notes: null,
      displayOrder: 4,
    },
    {
      id: "hash-001",
      userId: user.id,
      name: "גמל להשקעה משפחתי",
      type: ManagedSavingsType.hashkaa,
      owner: OwnerLabel.shared,
      status: HoldingStatus.active,
      currentBalanceMinor: toMinorUnits(145000),
      monthlyContributionMinor: toMinorUnits(400),
      currency: "ILS",
      accumulationFeeBps: percentToBps(0.65),
      depositFeeBps: percentToBps(0.0),
      managingCompany: "בנק דיסקונט",
      trackName: "קרן אפיקים גמל להשקעה",
      officialFundId: "BD-HASH-0065",
      valuationDate: new Date("2026-06-25"),
      notes: "ניתן למשוך בכל עת — נזילות גבוהה",
      displayOrder: 5,
    },
    {
      id: "save-001",
      userId: user.id,
      name: "פוליסת חיסכון ילדים",
      type: ManagedSavingsType.savings,
      owner: OwnerLabel.family,
      status: HoldingStatus.active,
      currentBalanceMinor: toMinorUnits(92000),
      monthlyContributionMinor: toMinorUnits(400),
      currency: "ILS",
      accumulationFeeBps: percentToBps(0.8),
      depositFeeBps: percentToBps(0.0),
      managingCompany: "הפניקס",
      trackName: "פוליסה משתנה",
      officialFundId: "PHX-SAVE-0080",
      valuationDate: new Date("2026-06-23"),
      notes: null,
      displayOrder: 6,
    },
    {
      id: "gemel-003",
      userId: user.id,
      name: "קופת גמל שלי",
      type: ManagedSavingsType.gemel,
      owner: OwnerLabel.self,
      status: HoldingStatus.active,
      currentBalanceMinor: toMinorUnits(125000),
      monthlyContributionMinor: toMinorUnits(350),
      currency: "ILS",
      accumulationFeeBps: percentToBps(0.4),
      depositFeeBps: percentToBps(0.0),
      managingCompany: "הפניקס",
      trackName: "קופת גמל ממוצעת",
      officialFundId: "PHX-GEMEL-0040",
      valuationDate: new Date("2026-06-27"),
      notes: null,
      displayOrder: 7,
    },
    {
      id: "save-002",
      userId: user.id,
      name: "חיסכון מנוהל משותף",
      type: ManagedSavingsType.savings,
      owner: OwnerLabel.shared,
      status: HoldingStatus.active,
      currentBalanceMinor: toMinorUnits(85000),
      monthlyContributionMinor: toMinorUnits(300),
      currency: "ILS",
      accumulationFeeBps: percentToBps(0.75),
      depositFeeBps: percentToBps(0.0),
      managingCompany: "בנק לאומי",
      trackName: "קרן השקעה משתנה",
      officialFundId: "BL-SAVE-0075",
      valuationDate: new Date("2026-06-22"),
      notes: "חיסכון משותף — לבדוק חלוקה",
      displayOrder: 8,
    },
  ];

  // Create-if-missing only. Once a Product Owner (or any real usage) has
  // edited, reordered, linked, or archived one of these holdings, re-running
  // seed must NEVER overwrite that state — a prior upsert-based version of
  // this loop reset status/displayOrder/balances/notes/etc. on every run,
  // which silently reactivated archived holdings and reset manual edits
  // during Phase 2D-1 QA (see Context/current-feature.md, data inconsistency
  // audit). Existing rows are left completely untouched, including
  // publicFundId — only missing canonical rows are created.
  let createdCount = 0;
  let skippedCount = 0;

  for (const holding of holdings) {
    const existing = await prisma.managedSavingsHolding.findUnique({
      where: { id: holding.id },
      select: { id: true },
    });
    if (existing) {
      skippedCount += 1;
      continue;
    }
    await prisma.managedSavingsHolding.create({ data: holding });
    createdCount += 1;
    console.log(`  Created: ${holding.id} — ${holding.name}`);
  }

  console.log(
    `Managed savings seed: created ${createdCount}, skipped existing ${skippedCount}.`
  );
  console.log(
    "Existing ManagedSavingsHolding rows are preserved — seed never overwrites status, balances, order, notes, or links."
  );
  console.log(
    "To reset local QA data intentionally, use an explicit, Product-Owner-approved DB reset workflow — do not rely on re-running seed."
  );

  console.log("Seeding public data resources (Phase 2C-1 config only — no Data.gov.il calls)...");

  // Verified resource IDs from the Phase 2C Discovery Audit Report.
  // Seeding only configures known resources; it does not fetch data.
  const publicDataResources = [
    {
      source: PublicDataSource.gemelnet,
      label: "GemelNet 1999-2022",
      resourceId: "91c849ed-ddc4-472b-bd09-0f5486cea35c",
      isCurrent: false,
      isActive: true,
    },
    {
      source: PublicDataSource.gemelnet,
      label: "GemelNet 2023",
      resourceId: "2016d770-f094-4a2e-983e-797c26479720",
      isCurrent: false,
      isActive: true,
    },
    {
      source: PublicDataSource.gemelnet,
      label: "GemelNet 2024-today",
      resourceId: "a30dcbea-a1d2-482c-ae29-8f781f5025fb",
      isCurrent: true,
      isActive: true,
    },
    {
      source: PublicDataSource.pensionnet,
      label: "PensionNet 1999-2022",
      resourceId: "a66926f3-e396-4984-a4db-75486751c2f7",
      isCurrent: false,
      isActive: true,
    },
    {
      source: PublicDataSource.pensionnet,
      label: "PensionNet 2023",
      resourceId: "4694d5a7-5284-4f3d-a2cb-5887f43fb55e",
      isCurrent: false,
      isActive: true,
    },
    {
      source: PublicDataSource.pensionnet,
      label: "PensionNet 2024-today",
      resourceId: "6d47d6b5-cb08-488b-b333-f1e717b1e1bd",
      isCurrent: true,
      isActive: true,
    },
  ];

  for (const resource of publicDataResources) {
    await prisma.publicDataResource.upsert({
      where: {
        source_resourceId: {
          source: resource.source,
          resourceId: resource.resourceId,
        },
      },
      update: {
        label: resource.label,
        isCurrent: resource.isCurrent,
        isActive: resource.isActive,
      },
      create: resource,
    });
    console.log(`  Upserted: ${resource.source} — ${resource.label}`);
  }

  console.log(`Public data resource seed complete. ${publicDataResources.length} resources configured.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
