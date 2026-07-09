"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Info, Plus, CheckCircle2, XCircle } from "lucide-react";
import { ManagedSavingsSummaryCards } from "./ManagedSavingsSummaryCards";
import { ManagedSavingsBreakdownByType } from "./ManagedSavingsBreakdownByType";
import { ManagedSavingsTable } from "./ManagedSavingsTable";
import { ManagedSavingsSummaryTable } from "./ManagedSavingsSummaryTable";
import { EditManagedFundModal } from "./EditManagedFundModal";
import { AddManagedFundModal } from "./AddManagedFundModal";
import { DeleteHoldingConfirmModal } from "./DeleteHoldingConfirmModal";
import { reorderManagedSavingsHoldings } from "@/lib/actions/managed-savings-actions";
import { calculateManagedSavingsSummary } from "@/lib/managed-savings/summary";
import { cn } from "@/lib/utils";
import {
  calculateTotalSummary,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";

interface ManagedSavingsPageClientProps {
  initialInvestments: ManagedSavingsInvestment[];
}

export function ManagedSavingsPageClient({
  initialInvestments,
}: ManagedSavingsPageClientProps) {
  const t = useTranslations("managedSavings");
  const tOrdering = useTranslations("managedSavings.ordering");
  const router = useRouter();
  // Default custom horizon is 15 years — matches the table's dynamic
  // projection column default (Product QA fix round, 2026-07-06).
  const [customYears, setCustomYears] = useState(15);
  const [investments, setInvestments] = useState(initialInvestments);
  const [editingInvestment, setEditingInvestment] =
    useState<ManagedSavingsInvestment | null>(null);
  const [deletingInvestment, setDeletingInvestment] =
    useState<ManagedSavingsInvestment | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [reorderStatus, setReorderStatus] = useState<"saved" | "failed" | null>(null);
  const reorderStatusTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const summary = calculateManagedSavingsSummary(investments);

  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + inv.currentBalance,
    0
  );

  // Top KPI row shows a clear progression over time (current -> 1Y -> 5Y ->
  // 10Y); monthly contributions remain visible per-row and in the table
  // totals, just not as a top colored card (Product QA final visual round).
  const oneYearSummary = calculateTotalSummary(investments, 1);
  const fiveYearSummary = calculateTotalSummary(investments, 5);
  const tenYearSummary = calculateTotalSummary(investments, 10);

  const handleAddSuccess = (holding: ManagedSavingsInvestment) => {
    setInvestments((prev) => [...prev, holding]);
    setShowAddModal(false);
    router.refresh();
  };

  const handleEditSuccess = (holding: ManagedSavingsInvestment) => {
    setInvestments((prev) =>
      prev.map((inv) => (inv.id === holding.id ? holding : inv))
    );
    setEditingInvestment(null);
    router.refresh();
  };

  const handleDeleteRequest = (investment: ManagedSavingsInvestment) => {
    setEditingInvestment(null);
    setDeletingInvestment(investment);
  };

  const handleDeleteSuccess = (id: string) => {
    setInvestments((prev) => prev.filter((inv) => inv.id !== id));
    setDeletingInvestment(null);
    router.refresh();
  };

  const handleInvestmentUpdate = (holding: ManagedSavingsInvestment) => {
    setInvestments((prev) =>
      prev.map((inv) => (inv.id === holding.id ? holding : inv))
    );
    router.refresh();
  };

  const showReorderStatus = (status: "saved" | "failed") => {
    if (reorderStatusTimeout.current) clearTimeout(reorderStatusTimeout.current);
    setReorderStatus(status);
    reorderStatusTimeout.current = setTimeout(() => setReorderStatus(null), 3000);
  };

  const handleReorder = async (orderedIds: string[]) => {
    const previousInvestments = investments;
    // Optimistic update: reorder the local list immediately.
    const reordered = orderedIds
      .map((id) => previousInvestments.find((inv) => inv.id === id))
      .filter((inv): inv is ManagedSavingsInvestment => Boolean(inv));
    setInvestments(reordered);

    const result = await reorderManagedSavingsHoldings({ orderedIds });
    if (result.ok) {
      setInvestments(result.holdings);
      showReorderStatus("saved");
    } else {
      // Recover from server failure by reverting to the previous order.
      setInvestments(previousInvestments);
      showReorderStatus("failed");
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
          {t("pageTitle")}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {t("pageSubtitle")}
        </p>
      </div>

      {/* Summary Cards — compact, top-of-page KPIs only. The custom-horizon
          control now lives next to the table itself (see ManagedSavingsTable),
          not as a disconnected strip here. */}
      <ManagedSavingsSummaryCards
        totalCurrentValue={totalCurrentValue}
        projectedIn1Year={oneYearSummary.total}
        projectedIn5Years={fiveYearSummary.total}
        projectedIn10Years={tenYearSummary.total}
      />

      {/* Reorder save status — fixed near the top of the viewport so it
          stays clearly visible even if the user has scrolled down
          (Product QA final fix round). Larger and more prominent than the
          previous small inline pill. */}
      {reorderStatus && (
        <div className="fixed top-4 inset-x-0 z-[100] flex justify-center px-4 pointer-events-none">
          <div
            role="status"
            aria-live="polite"
            className={cn(
              "pointer-events-auto flex items-center gap-2.5 rounded-2xl border px-5 py-3 shadow-lg text-sm md:text-base font-semibold",
              reorderStatus === "saved"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            )}
          >
            {reorderStatus === "saved" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            {reorderStatus === "saved"
              ? tOrdering("orderSaved")
              : tOrdering("orderSaveFailed")}
          </div>
        </div>
      )}

      {/* Main Investments Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold">{t("holdingsTitle")}</h2>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-asset text-white font-medium text-sm hover:bg-asset/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            {t("addFundButton")}
          </button>
        </div>

        {investments.length === 0 ? (
          <div className="rounded-3xl bg-card border border-border/60 shadow-card p-12 text-center">
            <p className="text-lg font-semibold text-foreground mb-2">
              {t("emptyState")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("emptyStateSubtitle")}
            </p>
          </div>
        ) : (
          <ManagedSavingsTable
            investments={investments}
            customYears={customYears}
            onCustomYearsChange={setCustomYears}
            onEditClick={setEditingInvestment}
            onDeleteClick={handleDeleteRequest}
            onReorder={handleReorder}
          />
        )}
      </div>

      {/* Breakdown by Product Type — moved below the main table so it no
          longer delays the table (Product QA fix round, 2026-07-06). */}
      <ManagedSavingsBreakdownByType summary={summary} />

      {/* Summary Table */}
      {investments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">
            {t("projectionsLabel")}
          </h2>
          <ManagedSavingsSummaryTable
            investments={investments}
            customYears={customYears}
          />
        </div>
      )}

      {/* Disclaimers */}
      <div className="rounded-3xl bg-card border border-border/60 shadow-card p-4 md:p-6 space-y-4">
        <h3 className="font-bold text-base">{t("disclaimers.informational")}</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.noAdvice")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.publicData")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-asset shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              {t("disclaimers.simulation")}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editingInvestment && (
        <EditManagedFundModal
          investment={editingInvestment}
          isOpen={!!editingInvestment}
          onClose={() => setEditingInvestment(null)}
          onSaveSuccess={handleEditSuccess}
          onDeleteRequest={handleDeleteRequest}
          onInvestmentUpdate={handleInvestmentUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingInvestment && (
        <DeleteHoldingConfirmModal
          investment={deletingInvestment}
          isOpen={!!deletingInvestment}
          onClose={() => setDeletingInvestment(null)}
          onSuccess={handleDeleteSuccess}
        />
      )}

      {/* Add Modal */}
      <AddManagedFundModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSuccess={handleAddSuccess}
      />
    </div>
  );
}
