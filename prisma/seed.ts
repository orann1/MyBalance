import { PrismaClient, ManagedSavingsType, OwnerLabel, HoldingStatus } from "@prisma/client";
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
    },
  ];

  for (const holding of holdings) {
    await prisma.managedSavingsHolding.upsert({
      where: { id: holding.id },
      update: {
        userId: holding.userId,
        name: holding.name,
        type: holding.type,
        owner: holding.owner,
        status: holding.status,
        currentBalanceMinor: holding.currentBalanceMinor,
        monthlyContributionMinor: holding.monthlyContributionMinor,
        currency: holding.currency,
        accumulationFeeBps: holding.accumulationFeeBps,
        depositFeeBps: holding.depositFeeBps,
        managingCompany: holding.managingCompany,
        trackName: holding.trackName,
        officialFundId: holding.officialFundId,
        valuationDate: holding.valuationDate,
        notes: holding.notes,
      },
      create: holding,
    });
    console.log(`  Upserted: ${holding.id} — ${holding.name}`);
  }

  console.log(`Seed complete. ${holdings.length} holdings seeded for ${DEV_USER_EMAIL}.`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
