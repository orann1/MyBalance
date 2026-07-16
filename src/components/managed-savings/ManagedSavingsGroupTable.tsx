"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Edit2, Trash2, GripVertical, ArrowUp, ArrowDown, Link2 } from "lucide-react";
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
import { ManagedSavingsGroupSummaryRow } from "./ManagedSavingsGroupSummaryRow";
import {
  projectWithAvailableReturnOrZero,
  type ManagedSavingsInvestment,
} from "@/lib/mock/managed-savings-data";
import { getCompanyDisplay, formatCompanyNameForTable } from "@/lib/managed-savings/company-display";

interface ManagedSavingsGroupTableProps {
  groupId: string;
  investments: ManagedSavingsInvestment[];
  customYears: number;
  onEditClick?: (investment: ManagedSavingsInvestment) => void;
  onDeleteClick?: (investment: ManagedSavingsInvestment) => void;
  // Called with the full desired order of this group's holding ids after a
  // same-group drag-and-drop reorder or an up/down move. Cross-group moves
  // are not handled here (Phase 2D-2A) — use the Edit modal's group selector.
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
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold bg-secondary/80 text-foreground border border-border/40"
            title={investment.ownershipLabel}
          >
            {investment.ownershipLabel}
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

export function ManagedSavingsGroupTable({
  groupId,
  investments,
  customYears,
  onEditClick,
  onDeleteClick,
  onReorder,
}: ManagedSavingsGroupTableProps) {
  const t = useTranslations("managedSavings");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const projections: Record<string, Record<number, number>> = {};
  investments.forEach((inv) => {
    const sims = projectWithAvailableReturnOrZero(inv, customYears);
    projections[inv.id] = {
      1: sims[1]?.projectedValue ?? 0,
      5: sims[5]?.projectedValue ?? 0,
      10: sims[10]?.projectedValue ?? 0,
      [customYears]: sims[customYears]?.projectedValue ?? 0,
    };
  });

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

  return (
    // `contain-paint` (in addition to `overflow-x-auto`) is required, not
    // cosmetic: @dnd-kit/core's DndContext always renders a visually-hidden,
    // `position: fixed` accessibility live-region (`DndLiveRegion-*`) inside
    // this subtree. A `position: fixed` descendant is positioned relative to
    // the viewport/initial containing block and is NOT contained by an
    // ordinary ancestor's `overflow: auto/hidden` — its mere presence was
    // found (via bisection) to prevent this wrapper from properly isolating
    // the wide table's layout overflow from `document.documentElement.
    // scrollWidth`, inflating it far beyond the viewport on mobile even
    // though the table itself was still visually/interactively scoped
    // correctly. `contain: paint` additionally establishes this wrapper as
    // the containing block for fixed/absolute descendants, which resolves
    // it (verified: reduced document.documentElement.scrollWidth from 1276
    // to 390 on a 390px-wide viewport with two rendered groups).
    <div className="overflow-x-auto contain-paint">
      <DndContext
        id={`managed-savings-holdings-${groupId}`}
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
            <ManagedSavingsGroupSummaryRow investments={investments} customYears={customYears} />
          </tfoot>
        </table>
      </DndContext>
    </div>
  );
}
