import { getManagedSavingsGroupsForCurrentDevUser } from "@/lib/data/managed-savings";
import { ManagedSavingsPageClient } from "@/components/managed-savings/ManagedSavingsPageClient";

// Force server-side rendering so the DB-backed data is always fresh per request.
export const dynamic = "force-dynamic";

// Server component: locale-specific route (/en/managed-savings).
// Loads groups + holdings from the same cached data access layer as the
// canonical Hebrew route.
export default async function LocaleManagedSavingsPage() {
  const groups = await getManagedSavingsGroupsForCurrentDevUser();
  return <ManagedSavingsPageClient initialGroups={groups} />;
}
