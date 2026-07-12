"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  X,
  Edit3,
  Building2,
  DollarSign,
  StickyNote,
  Trash2,
  Link2,
  Unlink,
  Loader2,
} from "lucide-react";
import { updateManagedSavingsHolding } from "@/lib/actions/managed-savings-actions";
import { unlinkManagedSavingsHoldingFromPublicFund } from "@/lib/actions/public-fund-linking-actions";
import { formatDate } from "@/lib/locale/formatters";
import type { ManagedSavingsInvestment, LinkedPublicFund } from "@/lib/mock/managed-savings-data";
import type { UpdateManagedSavingsInput } from "@/lib/validation/managed-savings";
import { PublicFundMatchModal } from "./PublicFundMatchModal";

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

interface EditManagedFundModalProps {
  investment: ManagedSavingsInvestment;
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: (holding: ManagedSavingsInvestment) => void;
  onDeleteRequest: (investment: ManagedSavingsInvestment) => void;
  onInvestmentUpdate?: (holding: ManagedSavingsInvestment) => void;
  groups: ManagedSavingsGroupOption[];
}

function investmentToForm(
  inv: ManagedSavingsInvestment
): UpdateManagedSavingsInput {
  return {
    id: inv.id,
    name: inv.name,
    type: inv.type,
    ownershipLabel: inv.ownershipLabel,
    groupId: inv.groupId,
    currentBalance: inv.currentBalance,
    monthlyContribution: inv.monthlyContribution,
    accumulationFeePercent: inv.accumulationFeePercent,
    depositFeePercent: inv.depositFeePercent,
    managingCompany: inv.managingCompany || undefined,
    trackName: inv.track || undefined,
    officialFundId: inv.officialFundId || undefined,
    notes: inv.notes || undefined,
  };
}

export function EditManagedFundModal({
  investment,
  isOpen,
  onClose,
  onSaveSuccess,
  onDeleteRequest,
  onInvestmentUpdate,
  groups,
}: EditManagedFundModalProps) {
  const t = useTranslations("managedSavings");
  const tGroups = useTranslations("managedSavings.groups");
  const tValidation = useTranslations("managedSavings.validation");
  const tLink = useTranslations("managedSavings.publicFundLinking");
  const tLinkModal = useTranslations("managedSavings.publicFundLinking.modal");
  const tSource = useTranslations("managedSavings.publicFundLinking.sourceLabels");

  const [formData, setFormData] = useState<UpdateManagedSavingsInput>(
    investmentToForm(investment)
  );
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [currentLinkedFund, setCurrentLinkedFund] = useState<
    LinkedPublicFund | null | undefined
  >(() => investment.linkedPublicFund);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [confirmingUnlink, setConfirmingUnlink] = useState(false);
  const [unlinkError, setUnlinkError] = useState(false);
  const [isUnlinking, startUnlink] = useTransition();

  const handleChange = (
    field: keyof UpdateManagedSavingsInput,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorKey(null);
  };

  const nameInvalid = showValidation && !formData.name.trim();
  const ownershipInvalid = showValidation && !formData.ownershipLabel.trim();
  const groupInvalid = showValidation && !formData.groupId;

  const handleSave = () => {
    setErrorKey(null);
    if (!formData.name.trim() || !formData.ownershipLabel.trim() || !formData.groupId) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    startTransition(async () => {
      const payload: UpdateManagedSavingsInput = {
        ...formData,
        managingCompany: formData.managingCompany || undefined,
        trackName: formData.trackName || undefined,
        officialFundId: formData.officialFundId || undefined,
        notes: formData.notes || undefined,
      };
      const result = await updateManagedSavingsHolding(payload);
      if (result.ok) {
        onSaveSuccess(result.holding);
      } else if (result.error === "invalid_group") {
        setErrorKey("groups.invalidGroupSelection");
      } else {
        setErrorKey("errors.updateFailed");
      }
    });
  };

  const handleLinkSuccess = (holding: ManagedSavingsInvestment) => {
    setCurrentLinkedFund(holding.linkedPublicFund);
    setShowMatchModal(false);
    onInvestmentUpdate?.(holding);
  };

  const handleUnlinkConfirm = () => {
    setUnlinkError(false);
    startUnlink(async () => {
      const result = await unlinkManagedSavingsHoldingFromPublicFund({
        holdingId: investment.id,
      });
      if (result.ok) {
        setCurrentLinkedFund(null);
        setConfirmingUnlink(false);
        onInvestmentUpdate?.(result.holding);
      } else {
        setUnlinkError(true);
      }
    });
  };

  if (!isOpen) return null;

  // Shared field styles
  const fieldClass =
    "w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asset/40 focus:border-asset hover:border-slate-400 transition-colors";
  const fieldErrorClass =
    "w-full h-11 px-3.5 text-sm rounded-xl border border-red-400 bg-red-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500 transition-colors";
  const labelClass =
    "text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide";

  // Section card structure
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
                    <Edit3 className="h-5 w-5 text-asset" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {t("modal.editFund")}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 ms-[52px]">
                  {t("modal.editSubtitle")}
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
                  <Edit3 className="h-4 w-4 text-asset" />
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
                      placeholder={investment.name}
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
                        handleChange("type", e.target.value as UpdateManagedSavingsInput["type"])
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
                      placeholder={investment.managingCompany}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>{t("tableColumns.track")}</label>
                    <input
                      type="text"
                      value={formData.trackName ?? ""}
                      onChange={(e) => handleChange("trackName", e.target.value)}
                      className={fieldClass}
                      placeholder={investment.track}
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

            {/* 4. Public Fund Data */}
            <div className={secCard}>
              <div className={secHeader}>
                <div className={secIcon}>
                  <Link2 className="h-4 w-4 text-asset" />
                </div>
                <h3 className={secTitle}>{tLink("sectionTitle")}</h3>
              </div>
              <div className="p-5 bg-white space-y-4">
                {currentLinkedFund ? (
                  <>
                    {/* Source badge + management actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {tSource(currentLinkedFund.source)}
                      </span>

                      {!confirmingUnlink && (
                        <div className="ms-auto flex items-center gap-2">
                          <button
                            onClick={() => { setUnlinkError(false); setShowMatchModal(true); }}
                            disabled={isPending || isUnlinking}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            {tLink("changeLinkButton")}
                          </button>
                          <button
                            onClick={() => { setUnlinkError(false); setConfirmingUnlink(true); }}
                            disabled={isPending || isUnlinking}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            <Unlink className="h-3.5 w-3.5" />
                            {tLink("unlinkButton")}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Labelled metadata row */}
                    <div className="flex flex-wrap items-center gap-y-2 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-1.5 pe-3">
                        <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-medium">
                          {tLink("linkedSummary.fundName")}:
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {currentLinkedFund.fundName}
                        </span>
                      </div>

                      <span aria-hidden="true" className="hidden sm:block w-px h-3 bg-slate-300 shrink-0 me-3" />

                      <div className="flex items-center gap-1.5 pe-3">
                        <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-medium">
                          {tLink("linkedSummary.managingCompany")}:
                        </span>
                        <span className="text-xs font-semibold text-slate-900">
                          {currentLinkedFund.managingCompany}
                        </span>
                      </div>

                      <span aria-hidden="true" className="hidden sm:block w-px h-3 bg-slate-300 shrink-0 me-3" />

                      <div className="flex items-center gap-1.5 pe-3">
                        <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-medium">
                          {tLink("linkedSummary.fundId")}:
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {currentLinkedFund.fundId}
                        </span>
                      </div>

                      {currentLinkedFund.latestReportPeriod && (
                        <>
                          <span aria-hidden="true" className="hidden sm:block w-px h-3 bg-slate-300 shrink-0 me-3" />
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-slate-500 whitespace-nowrap shrink-0 font-medium">
                              {tLink("linkedSummary.latestReportPeriod")}:
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-900">
                              {formatDate(
                                new Date(currentLinkedFund.latestReportPeriod),
                                undefined,
                                { year: "numeric", month: "2-digit" }
                              )}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Unlink error */}
                    {unlinkError && (
                      <p className="text-xs text-red-700">{tLinkModal("errorUnlink")}</p>
                    )}

                    {/* Unlink confirmation */}
                    {confirmingUnlink && (
                      <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200/60 p-3">
                        <span className="text-xs text-red-800 flex-1">
                          {tLink("unlinkConfirmText")}
                        </span>
                        <button
                          onClick={() => setConfirmingUnlink(false)}
                          disabled={isUnlinking}
                          className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                        >
                          {tLink("unlinkCancelButton")}
                        </button>
                        <button
                          onClick={handleUnlinkConfirm}
                          disabled={isUnlinking}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          {isUnlinking && <Loader2 className="h-3 w-3 animate-spin" />}
                          {tLink("unlinkConfirmButton")}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-600">
                      {tLink("notLinkedDescription")}
                    </p>
                    <button
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
                  {t(
                    errorKey as
                      | "errors.updateFailed"
                      | "errors.archiveFailed"
                      | "errors.createFailed"
                      | "groups.invalidGroupSelection"
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-slate-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] px-6 py-4">
            <button
              onClick={() => onDeleteRequest(investment)}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {t("modal.deleteButton")}
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={isPending}
                className="px-4 py-2.5 text-sm font-semibold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                {t("modal.cancel")}
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-5 py-2.5 text-sm font-bold text-white bg-asset rounded-xl hover:bg-asset/85 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isPending ? t("modal.saving") : t("modal.save")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match modal — z-[70] renders above edit modal's z-50 */}
      {showMatchModal && (
        <PublicFundMatchModal
          investment={investment}
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          onLinkSuccess={handleLinkSuccess}
        />
      )}
    </>
  );
}
