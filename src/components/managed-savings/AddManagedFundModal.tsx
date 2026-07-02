"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { X, Plus, Building2, DollarSign, StickyNote } from "lucide-react";
import { createManagedSavingsHolding } from "@/lib/actions/managed-savings-actions";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";
import type { CreateManagedSavingsInput } from "@/lib/validation/managed-savings";

interface AddManagedFundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuccess: (holding: ManagedSavingsInvestment) => void;
}

const EMPTY_FORM: CreateManagedSavingsInput = {
  name: "",
  type: "gemel",
  owner: "self",
  currentBalance: 0,
  monthlyContribution: 0,
  accumulationFeePercent: 0.5,
  depositFeePercent: 0,
  managingCompany: "",
  trackName: "",
  officialFundId: "",
  notes: "",
};

export function AddManagedFundModal({
  isOpen,
  onClose,
  onAddSuccess,
}: AddManagedFundModalProps) {
  const t = useTranslations("managedSavings");
  const [formData, setFormData] = useState<CreateManagedSavingsInput>(EMPTY_FORM);
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleChange = (
    field: keyof CreateManagedSavingsInput,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorKey(null);
  };

  const handleAdd = () => {
    setErrorKey(null);
    startTransition(async () => {
      const payload: CreateManagedSavingsInput = {
        ...formData,
        officialFundId: formData.officialFundId || undefined,
        notes: formData.notes || undefined,
        managingCompany: formData.managingCompany || undefined,
        trackName: formData.trackName || undefined,
      };
      const result = await createManagedSavingsHolding(payload);
      if (result.ok) {
        setFormData(EMPTY_FORM);
        onAddSuccess(result.holding);
      } else {
        setErrorKey("errors.createFailed");
      }
    });
  };

  if (!isOpen) return null;

  const fieldClass =
    "w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asset/40 focus:border-asset hover:border-slate-400 transition-colors";
  const labelClass =
    "text-xs font-bold text-slate-700 mb-1.5 block uppercase tracking-wide";

  const secCard = "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden";
  const secHeader = "flex items-center gap-3 px-5 py-3.5 bg-slate-100/70 border-b border-slate-200";
  const secIcon = "rounded-full bg-white border border-slate-200 shadow-sm p-1.5 shrink-0";
  const secTitle = "text-sm font-bold text-slate-800";
  const secBody = "p-5 bg-white space-y-4";

  return (
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
                  <label className={labelClass}>{t("tableColumns.name")}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={fieldClass}
                    placeholder={t("modal.investmentNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("tableColumns.type")}</label>
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
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t("modal.ownership")}</label>
                  <select
                    value={formData.owner}
                    onChange={(e) =>
                      handleChange("owner", e.target.value as CreateManagedSavingsInput["owner"])
                    }
                    className={fieldClass}
                  >
                    <option value="self">{t("ownerLabels.self")}</option>
                    <option value="spouse">{t("ownerLabels.spouse")}</option>
                    <option value="child">{t("ownerLabels.child")}</option>
                    <option value="shared">{t("ownerLabels.shared")}</option>
                    <option value="family">{t("ownerLabels.family")}</option>
                    <option value="other">{t("ownerLabels.other")}</option>
                  </select>
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
                  <label className={labelClass}>{t("tableColumns.currentBalance")}</label>
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
                  <label className={labelClass}>{t("tableColumns.monthlyContribution")}</label>
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

          {/* 4. Personal Notes */}
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

          {/* Error */}
          {errorKey && (
            <div className="rounded-2xl bg-red-50 border border-red-200 px-4 py-3">
              <p className="text-xs text-red-700 font-medium">
                {t(errorKey as "errors.createFailed")}
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
            disabled={isPending || !formData.name.trim()}
            className="px-5 py-2.5 text-sm font-bold text-white bg-asset rounded-xl hover:bg-asset/85 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isPending ? t("modal.adding") : t("modal.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
