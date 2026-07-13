# MyBalance — Current Feature

## Feature Name

Phase 2E-1 — Similar Tracks Comparison Core (COMPLETED AND VERIFIED — Product Owner browser QA approved, committed and merged into `master`, commit `6880796`; branch `feature/similar-tracks-comparison` deleted after merge). No next phase has been started or approved yet.

### Phase Breakdown

- **Phase 1A: Clean App Foundation** — COMPLETED & APPROVED
- **Phase 1B: Static Dashboard UI** — COMPLETED & APPROVED
- **Phase 2A: Managed Savings Mock Experience** — COMPLETED & APPROVED
- **Phase 2B-1: Managed Savings Persistence Infrastructure** — COMPLETED (2026-06-29)
- **Phase 2B-2: Managed Savings DB-backed Actions and UI** — COMPLETED (2026-06-29)
- **Phase 2B-3: Managed Savings Hardening & QA Audit** — COMPLETED AND VERIFIED (2026-06-29)
- **Phase 2C-1: Public Fund Schema and Resource Configuration** — COMPLETED AND VERIFIED (2026-06-30)
- **Phase 2C-2: Public Fund Live Sync** — COMPLETED AND VERIFIED (2026-06-30)
- **Phase 2C-3A: Public Fund Matching Search Backend** — COMPLETED AND VERIFIED (2026-06-30)
- **Phase 2C-3B: Public Fund Matching/Linking (UI, link/unlink, FK) — including the DB-backed linked public performance KPI display** — COMPLETED AND VERIFIED (2026-07-02), merged into `master`
- **Phase 2C-4A: Fund Return Query Hardening + Documentation Correction** — COMPLETED AND VERIFIED (2026-07-06), Product Owner browser QA approved, merged into `master` from `feature/fund-return-query-hardening`
- **Phase 2C-4B: Further public performance display work (if any)** — Not started; no scope defined yet
- **Phase 2D-1: Managed Savings Summary + Ordering** — COMPLETED AND VERIFIED (2026-07-09). Product Owner browser QA approved. Committed and merged into `master` from `feature/managed-savings-summary-ordering`.
- **Phase 2D-2A: Managed Savings Groups Foundation** — COMPLETED AND VERIFIED (2026-07-12). Product Owner browser QA approved after one QA fix round (required-field indicators, group reorder toast, stale-state/double-refresh cache fix, top-level Add Fund button removed). Committed and merged into `master` from `feature/managed-savings-groups-foundation`.
- **Phase 2D-2B: Managed Savings Groups — Move-Between-Groups + Delete-With-Transfer** — Not started; no scope defined yet. Recommended next sub-phase per the Phase 2D-2 planning audit (moving a holding between groups without drag-and-drop, and deleting a non-empty group via an explicit transfer-destination flow).
- **Phase 2D-2C: Managed Savings Groups — Cross-Group Drag-and-Drop** — Not started; no scope defined yet. Recommended final sub-phase per the Phase 2D-2 planning audit (dragging a holding from one group's table into another). Explicitly deferred again in favor of Phase 2E-1 per Product Owner direction (2026-07-13) — group-management work is paused for now.
- **Phase 2E-1: Similar Tracks Comparison Core** — **COMPLETED AND VERIFIED (2026-07-13)**. Product Owner browser QA approved after two focused fix rounds. Committed and merged into `master` from `feature/similar-tracks-comparison`, commit `6880796`. Branch deleted after merge. Built following the Phase 2E audit/planning report. Adds a local-DB-only peer comparison (GemelNet funds grouped by `fundClassification` + `subSpecialization`, with targetPopulation-aware relevance filtering) to the linked-holding expanded row: return/fee comparison table, peer average row, user-fund highlight, no Sharpe/Alpha/AUM/exposure data. No schema changes. See Phase 2E-1 Implementation Notes below.
- **Phase 2E-2 — Fund Profile Data Enrichment (Sharpe/Alpha/exposure fields) / Phase 2E-3 (exposure-profile UI)** — Not started; no scope defined yet, no approved scope. Would require a Prisma migration to persist Sharpe/Alpha/exposure fields observed in the live GemelNet source but not currently stored (see the Phase 2E audit report) — explicitly out of scope for Phase 2E-1.

## Status

Phase 1A: Complete and Approved
Phase 1B: Complete and Approved
Phase 2A: **COMPLETED AND APPROVED** (2026-06-28)
Phase 2B: **COMPLETED AND VERIFIED** (2026-06-29)
  - 2B-1: Persistence Infrastructure — COMPLETED (2026-06-29)
  - 2B-2: DB-backed Actions and UI — COMPLETED AND VERIFIED (2026-06-29)
  - 2B-3: Hardening & QA Audit — COMPLETED AND VERIFIED (2026-06-29)
Phase 2C-1: Public Fund Schema and Resource Configuration — **COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report; schema, migration, seed/config, documentation, and automated checks accepted.
Phase 2C-2: Manual Public Fund Live Sync + Normalization — **COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report; Data.gov.il `datastore_search` client, GemelNet/PensionNet normalization, sync service, manual CLI trigger (`npm run sync:public-funds:local`), live local sync verification, documentation, and automated checks accepted. Merged into `master`.
Phase 2C-3A: Public Fund Matching Search Backend — **COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report; backend/data-layer search and candidate ranking over local `PublicFund`/`FundReturn` records, Hebrew-aware matching normalization, deterministic candidate scoring, Zod-validated server action, optional CLI smoke test, documentation updates, and automated checks accepted. Merged into `master` from `feature/public-fund-matching-search`. No linking UI, no FK from `ManagedSavingsHolding` to `PublicFund`, no replacement of mock/fallback public performance display.
Phase 2C-3B: Public Fund Matching UI + Confirm Link / Unlink — **COMPLETED AND VERIFIED** (2026-07-02). Product Owner browser QA approved. Committed and merged into `master`. Adds a nullable `publicFundId` FK from `ManagedSavingsHolding` to `PublicFund` (user-confirmed only, never auto-linked), Zod-validated `linkManagedSavingsHoldingToPublicFund`/`unlinkManagedSavingsHoldingFromPublicFund` server actions, a `PublicFundMatchModal` search/select UI reusing the Phase 2C-3A local search backend, link/change/unlink management surface in `EditManagedFundModal`, and a read-only public fund returns card in `ExpandedManagedSavingsRow` (linked: KPI return metrics + labelled metadata row + disclaimer; unlinked: compact amber warning only). Linked fund `latestAnnualized5YrReturn` drives the 5Y table column and `projectSimulations` when available via `getEffectiveAnnualReturn`. Add/Edit modal visual redesign (slate-based hierarchy) and modal scrollbar polish also included. No AUM display, no auto-linking, no Data.gov.il calls.

**Important correction:** Phase 2C-3B already fully replaced the linked-holding public performance display with real DB-backed KPI data — this is not mock/fallback and was not deferred to a later phase. What remained mock/fallback after 2C-3B was narrower than earlier notes implied: only the `trackPerformance` object used as a *calculation fallback* inside `getEffectiveAnnualReturn` (and therefore the table 5Y column and `projectSimulations`) for **unlinked** holdings, or linked holdings whose linked fund has a null `latestAnnualized5YrReturn`. No mock performance numbers are rendered in the UI for either linked or unlinked holdings.

Phase 2C-4A: Fund Return Query Hardening + Documentation Correction — **COMPLETED AND VERIFIED** (2026-07-06). Product Owner browser QA approved. Committed and merged into `master` from `feature/fund-return-query-hardening`. This phase is primarily backend/data-layer and documentation work. Replaced the "fetch all `FundReturn` rows for a fund-id set and reduce to the latest in JS" pattern in `getLatestFundReturnSummaries` (`src/lib/public-funds/latest-fund-returns.ts`) with a single parameterized `DISTINCT ON ("publicFundId") ... ORDER BY "publicFundId", "reportPeriod" DESC` raw SQL query, so exactly one row per fund is ever read from the database regardless of history depth. `searchPublicFundsForMatching` (`src/lib/public-funds/search-public-funds.ts`) now reuses this same hardened lookup instead of its own separate fetch-all-then-reduce enrichment step. No schema/migration changes, no new AUM exposure, `linkedPublicFund` output shape and all downstream behavior (KPI display, unlinked warning, link/unlink flow, `getEffectiveAnnualReturn`, projections, table 5Y column) unchanged.

**Follow-up QA fix (same branch, 2026-07-05):** Product Owner browser smoke QA found two issues in `PublicFundMatchModal`, fixed on the same branch: (1) the modal header used a translucent gradient background that let scrolled result text show through it — replaced with a fully opaque `bg-white` header with a solid border and shadow; (2) the modal exposed a GemelNet/PensionNet source dropdown, which is confusing (these are data sources, not product types) and wrongly allowed selecting PensionNet — a pension-specific source — from the non-pension Managed Savings page. The dropdown was removed entirely; the modal now always searches `source: "gemelnet"` internally (Option A from the fix prompt). New helper copy (`modal.gemelnetOnlyNote`) clarifies the search covers the public GemelNet dataset and may include Keren Hishtalmut/Kupat Gemel/Gemel LeHashkaa where available. No product-type filter was added (`PublicFund.productType` inference remains unresolved). The backend (`searchPublicFundsForMatching`, `searchPublicFundsForMatchingAction`) still supports both `gemelnet` and `pensionnet` for any future screen — only this modal's UI was restricted.

Phase 2C-4B (any further public performance display work): **Not started.** No scope defined — a chart/history table was evaluated during 2C-4A planning and explicitly deferred; Option A (KPI-only, already delivered in 2C-3B) remains the approved MVP display.

Phase 2D-1: Managed Savings Summary + Ordering — **COMPLETED AND VERIFIED (2026-07-09).** Product Owner browser QA approved after all fix rounds (see below). Committed and merged into `master` from `feature/managed-savings-summary-ordering`. Built following the Phase 2D-1 planning/audit report. Scope:

- **Schema**: `ManagedSavingsHolding.displayOrder Int @default(0)` (new, indexed via `@@index([userId, displayOrder])`). Migration `prisma/migrations/20260706125519_add_managed_savings_display_order/` backfills existing rows sequentially per user in `createdAt` ascending order (preserves today's visible order exactly — verified against local DB after migration). `prisma/seed.ts` now assigns deterministic `displayOrder` (1-8) to the 8 seeded holdings.
- **Ordering behavior**: `fetchHoldingsForDevUser` (`src/lib/data/managed-savings.ts`) now sorts `[{ displayOrder: "asc" }, { createdAt: "asc" }]` instead of `createdAt asc` alone. `createManagedSavingsHolding` (`src/lib/actions/managed-savings-actions.ts`) assigns new holdings `max(existing active displayOrder for user) + 1` inside a transaction, so new holdings always append to the end. A new server action `reorderManagedSavingsHoldings({ orderedIds })` persists user-controlled order: Zod-validated (`ReorderManagedSavingsSchema` in `src/lib/validation/managed-savings.ts`, rejects empty/duplicate ids), verifies every id belongs to the dev user and is not archived (rejects the whole batch otherwise, closed error union `"validation" | "not_found" | "unauthorized" | "server_error"`), updates `displayOrder` transactionally, revalidates `MANAGED_SAVINGS_CACHE_TAG`, and returns the authoritative re-sorted active holdings.
- **Ordering UI**: `ManagedSavingsTable` uses `@dnd-kit/core` + `@dnd-kit/sortable` (new dependencies; `react-beautiful-dnd` intentionally not used) for desktop drag-and-drop via a visible grip handle, with up/down icon buttons as the mobile/accessibility fallback (disabled at the first/last row). Both paths call the same `onReorder` callback in `ManagedSavingsPageClient`, which optimistically reorders local state, calls the server action, reconciles against the authoritative response on success, and reverts to the previous order with an inline "order save failed" pill on failure (an "order saved" pill shows on success, both auto-dismiss after 3s). `DndContext` is given a stable `id` prop to avoid an SSR/CSR id-mismatch hydration warning that `@dnd-kit`'s default auto-generated ids can otherwise produce.
- **Summary layer**: New `src/lib/managed-savings/summary.ts` (`calculateManagedSavingsSummary`) computes, from already-serialized active holdings: total balance, total monthly contributions, linked/unlinked holding counts, linked balance and its coverage percent, a balance-weighted `weightedLinkedAnnualized5YrReturn` (linked holdings with non-null `latestAnnualized5YrReturn` only — never reads the mock/fallback `trackPerformance`, and is `null` when no eligible linked holding exists), and a breakdown by `ManagedSavingsType` (count, balance, monthly contribution, percent of total, linked/unlinked counts). Computed client-side in `ManagedSavingsPageClient` from the already-loaded `investments` array (same pattern as the pre-existing `calculateTotalSummary`), not server-side, to avoid a second data-fetch path.
- **Summary UI**: `ManagedSavingsSummaryCards` keeps the 5 existing KPI cards, and adds a linked-coverage card ("X of Y linked" + balance coverage %), a weighted-5Y-assumption card (shows a neutral "not enough data" message instead of 0% when no eligible linked data exists), and a breakdown-by-type row — all hidden when there are zero active holdings.
- **Unlinked state**: `ExpandedManagedSavingsRow`'s "not linked" warning changed from amber (`bg-amber-50`/`border-amber-200`/`text-amber-900`) to a red/error data-completeness style (`bg-red-50`/`border-red-200`/`text-red-600` icon/`text-red-900` text). Copy updated in both locales to explicitly frame this as a data-completeness state ("No public fund is linked. To display public return data, link this holding to a GemelNet fund from Edit." / Hebrew equivalent). Still shows no return numbers for unlinked holdings — unchanged from Phase 2C-3B.
- **Table badge**: `ManagedSavingsTable` now renders a small "Linked"/"מקושר" (green) or "Unlinked"/"לא מקושר" (red) badge next to each holding's name in the main table — previously link status was only visible in the expanded row.
- **i18n**: New keys added under the existing `managedSavings` namespace in both `he.json`/`en.json`: `summary.*` (linked coverage, weighted 5Y, breakdown-by-type, no-holdings), `table.linkedBadge`/`unlinkedBadge`/`reorderColumnSr`, `ordering.*` (reorder/drag/move up/down/order saved/failed). No hardcoded UI strings added.
- **Peer comparison**: Not implemented (out of scope per this phase, as planned). No classifier, no comparison UI, no new `PublicFund`/schema changes beyond `ManagedSavingsHolding.displayOrder`.

Non-scope confirmed unchanged: no AUM display, no advisory wording, no Data.gov.il calls added, no Accounts/Assets/Liabilities/Net Worth work, no Auth.js/multi-user changes, `PublicFundMatchModal` remains GemelNet-only.

**Product QA fix round (2026-07-06, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** Product Owner browser QA on the Phase 2D-1 implementation found several issues, fixed on the same branch:

- **Search modal default query**: `PublicFundMatchModal`'s `buildInitialQuery` previously joined the holding's mock/generic `track` + `managingCompany` text (e.g. producing "קופת גמל ממוצעת הבנק הבינלאומי"), which is unrelated to any real public fund name and confused users. Now defaults to an empty string, except when `officialFundId` is purely numeric (`/^\d+$/`), in which case it is offered as a plausible starting fund number.
- **Search by fund number**: The modal now detects a numeric-only (trimmed) search input and calls `searchPublicFundsForMatchingAction` with `fundId` instead of `query` — fund numbers never appear inside `fundName`/`managingCompany` text, so the previous text-only search always returned zero results for numeric input (verified: querying `"12536"`/`"963"` as free text returned 0 candidates; the same values via `fundId` correctly resolve to the Mor and Analyst funds).
- **"מור" (Mor) search returning no results**: Root-caused to the same default-prefill bug above — `searchPublicFundsForMatching({ query: "מור", source: "gemelnet" })` was verified directly against the local DB to correctly return 10 ranked Mor Gemel candidates; the reported empty result was caused by the irrelevant prefilled text polluting the search box before the user's input. Fixing the prefill (above) resolves this; no search/ranking logic changed.
- **Company suggestions**: New lightweight, local-DB-only feature. `listManagingCompanies(source)` (`src/lib/public-funds/search-public-funds.ts`) and `listGemelnetManagingCompaniesAction` (`src/lib/actions/public-fund-matching-actions.ts`) return the distinct GemelNet managing companies (58 total in local DB — a small, cheap, one-time fetch per modal open). The search input shows up to 20 filtered suggestions on focus; selecting one fills the field and searches immediately. No schema change, no external calls.
- **Delete icon in main table**: `ManagedSavingsTable` now renders a `Trash2` icon next to the edit icon in each row, wired to the same `handleDeleteRequest` handler and the existing `DeleteHoldingConfirmModal` already used by the edit modal's delete button — no second/inconsistent delete modal was created. Archive-based (soft-delete) DB behavior is unchanged; only the UI entry point was added.
- **Investment-name column width + internal code removal**: The name column header now has a `min-w-[200px] sm:min-w-[260px]` minimum width to reduce wrapping. The unlabeled `officialFundId` sub-line (e.g. "BL-UH-0045") shown directly under the holding name in the main table row was removed — it read as an unclear internal code with no label. `officialFundId`, when present, is now shown only in `ExpandedManagedSavingsRow`'s labelled metadata line (reusing the existing `expandedView.fundId` — "מזהה קרן רשמי" / "Official Fund ID" — translation key), clearly distinguished from the linked public fund number.
- **Public fund number clarity**: Verified already correct — `linkedSummary.fundId` ("מספר קרן" / "Fund number") in both `ExpandedManagedSavingsRow` and `EditManagedFundModal` already renders `linkedPublicFund.fundId` (the real public fund number), which is a distinct field/label from the internal holding id and from the newly-relabeled `officialFundId` ("מזהה קרן רשמי" / "Official Fund ID"). No code change was needed for this item beyond the internal-code removal above.
- **i18n**: New/updated keys under `managedSavings.publicFundLinking.modal`: `searchPlaceholder` (updated copy), `searchHelper`, `companySuggestionsTitle`. New key under `managedSavings.table`: `deleteTitle`. All added to both `he.json`/`en.json`.

Deferred from this fix round (per explicit non-scope): peer comparison, fund classifier, groups/sections. See "Known Limitations" below for the Phase 2D-2 groups/sections recommendation.

**Layout QA fix round (2026-07-06, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** Product Owner reported the summary layer took too much vertical space and the table had too many columns/horizontal scroll, delaying the table too far down the page. Fixed on the same branch:

- **Top summary cleanup**: `ManagedSavingsSummaryCards` no longer renders the linked-coverage block or the weighted-5Y-assumption block — reduced back to the original 4 core KPI cards (total balance, total monthly contributions, projected 5Y, projected 10Y). The underlying `calculateManagedSavingsSummary` helper (`src/lib/managed-savings/summary.ts`) is unchanged and still computes these values for potential future use — only the top-of-page rendering was removed.
- **Breakdown-by-type relocated**: extracted into a new component, `ManagedSavingsBreakdownByType.tsx`, now rendered in `ManagedSavingsPageClient` immediately **below** the main holdings table (previously above it, inside the summary cards). English title updated to "Breakdown by Product Type" to match the Hebrew "פילוח לפי סוג מוצר" more closely.
- **Removed 20-year column, made the 15-year column dynamic**: `ManagedSavingsTable` previously rendered both a fixed "15 years" column and a separate dynamic "custom years" column (which defaulted to 20). These are now merged into a single dynamic column that defaults to **15** years — reducing the table from 16 to 15 columns and removing the redundant 20-year-default column entirely. `projectSimulations` (`src/lib/mock/managed-savings-data.ts`) is unchanged in signature/usage elsewhere.
- **Custom horizon control relocated**: the previously disconnected top-of-page "Custom Horizon Selector" strip was removed from `ManagedSavingsPageClient`. A compact equivalent control (same `customHorizon`/`years` i18n labels, reused) now lives inside `ManagedSavingsTable`'s own section header, directly above the table rows — verified via browser QA to sit ~80px above the table body, clearly attached to the table rather than floating at the page top. State (`customYears`, default 15) remains owned by `ManagedSavingsPageClient` and is passed down along with a new `onCustomYearsChange` callback.
- **`projectSimulations` custom-year bug fix**: the function only computed a custom-horizon data point when `customYears > 15`, silently returning 0 for any other custom value (e.g. 12) — a known limitation previously masked by the old default of 20. Since the dynamic column now defaults to 15 and commonly takes values below 15, this was fixed: any `customYears` value not already in the baseline `[0,1,5,10,15]` set is now computed, regardless of whether it's above or below 15.
- **Table totals row**: a new `<tfoot>` row in `ManagedSavingsTable` sums current balance, 1Y/5Y/10Y projections, and the dynamic custom-horizon projection across all currently visible (non-archived) holdings — reusing the same per-row `projections` map already computed for the table body. No 20-year total, no average return, no advisory wording. Subtle background (`bg-secondary/30`), normal (non-sticky) footer row.
- **i18n**: new key `managedSavings.table.totalsLabel` ("סה\"כ" / "Total"). No other new visible strings — the custom-horizon control reuses the pre-existing `customHorizon`/`years` keys.

Non-scope confirmed unchanged: no groups/sections, no peer comparison, no schema changes. All Phase 2D-1 behavior (displayOrder persistence, drag-and-drop, up/down fallback, reorder server action, linked/unlinked badges, red unlinked expanded state, search modal fixes, delete icon) verified still working via targeted regression QA.

**Final visual QA fix round (2026-07-07, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** Product Owner requested final visual polish on the top KPI cards and the table before approval. Fixed on the same branch:

- **KPI card set replaced**: `ManagedSavingsSummaryCards` no longer shows "Total monthly contributions" as one of the four top colored cards. The four cards now show a clear savings-value progression: current value, in 1 year, in 5 years, in 10 years (Hebrew: "שווי חסכונות נוכחי" / "שווי חסכונות בעוד שנה" / "שווי חסכונות בעוד 5 שנים" / "שווי חסכונות בעוד 10 שנים"; English: "Current Savings Value" / "Savings Value in 1 Year" / "Savings Value in 5 Years" / "Savings Value in 10 Years"). Monthly contribution data is unaffected everywhere else (table column, per-row values, `summary.ts` helper) — only removed from this specific top-row card set. `ManagedSavingsPageClient` now also computes `oneYearSummary = calculateTotalSummary(investments, 1)` for the new second card.
- **Fixed incorrect Hebrew copy**: the `managedSavings.summaryCards` translation keys previously read "תחזוקה בעוד X שנים" ("maintenance/upkeep in X years" — incorrect, leftover generic wording). Replaced with "שווי חסכונות בעוד X שנים" ("savings value in X years") across `projectedIn5Years`, `projectedIn10Years`, `projectedInCustomYears`, and the new `projectedIn1Year` key, in both `he.json`/`en.json`. Confirmed via grep that no "תחזוקה" wording remains anywhere in the Managed Savings namespace (the one other pre-existing "תחזוקה" occurrence, in `modal.editSubtitle`, belongs to a different, legitimate phrase — "fund details used for accumulation calculations" — and was left unchanged as out of scope).
- **KPI label typography**: card labels increased from `text-xs` to `text-sm font-bold text-white` (was `text-xs font-semibold text-white/80`) for better readability, while the numeric value styling is unchanged (`text-2xl sm:text-3xl font-extrabold`).
- **Table totals row styling**: `<tfoot>` row background changed from `bg-secondary/30 border-t-2` to a more visually distinct `bg-emerald-50/60 border-t-4 border-emerald-300/70`, with the "Total"/"סה\"כ" label recolored to `text-emerald-900` for emphasis.
- **Table width reduction**: cell horizontal padding reduced from `px-4` to `px-3` across all header/body/footer cells; the investment-name column's `min-w` reduced (from `min-w-[200px] sm:min-w-[260px]` in the prior round down to `min-w-[130px] sm:min-w-[150px]`); the reorder column reduced from `w-14` to `w-12`; the dynamic custom-horizon column's emphasis padding reduced from `ps-6` to `ps-4`; owner/type pill badges tightened from `px-2.5 py-1` to `px-2 py-0.5`. Measured effect: table content width reduced from ~1382px to ~1336px at a 1440px viewport. Some horizontal scroll remains (~242px overflow at that viewport) — see Known Limitations below for why this was not further reduced.

**Final Product QA fix round (2026-07-07, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** Two more Product Owner QA issues fixed before approval:

- **Reorder save toast made prominent and persistent**: the reorder-status feedback in `ManagedSavingsPageClient` was previously a small inline pill (`text-xs`) next to the "Your Holdings" heading, which scrolled out of view once the user scrolled down. It is now rendered as a `position: fixed` toast (`top-4 inset-x-0`, `z-[100]`, centered via `flex justify-center`), styled larger (`text-sm md:text-base font-semibold`, larger icon, more padding/shadow), with `role="status"`/`aria-live="polite"` for accessibility. Verified via browser QA that the toast stays at the same fixed screen position (top ≈16px) before and after scrolling 800px. Success/error styling (`bg-green-50`/`bg-red-50`) and copy (existing `ordering.orderSaved`/`orderSaveFailed` keys, unchanged) are preserved — no new i18n keys were needed. Auto-dismiss after 3 seconds is unchanged.
- **Main table "Managing company" column now prefers linked public fund data**: new helper `getCompanyDisplay(investment)` (`src/lib/managed-savings/company-display.ts`) returns `{ primary, secondary }` — for linked holdings this is `linkedPublicFund.managingCompany` / `linkedPublicFund.fundName` (the real public fund identity); for unlinked holdings it falls back to the existing manually-entered `managingCompany`/`track` fields, unchanged. `ManagedSavingsTable`'s company cell now renders this pair instead of always reading the manual fields directly. No internal IDs, no `officialFundId`, and no public fund number are shown in this cell — the fund number label ("מספר קרן"/"Fund number") remains exactly where it already was, in the expanded row and edit modal metadata, unchanged.
- **Conservative company-name display cleanup**: `formatCompanyNameForTable` (same new file) strips only the trailing Israeli legal-entity suffix ("בע\"מ" and its quote-character variants — straight quote, apostrophe, Hebrew geresh/gershayim) for table display only; it never mutates stored data. A more aggressive brand-name-only extraction (e.g. "אנליסט קופות גמל בע\"מ" → "אנליסט") was considered but rejected as unsafe/ambiguous without a hardcoded company-name lookup table (there is no reliable rule to know where a legal/generic descriptor ends and a multi-word brand name like "אלטשולר שחם" begins) — the conservative legal-suffix-only trim was implemented instead, per the guidance to skip risky cleanup and prefer showing more of the real name. Verified via browser QA: linked rows now show e.g. "אנליסט קופות גמל" / "אנליסט גמל מניות" (public fund company + fund name, suffix trimmed) instead of the previous manually-entered mock company; unlinked rows are unaffected.

**Public fund search completeness fix (2026-07-07, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** Product Owner found that searching "אנליסט" in `PublicFundMatchModal` did not surface fundId 963 ("אנליסט השתלמות מניות"), even though searching the fund number "963" directly found it correctly. Root cause: the local DB has exactly 40 GemelNet funds managed by "אנליסט קופות גמל בע\"מ", all matching the query on both `fundName` and `managingCompany` and therefore tying at the identical relevance score (395) computed by `scorePublicFundCandidate` (`src/lib/public-funds/matching.ts`, unchanged in this fix). Within that 40-way tie, the deterministic tie-breaker (`latestReportPeriod` desc, then `fundName` alphabetical) placed fund 963 11th — past the modal's previous hardcoded `limit: 10`. Fix: `PublicFundMatchModal.tsx` now requests `limit: 20` (renamed to a named constant `MAX_MODAL_RESULTS`, matching the existing `MAX_SEARCH_LIMIT` server-side ceiling in `src/lib/public-funds/search-types.ts` — no schema/validation change needed) for both the fundId and text-query search paths. A new informational note (`managedSavings.publicFundLinking.modal.truncatedResultsNote`, both locales) appears when a text search returns exactly `MAX_MODAL_RESULTS` candidates, hinting the user can search by fund number for an exact result — gated off for numeric fundId searches, which never legitimately hit that ceiling. No changes to the scoring formula itself (already correctly ranks exact fundId highest and multi-field matches above single-field matches) and no ranking by returns/performance was introduced — this is a display-completeness fix, not a recommendation change. Verified via direct backend calls and browser QA that "963" (exact), "מור", and "12536" all continue to work unchanged, and the modal remains GemelNet-only with no PensionNet selector and no auto-linking.

**Add Modal public fund linking fix (2026-07-07, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** Product Owner found that only `EditManagedFundModal` allowed linking a holding to a public GemelNet fund — `AddManagedFundModal` had no equivalent, forcing an awkward add-then-reopen-edit-then-link flow. Fixed:

- **`PublicFundMatchModal.tsx` refactored for select-only mode**: the `investment` prop is loosened from the full `ManagedSavingsInvestment` to a small `Pick<ManagedSavingsInvestment, "officialFundId"> & { id?: string }` shape (the only fields the modal ever reads), and a new optional `onSelectCandidate?: (candidate) => void` prop was added alongside the existing (now optional) `onLinkSuccess?`. When `onSelectCandidate` is provided, `handleLink` hands the chosen candidate back to the caller synchronously instead of calling `linkManagedSavingsHoldingToPublicFund` — nothing is persisted until the caller decides to. `EditManagedFundModal`'s existing immediate-link flow is unchanged (it doesn't pass `onSelectCandidate`, so the original behavior applies); no second/duplicate search modal was created, per instructions.
- **`AddManagedFundModal.tsx`** gained a new "Public Fund Data" section (positioned between "Personal Assumptions" and "Personal Notes", matching the Edit modal's section ordering) with two states: no fund selected (shows the `linkButton` CTA, opens `PublicFundMatchModal` in select-only mode) and fund selected (shows source badge, fund name, managing company, fund number, latest report period, "Change selected fund"/"Remove selected fund" buttons, and a "will be linked on save" note). The selected candidate (`PublicFundMatchCandidate`) is held in local component state only — closing/cancelling the Add modal discards it, nothing is created or linked.
- **`createManagedSavingsHolding` now accepts an optional `publicFundId`**: `CreateManagedSavingsSchema` (only the create schema, not update) gained `publicFundId: z.string().min(1).optional()`. The server action verifies the referenced `PublicFund` exists and has `source: "gemelnet"` before creating the holding (closed error union extended with `"invalid_public_fund"`, no raw DB errors exposed) — the transaction that assigns `displayOrder` now also sets `publicFundId` when valid. The returned holding is serialized with `getLatestFundReturnSummaries` (same helper `updateManagedSavingsHolding`/link actions already use) so a holding created with a linked fund immediately includes `linkedPublicFund` and its latest return metrics — no follow-up fetch or page refresh needed to see linked data. `updateManagedSavingsHolding` is unchanged; it still never touches `publicFundId`.
- Verified via browser QA: saving a new holding with a selected fund makes it appear at the end of the table (via the existing `displayOrder` append-to-end logic, unchanged) already showing the linked badge, linked company/fund-name in the company column, the linked KPI card in the expanded row, and the linked `latestAnnualized5YrReturn` in the 5Y/projection columns. Saving without a selected fund behaves exactly as before (unlinked badge, red unlinked expanded state, no public return data).

**Seed safety fix (2026-07-09, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** A dedicated data-inconsistency audit (see prior audit report) found that `npm run db:seed:local` had been silently overwriting `ManagedSavingsHolding` data throughout Phase 2D-1 QA. Root cause: `prisma/seed.ts` upserted the 8 canonical seed holdings (`hist-001` … `save-002`) with an `update` block that unconditionally reset **every** field except `publicFundId` — `status`, `displayOrder`, `currentBalanceMinor`, `monthlyContributionMinor`, fees, `managingCompany`, `trackName`, `officialFundId`, `valuationDate`, and `notes` — back to their hardcoded seed values on every run. Confirmed evidence: all 8 canonical rows shared an identical `updatedAt` timestamp matching a seed run performed after a QA round, and a `displayOrder` collision existed between two reset canonical rows and two ad-hoc (Product-Owner-created) holdings that were never touched by seed. Because `status` was included in the reset, this mechanism could also silently reactivate a canonical holding that had been archived (soft-deleted) via the UI.

Fixed: the `ManagedSavingsHolding` seeding loop in `prisma/seed.ts` is now **create-if-missing only** — for each of the 8 canonical ids, `findUnique` checks whether the row already exists; if it does, the row is skipped entirely (no fields touched, including `publicFundId`); only genuinely missing rows are created. The seed now logs `"Managed savings seed: created X, skipped existing Y."` plus an explicit warning that existing rows are preserved and that intentional QA-data resets must go through an explicit, Product-Owner-approved workflow — not accidental reseeding. **`db:seed:local` must no longer be used as a QA cleanup/reset mechanism.** Verified via a before/after read-only fingerprint (id, status, displayOrder, currentBalanceMinor, updatedAt, publicFundId presence) across all 19 rows in the local DB: running the fixed seed produced a byte-for-byte identical fingerprint (0 created, 8 skipped — all canonical rows already existed) — no row's status, order, balance, timestamp, or link was touched. The public-fund-resource config seeding (unrelated, non-personal data) was left unchanged, as scoped.

**`displayOrder` collision repaired (2026-07-09, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** the pre-existing `displayOrder` duplication left over from earlier (now-fixed) destructive seed runs — canonical `hash-001`/`gemel-003` colliding with two ad-hoc holdings at `displayOrder` 6 and 7 — was repaired directly in the local DB via a temporary, one-off script (read, renumber, verify, then deleted; never added to the repo or `package.json`). Only `ManagedSavingsHolding.displayOrder` was modified, and only for the 5 rows whose displayOrder actually needed to change to make the sequence strictly `1..11` — the other 6 active rows were left completely untouched (no update call issued, so no `updatedAt` change either). The exact visible ordering (the same `displayOrder asc, createdAt asc` sort the app already uses) was preserved — this was a renumbering, not a reshuffle: every row kept its same relative position, just with unique sequential numbers. No records were created, deleted, archived, or reactivated; archived holdings (8 rows) were read for verification only and are confirmed byte-for-byte unchanged. `db:seed:local` was **not** run as part of this cleanup — seed remains verified non-destructive from the prior fix. Verified via browser QA: the page now loads in a stable order across repeated reloads (previously two rows tied at the same `displayOrder` could render inconsistently), and drag/keyboard reordering still works correctly after the cleanup.

**"Other" investment type + unlinked 5-year return fallback cleanup (2026-07-09, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** two final Product Owner QA issues fixed:

- **New "Other" holding type**: `ManagedSavingsType` (Prisma enum) gained a new value, `other` ("אחר"/"Other"), for private investments/bank accounts/anything not covered by the four existing types. Additive-only migration (`ALTER TYPE "ManagedSavingsType" ADD VALUE 'other'`, no data loss risk, no existing rows touched). Wired through everywhere the four existing types already appear: `CreateManagedSavingsSchema`'s `MANAGED_SAVINGS_TYPES`, the `ManagedSavingsInvestment.type` union, `calculateTotalSummary`'s `byType` accumulator, `summary.ts`'s breakdown-by-type list, `ManagedSavingsBreakdownByType`'s label map, `ManagedSavingsTable`'s type-badge color/label maps, and both Add/Edit modal `<select>` options. "Other" holdings behave exactly like any other type — same balance/contribution/fee/ordering/delete/edit/projection handling, and may remain unlinked (never forced to link a public fund). Verified via a before/after seed fingerprint that the additive migration did not disturb seed's non-destructive behavior (`created 0, skipped existing 8`, unchanged). **Scope note**: the separate legacy "Future Projections" summary table (`ManagedSavingsSummaryTable`) still only itemizes the original 4 types as columns — an "other"-type holding's balance is included in that table's grand total but not broken out into its own column there, since that table wasn't in the required list of places to update.
- **Unlinked 5-Year Return column no longer shows a misleading mock value**: the main table's "5-Year Return" percentage column previously called `getEffectiveAnnualReturn`, which falls back to a per-type mock `trackPerformance.last5Years` value (e.g. `4.9` for `gemel` — rendering as "4.90%", exactly the value the Product Owner flagged as looking like a real, unexplained return) whenever a holding had no linked public fund. The column now reads `linkedPublicFund.latestAnnualized5YrReturn` directly — linked holdings with a value show it as before; everything else (unlinked, or linked with a null 5Y return) shows a neutral "—" with a translated `aria-label`/`title` (`table.noReturnData`) for accessibility. Linked holdings' real return display is unchanged.
- **Projection columns (1Y/5Y/10Y/custom-horizon) — fallback intentionally not removed, reported per the prompt's own scope allowance**: `getEffectiveAnnualReturn` (and its mock-fallback fallthrough) is still used internally by `projectSimulations`, which drives every currency-valued projection column, the top KPI cards (`calculateTotalSummary`), and the table totals row. Removing the fallback there would require deciding how a currency total should render when some/all contributing holdings have no real return data — which directly conflicts with the explicit requirement to preserve the top KPI cards and totals row as currently working. Per the prompt's explicit escape hatch ("if changing all projection logic is too broad, at minimum fix the visible 5-year return column now and report exactly where projection fallback remains"), this fix intentionally stopped at the raw percentage column. The weighted-return summary (`summary.ts`) was verified already correct — it only ever reads `linkedPublicFund.latestAnnualized5YrReturn` and already excludes unlinked holdings; no change was needed there. **Superseded (2026-07-09) — see "Unlinked projection fallback removal" below: the projection-column fallback flagged here has now been removed.**

**Unlinked projection fallback removal (2026-07-09, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** the mock return-rate fallback flagged as deferred in the note above has now been removed from every currency-valued display surface. `src/lib/mock/managed-savings-data.ts` gained `getLinkedAnnualReturn(investment): number | null` (returns the real `linkedPublicFund.latestAnnualized5YrReturn` or `null` — no mock fallback) and `projectLinkedOnly(investment, years): Record<number, SimulationYear> | null` (returns `null` when the holding has no eligible linked return, instead of silently computing on a mock rate). The compounding formula itself (`runProjection`) is unchanged and shared between the strict `projectLinkedOnly` and the still-present mock-capable `projectSimulations`/`getEffectiveAnnualReturn` (kept only for potential future mock/demo use, no longer used by any live display path). Effects:
  - **Table rows** (`ManagedSavingsTable`): the 1Y/5Y/10Y and custom-horizon cells now show a neutral "—" (with translated `aria-label`/`title` via the new `table.noProjectionData` key) for any holding with no eligible linked return — whether fully unlinked or linked to a fund with a null `latestAnnualized5YrReturn`. Holdings with real linked return data are unaffected. The table totals row already excluded `null`/missing per-row values via existing optional chaining, so summing needed no logic change — it now correctly sums only eligible holdings' projections while the current-balance total still sums every visible holding. A small info icon next to the "סה"כ"/"Total" label now shows a tooltip (new `table.projectionLinkedOnlyTitle` key) explaining that the projection total only includes linked funds with return data.
  - **Top KPI cards** (`ManagedSavingsSummaryCards`): `totalCurrentValue` is unchanged (still sums all active holdings). The three projected cards (1Y/5Y/10Y) now accept `number | null`; `ManagedSavingsPageClient` computes `hasLinkedReturnData` (true if any holding has a non-null `getLinkedAnnualReturn`) and passes `null` to all three cards when no holding qualifies, rendering "—" instead of a mock-derived total. Each of the three projected cards now shows a small caption (new `summaryCards.linkedOnlyHint` key: "כולל קרנות מקושרות בלבד"/"Linked funds only") — no large coverage block was added back to the top area, per the explicit instruction to keep this compact.
  - **Legacy "Future Projections" table** (`ManagedSavingsSummaryTable`): required no direct code changes — it already consumes `calculateTotalSummary`, which was updated to call `projectLinkedOnly` instead of `projectSimulations`. Its per-type/period totals now automatically exclude unlinked (or unlinked-return) holdings; verified via browser QA that a fully-unlinked type/period now shows ₪0 there rather than a mock-derived figure.
  - Verified via Playwright: no console errors on `/managed-savings` or `/en/managed-savings`; per-row inspection confirmed holdings with real linked return data show numbers, while both "linked but no return data" and "fully unlinked" holdings correctly show "—" across all projection cells; the totals row and KPI cards agree on the current-balance figure.
  - `db:seed:local` was **not** run this round, per the explicit instruction — no DB mutation of any kind was performed.
  - **Superseded (2026-07-09) — see "Projection zero-return assumption fix" below**: hiding the projection *amount* cells (not just the percentage) for unlinked holdings was itself incorrect per Product Owner clarification. The percentage-column behavior described above is unchanged and correct; only the amount-hiding behavior was reverted in favor of a 0%-return assumption.

**Projection zero-return assumption fix (2026-07-09, same branch, `feature/managed-savings-summary-ordering`, still not committed/merged):** the prior round's fix correctly stopped showing a mock return *percentage* for unlinked holdings, but it also incorrectly hid the projection *amount* cells (1Y/5Y/10Y/custom-horizon) entirely for those holdings. Per Product Owner clarification: when there is no linked return, the projection amount must still be shown, computed with an explicit 0% annual return assumption (current balance + accumulated monthly contributions, no growth, no fee drag) — never hidden and never computed from mock data.

- `src/lib/mock/managed-savings-data.ts`: renamed/restructured the strict helpers for clarity — `getDisplayAnnualReturn(investment): number | null` (historical/display return; unchanged behavior from `getLinkedAnnualReturn`, still null when no linked return, still drives the "—" in the 5-Year Return percentage column) and `getProjectionAnnualReturn(investment): number` (projection assumption; linked return if available, else `0`, never null). `projectLinkedOnly` was replaced with `projectWithAvailableReturnOrZero(investment, years): Record<number, SimulationYear>` — always returns a result. Internally it branches: a linked holding uses the existing fee-adjusted compounding formula (`runProjection`, unchanged math); a holding with no linked return uses a new `runZeroReturnProjection` that returns `currentBalance + monthlyContribution × months` with **no fee applied** — applying the existing fee-subtracted-from-return formula at a literal 0% rate would either divide by zero (when the fee is also 0, e.g. a 0-contribution bank account) or silently shrink a 0-contribution holding below its current balance (when the fee is non-zero), both of which contradict the explicit requirement that a 0-contribution unlinked holding must project to exactly its current balance at every horizon. `runProjection` itself also gained a zero-rate guard (`monthlyRate === 0` → linear sum) as a general robustness fix for the same underlying division-by-zero risk, in case a linked fund's real return ever exactly equals its fee.
- `src/components/managed-savings/ManagedSavingsTable.tsx`: the four projection `<td>` cells (1Y/5Y/10Y/custom-horizon) no longer conditionally render "—" — they always show `formatCurrency(rowProjection[...])`, since `projections` is now always a plain `Record<string, Record<number, number>>` (no `null` case). The 5-Year Return percentage column is unchanged (still reads `linkedPublicFund.latestAnnualized5YrReturn` directly, still shows "—" when absent). The totals-row info-icon tooltip now reads the new `table.projectionZeroReturnTitle` key ("קרנות ללא נתוני תשואה מחושבות לפי 0% תשואה" / "Holdings without return data use 0% return") instead of the retired "linked funds only" wording.
- `src/components/managed-savings/ManagedSavingsSummaryCards.tsx` / `ManagedSavingsPageClient.tsx`: the three projected props reverted from `number | null` back to plain `number` — `calculateTotalSummary` (which now internally calls `projectWithAvailableReturnOrZero`) always returns a real sum across all active holdings, so the `hasLinkedReturnData`/null-passing logic added in the prior round was removed as no longer needed. Each projected card shows a compact caption using the new `summaryCards.zeroReturnAssumptionHint` key ("תחזית שמרנית: קרנות ללא נתוני תשואה מחושבות לפי 0% תשואה" / "Conservative projection: holdings without return data use 0% return"). No large coverage block was reintroduced.
- **Legacy "Future Projections" table** (`ManagedSavingsSummaryTable`): required no direct code change — it already consumes `calculateTotalSummary`, which now sums every active holding (0%-assumption for unlinked ones) instead of excluding them. Verified via browser QA that its per-period totals now include unlinked holdings' balance+contribution figures instead of showing ₪0 for a fully-unlinked type/period.
- i18n: removed the now-inaccurate `table.noProjectionData` and `table.projectionLinkedOnlyTitle` keys (no longer referenced anywhere); removed `summaryCards.linkedOnlyHint`; added `table.projectionZeroReturnTitle` and `summaryCards.zeroReturnAssumptionHint` to both `he.json` and `en.json` with the exact wording specified by the Product Owner.
- Verified via Playwright against the running dev server (`/managed-savings` and `/en/managed-savings`, zero console errors in both): an unlinked bank account holding (current balance ₪20,000, monthly contribution ₪0) projects to exactly ₪20,000 at 1Y/5Y/10Y/custom; an unlinked/no-return holding with a monthly contribution (current balance ₪42,213, monthly contribution ₪2,176) projects to ₪68,325 at 1Y, ₪172,773 at 5Y, ₪303,333 at 10Y, ₪433,893 at 15Y — exactly `currentBalance + monthlyContribution × months`, confirmed by manual arithmetic; linked holdings with real return data are unaffected and still compound as before; no holding anywhere shows a mock `4.90%`-style percentage; the totals row and KPI cards reconcile exactly with the sum of all visible rows' 1Y/5Y/10Y/custom values.
- `db:seed:local` was **not** run this round — no DB mutation of any kind was performed.

## Known Limitations / Deferred Items

- **`<html lang/dir>` SSR for English routes:** For `/en/*` routes, the initial server-rendered HTML has `lang="he" dir="rtl"` on the `<html>` element (from the minimal root layout). `SetHtmlAttributes` corrects this after client hydration. No visible layout flash — `AppShell` renders with `dir="ltr"` in SSR HTML. Should be addressed in a dedicated i18n hardening task before production.
- **Dev-user stub:** All DB operations use `dev@mybalance.local`. Auth.js and production multi-user isolation are future scope.
- **Public track performance:** Phase 2C-3B already replaced the displayed performance card for **linked** holdings with real DB-backed KPI data (monthly/YTD/3Y/5Y annualized returns) — this is not mock/fallback. **Unlinked** holdings show a compact warning only, with no performance numbers displayed at all. The mock `trackPerformance` object and `getEffectiveAnnualReturn`/`projectSimulations` still exist in `src/lib/mock/managed-savings-data.ts` for potential future mock/demo use, but no live display path (table cells, KPI cards, totals, or the legacy summary table) calls them anymore. The 5-Year Return percentage column uses `getDisplayAnnualReturn` (null when no linked return — renders "—"); every currency-valued projection column/card/total uses `getProjectionAnnualReturn`/`projectWithAvailableReturnOrZero` (0% assumption when no linked return — renders a real amount, never hidden and never mock-derived).
- **ManagedSavingsHolding.publicFundId:** Added in Phase 2C-3B as a nullable FK to `PublicFund` (user-confirmed via `EditManagedFundModal`, `onDelete: SetNull`). The linked fund's `latestAnnualized5YrReturn` is used as the projection assumption by `getEffectiveAnnualReturn` when available. `officialFundId` remains a separate, unrelated plain optional string — not repurposed.
- **Product type inference for PublicFund:** Unresolved. GemelNet does not expose a clean product type column; `productType` must remain nullable / allow `unknown` until a future phase defines safe inference rules.
- **AUM units:** Not display-approved yet. `FundReturn.assetsUnderManagement` must not be displayed in UI until units are confirmed.
- **`ACTUARIAL_ADJUSTMENT` (PensionNet):** Observed in live Data.gov.il records but has no corresponding schema column — not mapped or stored. No functional impact in this phase.
- **Scheduled sync:** Not implemented. Sync is manual CLI trigger only (`npm run sync:public-funds:local`).
- **Historical resource backfill:** 1999–2022 and yearly-archive resources are not synced by default; only `isCurrent=true` resources sync automatically.
- **Custom horizon projection edge case — FIXED (2026-07-06, layout QA fix round):** `projectSimulations` previously only computed a custom-horizon data point when `customYears > 15`, silently returning 0 for any other custom value (e.g. 12). Now any `customYears` value not already in the baseline `[0,1,5,10,15]` set is computed. This was promoted from a rare edge case to a routine path once the table's dynamic projection column defaulted to 15 (previously 20).
- **Managed Savings groups/sections (recommended future planning phase):** Product Owner suggested grouping holdings into blocks (e.g. "My investments" / "Spouse investments" / "Children savings") with per-block subtotals. Not implemented — no schema, UI, or `displayOrder` design changes were made to support this. Recommend a dedicated **Phase 2D-2 — Managed Savings Groups / Sections Planning** (audit/planning prompt) before any implementation, since it would interact with both the summary layer and the `displayOrder` ordering model introduced in Phase 2D-1.
- **Managed Savings table horizontal scroll (partially minimized, 2026-07-07):** The main holdings table still has some horizontal scroll (~242px overflow measured at a 1440px viewport, down from ~288px before this round's padding/width trims). Full elimination was not attempted because the required column set (14 data columns including reorder/drag, name, owner, type, company, and 4 currency-formatted projection columns) inherently needs more width than fits in the page's available content area (~1094px after sidebar/layout chrome) without either hiding a required column or shrinking currency columns to the point of risking number wrapping — both explicitly out of scope for this round. A future dedicated pass (e.g. responsive column hiding on narrower viewports) could reduce this further if the Product Owner wants zero scroll.
- **`displayOrder` collision from prior seed damage — REPAIRED (2026-07-09):** the duplicate `displayOrder` values left over from earlier destructive seed runs (canonical `hash-001`/`gemel-003` colliding with two ad-hoc holdings at `displayOrder` 6 and 7) were repaired via a one-off local cleanup script — see the `displayOrder` collision repair note above. The relative visible order was preserved exactly; only the numbers were made unique/sequential (`1..11`, no duplicates). The Product Owner should still spot-check the row order next time they view the page, since the collision could have caused inconsistent rendering before this repair.
- **Unlinked-holding projection columns used a mock return-rate assumption — RESOLVED (2026-07-09, refined same day):** the currency-valued projection columns (1Y/5Y/10Y/custom-horizon), top KPI cards, and table totals row previously computed their values using `getEffectiveAnnualReturn`'s per-type mock fallback for any unlinked holding. An interim fix made these surfaces show "—" instead, but the Product Owner clarified this over-corrected: the projection amount should still be shown, computed with an explicit 0% return assumption (current balance + contributions, no growth), never hidden. See "Projection zero-return assumption fix" above for the final behavior. `getEffectiveAnnualReturn`/`projectSimulations` remain in the codebase for potential future mock/demo use but are no longer called by any live display path — all live surfaces use `getDisplayAnnualReturn`/`getProjectionAnnualReturn`/`projectWithAvailableReturnOrZero` instead.
- **"Other" type not itemized in the legacy "Future Projections" summary table:** `ManagedSavingsSummaryTable` (a separate, older summary section) still only has columns for the original 4 types; an "other"-type holding's balance is folded into that table's grand total but has no dedicated column there. This table was not in the required list of places to update for the "Other" type fix.

Phase 2D-2A: Managed Savings Groups Foundation — **COMPLETED AND VERIFIED (2026-07-12).** Product Owner browser QA approved after the fix round below. Committed and merged into `master` from `feature/managed-savings-groups-foundation`. Built following the Phase 2D-2 audit/planning report (`Context/current-feature.md` prior "Known Limitations" recommendation). Scope:

- **Schema**: new `ManagedSavingsGroup` model (`id`, `userId`, `name` unique per user, `displayOrder`, timestamps). `ManagedSavingsHolding` gains required `groupId` (FK, `onDelete: Restrict`) and required `ownershipLabel` (free-text String). The legacy `owner` (`OwnerLabel` enum) column is intentionally **not** dropped — kept for rollback safety, no longer read/written by the live app. Migration `prisma/migrations/20260712090000_add_managed_savings_groups/` creates one default group per user ("כל החסכונות"), backfills every existing holding (active and archived) into it without touching `displayOrder`, and backfills `ownershipLabel` from the legacy `owner` enum values. Verified locally: all 24 holdings (7 active, 17 archived) ended up with a valid `groupId`/`ownershipLabel`, all in the single default group, visible order unchanged.
- **Seed**: `prisma/seed.ts` gained a create-if-missing default-group step (same deterministic id as the migration, `default-group-${userId}`) — never upserts, matching the existing Phase 2D-1 seed-safety precedent. Verified: re-running seed against the already-migrated local DB reported "Default group already exists — left untouched" and "created 0, skipped existing 8" for holdings — fully non-destructive.
- **Server actions**: new `src/lib/actions/managed-savings-group-actions.ts` — `createManagedSavingsGroup`, `renameManagedSavingsGroup` (both reject duplicate names with a closed `duplicate_name` error), `reorderManagedSavingsGroups`, `deleteEmptyManagedSavingsGroup` (rejects with `group_not_empty` if the group has any holdings of any status — no transfer flow in this sub-phase). `createManagedSavingsHolding`/`updateManagedSavingsHolding` now require and ownership-check `groupId`, and changing a holding's group on update appends it to the end of the target group (existing flat `reorderManagedSavingsHoldings` action is reused unchanged for same-group reorder, scoped by the ids submitted).
- **UI**: the Managed Savings page now renders grouped sections (`ManagedSavingsGroups` → `ManagedSavingsGroupSection` → `ManagedSavingsGroupHeader`/`ManagedSavingsGroupTable`/`ManagedSavingsGroupSummaryRow`) instead of one flat table. The former `ManagedSavingsTable` component was removed; its row-rendering logic now lives in `ManagedSavingsGroupTable`, scoped per group with its own `@dnd-kit` context (same-group drag-and-drop and up/down fallback both preserved, working per group). Empty groups remain visible with an empty state and a group-preselected "Add holding" action. `CreateManagedSavingsGroupModal`/`RenameManagedSavingsGroupModal`/`DeleteManagedSavingsGroupModal` added. Add/Edit modals gained a required group `<select>` and a free-text ownership `<input>` (replacing the old fixed ownership `<select>` and its `ownerLabels.*` translation keys, which were removed as orphaned).
- **Calculation**: `src/lib/managed-savings/summary.ts` gained `calculateProjectionTotals` — the single shared aggregation helper (built on the existing `projectWithAvailableReturnOrZero`) used by each group's summary row; the global top KPI cards and table-level totals continue to use the pre-existing `calculateTotalSummary`/`calculateManagedSavingsSummary` over the full flattened holdings list, so group and global totals are computed from the same per-holding source of truth and never diverge. 0%-return assumption for holdings without a usable linked return is unchanged.
- **Non-scope confirmed**: no cross-group drag-and-drop, no delete-with-transfer for non-empty groups, no dedicated "Move to group" quick action outside Edit, no group colors/icons/charts, no family-member profiles/household accounts, no Auth.js, no dropping of the legacy `owner`/`OwnerLabel` column/enum.
- **QA performed**: `prisma validate`, `prisma generate`, `prisma migrate dev` (applied cleanly, no drift), `prisma db seed` (non-destructive, verified), `npm run lint` (clean after one fix — see Known Limitations), `npx tsc --noEmit` (clean), `npm run build` (succeeded). Server-rendered HTML verified directly (via `curl` against both a production build smoke-test server and confirmed against the live local DB) for `/managed-savings` and `/en/managed-savings`: default group name, ownership labels, and correct single-group `groupId` bucketing all confirmed present and correct with zero holdings missing `groupId`/`ownershipLabel`. **Full interactive browser QA (create/rename/delete group, drag-and-drop, Edit-modal group move, RTL/LTR visual check) was not performed in this session** — no interactive browser tool was available; this is deferred to the Product Owner's browser QA step per the standard workflow.

**Phase 2D-2A QA fix round (2026-07-12, same branch `feature/managed-savings-groups-foundation`, still not committed/merged):** Product Owner QA findings addressed:

- **Stale state requiring two browser refreshes (root cause found and fixed)**: every managed-savings server action (holding create/update/archive/reorder, group create/rename/reorder/delete, public fund link/unlink) called `revalidateTag(MANAGED_SAVINGS_CACHE_TAG, {})`. Reading Next.js 16.2.9's own shipped source (`node_modules/next/dist/server/web/spec-extension/revalidate.js`) showed that `revalidateTag(tag, profile)` only marks the client router cache as revalidated (`pathWasRevalidated = ActionDidRevalidateStaticAndDynamic`) when `profile` is falsy or `profile.expire === 0` — passing an empty object `{}` as the second argument satisfies neither condition, so it silently performed a stale-while-revalidate-style update instead of an immediate purge, which is exactly why a saved change could still show the old value on the first request after a mutation and only the correct value after a second one. Fixed by switching every call site to `updateTag(MANAGED_SAVINGS_CACHE_TAG)` — a Next.js-documented API specifically for "read-your-own-writes semantics" from within a Server Action, which always performs an immediate invalidation with no profile ambiguity. `router.refresh()` calls were also added to the group-reorder/rename/create/delete and holding-reorder client handlers in `ManagedSavingsPageClient.tsx` (previously only add/edit/delete-holding called it) as defense-in-depth, matching the codebase's existing convention.
- **Group reorder save feedback**: confirmed already wired to the same fixed toast component used by holding reorder (`ordering.orderSaved`/`orderSaveFailed`, no new keys needed) — the perceived "missing" toast was most likely a symptom of the stale-state bug above (the reverted-looking order after refresh could read as "nothing was saved"). No separate toast bug was found; the underlying cache fix directly addresses the confusion.
- **Required-field indicators and validation**: Add/Edit holding modals and Create/Rename group modals now show a red asterisk next to every required label (name, ownership, group, type, current balance, monthly contribution) plus a "* required" helper line near the top of the form. Submit buttons are no longer disabled purely by field emptiness — clicking Save/Add/Create with a missing required text/select field now sets a local `showValidation` flag, highlighting the invalid field(s) in red with an inline "this field is required" message and a form-level summary message, and blocks the actual server call. Fields also validate on blur. New `managedSavings.validation.*` i18n keys (`requiredFieldsHelper`, `fieldRequired`, `formHasErrors`) added to both locales.
- **Top-level "Add Fund" button removed**: `ManagedSavingsPageClient.tsx` no longer renders a page-level "Add Fund"/"הוסף קרן" button or `handleOpenAddModal`. The orphaned `managedSavings.addFundButton` translation key was removed from both locales. "New Group"/"קבוצה חדשה" and each group's "Add holding to group" action are unchanged and remain the only ways to add a holding — the Add modal always receives an explicit `defaultGroupId` now.

Phase 2E-1: Similar Tracks Comparison Core — **COMPLETED AND VERIFIED (2026-07-13)**. Product Owner browser QA approved after two focused fix rounds. Committed and merged into `master` from `feature/similar-tracks-comparison`, commit `6880796`. Branch deleted after merge. Built following the Phase 2E audit/planning report (prior session). Scope:

- **No schema changes.** Peer grouping uses `PublicFund.fundClassification`/`subSpecialization` and `FundReturn` fields already stored as of Phase 2C-1 — confirmed sufficient by the Phase 2E audit. `npm run db:validate` confirms the schema is unchanged/valid.
- **Backend**: new `src/lib/public-funds/peer-comparison.ts` — `getPeerComparisonForPublicFund(publicFundId)`. Peer grouping: `source: "gemelnet"` + `fundClassification` + `subSpecialization` (strict); if the strict group has fewer than 5 funds, falls back to `fundClassification`-only (relaxed, labelled in the UI); if the relaxed group has fewer than 3 funds, returns a `not_enough_peers` no-comparison result. Also returns `missing_classification` (linked fund has no classification data) and `unsupported_source` (linked fund is `pensionnet`, out of scope for this comparison). Comparison period is always the target fund's own latest `FundReturn.reportPeriod`; peers without a `FundReturn` row for that exact period are excluded (no cross-period comparisons). Rolling 12-month return is computed by compounding (not summing) the last 12 monthly `FundReturn.monthlyReturn` rows via a batched window-function SQL query (`ROW_NUMBER() OVER (PARTITION BY "publicFundId" ...)`); null if fewer than 12 months of history exist. Fee falls back to the latest available 2025 `avgAnnualManagementFee` when the selected period's row has none. Default ranking is `trailing5YrReturn` descending, missing values sorted last. The peer-average row is computed over peers only (excluding the target fund's own row), per-metric null-safe averaging — this is what "vs. peer average" is measured against. Sharpe, Alpha, AUM, and exposure/composition data are intentionally not read or exposed (confirmed unavailable/not-display-approved by the Phase 2E audit). **Superseded by the Phase 2E-1 QA fix round below** for relevance filtering and display capping.
- **Data layer**: `src/lib/data/managed-savings.ts`'s `fetchHoldingsForDevUser` now computes a peer comparison once per distinct linked `PublicFund` id (not per holding) and attaches it as `similarTracksComparison` on the serialized `ManagedSavingsInvestment` (`src/lib/mock/managed-savings-data.ts`, new optional field). `serializeHolding` itself is unchanged — mutation-action responses (link/unlink/create/update) do not include `similarTracksComparison` until the next `router.refresh()`/cache read, consistent with how those actions already omit other derived-at-read-time data.
- **UI**: new `src/components/managed-savings/SimilarTracksComparison.tsx`, rendered in `ExpandedManagedSavingsRow` directly below the existing linked-fund performance card, for linked holdings only (renders nothing for unlinked holdings — the existing red "not linked" warning is unchanged). For `not_enough_peers`/`missing_classification`/`unsupported_source`/undefined comparisons, a compact neutral empty-state message renders instead — never fake/mock values. `data-testid="similar-tracks-comparison"` / `data-comparison-status` attributes were added to both render branches to support automated QA; they carry no user-facing text. **Table/summary layout superseded by the Phase 2E-1 QA fix round below.**

**Phase 2E-1 QA fix round (2026-07-13, same branch `feature/similar-tracks-comparison`, later committed and merged into `master` as part of commit `6880796`):** Product Owner QA feedback addressed — relevance filtering, table width, and row/value emphasis:

- **Relevance filtering by `targetPopulation`** (root cause of "too many irrelevant results"): local GemelNet data was inspected first (read-only `groupBy` query) and shows exactly 3 distinct `PublicFund.targetPopulation` values — one generic/public phrase ("כלל האוכלוסיה", 595 funds) and two sector/employer-specific phrases ("עובדי סקטור מסויים", "עובדי מפעל/גוף מסויים", 159 + 45 funds). `peer-comparison.ts` gained `isGenericTargetPopulation()` (null/empty or a known generic phrase → generic; anything else → specific/sectoral — an extensible allow-list, not a brittle enumeration of every possible non-generic value) and now filters the classification-matched peer group by relevance: a generic/public target fund is compared only against other generic/public peers (sector-specific funds excluded); a sector/employer-specific target fund is compared only against peers sharing that exact `targetPopulation` value. The target fund itself always passes the filter. This is applied after the existing strict/relaxed classification matching and before the period/return queries — reduces query size too. Verified directly against all 7 currently-linked holdings: full relevant peer-set sizes dropped from the pre-fix 16–45 range down to 3–18, with the one sector-specific linked fund (fund 15421, "עובדי סקטור מסויים") now correctly compared only against its 3 sector peers instead of being diluted into the general Hishtalmut pool.
- **Top-10 display cap**: `PeerComparisonResult.rows` is now capped to the top 10 relevant peers by `trailing5YrReturn` descending, with the user's own linked-fund row always appended if its true rank falls outside that range (so up to 11 rows can render, plus the peer-average row). `rank` always reflects the fund's position in the full relevant (population-filtered) peer set, not its position in the displayed/trimmed array — verified with a fund whose true rank is 11 (`חסכון מדינה אייל`, fund 1375): the UI correctly renders it as an 11th row below the top 10, still showing "11" as its rank. `averageRow`/`peerGroupSize` continue to be computed over the full relevant peer set (not just the displayed top 10), so the average and peer count remain statistically representative of the whole comparable universe.
- **"Managing company" column removed** from `PeerComparisonRow`/the table — no longer selected/returned by the backend at all (not just hidden in the UI).
- **"My fee"/"Fee gap" columns removed** from the table entirely (they only ever applied to one row and wasted width). The fee-gap calculation itself (`myFeePercent - targetAvgFee`, existing "above/below/same as average" neutral wording, epsilon-guarded) moved into a new fourth mini summary card, "My annual fee" (`managedSavings.similarTracks.summaryMyFee`), which now also states the actual difference amount in the subtext (e.g. "0.10% above public average") via new `feeDiffAbove`/`feeDiffBelow`/`feeDiffSame` i18n keys (replacing the old generic `aboveAverage`/`belowAverage`/`sameAsAverage`/`summaryFeeGap` keys, removed as orphaned). Table columns are now: Rank, Fund/track name, Last month, Last 12 months, 3-year, 5-year, Avg. management fee (7 columns, down from 10) — narrow enough to fit without horizontal scroll at a 1500px viewport in both locales, verified via browser QA screenshots.
- **User-fund row made visually prominent**: stronger background tint (`bg-emerald-100/80`, up from `/60`), a thicker top/bottom border (`border-y-2 border-emerald-500/70`) plus an inset ring, a start-side accent strip (`border-s-4 border-emerald-500` on the rank cell, RTL/LTR-safe via logical properties), and a bolder badge (`bg-emerald-700` solid pill with shadow, up from a lighter green). The row stays in its true ranked position — never pinned/extracted from the table.
- **Best-value highlighting**: new `computeBestValues()` helper computes, per displayed row set (target + peers, excluding the peer-average row), the single highest value for each return column and the single lowest value for the fee column; matching cells get a subtle `bg-emerald-50 ring-1 ring-emerald-200` badge-style highlight (same accent color across all columns — deliberately not a per-column rainbow of colors). Ties highlight all matching cells. Verified via screenshots that highlighting is sparse (one or two cells per column, not every cell) and visually calm.
- **No visual redesign performed** beyond what the above items required, per explicit instruction.
- **Non-scope confirmed unchanged**: no Sharpe/Alpha/AUM/exposure/asset-composition, no new Prisma schema/migrations, no Data.gov.il calls, no sync-logic changes, no Managed Savings group-management work.
- **QA performed**: `npm run lint` (clean), `npx tsc --noEmit` (clean), `npm run build` (exit 0), `npm run db:validate` (schema unchanged/valid). A read-only `groupBy` inspection script confirmed the `targetPopulation` data patterns above before writing the filter (then deleted — never committed). A direct backend script (read-only, Prisma `findFirst`/`findMany`/`groupBy` only) verified relevance filtering and the top-10/rank-11 behavior against real local data before browser QA; also deleted after use. Browser QA via a headless-Chromium Playwright script (no `chromium-cli` available in this environment) against a freshly rebuilt dev server (`rm -rf .next` + restart, avoiding the dev-cache staleness gotcha noted in the original Phase 2E-1 implementation): all 7 linked holdings render `comparisonStatus: "available"` on both `/managed-savings` (he/RTL) and `/en/managed-savings` (en/LTR), zero console errors either locale, unlinked holdings still show no comparison section.
- **Wording**: uses only "above average"/"below average"/"same as average", "similar tracks", "informational only" phrasing (all via new `managedSavings.similarTracks.*` i18n keys) — no "recommended", "best", "you should switch/move", or "guaranteed" language anywhere.
- **Non-scope confirmed**: no Sharpe/Alpha/AUM/exposure/asset-composition display, no pie/donut charts, no new Prisma columns/migrations, no Data.gov.il live calls, no group-management work (cross-group drag-and-drop, delete-with-transfer — both remain deferred, see Phase 2D-2B/2D-2C above).
- **QA performed**: `npm run lint` (clean), `npx tsc --noEmit` (clean), `npm run build` (exit 0), `npm run db:validate` (schema unchanged/valid). Browser QA via a headless-Chromium Playwright script driving the running dev server (no `chromium-cli` available in this environment): expanded every holding row on both `/managed-savings` (he/RTL) and `/en/managed-savings` (en/LTR); all 7 currently-linked holdings resolved to `comparisonStatus: "available"` with real peer data (peer group sizes 16–45, strict match in all 7 cases); unlinked holdings correctly show no comparison section; zero browser console errors on either locale. **A stale Next.js dev data cache (`.next/dev/cache`, not the `.next/cache` build-cache directory) was found to silently serve pre-feature cached page data across dev-server restarts during this QA session — a full `rm -rf .next` was required to force a clean recompute. This is a local dev-environment gotcha, not a product bug** (the cache is correctly invalidated by `updateTag(MANAGED_SAVINGS_CACHE_TAG)` after real mutations in the running app; it only affects this session's manual QA against a server that was already running before the feature code existed).

**Phase 2E-1 second QA fix round (2026-07-13, same branch, later committed and merged into `master` as part of commit `6880796`):** Product Owner found the 5-year/12-month summary cards could be misread as raw returns rather than gaps versus the peer average. Fixed: card labels now explicitly say "gap" (`summaryFiveYear`/`summaryOneYear` reworded in both locales), values render with an explicit +/- sign via a new local `formatSignedPercent` helper (summary cards only — table cells unchanged), and a neutral subtext ("above/below/same as peer average") was added under each via new `returnAbovePeerAverage`/`returnBelowPeerAverage`/`returnSameAsPeerAverage` i18n keys. No peer algorithm, table columns, or schema changes. Verified via the same headless-Chromium browser QA approach on both locales, zero console errors; confirmed example values from the Product Owner's report (e.g. `+6.34%`/`-2.71%`) render correctly with signs and matching subtext.

## Context

This phase builds the implementation foundation for MyBalance in two sub-phases:

### Phase 1A (Completed)
Establishes the core infrastructure:
- Locale-aware routing (Hebrew-first, RTL-first)
- next-intl integration for i18n
- Translation message files (English and Hebrew)
- Locale direction handling
- Formatting helpers (currency, date, percent, number, month)
- Minimal placeholder page confirming foundation works

### Phase 1B (Completed)
Static dashboard UI with mock data showing:
- Total net worth
- Total assets
- Total liabilities
- Monthly change
- Asset allocation
- Major asset categories
- Major liability categories
- Recent snapshots / freshness indicators
- App shell with desktop sidebar and mobile drawer
- Responsive layout for desktop, tablet, and mobile

## Phase 1A: Built (Complete)

### Infrastructure
- Next.js App Router with TypeScript
- next-intl library with `localePrefix: "as-needed"` configuration
- Middleware for locale detection and routing
- Root path `/` serves Hebrew directly (unprefixed, canonical)
- Locale-aware route structure for (/he, /en):
  - [locale]/layout.tsx — locale-specific layout and lang/dir attributes
  - [locale]/page.tsx — locale-specific content
- Root layout.tsx — serves Hebrew as default for root path

### Internationalization
- Translation message files (src/messages/he.json, src/messages/en.json)
- Direction mapping (rtl for Hebrew, ltr for English)
- All UI text sourced from translation files
- No hardcoded text in components

### Helpers & Utilities
- Locale direction helper (getDirection)
- Formatting helpers:
  - formatCurrency (default: ILS)
  - formatPercent
  - formatDate
  - formatNumber
  - formatMonth
- Default locale: he-IL
- Default currency: ILS

### UI
- Minimal placeholder page
- Product name: MyBalance
- Subtitle from translations
- Foundation description
- No dashboard cards, charts, or financial data
- Clean informational wording (no financial advice)

## Phase 1B: Built and Ready for QA

Implemented:
- App shell with desktop sidebar and mobile drawer
- Dashboard summary cards (KPI cards with gradient styling)
- Net worth timeline chart (Recharts)
- Asset allocation donut chart (Recharts)
- Assets summary section
- Liabilities summary section
- Pension/Gemel section with compliance disclaimer
- Financial goals progress bars
- Data freshness status indicators
- Informational insights section
- Mock financial data (static, clearly marked as example data)
- Responsive layout (desktop, tablet, mobile)
- Complete Hebrew translation for UI
- English translation keys for future support
- 8 placeholder pages for future feature areas

### Do Not Build in Phase 1B

- Real database persistence (Phase 3+)
- Prisma schema changes (Phase 3+)
- Authentication (Phase 3+)
- CRUD forms (Phase 3+)
- Pension/Gemel API sync (Phase 4+)
- Open Banking (Phase 4+)
- AI recommendations (Phase 5+)
- Import/export (Phase 4+)
- Admin settings (Phase 6+)
- User roles (Phase 6+)
- Billing (Phase 6+)
- Production deployment (Phase 7)

## Phase 1A Acceptance Criteria (MET ✓)

- ✓ App runs locally with `npm run dev`
- ✓ `/` (root) displays Hebrew UI with RTL direction (unprefixed, canonical path)
- ✓ `/he` redirects to `/` (no separate Hebrew-prefixed route)
- ✓ `/en` displays English UI with LTR direction (locale-specific route)
- ✓ All user-facing text comes from translation files
- ✓ HTML lang and dir attributes set correctly for each route
- ✓ Layout works on desktop and mobile widths
- ✓ No financial advice language appears
- ✓ No DB/API/Auth/Dashboard implementation added
- ✓ No runtime errors on routes
- ✓ ESLint, TypeScript, build all pass

## Phase 1B Acceptance Criteria (READY FOR QA)

Met criteria:
- ✓ Dashboard displays with Hebrew UI and RTL
- ✓ Summary KPI cards show net worth, assets, liabilities, monthly change
- ✓ Charts render correctly (Recharts integrated)
- ✓ Mock financial data displays appropriately with example badge
- ✓ No real data persistence or authentication
- ✓ App shell with sidebar and mobile drawer
- ✓ Responsive layout on desktop, tablet, mobile
- ✓ All UI text from translation files
- ✓ No financial advice language
- ✓ Placeholder pages for all feature areas

## QA Requirements — Phase 1A (COMPLETED)

Checks run:
- ✓ `npm run lint` — passed
- ✓ `npm run build` — successful
- ✓ `npx tsc --noEmit` — no errors

Browser QA performed:
- ✓ `/` renders with Hebrew and RTL (direct, no redirect)
- ✓ `/` has lang="he" and dir="rtl" attributes
- ✓ `/he` redirects to `/` (307 redirect)
- ✓ `/en` renders with English and LTR
- ✓ `/en` has lang="en" and dir="ltr" attributes
- ✓ No runtime errors

## Phase 2A: Managed Savings Mock Experience

### Overview

Rich front-end mock experience for the Managed Savings page at canonical route `/managed-savings` (Hebrew) and `/en/managed-savings` (English). This is a feature-complete UI mock with client-side interactivity and mock data only — no database persistence, no real API integration, no Prisma changes, and no authentication required.

### Important: Pension Separated

**Pension investments have been intentionally separated from this page.** This page focuses exclusively on non-pension managed savings products:
- Keren Hishtalmut (סדרת עו״ש)
- Kupat Gemel (קופות גמל)
- Gemel LeHashkaa (גמל להשקעה)
- Savings Policies (פוליסות חיסכון)

A dedicated Pension page is planned as a future feature to handle pension-specific concepts like retirement age, pension conversion factors, and estimated monthly pension calculations.

### Implemented Features

**Page Structure:**
- Top summary area with 5 KPI cards:
  - Total current managed savings
  - Total monthly contributions
  - Projected value in 5 years
  - Projected value in 10 years
  - Projected value in custom time horizon (1-50 years)
- Interactive custom horizon control (1-50 years) affecting all projections
- NO estimated monthly pension card (pension-specific, removed)

**Main Investments Table:**
- Unified table for all managed savings products (non-pension only)
- Columns: name, ownership, type, company, track, current balance, monthly contribution, fees, historical returns, and multi-year projections
- Expandable rows showing detailed information

**Expandable Row Details:**
- Public track performance card (last month, 1Y, 3Y, 5Y, 10Y returns)
- Public data disclaimer note
- Last updated metadata line
- Smooth entry animation via CSS keyframe (`expandedRowIn`)

**Disclaimers & Safety Language:**
- Four prominent disclaimers about data being informational only
- No financial advice language
- Clear statement that MyBalance does not provide financial or pension advice

### Responsive Design

- Desktop: Full table layout with all columns visible
- Tablet: Some columns hidden, expandable rows provide details
- Mobile: Optimized layout with essential columns and full expandable row access

### i18n & RTL

- All 100+ UI strings sourced from translation files (no hardcoded text)
- Complete Hebrew translations
- Complete English translations
- Proper Hebrew RTL layout (dir="rtl") at `/managed-savings`
- Proper English LTR layout (dir="ltr") at `/en/managed-savings`

### Mock Data

6 realistic managed savings investments (non-pension only) with Hebrew names:
- 2 Keren Hishtalmut (self and spouse)
- 2 Kupat Gemel (children)
- 1 Gemel LeHashkaa (shared family)
- 1 Savings Policy (family)

Mock data includes realistic:
- Account balances and monthly contributions
- Management fees (accumulation and deposit)
- Public track performance data by product type
- Ownership labels (self, spouse, child, shared, family, other)
- Status indicators (active/inactive)
- Last update dates
- Official fund/track identifiers

### Routing & Architecture

- **Canonical Hebrew route:** `/managed-savings` (root level)
- **English route:** `/en/managed-savings` (locale-specific)
- **Optional Hebrew prefix:** `/he/managed-savings` (locale-specific, also works)
- Root-level page component at `src/app/managed-savings/page.tsx` ensures canonical routing (no AppShell wrapper - layout provides it)
- Locale-specific components at `src/app/[locale]/managed-savings/page.tsx` for explicit locale handling
- Navigation updated in Sidebar and MobileDrawer to point to `/managed-savings`
- Old `/pension-gemel` routes remain functional but are no longer primary navigation targets
- Shared reusable components: ManagedSavingsSummaryCards, ManagedSavingsTable, ExpandedManagedSavingsRow, ManagedSavingsSummaryTable

### Non-Scope

This phase explicitly does NOT include:
- **Pension investments** - Intentionally separated for a dedicated future Pension page
- Real database or Prisma schema
- API integration with Data.gov.il or any external data sources
- Real fund data sync or historical sync workflows
- Authentication or user accounts
- Persistent data storage (all edits reset on page refresh)
- Production-grade financial calculation engine
- Financial advisory or recommendation functionality
- Mobile app or desktop app
- Export/import functionality

### Acceptance Criteria

- ✓ `/managed-savings` renders Hebrew RTL version (canonical route)
- ✓ `/en/managed-savings` renders English LTR version
- ✓ `/pension-gemel` still functional as legacy compatibility route (not primary nav)
- ✓ Page includes top summary cards with 5 KPIs (no pension monthly estimate card)
- ✓ Single managed savings table with expandable rows (non-pension products only)
- ✓ Expanded rows show public track performance, disclaimer, and last updated metadata
- ✓ Add managed fund modal opens with animation, adds to local state
- ✓ Edit managed fund modal opens with animation, updates local state
- ✓ Client-side mock add/edit behavior — resets on refresh by design
- ✓ Public track performance metrics displayed in expanded row
- ✓ All UI text from i18n translation files
- ✓ Hebrew RTL layout proper
- ✓ English LTR layout proper
- ✓ Responsive on desktop, tablet, mobile
- ✓ No hardcoded visible UI text
- ✓ Mock data only, no backend calls
- ✓ Safe informational language, no financial advice
- ✓ No pension content on managed savings page

### QA Requirements — Phase 2A (COMPLETED)

Automated checks:
- ✓ `npm run lint` — passed (0 errors, 0 warnings)
- ✓ `npm run build` — successful (25 routes including `/managed-savings` and legacy `/pension-gemel`)
- ✓ `npx tsc --noEmit` — no errors

Browser QA performed:
- ✓ `/` Hebrew dashboard renders, no regressions
- ✓ `/managed-savings` returns HTTP 200, renders Hebrew RTL (canonical route)
- ✓ `/en/managed-savings` returns HTTP 200, renders English LTR
- ✓ `/en` English dashboard renders, no regressions
- ✓ `/pension-gemel` returns HTTP 200 (legacy route still functional)
- ✓ Navigation sidebar and mobile drawer updated to point to `/managed-savings`
- ✓ Summary KPI cards render correctly (no pension KPI card)
- ✓ Single managed savings table with expandable rows
- ✓ Expanded row shows public track performance with smooth entry animation
- ✓ Add fund modal opens with visible fade+scale animation
- ✓ Edit fund modal opens with visible fade+scale animation
- ✓ Product type dropdown shows translated labels (no raw translation keys)
- ✓ Table borders, zebra striping, column separators visible
- ✓ Client-side mock add/edit behavior works, resets on refresh
- ✓ No DB/API/Auth/persistence behavior
- ✓ No hardcoded visible UI text
- ✓ Single app shell (no duplication)
- ✓ Responsive layout on desktop, tablet, mobile

## Documentation Checklist

Updated for Phase 1A:
- ✓ `Context/current-feature.md` — Updated to reflect unprefixed Hebrew at root and new routing structure
- ✓ `Context/i18n-and-localization.md` — Updated to document unprefixed Hebrew at root and localePrefix: "as-needed"

Updated for Phase 1B:
- ✓ `Context/current-feature.md` — Updated to reflect Phase 1B completion and visual design updates
- ✓ `Context/Features/dashboard-feature-spec.md` — Documented visual design system, typography, colors, gradients, layout, card system, navigation, charts

Phase 1B Visual Design Enhancements:
- Implemented Lovable fintech design system with oklch color space
- Added Heebo font for Hebrew-first typography
- Semantic financial category gradients (networth, asset, liability, goal, pension, cash)
- Soft pastel app background gradient
- Rounded-3xl card styling with shadow-card soft shadows
- Real lucide-react icons replacing placeholders
- Active navigation state with gradient backgrounds and accent bars
- Improved KPI card styling with icon bubbles and trend indicators
- Responsive layout optimization for desktop (1440px), tablet (768-1024px), mobile (390-430px)

Updated for Phase 2A (Refactored):
- ✓ `Context/current-feature.md` — Updated to document Phase 2A as Managed Savings Mock Experience (refactored from Pension & Gemel)
- ✓ `src/messages/he.json` — Updated navigation label from "פנסיה וגמל" to "חיסכון מנוהל"
- ✓ `src/messages/en.json` — Updated navigation label from "Pension & Gemel" to "Managed Savings"
- ✓ Sidebar and MobileDrawer — Updated route links from `/pension-gemel` to `/managed-savings`

Checked but not updated:
- `Context/coding-standards.md` — Standards being followed
- `Context/security-and-privacy.md` — No security/privacy issues identified
- `Context/i18n-and-localization.md` — Locale architecture unchanged
- `Context/Features/pension-gemel-sync-feature-spec.md` — Sync feature is future phase; Managed Savings mock experience is independent
- `Context/Features/dashboard-feature-spec.md` — Dashboard design system already documented for Phase 1B; Managed Savings reuses same system

---

## Phase 2B: Managed Savings Persistence Foundation

### Status

Phase 2B-1 (Infrastructure / Schema / Seed) — **COMPLETED AND VERIFIED** (2026-06-29)
Phase 2B-2 (Server Actions / UI DB Connection) — **IN PROGRESS** (2026-06-29)

### Phase 2B-1: Completed (2026-06-29)

Infrastructure, schema, and seed only. No UI DB connection, no server actions, no Auth.js.

#### Core infrastructure
- Prisma installed (v7) with PostgreSQL provider (`prisma` dev, `@prisma/client` runtime).
- `@prisma/adapter-pg` and `pg` installed for Prisma v7 adapter pattern.
- `zod`, `react-hook-form`, `@hookform/resolvers`, `tsx` installed.
- `prisma/schema.prisma` — User and ManagedSavingsHolding models with all planned fields.
- `prisma.config.ts` — Prisma v7 config with schema path and datasource URL.
- `src/lib/db/prisma.ts` — singleton Prisma client using adapter pattern, hot-reload safe.
- `src/lib/financial/units.ts` — `toMinorUnits`, `fromMinorUnits`, `percentToBps`, `bpsToPercent`.
- `prisma/seed.ts` — seeds 1 dev user + 8 managed savings holdings from Phase 2A mock data.

#### Local PostgreSQL workflow
- `docker-compose.yml` — local PostgreSQL 16 container (`mybalance_local`, host port 5433 → container port 5432), persistent volume. Host port 5433 is used because native PostgreSQL 18 is installed on this machine and occupies port 5432.
- `.env.example` — updated with local DB URL (matches Docker Compose) and Neon placeholder.
- Local DB is isolated from Neon — data is not shared between environments.
- Neon migrations use `migrate deploy` only (not `migrate dev`).
- `package.json` — `db:local:up/down/logs`, `db:migrate:local`, `db:seed:local`, `db:studio:local`, `db:migrate:deploy`, `db:generate`, `db:validate` scripts added.

#### Status (verified 2026-06-29)
- Docker Desktop v29.5.3 running. WSL2 was installed between sessions — Docker daemon now operational.
- Local PostgreSQL container starts successfully on host port **5433** (not 5432). Native PostgreSQL 18 is installed on this machine and occupies port 5432 — host port 5433 was chosen to avoid the conflict.
- Migration applied: `prisma/migrations/20260629090812_init_managed_savings/` created and applied.
- Seed verified: 1 dev user (`dev@mybalance.local`) + 8 holdings (hishtalmut×2, gemel×3, hashkaa×1, savings×2).
- Prisma format, validate, generate all passed.
- lint, tsc --noEmit, build all passed. Pre-existing ENVIRONMENT_FALLBACK build warning is unrelated to this task.
- `prisma.config.ts` updated with two fixes: `dotenv/config` import (Prisma v7 CLI does not auto-load `.env`), and `migrations.seed` config (Prisma v7 reads seed from config file, not `package.json`).
- `.gitignore` updated: added `!.env.example` negation so the example template file can be committed.

#### Port note
Host port **5433** is used instead of the default 5432. Native PostgreSQL 18 (`postgresql-x64-18` service) runs on this machine and occupies port 5432. The Docker Compose config maps `5433:5432` — the container still runs PostgreSQL on its internal port 5432.

#### Quick start
```bash
cp .env.example .env           # already has correct local DB URL (port 5433)
npm run db:local:up             # start PostgreSQL container (port 5433)
npm run db:migrate:local        # apply migration (creates tables)
npm run db:seed:local           # seed 1 dev user + 8 holdings
npm run db:studio:local         # open Prisma Studio to inspect data
```

### Goal

Convert the approved Managed Savings mock page into a DB-backed single-user/dev persistence experience. User-entered holdings will be stored in and loaded from a PostgreSQL database via Prisma server actions.

### Scope

- Bootstrap Prisma with PostgreSQL.
- Add a User stub model for future Auth.js compatibility.
- Add a ManagedSavingsHolding model for personal managed savings holdings.
- Store user-entered holdings in DB via server actions.
- Load holdings from DB on the Managed Savings page.
- Create/update/archive holdings through server actions.
- Use Zod validation for all writes.
- Add a `notes` field to each holding — optional, personal, displayed in expanded row only (not in main table).
- Allow notes to be edited through the edit modal or an appropriate expanded-row edit interaction.
- Keep `officialFundId` as optional preparation for future Data.gov.il / GemelNet matching.
- Keep public track performance as mock/fallback data until Phase 2C.
- Preserve the current UI direction as much as possible.
- Keep add/edit modals.
- Keep expanded row minimal.

### Phase 2B-2: In Progress (2026-06-29)

Server actions, Zod validation, cached DB reads, and DB-backed Managed Savings page.

#### Files created
- `src/lib/managed-savings/dev-user.ts` — Dev user helper (resolves `dev@mybalance.local`). TODO comment to replace with `session.user.id` when Auth.js is introduced.
- `src/lib/managed-savings/serializers.ts` — Maps Prisma `ManagedSavingsHolding` records to `ManagedSavingsInvestment` UI type. Converts BigInt minor units to ILS numbers, bps to percent. Track performance is mock fallback until Phase 2C.
- `src/lib/validation/managed-savings.ts` — Zod schemas: `CreateManagedSavingsSchema`, `UpdateManagedSavingsSchema`, `ArchiveManagedSavingsSchema`. Form validates UI values (ILS amounts, % fees). Server actions convert to minor units/bps.
- `src/lib/data/managed-savings.ts` — Cached data access layer using `unstable_cache`. Cache key: `managed-savings-dev-user`. Cache tag: `managed-savings:dev-user`. Sorted by `createdAt asc`. Excludes archived holdings. Invalidated via `revalidateTag` after any write.
- `src/lib/actions/managed-savings-actions.ts` — Server actions: `createManagedSavingsHolding`, `updateManagedSavingsHolding`, `archiveManagedSavingsHolding`. All validate with Zod, check ownership, convert units, call `revalidateTag` on success.
- `src/components/managed-savings/ManagedSavingsPageClient.tsx` — Client wrapper receiving `initialInvestments` from server. Calls `router.refresh()` after successful mutations to reload fresh server data.

#### Files updated
- `src/lib/mock/managed-savings-data.ts` — Added `notes?: string` to `ManagedSavingsInvestment` interface.
- `src/app/managed-savings/page.tsx` — Refactored from `"use client"` to async server component. Fetches holdings via `getManagedSavingsHoldingsForCurrentDevUser()` and renders `ManagedSavingsPageClient`.
- `src/app/[locale]/managed-savings/page.tsx` — Same refactoring as canonical route.
- `src/components/managed-savings/AddManagedFundModal.tsx` — Now calls `createManagedSavingsHolding` server action. Added notes textarea and owner dropdown. Removed mock-only behavior.
- `src/components/managed-savings/EditManagedFundModal.tsx` — Now calls `updateManagedSavingsHolding` and `archiveManagedSavingsHolding`. Fixed type field from free text to dropdown. Added notes textarea, owner dropdown, and archive button (two-click confirm).
- `src/components/managed-savings/ExpandedManagedSavingsRow.tsx` — Added notes section (shown only in expanded row, never in main table).
- `src/components/managed-savings/ManagedSavingsTable.tsx` — Fixed hardcoded Hebrew product labels to use i18n. Removed vestigial `onInvestmentChange` usage.
- `src/messages/he.json` — Added: `table.investmentsCount`, `emptyState`, `emptyStateSubtitle`, `errors.*`, `modal.archive`, `modal.archiveConfirm`, `modal.ownership`, `modal.notes`, `modal.notesPlaceholder`, `expandedView.notes`, `expandedView.noNotes`. Updated `modal.mockDataNote` to reflect DB persistence.
- `src/messages/en.json` — Same additions.

#### Cache and invalidation design
- DB read function: `getManagedSavingsHoldingsForCurrentDevUser` in `src/lib/data/managed-savings.ts`
- Cache mechanism: Next.js `unstable_cache` (server-side, not browser storage)
- Cache key: `["managed-savings-dev-user"]`
- Cache tag: `managed-savings:dev-user`
- Invalidation: `revalidateTag("managed-savings:dev-user")` called in all three server actions after successful DB write
- Page refresh after mutation: client calls `router.refresh()` to trigger server component re-render with fresh cached data
- Result: repeated page loads use cached data; DB is only re-queried after a write mutation invalidates the cache
- Admin cache UI: deferred (not in Phase 2B scope)
- TODO in code: replace dev-user cache tag with `managed-savings:user:${userId}` when Auth.js is introduced

### Non-Scope

- No Data.gov.il API calls.
- No GemelNet/PensionNet sync.
- No PublicFund or FundReturn model implementation.
- No dedicated Pension page.
- No Auth.js production login.
- No multi-user production isolation.
- No net worth snapshot integration.
- No import/export.
- No fund comparison mode.
- No production-grade financial calculation engine.
- No financial advice or recommendation language.

### Acceptance Criteria

- [ ] Prisma is bootstrapped with a PostgreSQL connection.
- [ ] User stub model exists (id, email, name, createdAt, updatedAt).
- [ ] ManagedSavingsHolding model exists with all planned fields including `notes`.
- [ ] Holdings are loaded from DB on the Managed Savings page.
- [ ] Add modal creates a DB record via server action.
- [ ] Edit modal updates a DB record via server action.
- [ ] Archive/delete removes or archives a holding via server action.
- [ ] All writes validated with Zod.
- [ ] Notes field displayed in expanded row only.
- [ ] Notes editable through edit modal.
- [ ] Public track performance remains mock/fallback.
- [ ] No financial advice language.
- [ ] Hebrew RTL and English LTR layouts preserved.
- [ ] No regressions on dashboard or other pages.

### QA Requirements

- `npm run lint` — must pass
- `npm run build` — must pass
- `npx tsc --noEmit` — must pass
- Browser QA: load page, add holding, edit holding, verify persistence after refresh
- Confirm no data leakage in URLs or logs

### Phase 2B-2 QA Fixes (applied 2026-06-29)

Two rounds of QA fixes applied on the same branch (`feature/managed-savings-actions`):

#### Fix Round 1 — Immediate UI updates and delete confirmation modal

- **Problem**: Add/edit/archive mutations required a manual browser refresh to see changes. `router.refresh()` is async and doesn't immediately update the visible list.
- **Fix**: `ManagedSavingsPageClient` now holds local `useState(initialInvestments)`. Server actions (`createManagedSavingsHolding`, `updateManagedSavingsHolding`) return the serialized holding in the `ok: true` branch. Handlers update local state immediately, then call `router.refresh()` in background.
- **Problem**: Archive button used a two-click inline confirm ("ארכב" → "לאשר ארכוב?") with incorrect language.
- **Fix**: Replaced with a single "מחק חיסכון" / "Delete holding" button in the edit modal footer. Clicking it opens a new `DeleteHoldingConfirmModal` component. The holding is soft-archived (status = `archived`), not hard-deleted.
- **Files changed**: `managed-savings-actions.ts`, `ManagedSavingsPageClient.tsx`, `AddManagedFundModal.tsx`, `EditManagedFundModal.tsx`, new `DeleteHoldingConfirmModal.tsx`, `he.json`, `en.json`.

#### Fix Round 2 — English LTR layout and duplicate menu

- **Root cause 1 (duplicate menu)**: `app/[locale]/layout.tsx` rendered a full `<html><body>` + `RootLayoutProvider` → `AppShell` NESTED inside the root layout's `<html><body>` + AppShell. Two `AppShell` instances = two sidebars visible simultaneously.
- **Root cause 2 (English RTL)**: The nested `<html lang="en" dir="ltr">` from the locale layout was ignored by browsers (nested html is invalid). The root layout's outer `<html lang="he" dir="rtl">` always won. Additionally, `AppShell` had `dir="rtl"` hardcoded on its container div.
- **Root cause 3 (MobileDrawer hardcoded RTL)**: Drawer used `right-0` + `translate-x-full` (always slides from right). Navigation strings were hardcoded Hebrew, bypassing i18n.
- **Fixes**:
  - `app/layout.tsx` is now `async`, calls `getLocale()` from `next-intl/server` to set correct `lang` and `dir` dynamically for both Hebrew and English routes. Passes locale to `RootLayoutProvider`.
  - `app/[locale]/layout.tsx` stripped to a minimal pass-through: only calls `setRequestLocale(locale)` and returns `{children}`. No html/body/AppShell rendered.
  - `AppShell.tsx` — removed hardcoded `dir="rtl"` from flex container. Direction now inherited from `<html dir>`.
  - `Sidebar.tsx` — uses `useLocale()` for direction-aware active indicator (`start-0` logical property), gradient direction, and collapse chevrons.
  - `MobileDrawer.tsx` — uses `useLocale()` for direction-aware positioning (`right-0`/`left-0`) and slide transform. All hardcoded Hebrew strings replaced with `useTranslations("nav")` and `useTranslations("sidebar")`.
  - `he.json` + `en.json` — added `sidebar.close` key.
- **Side effect**: All previously-static SSG locale routes (`/[locale]/accounts`, `/[locale]/assets`, etc.) become `ƒ (Dynamic)` because the root layout reads from request headers. This is acceptable during development.
- **Files changed**: `app/layout.tsx`, `app/[locale]/layout.tsx`, `AppShell.tsx`, `Sidebar.tsx`, `MobileDrawer.tsx`, `he.json`, `en.json`.

#### Fix Round 3 — Locale resolution fix (route group architecture)

- **Root cause**: `getLocale()` in `app/layout.tsx` reads from a React `cache()` slot populated by `setRequestLocale()`. The root layout renders BEFORE the `[locale]` layout in Next.js App Router. For `/en/*` routes, `setRequestLocale("en")` in `[locale]/layout.tsx` runs too late — the root layout's `getLocale()` call already returned "he" (default), so English routes received Hebrew messages, RTL direction, and the Hebrew AppShell.
- **Fix — route group `(root)`**: Root layout is now truly minimal (`lang="he" dir="rtl"` static, no `getLocale()`, no `RootLayoutProvider`). Hebrew routes are wrapped by a new `app/(root)/layout.tsx` group layout that calls `setRequestLocale("he")` and renders `RootLayoutProvider("he")`. English routes keep `app/[locale]/layout.tsx` which calls `setRequestLocale(locale)` and renders `RootLayoutProvider(locale)`. Each shell layout owns its locale before rendering children.
- **Fix — `SetHtmlAttributes` client component**: Because the root `<html>` element is statically set to `lang="he" dir="rtl"`, English routes use a new `SetHtmlAttributes` client component that patches `document.documentElement.lang` and `document.documentElement.dir` after hydration.
- **Fix — `AppShell.tsx` direction-aware `dir` attribute**: Added `useLocale()` from next-intl and derives `dir` (`"rtl"` for Hebrew, `"ltr"` for English). Applied `dir={dir}` on the root flex container div so CSS direction cascade is correct even if the `<html dir>` attribute is patched asynchronously post-hydration.
- **Fix — page migrations to `(root)` group**: Moved `app/page.tsx`, `app/managed-savings/page.tsx`, and `app/pension-gemel/page.tsx` into `app/(root)/` route group. The `pension-gemel` page had a pre-existing double-AppShell bug (the page wrapped itself in `<AppShell>` while also being inside the root layout's `AppShell`); the `(root)` group layout now provides the single shell.
- **Files changed**: `app/layout.tsx` (rewritten minimal), new `app/(root)/layout.tsx`, new `app/(root)/page.tsx`, new `app/(root)/managed-savings/page.tsx`, new `app/(root)/pension-gemel/page.tsx` (AppShell wrapper removed), deleted `app/page.tsx`, deleted `app/managed-savings/page.tsx`, deleted `app/pension-gemel/page.tsx`, `app/[locale]/layout.tsx` (full English shell restored), new `src/components/layout/SetHtmlAttributes.tsx`, `AppShell.tsx` (added `useLocale()` + `dir` prop).

---

## Phase 2B-3: Managed Savings Hardening & QA Audit

### Status

**COMPLETED AND VERIFIED** (2026-06-29) — Product Owner QA approved. Changes committed to master.

### Goal

Fix audit findings identified after Phase 2B-2 was merged. Focus on UX correctness, projection consistency, i18n cleanup, validation hardening, and code quality. No new features, no schema changes, no external APIs.

### Scope

- **Delete/archive error feedback:** `DeleteHoldingConfirmModal` now shows a translated error message (`errors.archiveFailed`) when `archiveManagedSavingsHolding` returns `ok: false`. Modal stays open for retry.
- **Projection consistency:** Per-row projection columns in `ManagedSavingsTable` (1Y, 5Y, 10Y, 15Y, custom) now use `projectSimulations(investment, customYears)` — the same helper used by summary cards. Monthly contributions and accumulation fees are factored in. Hardcoded multipliers removed.
- **i18n — hardcoded strings:** Removed hardcoded English `sr-only "Expand"`, `sr-only "Actions"`, and `title="Edit"` from `ManagedSavingsTable`. Added translation keys `table.expandSr`, `table.actionsSr`, `table.editTitle` in both `he.json` and `en.json`.
- **i18n — duplicate key:** Removed stale string form `"mockActions": "פעולות"` / `"Mock Actions"` from `managedSavings.expandedView` in both translation files. Object form retained.
- **Pluralization:** `table.investmentsCount` updated to ICU plural syntax. Hebrew: `"{count, plural, one {קרן אחת} other {{count} קרנות}}"`. English: `"{count, plural, one {# fund} other {# funds}}"`. Component updated to use `t()` instead of `t.rich()`.
- **Loading states:** Add modal save button shows `modal.adding` ("מוסיף..." / "Adding...") while pending. Edit modal save button shows `modal.saving` ("שומר..." / "Saving...") while pending.
- **Section heading:** Page `h2` above the holdings table now uses `holdingsTitle` ("ההשקעות שלי" / "Your Holdings") instead of repeating `pageTitle`.
- **Validation hardening:** `CreateManagedSavingsSchema` and `UpdateManagedSavingsSchema` now enforce `currentBalance: max(50_000_000)` and `monthlyContribution: max(500_000)`. Fee max bounds unchanged at 5%.
- **Cleanup:** Removed dead `onInvestmentChange?` prop from `ManagedSavingsTable`. Removed unreachable `archived → inactive` status mapping in serializer (archived records are filtered out before serialization).

### Files Changed

Code:
- `src/components/managed-savings/DeleteHoldingConfirmModal.tsx` — error state
- `src/components/managed-savings/ManagedSavingsTable.tsx` — projections, sr-only, pluralization, dead prop
- `src/components/managed-savings/AddManagedFundModal.tsx` — loading state
- `src/components/managed-savings/EditManagedFundModal.tsx` — loading state
- `src/components/managed-savings/ManagedSavingsPageClient.tsx` — section heading
- `src/lib/validation/managed-savings.ts` — max value bounds
- `src/lib/managed-savings/serializers.ts` — dead code removal

Translations:
- `src/messages/he.json` — pluralization, new keys, duplicate key removal
- `src/messages/en.json` — same

### Non-Scope

- Phase 2C public fund sync
- Data.gov.il / GemelNet / PensionNet
- Auth.js / production multi-user isolation
- SSR raw `<html lang/dir>` fix for English routes
- Admin cache UI
- Import/export
- Pension page
- Visual redesign

### QA Requirements

- `npm run lint` — must pass
- `npx tsc --noEmit` — must pass
- `npm run build` — must pass
- `npm run db:validate` — must pass
- Browser QA on both Hebrew and English managed savings routes

---

## Phase 2C-1: Public Fund Schema and Resource Configuration

### Status

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved. Merged into `master`.

### Goal

Add the database schema and seed/config records needed for future public GemelNet/PensionNet fund sync. Schema/config foundation only.

### Scope

- Prisma models: `PublicFund`, `FundReturn`, `PublicDataResource`, `PublicDataSyncRun`.
- Enums: `PublicDataSource`, `PublicDataSyncStatus`, `PublicDataSyncTrigger`, `PublicFundProductType`.
- Seed: `PublicDataResource` config rows for the six confirmed Data.gov.il resource IDs (3 GemelNet periods + 3 PensionNet periods), idempotent upsert, no Data.gov.il calls made.
- Migration: `prisma/migrations/20260630125534_add_public_fund_schema/`.

### Non-Scope (deferred to later sub-phases)

- Data.gov.il API client / `datastore_search` calls (Phase 2C-2).
- Normalization logic, sync server actions, admin sync UI, scheduled sync (Phase 2C-2).
- Matching/linking UI and FK from `ManagedSavingsHolding` to `PublicFund` (Phase 2C-3).
- Replacing mock/fallback public track performance on the Managed Savings page (Phase 2C-2/2C-3).
- Any UI changes.

### Acceptance Criteria

- Prisma schema includes `PublicFund`, `FundReturn`, `PublicDataResource`, `PublicDataSyncRun` with correct enums, relationships, unique constraints, and indexes.
- Prisma migration created and applied locally.
- `prisma generate` and `prisma validate` pass.
- Existing `ManagedSavingsHolding` model and behavior unchanged; no FK added yet.
- Seed remains idempotent and includes `PublicDataResource` rows.
- No Data.gov.il calls made.
- No UI changes.

### QA Requirements

- `npm run db:validate` — must pass
- `npm run db:generate` — must pass
- `npm run db:migrate:local` — must pass (local DB available)
- `npm run db:seed:local` — must pass (local DB available)
- `npm run lint` — must pass
- `npx tsc --noEmit` — must pass
- `npm run build` — must pass

---

## Phase 2C-2: Public Fund Live Sync

### Status

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report. Merged into `master` from `feature/public-fund-sync`.

### Goal

First live sync from Data.gov.il into `PublicFund`/`FundReturn`, building on the Phase 2C-1 schema. Backend/data-layer only — no matching UI, no link from `ManagedSavingsHolding` to `PublicFund`, no change to the mock/fallback public performance display.

### Scope

- `src/lib/public-data/data-gov-client.ts` — typed CKAN `datastore_search` client (timeout/abort handling, treats HTTP-200-with-`success:false` as an error, sequential pagination via `paginateDatastoreSearch`).
- `src/lib/public-funds/types.ts` — raw GemelNet/PensionNet record types (all fields optional).
- `src/lib/public-funds/parsing.ts` — safe parsing helpers (`parseNumeric`, `parseString`, `parseReportPeriod`, `parseSourceDateTime`).
- `src/lib/public-funds/normalize-public-fund-record.ts` — single normalization function shared by GemelNet and PensionNet, branching only on the fields that actually differ (`PARENT_COMPANY_*` for PensionNet; `TARGET_POPULATION`/`SPECIALIZATION`/`SUB_SPECIALIZATION` for GemelNet). Skips rows missing required core fields (`FUND_ID`, `FUND_NAME`, `MANAGING_CORPORATION`, `REPORT_PERIOD`, `MONTHLY_YIELD`, `YEAR_TO_DATE_YIELD`). Leaves `productType` unset (stays null/unknown).
- `src/lib/public-funds/sync-public-funds.ts` — sync service: reads active `PublicDataResource` rows from DB, paginates CKAN records sequentially, normalizes, upserts `PublicFund` and `FundReturn`, writes `PublicDataSyncRun` lifecycle (`running` → `success`/`failed`), updates `PublicDataResource.lastSyncedAt`.
- `scripts/sync-public-funds.ts` + `npm run sync:public-funds:local` — manual CLI trigger. Defaults to current (`isCurrent=true`) GemelNet and PensionNet resources only. Optional `--source=gemelnet|pensionnet` / `--resourceId=<id>` flags. Prints a concise summary (no raw rows).

### Count strategy

`PublicFund` spans many report periods, so `insertedCount`/`updatedCount`/`skippedCount`/`errorCount` are tracked at `FundReturn` granularity (one CKAN row = one `FundReturn`). A `FundReturn` existence check runs before each upsert to classify insert vs. update. `PublicFund` itself is always upserted per row (to keep `lastSeenAt` current) but is not counted separately.

### Non-Scope (deferred to later sub-phases)

- Matching/linking UI and FK from `ManagedSavingsHolding` to `PublicFund` (Phase 2C-3).
- Replacing mock/fallback public track performance on the Managed Savings page (Phase 2C-3/2C-4).
- Scheduled sync (Vercel Cron).
- Historical (1999–2022) resource backfill by default.
- Admin sync UI (CLI trigger only in this phase).
- Reliable `productType` inference.
- AUM display in UI (units not display-approved).

### Local verification (2026-06-30)

Live sync run against current GemelNet (`a30dcbea-a1d2-482c-ae29-8f781f5025fb`) and PensionNet (`6d47d6b5-cb08-488b-b333-f1e717b1e1bd`) resources:
- GemelNet: inserted=19016, updated=0, skipped=1803, errors=0 (~156s)
- PensionNet: inserted=7804, updated=0, skipped=328, errors=0 (~77s)
- Resulting DB state:
  - `PublicDataResource` count: 6
  - `PublicFund` count: 1,106 (gemelnet=799 / pensionnet=307)
  - `FundReturn` count: 26,820 (gemelnet=19016 / pensionnet=7804)
  - `PublicDataSyncRun` count: 2 success rows
  - `lastSyncedAt` set on both current resources only (historical resources untouched)
- Skipped rows verified as legitimate (e.g., guaranteed-return tracks reporting `null` `MONTHLY_YIELD`/`YEAR_TO_DATE_YIELD` for that period), not a parsing defect.
- `ManagedSavingsHolding` unaffected — no rows created/modified/linked by the sync.

### Acceptance Criteria

- Data.gov.il client calls `datastore_search` only (confirmed: no `datastore_search_sql` usage anywhere in the new code).
- Current GemelNet and PensionNet resources can be synced manually via `npm run sync:public-funds:local`.
- Sync reads `PublicDataResource` config from DB — no resource IDs hardcoded in sync logic.
- Records normalized and upserted into `PublicFund` and `FundReturn`.
- `PublicDataSyncRun` created and completed with status/counts.
- `PublicDataResource.lastSyncedAt` updates on successful sync.
- Bad rows skipped/counted without crashing the whole sync.
- No personal holdings linked or modified.
- No UI behavior changes.

### QA Requirements

- `npm run db:validate` — must pass
- `npm run db:generate` — must pass
- `npm run lint` — must pass
- `npx tsc --noEmit` — must pass
- `npm run build` — must pass
- Local DB: `npm run db:migrate:local`, `npm run db:seed:local`, `npm run sync:public-funds:local` — must pass

---

## Phase 2C-3A: Public Fund Matching Search Backend

### Status

**COMPLETED AND VERIFIED** (2026-06-30). Product Owner approved the implementation report. Merged into `master` from `feature/public-fund-matching-search`.

### Goal

Provide a safe, local-DB-only search and candidate ranking layer over synced `PublicFund`/`FundReturn` records, as the backend foundation for a future matching/linking UI (Phase 2C-3B). No link is added from `ManagedSavingsHolding` to `PublicFund` in this phase.

### Scope

- `src/lib/public-funds/search-types.ts` — `PublicFundSearchInput`, `PublicFundMatchCandidate`, and `MatchReasonLabel` types. Internal match reason identifiers only — no user-facing text.
- `src/lib/public-funds/matching-normalization.ts` — local string normalization helpers (`normalizeForMatching`, `tokenizeForMatching`, `isNormalizedEqual`, `normalizedContains`, `trimAndCollapseWhitespace`) for Hebrew/English fund/company name matching. Comparison-only — never mutates stored values.
- `src/lib/public-funds/matching.ts` — `scorePublicFundCandidate`, a pure deterministic scoring function (exact fundId, exact/contains fund name, token overlap, managing company, controlling corporation, parent company, source, product type, recent-return tie-breaker).
- `src/lib/public-funds/search-public-funds.ts` — `searchPublicFundsForMatching`, the main search entry point. Local DB only via Prisma. Exact `fundId` lookup plus a bounded (`take: 200`) case-insensitive `contains` query across `fundName`/`managingCompany`/`controllingCorporation`/`parentCompanyName`, then in-memory scoring/ranking over the combined candidate pool. Enriches each candidate with the latest `FundReturn` (`reportPeriod desc`), excluding AUM fields.
- `src/lib/validation/public-fund-matching.ts` — `PublicFundSearchSchema` (Zod) for the server action.
- `src/lib/actions/public-fund-matching-actions.ts` — `searchPublicFundsForMatchingAction` server action. Validates with Zod, returns `{ ok: true, candidates }` or `{ ok: false, error: "validation" | "server_error" }`. No client/UI wiring in this phase.
- `scripts/search-public-funds.ts` + `npm run search:public-funds:local` — optional CLI smoke test. Prints concise rows only (score, source, fundId, managingCompany, fundName, latestReportPeriod), no raw DB records.

### Search behavior

- Default result limit 10, max 20.
- If both `query` and `fundId` are empty, returns `[]` immediately (no broad table scan).
- Exact `fundId` match always included if present, scored highest (`exact_fund_id`), regardless of whether `query` is also supplied.
- Text search runs only when `query` is non-empty; `source`/`managingCompany`/`productType` are optional narrowing filters. `productType` is not applied unless explicitly supplied, since most `PublicFund` rows have `productType = null`.
- Candidate pool capped at 200 rows from the DB before in-memory scoring (`MAX_CANDIDATE_POOL`).
- Ranking: `matchScore` desc, then `latestReportPeriod` desc, then `fundName` asc.

### Non-Scope (deferred to Phase 2C-3B / 2C-4)

- Matching/confirmation UI (no modal, no page changes).
- Confirm link / unlink actions.
- FK or relation from `ManagedSavingsHolding` to `PublicFund`.
- Replacing the mock/fallback public performance display on the Managed Savings page.
- Reliable `productType` inference.
- AUM display.
- Any Data.gov.il calls (this phase searches the local DB only).
- Prisma schema changes (none made in this phase).

### Acceptance Criteria

- Public fund search function exists and is typed.
- Search can find candidates by `fundId`.
- Search can find candidates by Hebrew fund/company query.
- Search supports `source` filtering.
- Search returns ranked candidates with `matchScore` and `matchReasonLabels`.
- Search enriches candidates with latest `FundReturn` metrics (AUM excluded).
- Search does not call Data.gov.il.
- Search does not modify `ManagedSavingsHolding`.
- No schema migration added.
- No UI changes.

### QA Requirements

- `npm run db:validate` — must pass
- `npm run db:generate` — must pass
- `npm run lint` — must pass
- `npx tsc --noEmit` — must pass
- `npm run build` — must pass
- Manual verification (if local DB has Phase 2C-2 synced data): exact `fundId` search, Hebrew company query (e.g. "הראל", "מגדל"), `source=gemelnet`, `source=pensionnet`.

### Local Search Verification (2026-06-30, re-verified at finalization)

Run against local DB with Phase 2C-2 synced data (`PublicFund`=1,106, `FundReturn`=26,820):
- Exact `fundId` search (`--fundId=101 --source=gemelnet`): 1 candidate returned, top score, correct fund.
- Hebrew query search (`--query="הראל"`): 10 ranked candidates returned, all matching company/fund names.
- `source=gemelnet` filter (`--query="מגדל" --source=gemelnet`): 10 gemelnet-only candidates, no pensionnet leakage.
- `source=pensionnet` filter (`--query="כלל" --source=pensionnet --limit=5`): 5 pensionnet-only candidates, custom limit respected.
- Empty/no-query edge case (no flags): 0 candidates returned, no broad DB scan triggered (confirms the empty-input short-circuit).
- No Data.gov.il calls made during any verification run — confirmed by code inspection (`search-public-funds.ts` only calls `prisma.publicFund`/`prisma.fundReturn`).

---

## Phase 2C-3B: Public Fund Matching UI + Confirm Link / Unlink

### Status

**COMPLETED AND VERIFIED** (2026-07-02). Product Owner browser QA approved. Committed and merged into `master` from `feature/public-fund-linking-ui`.

### Goal

Add a minimal, explicit, user-confirmed link from `ManagedSavingsHolding` to `PublicFund`, expose safe server actions for link/unlink, and add a matching/search UI in the Managed Savings expanded row using the Phase 2C-3A local search backend. Does not replace the mock/fallback public performance display and does not auto-link anything.

### Scope

- **Schema**: `ManagedSavingsHolding.publicFundId String?` (nullable FK to `PublicFund`, `onDelete: SetNull`, indexed). `PublicFund.managedSavingsHoldings` reverse relation added. `officialFundId` unchanged and unrelated — not repurposed. Migration: `prisma/migrations/20260630142325_add_public_fund_linking_to_managed_savings/`.
- **Server actions** (`src/lib/actions/public-fund-linking-actions.ts`): `linkManagedSavingsHoldingToPublicFund` and `unlinkManagedSavingsHoldingFromPublicFund`. Zod-validated (`src/lib/validation/public-fund-linking.ts`, both ids `z.string().min(1)` — `cuid()` was intentionally not used because seeded dev holdings use stable IDs like "hist-001" that fail cuid regex; security gate is the ownership check in the action body), ownership-checked against the dev user, reject linking archived holdings, verify the target `PublicFund` exists, update `publicFundId` only, call `revalidateTag`, return `{ ok: true, holding }` or `{ ok: false, error: "validation" | "not_found" | "unauthorized" | "server_error" }`. No DB errors or stack traces exposed to the client.
- **Data layer**: `src/lib/public-funds/latest-fund-returns.ts` — batch helper (`getLatestReportPeriodsByPublicFundIds`) to resolve each linked fund's latest `FundReturn.reportPeriod` without N+1 queries. `serializeHolding` (`src/lib/managed-savings/serializers.ts`) now accepts the Prisma-included `publicFund` relation and produces an optional `linkedPublicFund` field (`id`, `source`, `fundId`, `fundName`, `managingCompany`, `latestReportPeriod`, `latestMonthlyReturn`, `latestYtdReturn`, `latestAnnualized3YrReturn`, `latestAnnualized5YrReturn`), no AUM, no full `FundReturn` history. `getEffectiveAnnualReturn(investment)` in `src/lib/mock/managed-savings-data.ts` returns the linked fund's `latestAnnualized5YrReturn` when non-null, falling back to `investment.trackPerformance.last5Years` — used by `projectSimulations` so projections reflect live public data when linked. `fetchHoldingsForDevUser` (`src/lib/data/managed-savings.ts`) includes `publicFund` and batch-resolves latest report periods. `createManagedSavingsHolding`/`updateManagedSavingsHolding` (`src/lib/actions/managed-savings-actions.ts`) include `publicFund` and preserve/omit the link correctly (linking/unlinking is a separate action; add/edit never touches `publicFundId`).
- **UI**: `PublicFundMatchModal` (`src/components/managed-savings/PublicFundMatchModal.tsx`) — local-DB-only search via `searchPublicFundsForMatchingAction` (no Data.gov.il calls), prefilled query from track/company name, source filter defaulting to `gemelnet`, candidate cards showing fund identity and return metrics (no AUM), explicit "קשר לקרן זו" / "Link this fund" confirm button. `EditManagedFundModal` is the single management surface for link/change/unlink: shows source badge + action buttons + labelled metadata inset when linked, or a "Link to public fund data" button when unlinked. `ExpandedManagedSavingsRow` is read-only/summary only: shows a unified green card (KPI return metric cells + divider + labelled metadata row with Fund name / Managing company / Fund number / Last fund update + disclaimer) when linked, or a compact amber warning when unlinked — no link/change/unlink controls in the expanded row. Add/Edit modal full visual redesign (`bg-slate-50` outer, `bg-white shadow-sm rounded-2xl` section cards, `bg-slate-100/70` header bands, `h-11 border-slate-300` inputs, `font-bold uppercase` labels, `bg-white shadow-[0_-2px_10px_...]` sticky footer). Modal scrollbar polished with custom `modal-scrollbar` CSS utility (6px thumb, slate-300/400, Firefox `scrollbar-width: thin`). State changes propagate via `onInvestmentUpdate` threaded through `ManagedSavingsTable` → `ManagedSavingsPageClient`.
- **i18n**: New `managedSavings.publicFundLinking` namespace (and nested `sourceLabels`, `linkedSummary`, `modal`, `modal.candidate`) added to both `src/messages/he.json` and `src/messages/en.json`. No hardcoded UI text. Hebrew copy avoids "your return" / "best fund" framing; uses neutral phrasing ("נתוני קרן ציבוריים", "קשר לנתוני קרן ציבוריים") plus explicit disclaimers that linked data is public/fund-level-only and does not change personal balance or contributions.

### Non-Scope (deferred)

- Replacing the mock/fallback public performance display (Phase 2C-4).
- AUM display anywhere in the UI.
- Auto-linking / suggested-match acceptance without explicit user action.
- Any Data.gov.il calls (matching UI searches the local DB only, reusing Phase 2C-3A).
- Financial advice or fund-comparison language.

### Acceptance Criteria

- `publicFundId` FK added, nullable, `onDelete: SetNull`, indexed; `officialFundId` untouched.
- Link/unlink server actions are Zod-validated, ownership-checked, reject archived holdings, verify `PublicFund` existence, and never leak DB errors.
- Linking/unlinking only ever changes `publicFundId` — no other holding fields are touched.
- Matching UI is local-DB-only (no live Data.gov.il calls) and requires explicit user confirmation to link.
- No AUM field displayed anywhere in the matching or linked-summary UI.
- All new UI text sourced from `he.json`/`en.json` — no hardcoded strings.
- Existing add/edit/delete holding flows and the public performance display are unchanged.

### QA Requirements

- `npm run db:validate`, `npm run db:generate`, `npm run db:migrate:local`, `npm run db:seed:local` — must pass.
- `npm run lint`, `npx tsc --noEmit`, `npm run build` — must pass.
- Browser QA on `/managed-savings` and `/en/managed-savings`: open page, expand row, open matching modal, search, link, verify persistence after refresh, change link, unlink, verify add/edit/delete still work, verify no unintended change to the performance card, verify no cross-locale hardcoded text.

### Verification Performed

**Automated checks (final):**
- `npm run db:validate` — passed.
- `npm run db:generate` — passed (Prisma Client v7.8.0 generated cleanly).
- `npm run db:migrate:local` — passed (already in sync, no pending migrations).
- `npm run db:seed:local` — passed (6 PublicDataResource rows confirmed idempotent).
- `npm run lint` — passed, 0 errors/warnings.
- `npx tsc --noEmit` — passed, no errors (exit code 0).
- `npm run build` — passed (all routes compiled, pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only).

**Server action verification (Phase 2C-3B initial):**
- Direct DB verification: linking an active holding to a real `PublicFund` persists `publicFundId`; linking an archived holding rejected (`error: "validation"`); non-existent `publicFundId` rejected by Zod; unlinking clears `publicFundId` to `null`.

**Product Owner browser QA (2026-07-02, final approval):**
- Link/unlink working correctly.
- Regular edit (add/update holding) working correctly.
- Linked 5Y return displayed in table and projections updated correctly.
- Compact unlinked warning shown in expanded row.
- Linked public fund metadata displayed correctly in one labelled horizontal row.
- Add/Edit modal visual redesign accepted.
- Modal scrollbar polish accepted.

---

## Phase 2C-4A: Fund Return Query Hardening + Documentation Correction

### Status

**COMPLETED AND VERIFIED** (2026-07-06). Product Owner browser QA approved. Committed and merged into `master` from `feature/fund-return-query-hardening`.

### Goal

Backend/data-layer hardening of the latest-`FundReturn`-per-fund lookup, plus documentation correction. No UI changes. Follows the Phase 2C-4A Planning + Query Audit Report, which found that the previously-existing lookup pattern fetched every historical `FundReturn` row for a fund-id set and reduced it to "latest" in JS — safe at current data volumes (2 linked holdings, ≤29 rows each) but not scalable if historical backfill or many more linked holdings are added later.

### Scope

- **`getLatestFundReturnSummaries`** (`src/lib/public-funds/latest-fund-returns.ts`): replaced the `findMany({ orderBy: reportPeriod desc })` + JS reduce pattern with a single parameterized raw SQL query: `SELECT DISTINCT ON ("publicFundId") ... FROM "FundReturn" WHERE "publicFundId" = ANY($1::text[]) ORDER BY "publicFundId", "reportPeriod" DESC`, built via `Prisma.sql` (no string interpolation). Returns exactly one row per requested fund id. Empty input array short-circuits to an empty `Map` with no query executed. Output shape (`LatestFundReturnSummary`: `reportPeriod`, `monthlyReturn`, `ytdReturn`, `annualized3YrReturn`, `annualized5YrReturn`) is unchanged; Decimal-to-number conversion behavior preserved (raw numeric columns come back as strings from the pg driver and are converted via `Number()`, same as before).
- **`searchPublicFundsForMatching`** (`src/lib/public-funds/search-public-funds.ts`): the candidate-enrichment step no longer runs its own `prisma.fundReturn.findMany` fetch-all-then-reduce; it now calls the hardened `getLatestFundReturnSummaries` for the candidate fund-id set. `PublicFundMatchCandidate` output shape unchanged. The now-unused `toDecimalNumber` helper was removed as dead code.
- No Prisma schema/migration changes — the existing `@@unique([publicFundId, reportPeriod])` composite index already serves the `DISTINCT ON` query efficiently; no new index was needed.
- No UI changes: `ExpandedManagedSavingsRow`, `EditManagedFundModal`, `PublicFundMatchModal`, link/unlink behavior, `getEffectiveAnnualReturn`, `projectSimulations`, and the table's 5Y return column are all unchanged.
- No AUM, no average fee KPIs, no chart, no monthly history table — all confirmed non-scope for this phase.

### Verification Performed

Read-only local DB verification (no mutation):
- `getLatestFundReturnSummaries` for the 2 currently linked holdings' fund ids returned exactly 1 row per fund id, matching a manual `findFirst({ orderBy: reportPeriod desc })` cross-check for both funds (report period, monthly return values identical).
- Empty fund-id array input returned an empty `Map` with no query executed.
- `searchPublicFundsForMatching({ query: "הראל", source: "gemelnet" })` still returned ranked candidates enriched with latest return metrics (monthly/YTD/3Y/5Y annualized) after the change; no `assetsUnderManagement` key present on any returned candidate.

Automated checks:
- `npm run db:validate` — passed.
- `npm run db:generate` — passed.
- `npx tsc --noEmit` — passed.
- `npm run lint` — passed, 0 errors/warnings.
- `npm run build` — passed (pre-existing unrelated `ENVIRONMENT_FALLBACK` warning only).

### Non-Scope

- No UI redesign, no charts, no monthly history table, no AUM display, no `avgAnnualManagementFee`/`avgDepositFee` UI, no personal realized return calculation, no fund comparison ranking, no recommendations/advice, no automatic linking, no Data.gov.il sync, no scheduled sync, no admin sync UI, no Auth.js/multi-user work, no Open Banking.

### Acceptance Criteria

- Latest `FundReturn` summary lookup no longer fetches all historical rows per fund and reduces in JS — met (`DISTINCT ON` query).
- Search candidate enrichment no longer fetches all historical rows per candidate fund and reduces in JS — met (reuses hardened lookup).
- Existing linked public KPI display remains visually and functionally unchanged — met (no UI files touched).
- Existing matching/linking flow remains unchanged — met.
- Existing projection behavior remains unchanged — met (`getEffectiveAnnualReturn`/`projectSimulations` untouched).
- No AUM is serialized or displayed — confirmed via verification.
- Documentation accurately reflects that linked DB-backed KPI display was already delivered in Phase 2C-3B — corrected in this file and related docs.
- No advisory wording added — confirmed.

### QA Requirements

- `npm run db:validate`, `npm run db:generate`, `npx tsc --noEmit`, `npm run lint`, `npm run build` — all passed.
- Read-only local DB verification — passed (see above).
- Browser QA — smoke-only, since no UI changed; Product Owner should confirm `/managed-savings` and `/en/managed-savings` still load, the linked KPI card and unlinked warning render as before, and the search/link modal still opens.

### Follow-up QA Fix (2026-07-05, same branch)

Product Owner browser smoke QA found two issues in `PublicFundMatchModal` (`src/components/managed-savings/PublicFundMatchModal.tsx`), fixed on `feature/fund-return-query-hardening` without a new branch:

1. **Header/scroll overlap:** the modal header used `bg-gradient-to-r from-asset/15 via-asset/10 to-transparent` — translucent, so scrolled result rows showed through the header, especially near the transparent end of the gradient. Replaced with a fully opaque `bg-white border-b border-border/60 shadow-sm`, `z-20` (raised from `z-10`). Verified via headless-browser screenshot in both Hebrew RTL and English LTR that scrolled result text no longer overlaps the header/title/close button.
2. **PensionNet exposed in a non-pension modal:** the modal previously had a `select` dropdown offering "All / GemelNet / PensionNet". Since Managed Savings covers only non-pension products (Keren Hishtalmut, Kupat Gemel, Gemel LeHashkaa, Savings Policy), and GemelNet/PensionNet are data sources rather than product types, this was confusing and incorrectly allowed selecting a pension-specific source from this modal. The dropdown was removed (Option A from the fix prompt); the modal now always calls `searchPublicFundsForMatchingAction` with `source: "gemelnet"` internally. A new helper note (`modal.gemelnetOnlyNote` in `he.json`/`en.json`) clarifies the search covers the public GemelNet dataset and may include Keren Hishtalmut/Kupat Gemel/Gemel LeHashkaa where available — no claim that all product types are guaranteed present. No product-type filter was added, since `PublicFund.productType` inference remains unresolved/nullable.

Verified via headless-browser script (Playwright, ad hoc — not added as a project dependency) against the local dev server in both locales: no `select` element present in the modal, all returned candidate badges show "GemelNet"/"גמל-נט" only (never PensionNet), zero console errors, linked KPI card and unlinked amber warning both render unchanged, and the "Link this fund" confirm button is present and clickable. The backend (`searchPublicFundsForMatching`, `searchPublicFundsForMatchingAction`, Zod schema) still accepts and supports `pensionnet` for any future screen — only this modal's UI was restricted to GemelNet.

Automated checks re-run after the fix: `npm run db:validate`, `npm run db:generate`, `npx tsc --noEmit`, `npm run lint`, `npm run build` — all passed.
