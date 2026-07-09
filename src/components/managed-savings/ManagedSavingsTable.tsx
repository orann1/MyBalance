"use client";

import React, { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, TrendingUp, Edit2, Trash2, GripVertical, ArrowUp, ArrowDown, Link2, Info } from "lucide-react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { formatCurrency, formatPercent } from "@/lib/locale/formatters";
import { ExpandedManagedSavingsRow } from "./ExpandedManagedSavingsRow";
import {
  projectWithAvailableReturnOrZero,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";
import { getCompanyDisplay, formatCompanyNameForTable } from "@/lib/managed-savings/company-display";

interface ManagedSavingsTableProps {
  investments: ManagedSavingsInvestment[];
  customYears: number;
  onCustomYearsChange?: (years: number) => void;
  onEditClick?: (investment: ManagedSavingsInvestment) => void;
  onDeleteClick?: (investment: ManagedSavingsInvestment) => void;
  // Called with the full desired order of holding ids after a drag-and-drop
  // reorder or an up/down move. The caller owns persistence + optimistic state.
  onReorder?: (orderedIds: string[]) => void;
}

const TABLE_COLUMN_COUNT = 15;

function getProductColor(type: string): string {
  const colors: Record<string, string> = {
    hishtalmut: "bg-blue-100 text-blue-700",
    gemel: "bg-green-100 text-green-700",
    hashkaa: "bg-purple-100 text-purple-700",
    savings: "bg-orange-100 text-orange-700",
    other: "bg-gray-100 text-gray-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}

interface InvestmentRowProps {
  investment: ManagedSavingsInvestment;
  isFirst: boolean;
  isLast: boolean;
  expandedId: string | null;
  idx: number;
  typeLabels: Record<string, string>;
  projections: Record<string, Record<number, number>>;
  customYears: number;
  onToggleExpand: (id: string) => void;
  onEditClick?: (investment: ManagedSavingsInvestment) => void;
  onDeleteClick?: (investment: ManagedSavingsInvestment) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

function InvestmentRow({
  investment,
  isFirst,
  isLast,
  expandedId,
  idx,
  typeLabels,
  projections,
  customYears,
  onToggleExpand,
  onEditClick,
  onDeleteClick,
  onMoveUp,
  onMoveDown,
}: InvestmentRowProps) {
  const t = useTranslations("managedSavings");
  const tOwner = useTranslations("managedSavings.ownerLabels");
  const tOrdering = useTranslations("managedSavings.ordering");
  const isLinked = investment.linkedPublicFund != null;
  const companyDisplay = getCompanyDisplay(investment);
  const rowProjection = projections[investment.id];

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: investment.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <React.Fragment>
      <tr
        ref={setNodeRef}
        style={style}
        className={cn(
          "border-b border-border/50 transition-all cursor-pointer",
          expandedId === investment.id
            ? "bg-asset/8 border-b-2 border-asset/40 ring-1 ring-asset/30"
            : "hover:bg-secondary/50",
          idx % 2 === 0 ? "bg-white/70" : "bg-secondary/8"
        )}
        onClick={() => onToggleExpand(investment.id)}
      >
        <td className="h-14 px-2 py-3 text-center border-e border-border/15">
          <div className="flex items-center justify-center gap-1">
            {/* Desktop: drag handle (also keyboard-operable via dnd-kit's keyboard sensor) */}
            <button
              type="button"
              {...attributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
              className="hidden sm:inline-flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:bg-secondary/40 hover:text-foreground cursor-grab active:cursor-grabbing touch-none"
              title={tOrdering("dragHandle")}
              aria-label={tOrdering("dragHandle")}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            {/* Mobile/accessibility fallback: up/down buttons */}
            <div className="flex sm:hidden flex-col gap-0.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveUp(investment.id);
                }}
                disabled={isFirst}
                className="p-0.5 rounded text-muted-foreground hover:bg-secondary/40 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                title={tOrdering("moveUp")}
                aria-label={tOrdering("moveUp")}
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveDown(investment.id);
                }}
                disabled={isLast}
                className="p-0.5 rounded text-muted-foreground hover:bg-secondary/40 hover:text-foreground disabled:opacity-30 disabled:pointer-events-none"
                title={tOrdering("moveDown")}
                aria-label={tOrdering("moveDown")}
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </td>
        <td className="h-14 px-3 py-3 text-start border-e border-border/15">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              expandedId === investment.id && "rotate-180"
            )}
          />
        </td>
        <td className="h-14 px-3 py-3 text-start border-e border-border/15">
          <div className="flex flex-col gap-1">
            <span className="font-bold text-foreground">
              {investment.name}
            </span>
            <span
              className={cn(
                "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                isLinked
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              <Link2 className="h-2.5 w-2.5" />
              {isLinked ? t("table.linkedBadge") : t("table.unlinkedBadge")}
            </span>
          </div>
        </td>
        <td className="h-14 px-3 py-3 text-start border-e border-border/15">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-secondary/80 text-foreground border border-border/40">
            {tOwner(investment.owner)}
          </span>
        </td>
        <td className="h-14 px-3 py-3 text-start border-e border-border/15">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
              getProductColor(investment.type)
            )}
          >
            {typeLabels[investment.type] ?? investment.type}
          </span>
        </td>
        <td className="h-14 px-3 py-3 text-start border-e border-border/15">
          <div className="flex flex-col">
            <span className="text-xs font-medium">
              {formatCompanyNameForTable(companyDisplay.primary)}
            </span>
            <span className="text-xs text-muted-foreground">
              {companyDisplay.secondary}
            </span>
          </div>
        </td>
        <td className="h-14 px-3 py-3 text-end border-e border-border/15">
          <span className="font-mono font-bold text-asset">
            {formatCurrency(investment.currentBalance)}
          </span>
        </td>
        <td className="h-14 px-3 py-3 text-end border-e border-border/15">
          <span className="font-mono text-sm text-muted-foreground">
            {formatCurrency(investment.monthlyContribution)}
          </span>
        </td>
        <td className="h-14 px-3 py-3 text-end border-e border-border/15">
          <span className="font-mono text-xs text-muted-foreground">
            {investment.accumulationFeePercent.toFixed(2)}%
          </span>
        </td>
        <td className="h-14 px-3 py-3 text-end border-e border-border/15">
          {investment.linkedPublicFund?.latestAnnualized5YrReturn != null ? (
            <span className="font-mono text-sm text-green-600 font-semibold">
              {formatPercent(investment.linkedPublicFund.latestAnnualized5YrReturn)}
            </span>
          ) : (
            <span
              className="font-mono text-sm text-muted-foreground"
              aria-label={t("table.noReturnData")}
              title={t("table.noReturnData")}
            >
              —
            </span>
          )}
        </td>
        <td className="h-14 px-3 py-3 text-end border-e border-border/15">
          <span className="font-mono text-sm font-semibold text-goal">
            {formatCurrency(rowProjection[1] ?? 0)}
          </span>
        </td>
        <td className="h-14 px-3 py-3 text-end border-e border-border/15">
          <span className="font-mono text-sm font-semibold text-goal">
            {formatCurrency(rowProjection[5] ?? 0)}
          </span>
        </td>
        <td className="h-14 px-3 py-3 text-end border-e border-border/15">
          <span className="font-mono text-sm font-semibold text-goal">
            {formatCurrency(rowProjection[10] ?? 0)}
          </span>
        </td>
        <td className="h-14 px-3 py-3 text-end font-mono font-bold text-networth ps-4 border-s-2 border-networth/40">
          {formatCurrency(rowProjection[customYears] ?? 0)}
        </td>
        <td className="h-14 px-3 py-3 text-center">
          <div className="flex items-center justify-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEditClick?.(investment);
              }}
              className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-secondary/40 hover:text-foreground transition-colors"
              title={t("table.editTitle")}
              aria-label={t("table.editTitle")}
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteClick?.(investment);
              }}
              className="inline-flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
              title={t("table.deleteTitle")}
              aria-label={t("table.deleteTitle")}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </td>
      </tr>

      {expandedId === investment.id && (
        <tr>
          <td colSpan={TABLE_COLUMN_COUNT} className="p-0">
            <ExpandedManagedSavingsRow investment={investment} />
          </td>
        </tr>
      )}
    </React.Fragment>
  );
}

export function ManagedSavingsTable({
  investments,
  customYears,
  onCustomYearsChange,
  onEditClick,
  onDeleteClick,
  onReorder,
}: ManagedSavingsTableProps) {
  const t = useTranslations("managedSavings");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Pre-compute projections for every investment row. Uses
  // projectWithAvailableReturnOrZero — a holding with no eligible linked
  // return still gets a real projected currency value here (current balance
  // + accumulated contributions, 0% growth), not null/hidden (Phase 2D-1
  // zero-return-assumption fix). The raw 5-Year Return percentage column
  // remains a separate, strict "—"-when-unlinked display driven directly by
  // `investment.linkedPublicFund?.latestAnnualized5YrReturn`.
  const projections = useMemo(() => {
    const map: Record<string, Record<number, number>> = {};
    investments.forEach((inv) => {
      const sims = projectWithAvailableReturnOrZero(inv, customYears);
      map[inv.id] = {
        1: sims[1]?.projectedValue ?? 0,
        5: sims[5]?.projectedValue ?? 0,
        10: sims[10]?.projectedValue ?? 0,
        [customYears]: sims[customYears]?.projectedValue ?? 0,
      };
    });
    return map;
  }, [investments, customYears]);

  const typeLabels: Record<string, string> = {
    hishtalmut: t("tableColumns.typeHishtalmut"),
    gemel: t("tableColumns.typeGemel"),
    hashkaa: t("tableColumns.typeHashkaa"),
    savings: t("tableColumns.typeSavings"),
    other: t("tableColumns.typeOther"),
  };

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = investments.findIndex((inv) => inv.id === active.id);
    const newIndex = investments.findIndex((inv) => inv.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(investments, oldIndex, newIndex);
    onReorder?.(reordered.map((inv) => inv.id));
  };

  const handleMoveUp = (id: string) => {
    const index = investments.findIndex((inv) => inv.id === id);
    if (index <= 0) return;
    const reordered = arrayMove(investments, index, index - 1);
    onReorder?.(reordered.map((inv) => inv.id));
  };

  const handleMoveDown = (id: string) => {
    const index = investments.findIndex((inv) => inv.id === id);
    if (index === -1 || index >= investments.length - 1) return;
    const reordered = arrayMove(investments, index, index + 1);
    onReorder?.(reordered.map((inv) => inv.id));
  };

  // Table totals row — sums every visible (non-archived, already filtered by
  // the data loader) holding's current balance and projected values.
  // Holdings without a linked return contribute their 0%-growth projected
  // value (current balance + contributions) via projections[id], not zero
  // and not an exclusion (Phase 2D-1 zero-return-assumption fix).
  const totals = investments.reduce(
    (acc, inv) => {
      acc.currentBalance += inv.currentBalance;
      acc.in1Year += projections[inv.id]?.[1] ?? 0;
      acc.in5Years += projections[inv.id]?.[5] ?? 0;
      acc.in10Years += projections[inv.id]?.[10] ?? 0;
      acc.customYears += projections[inv.id]?.[customYears] ?? 0;
      return acc;
    },
    { currentBalance: 0, in1Year: 0, in5Years: 0, in10Years: 0, customYears: 0 }
  );

  return (
    <div className="rounded-3xl bg-card border border-border/60 shadow-card overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-secondary/60 to-secondary/30 border-b border-border/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-asset" />
            {t("pageTitle")}
          </h3>
          <div className="flex items-center gap-3">
            {/* Custom horizon control — attached to the table, not a
                disconnected top-page strip (Product QA fix round). */}
            <div className="flex items-center gap-2 rounded-lg bg-white/70 border border-border/40 px-3 py-1.5">
              <label htmlFor="managed-savings-custom-years" className="text-xs font-semibold text-foreground whitespace-nowrap">
                {t("customHorizon")}
              </label>
              <input
                id="managed-savings-custom-years"
                type="number"
                min="1"
                max="50"
                value={customYears}
                onChange={(e) => onCustomYearsChange?.(Math.max(1, Number(e.target.value)))}
                className="w-16 px-2 py-1 rounded-md border border-border bg-background text-xs font-mono font-semibold text-center focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-asset"
              />
              <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                {t("years")}
              </span>
            </div>
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {t("table.investmentsCount", { count: investments.length })}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{t("pageSubtitle")}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <DndContext
          id="managed-savings-holdings"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-secondary/40 border-b-2 border-border/80">
                <th className="h-12 px-2 py-3 text-center font-semibold text-muted-foreground w-12 border-e border-border/30">
                  <span className="sr-only">{t("table.reorderColumnSr")}</span>
                </th>
                <th className="h-12 px-3 py-3 text-start font-semibold text-muted-foreground w-10 border-e border-border/30">
                  <span className="sr-only">{t("table.expandSr")}</span>
                </th>
                <th className="h-12 px-3 py-3 text-start font-bold text-foreground border-e border-border/30 min-w-[130px] sm:min-w-[150px]">
                  {t("tableColumns.name")}
                </th>
                <th className="h-12 px-3 py-3 text-start font-semibold text-muted-foreground border-e border-border/30">
                  {t("tableColumns.ownership")}
                </th>
                <th className="h-12 px-3 py-3 text-start font-semibold text-muted-foreground border-e border-border/30">
                  {t("tableColumns.type")}
                </th>
                <th className="h-12 px-3 py-3 text-start font-semibold text-muted-foreground text-xs border-e border-border/30">
                  {t("tableColumns.company")}
                </th>
                <th className="h-12 px-3 py-3 text-end font-semibold text-muted-foreground border-e border-border/30">
                  {t("tableColumns.currentBalance")}
                </th>
                <th className="h-12 px-3 py-3 text-end font-semibold text-muted-foreground border-e border-border/30">
                  {t("tableColumns.monthlyContribution")}
                </th>
                <th className="h-12 px-3 py-3 text-end font-semibold text-muted-foreground text-xs border-e border-border/30">
                  {t("tableColumns.accumulationFee")}
                </th>
                <th className="h-12 px-3 py-3 text-end font-semibold text-asset border-e border-border/30">
                  {t("tableColumns.last5YearReturn")}
                </th>
                <th className="h-12 px-3 py-3 text-end font-semibold text-goal border-e border-border/30">
                  {t("tableColumns.in1Year")}
                </th>
                <th className="h-12 px-3 py-3 text-end font-semibold text-goal border-e border-border/30">
                  {t("tableColumns.in5Years")}
                </th>
                <th className="h-12 px-3 py-3 text-end font-semibold text-goal border-e border-border/30">
                  {t("tableColumns.in10Years")}
                </th>
                <th className="h-12 px-3 py-3 text-end font-bold text-networth ps-4 border-s-2 border-networth/40">
                  {t.rich("tableColumns.inCustomYears", { years: customYears })}
                </th>
                <th className="h-12 px-3 py-3 text-center font-semibold text-muted-foreground w-12">
                  <span className="sr-only">{t("table.actionsSr")}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={investments.map((inv) => inv.id)}
                strategy={verticalListSortingStrategy}
              >
                {investments.map((investment, idx) => (
                  <InvestmentRow
                    key={investment.id}
                    investment={investment}
                    isFirst={idx === 0}
                    isLast={idx === investments.length - 1}
                    expandedId={expandedId}
                    idx={idx}
                    typeLabels={typeLabels}
                    projections={projections}
                    customYears={customYears}
                    onToggleExpand={handleToggleExpand}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                  />
                ))}
              </SortableContext>
            </tbody>
            <tfoot>
              <tr className="bg-emerald-50/60 border-t-4 border-emerald-300/70 font-bold">
                <td className="h-12 px-2 py-3 border-e border-border/15" />
                <td className="h-12 px-3 py-3 border-e border-border/15" />
                <td className="h-12 px-3 py-3 text-start text-emerald-900 border-e border-border/15">
                  <span className="inline-flex items-center gap-1">
                    {t("table.totalsLabel")}
                    <span
                      title={t("table.projectionZeroReturnTitle")}
                      aria-label={t("table.projectionZeroReturnTitle")}
                      className="inline-flex"
                    >
                      <Info className="h-3.5 w-3.5 shrink-0 text-emerald-700/70" aria-hidden="true" />
                    </span>
                  </span>
                </td>
                <td className="h-12 px-3 py-3 border-e border-border/15" />
                <td className="h-12 px-3 py-3 border-e border-border/15" />
                <td className="h-12 px-3 py-3 border-e border-border/15" />
                <td className="h-12 px-3 py-3 text-end font-mono text-asset border-e border-border/15">
                  {formatCurrency(totals.currentBalance)}
                </td>
                <td className="h-12 px-3 py-3 border-e border-border/15" />
                <td className="h-12 px-3 py-3 border-e border-border/15" />
                <td className="h-12 px-3 py-3 border-e border-border/15" />
                <td className="h-12 px-3 py-3 text-end font-mono text-goal border-e border-border/15">
                  {formatCurrency(totals.in1Year)}
                </td>
                <td className="h-12 px-3 py-3 text-end font-mono text-goal border-e border-border/15">
                  {formatCurrency(totals.in5Years)}
                </td>
                <td className="h-12 px-3 py-3 text-end font-mono text-goal border-e border-border/15">
                  {formatCurrency(totals.in10Years)}
                </td>
                <td className="h-12 px-3 py-3 text-end font-mono text-networth ps-4 border-s-2 border-networth/40">
                  {formatCurrency(totals.customYears)}
                </td>
                <td className="h-12 px-3 py-3" />
              </tr>
            </tfoot>
          </table>
        </DndContext>
      </div>
    </div>
  );
}
