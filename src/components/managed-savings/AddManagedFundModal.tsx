"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { X, Plus, Building2, DollarSign, StickyNote, Link2, Unlink } from "lucide-react";
import { createManagedSavingsHolding } from "@/lib/actions/managed-savings-actions";
import { formatDate } from "@/lib/locale/formatters";
import { PublicFundMatchModal } from "./PublicFundMatchModal";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";
import type { CreateManagedSavingsInput } from "@/lib/validation/managed-savings";
import type { PublicFundMatchCandidate } from "@/lib/public-funds/search-types";

interface ManagedSavingsGroupOption {
  id: string;
  name: string;
}

// Static required-field marker — defined once at module scope (not as a
// component created during render) to avoid resetting state on every render.
const REQUIRED_MARKER = (
  <span className="text-red-600 ms-0.5" aria-hidden="true">
    *
  </span>
);

interface AddManagedFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: (holding: ManagedSavingsInvestment) => void;
  groups: ManagedSavingsGroupOption[];
  // Preselected when opened from a specific group's "Add holding" action
  // (including an empty group's empty state). Falls back to the first group
  // by display order when not provided.
  defaultGroupId?: string;
}

function buildEmptyForm(groupId: string): CreateManagedSavingsInput {
  return {
    name: "",
    type: "gemel",
    ownershipLabel: "",
    groupId,
    currentBalance: 0,
    monthlyContribution: 0,
    accumulationFeePercent: 0.5,
    depositFeePercent: 0,
    managingCompany: "",
    trackName: "",
    officialFundId: "",
    notes: "",
  };
}

export function AddManagedFundModal({
  isOpen,
  onClose,
  onAddSuccess,
  groups,
  defaultGroupId,
}: AddManagedFundModalProps) {
  const t = useTranslations("managedSavings");
  const tGroups = useTranslations("managedSavings.groups");
  const tValidation = useTranslations("managedSavings.validation");
  const tLink = useTranslations("managedSavings.publicFundLinking");
  const tSource = useTranslations("managedSavings.publicFundLinking.sourceLabels");
  const initialGroupId = defaultGroupId ?? groups[0]?.id ?? "";
  const [formData, setFormData] = useState<CreateManagedSavingsInput>(
    buildEmptyForm(initialGroupId)
  );
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Selected public fund is held locally only — nothing is linked/persisted
  // until the new holding is actually saved (select-only mode).
  const [selectedFund, setSelectedFund] = useState<PublicFundMatchCandidate | null>(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const handleChange = (
    field: keyof CreateManagedSavingsInput,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorKey(null);
  };

  const nameInvalid = showValidation && !formData.name.trim();
  const ownershipInvalid = showValidation && !formData.ownershipLabel.trim();
  const groupInvalid = showValidation && !formData.groupId;

  const handleAdd = () => {
    setErrorKey(null);
    if (!formData.name.trim() || !formData.ownershipLabel.trim() || !formData.groupId) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    startTransition(async () => {
      const payload: CreateManagedSavingsInput = {
        ...formData,
        officialFundId: formData.officialFundId || undefined,
        notes: formData.notes || undefined,
        managingCompany: formData.managingCompany || undefined,
        trackName: formData.trackName || undefined,
        publicFundId: selectedFund?.publicFundId,
      };
      const result = await createManagedSavingsHolding(payload);
      if (result.ok) {
        setFormData(buildEmptyForm(initialGroupId));
        setSelectedFund(null);
        onAddSuccess(result.holding);
      } else if (result.error === "invalid_group") {
        setErrorKey("groups.invalidGroupSelection");
      } else {
        setErrorKey("errors.createFailed");
      }
    });
  };

  if (!isOpen) return null;

  const fieldClass =
    "w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asset/40 focus:border-asset hover:border-slate-400 transition-colors";
  const fieldErrorClass =
    "w-full h-11 px-3.5 text-sm rounded-xl border border-red-400 bg-red-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-colors";
  const labelClass =
    "text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide";

  const secCard = "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden";
  const secHeader = "flex items-center gap-3 px-5 py-3.5 bg-slate-100/70 border-b border-slate-200";
  const secIcon = "rounded-full bg-white border border-slate-200 shadow-sm p-1.5 shrink-0";
  const secTitle = "text-sm font-bold text-slate-800";
  const secBody = "p-5 bg-white space-y-4";

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md modal-backdrop-in">
      <div className="rounded-3xl bg-slate-50 border border-slate-200 shadow-2xl w-full max-w-[740px] mx-4 max-h-[90vh] overflow-y-auto modal-panel-in modal-scrollbar">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="rounded-full bg-asset/15 border border-asset/20 p-2">
                  <Plus className="h-5 w-5 text-asset" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {t("modal.addFund")}
                </h2>
              </div>
              <p className="text-sm text-slate-500 ms-[52px]">
                {t("modal.addSubtitle")}
              </p>
              <p className="text-xs text-slate-400 ms-[52px] mt-1">
                {tValidation("requiredFieldsHelper")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl p-2 transition-colors shrink-0"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form body — bg-slate-50 inherited from outer div */}
        <div className="px-6 pt-5 pb-28 space-y-4">

          {/* 1. Holding Identity */}
          <div className={secCard}>
            <div className={secHeader}>
              <div className={secIcon}>
                <Plus className="h-4 w-4 text-asset" />
              </div>
              <h3 className={secTitle}>{t("modal.investmentIdentity")}</h3>
            </div>
            <div className={secBody}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.name")}
                    {REQUIRED_MARKER}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => setShowValidation(true)}
                    className={nameInvalid ? fieldErrorClass : fieldClass}
                    placeholder={t("modal.investmentNamePlaceholder")}
                    aria-required="true"
                    aria-invalid={nameInvalid}
                  />
                  {nameInvalid && (
                    <p className="text-xs text-red-600 mt-1">{tValidation("fieldRequired")}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.type")}
                    {REQUIRED_MARKER}
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      handleChange("type", e.target.value as CreateManagedSavingsInput["type"])
                    }
                    className={fieldClass}
                  >
                    <option value="hishtalmut">{t("tableColumns.typeHishtalmut")}</option>
                    <option value="gemel">{t("tableColumns.typeGemel")}</option>
                    <option value="hashkaa">{t("tableColumns.typeHashkaa")}</option>
                    <option value="savings">{t("tableColumns.typeSavings")}</option>
                    <option value="other">{t("tableColumns.typeOther")}</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>
                    {tGroups("groupSelectorLabel")}
                    {REQUIRED_MARKER}
                  </label>
                  <select
                    value={formData.groupId}
                    onChange={(e) => handleChange("groupId", e.target.value)}
                    onBlur={() => setShowValidation(true)}
                    className={groupInvalid ? fieldErrorClass : fieldClass}
                    aria-required="true"
                    aria-invalid={groupInvalid}
                  >
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                  {groupInvalid && (
                    <p className="text-xs text-red-600 mt-1">{tValidation("fieldRequired")}</p>
                  )}
                </div>
                <div>
                  <label className={labelClass}>
                    {tGroups("ownershipLabel")}
                    {REQUIRED_MARKER}
                  </label>
                  <input
                    type="text"
                    value={formData.ownershipLabel}
                    onChange={(e) => handleChange("ownershipLabel", e.target.value)}
                    onBlur={() => setShowValidation(true)}
                    className={ownershipInvalid ? fieldErrorClass : fieldClass}
                    placeholder={tGroups("ownershipPlaceholder")}
                    maxLength={80}
                    aria-required="true"
                    aria-invalid={ownershipInvalid}
                  />
                  {ownershipInvalid && (
                    <p className="text-xs text-red-600 mt-1">{tValidation("fieldRequired")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Fund Details */}
          <div className={secCard}>
            <div className={secHeader}>
              <div className={secIcon}>
                <Building2 className="h-4 w-4 text-asset" />
              </div>
              <h3 className={secTitle}>{t("modal.fundDetails")}</h3>
            </div>
            <div className={secBody}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("tableColumns.company")}</label>
                  <input
                    type="text"
                    value={formData.managingCompany ?? ""}
                    onChange={(e) => handleChange("managingCompany", e.target.value)}
                    className={fieldClass}
                    placeholder={t("modal.companyPlaceholder")}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("tableColumns.track")}</label>
                  <input
                    type="text"
                    value={formData.trackName ?? ""}
                    onChange={(e) => handleChange("trackName", e.target.value)}
                    className={fieldClass}
                    placeholder={t("modal.trackPlaceholder")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Personal Assumptions */}
          <div className={secCard}>
            <div className={secHeader}>
              <div className={secIcon}>
                <DollarSign className="h-4 w-4 text-asset" />
              </div>
              <h3 className={secTitle}>{t("modal.assumptions")}</h3>
            </div>
            <div className={secBody}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.currentBalance")}
                    {REQUIRED_MARKER}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentBalance}
                    onChange={(e) => handleChange("currentBalance", Number(e.target.value))}
                    className={fieldClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.monthlyContribution")}
                    {REQUIRED_MARKER}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.monthlyContribution}
                    onChange={(e) => handleChange("monthlyContribution", Number(e.target.value))}
                    className={fieldClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("tableColumns.accumulationFee")} %</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.01"
                    value={formData.accumulationFeePercent}
                    onChange={(e) => handleChange("accumulationFeePercent", Number(e.target.value))}
                    className={fieldClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("tableColumns.depositFee")} %</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.01"
                    value={formData.depositFeePercent}
                    onChange={(e) => handleChange("depositFeePercent", Number(e.target.value))}
                    className={fieldClass}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. Public Fund Data — select-only; only linked when the holding is saved */}
          <div className={secCard}>
            <div className={secHeader}>
              <div className={secIcon}>
                <Link2 className="h-4 w-4 text-asset" />
              </div>
              <h3 className={secTitle}>{tLink("sectionTitle")}</h3>
            </div>
            <div className="p-5 bg-white space-y-4">
              {selectedFund ? (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {tSource(selectedFund.source)}
                    </span>
                    <div className="ms-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowMatchModal(true)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        <Link2 className="h-3.5 w-3.5" />
                        {tLink("changeSelectedFundButton")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedFund(null)}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Unlink className="h-3.5 w-3.5" />
                        {tLink("removeSelectedFundButton")}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-1.5 pe-3">
                      <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-medium">
                        {tLink("linkedSummary.fundName")}:
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {selectedFund.fundName}
                      </span>
                    </div>

                    <span aria-hidden="true" className="hidden sm:block w-px h-3 bg-slate-300 shrink-0 me-3" />

                    <div className="flex items-center gap-1.5 pe-3">
                      <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-medium">
                        {tLink("linkedSummary.managingCompany")}:
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        {selectedFund.managingCompany}
                      </span>
                    </div>

                    <span aria-hidden="true" className="hidden sm:block w-px h-3 bg-slate-300 shrink-0 me-3" />

                    <div className="flex items-center gap-1.5 pe-3">
                      <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-medium">
                        {tLink("linkedSummary.fundId")}:
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900">
                        {selectedFund.fundId}
                      </span>
                    </div>

                    {selectedFund.latestReportPeriod && (
                      <>
                        <span aria-hidden="true" className="hidden sm:block w-px h-3 bg-slate-300 shrink-0 me-3" />
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-medium">
                            {tLink("linkedSummary.latestReportPeriod")}:
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-900">
                            {formatDate(new Date(selectedFund.latestReportPeriod), undefined, {
                              year: "numeric",
                              month: "2-digit",
                            })}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-xs text-blue-800 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                    {tLink("selectedPendingSaveNote")}
                  </p>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    {tLink("notLinkedDescription")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowMatchModal(true)}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-asset rounded-xl hover:bg-asset/85 transition-colors disabled:opacity-50"
                  >
                    <Link2 className="h-4 w-4" />
                    {tLink("linkButton")}
                  </button>
                </div>
              )}

              <p className="text-xs text-slate-400 border-t border-slate-100 pt-3 mt-1">
                {tLink("safetyNote")}
              </p>
            </div>
          </div>

          {/* 5. Personal Notes */}
          <div className={secCard}>
            <div className={secHeader}>
              <div className={secIcon}>
                <StickyNote className="h-4 w-4 text-asset" />
              </div>
              <h3 className={secTitle}>{t("modal.notes")}</h3>
            </div>
            <div className="p-5 bg-white">
              <textarea
                value={formData.notes ?? ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full px-3.5 py-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asset/40 focus:border-asset hover:border-slate-400 transition-colors resize-none"
                rows={3}
                maxLength={500}
                placeholder={t("modal.notesPlaceholder")}
              />
            </div>
          </div>

          {/* Persistence note */}
          <div className="rounded-2xl bg-blue-50 border border-blue-200/60 px-4 py-3">
            <p className="text-xs text-blue-800">{t("modal.mockDataNote")}</p>
          </div>

          {/* Validation summary — shown when a submit attempt found missing required fields */}
          {(nameInvalid || ownershipInvalid || groupInvalid) && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-xs text-red-700 font-medium">
                {tValidation("formHasErrors")}
              </p>
            </div>
          )}

          {/* Error */}
          {errorKey && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-xs text-red-700 font-medium">
                {t(errorKey as "errors.createFailed" | "groups.invalidGroupSelection")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-slate-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-6 py-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            {t("modal.cancel")}
          </button>
          <button
            onClick={handleAdd}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-bold text-white bg-asset rounded-xl hover:bg-asset/85 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isPending ? t("modal.adding") : t("modal.add")}
          </button>
        </div>
      </div>
    </div>

    {/* Match modal — select-only mode (no holding exists yet) */}
    {showMatchModal && (
      <PublicFundMatchModal
        investment={{ officialFundId: formData.officialFundId }}
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        onSelectCandidate={(candidate) => {
          setSelectedFund(candidate);
          setShowMatchModal(false);
        }}
      />
    )}
    </>
  );
}
