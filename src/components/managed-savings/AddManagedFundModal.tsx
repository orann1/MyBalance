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

  const inputClass =
    "w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors";
  const labelClass =
    "text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md modal-backdrop-in">
      <div className="rounded-3xl bg-white border border-border/40 shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto modal-panel-in">
        {/* Header */}
        <div className="sticky top-0 border-b border-asset/20 bg-gradient-to-r from-asset/15 via-asset/10 to-transparent px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-asset/20 p-2">
                  <Plus className="h-5 w-5 text-asset" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {t("modal.addFund")}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground ms-11">
                {t("modal.addSubtitle")}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg p-2 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-asset/10 p-2">
                <Plus className="h-4 w-4 text-asset" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {t("modal.investmentIdentity")}
              </h3>
            </div>
            <div className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/30 to-secondary/10 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>{t("tableColumns.name")}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={inputClass}
                    placeholder={t("modal.investmentNamePlaceholder")}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("tableColumns.type")}</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      handleChange(
                        "type",
                        e.target.value as CreateManagedSavingsInput["type"]
                      )
                    }
                    className={inputClass}
                  >
                    <option value="hishtalmut">
                      {t("tableColumns.typeHishtalmut")}
                    </option>
                    <option value="gemel">{t("tableColumns.typeGemel")}</option>
                    <option value="hashkaa">
                      {t("tableColumns.typeHashkaa")}
                    </option>
                    <option value="savings">
                      {t("tableColumns.typeSavings")}
                    </option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>{t("modal.ownership")}</label>
                  <select
                    value={formData.owner}
                    onChange={(e) =>
                      handleChange(
                        "owner",
                        e.target.value as CreateManagedSavingsInput["owner"]
                      )
                    }
                    className={inputClass}
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

          {/* Fund Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-asset/10 p-2">
                <Building2 className="h-4 w-4 text-asset" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {t("modal.fundDetails")}
              </h3>
            </div>
            <div className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/30 to-secondary/10 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.company")}
                  </label>
                  <input
                    type="text"
                    value={formData.managingCompany ?? ""}
                    onChange={(e) =>
                      handleChange("managingCompany", e.target.value)
                    }
                    className={inputClass}
                    placeholder={t("modal.companyPlaceholder")}
                  />
                </div>
                <div>
                  <label className={labelClass}>{t("tableColumns.track")}</label>
                  <input
                    type="text"
                    value={formData.trackName ?? ""}
                    onChange={(e) => handleChange("trackName", e.target.value)}
                    className={inputClass}
                    placeholder={t("modal.trackPlaceholder")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assumptions */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-asset/10 p-2">
                <DollarSign className="h-4 w-4 text-asset" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {t("modal.assumptions")}
              </h3>
            </div>
            <div className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/30 to-secondary/10 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.currentBalance")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentBalance}
                    onChange={(e) =>
                      handleChange("currentBalance", Number(e.target.value))
                    }
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.monthlyContribution")}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.monthlyContribution}
                    onChange={(e) =>
                      handleChange(
                        "monthlyContribution",
                        Number(e.target.value)
                      )
                    }
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.accumulationFee")} %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.01"
                    value={formData.accumulationFeePercent}
                    onChange={(e) =>
                      handleChange(
                        "accumulationFeePercent",
                        Number(e.target.value)
                      )
                    }
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    {t("tableColumns.depositFee")} %
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.01"
                    value={formData.depositFeePercent}
                    onChange={(e) =>
                      handleChange("depositFeePercent", Number(e.target.value))
                    }
                    className={inputClass}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-asset/10 p-2">
                <StickyNote className="h-4 w-4 text-asset" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {t("modal.notes")}
              </h3>
            </div>
            <div className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/30 to-secondary/10 p-5">
              <textarea
                value={formData.notes ?? ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors resize-none"
                rows={3}
                maxLength={500}
                placeholder={t("modal.notesPlaceholder")}
              />
            </div>
          </div>

          {/* Persistence note */}
          <div className="rounded-xl bg-blue-50/50 border border-blue-200/40 p-4">
            <p className="text-xs text-blue-900">{t("modal.mockDataNote")}</p>
          </div>

          {/* Error */}
          {errorKey && (
            <div className="rounded-xl bg-red-50 border border-red-200/60 p-4">
              <p className="text-xs text-red-800">{t(errorKey as "errors.createFailed")}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border/20 bg-gradient-to-t from-secondary/10 to-transparent px-6 py-4">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-foreground border border-border/40 rounded-lg hover:bg-secondary/30 transition-colors duration-150 disabled:opacity-50"
          >
            {t("modal.cancel")}
          </button>
          <button
            onClick={handleAdd}
            disabled={isPending || !formData.name.trim()}
            className="px-4 py-2.5 text-sm font-bold text-white bg-asset rounded-lg hover:bg-asset/85 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {t("modal.add")}
          </button>
        </div>
      </div>
    </div>
  );
}
