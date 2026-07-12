import { getManagedSavingsGroupsForCurrentDevUser } from "@/lib/data/managed-savings";
import { ManagedSavingsPageClient } from "@/components/managed-savings/ManagedSavingsPageClient";

// Force server-side rendering on every request so the DB-backed data is always fresh.
// unstable_cache handles read-level caching; this prevents static pre-rendering.
export const dynamic = "force-dynamic";

// Server component: fetches DB-backed groups + holdings (Phase 2D-2A) via the
// cached data access layer and passes them to the client component for
// rendering and interaction.
export default async function ManagedSavingsPage() {
  const groups = await getManagedSavingsGroupsForCurrentDevUser();
  return <ManagedSavingsPageClient initialGroups={groups} />;
}
