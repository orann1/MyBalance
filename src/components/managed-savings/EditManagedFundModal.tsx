"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, Edit3, Building2, DollarSign } from "lucide-react";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

interface EditManagedFundModalProps {
  investment: ManagedSavingsInvestment;
  isOpen: boolean;
  onClose: () => void;
  onSave: (investment: ManagedSavingsInvestment) => void;
}

export function EditManagedFundModal({ investment, isOpen, onClose, onSave }: EditManagedFundModalProps) {
  const t = useTranslations("managedSavings");
  const [formData, setFormData] = useState<Partial<ManagedSavingsInvestment>>(investment);

  const handleChange = (field: keyof ManagedSavingsInvestment, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({ ...investment, ...formData } as ManagedSavingsInvestment);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md modal-backdrop-in">
      <div className="rounded-3xl bg-white border border-border/40 shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto modal-panel-in">
        {/* Header with Premium Gradient */}
        <div className="sticky top-0 border-b border-asset/20 bg-gradient-to-r from-asset/15 via-asset/10 to-transparent px-6 py-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-asset/20 p-2">
                  <Edit3 className="h-5 w-5 text-asset" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{t("modal.editFund")}</h2>
              </div>
              <p className="text-sm text-muted-foreground ml-11">{t("modal.editSubtitle")}</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg p-2 transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form Sections */}
        <div className="p-6 space-y-6">
          {/* Investment Identity Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-asset/10 p-2">
                <Edit3 className="h-4 w-4 text-asset" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("modal.investmentIdentity")}</h3>
            </div>
            <div className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/30 to-secondary/10 p-5 space-y-4 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
                    {t("tableColumns.name")}
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
                    placeholder={investment.name}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
                    {t("tableColumns.type")}
                  </label>
                  <input
                    type="text"
                    value={formData.type || ""}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
                    placeholder={investment.type}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Fund Details Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-asset/10 p-2">
                <Building2 className="h-4 w-4 text-asset" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("modal.fundDetails")}</h3>
            </div>
            <div className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/30 to-secondary/10 p-5 space-y-4 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
                    {t("tableColumns.company")}
                  </label>
                  <input
                    type="text"
                    value={formData.managingCompany || ""}
                    onChange={(e) => handleChange("managingCompany", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
                    placeholder={investment.managingCompany}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
                    {t("tableColumns.track")}
                  </label>
                  <input
                    type="text"
                    value={formData.track || ""}
                    onChange={(e) => handleChange("track", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
                    placeholder={investment.track}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Personal Assumptions Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-asset/10 p-2">
                <DollarSign className="h-4 w-4 text-asset" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("modal.assumptions")}</h3>
            </div>
            <div className="rounded-xl border border-border/20 bg-gradient-to-br from-secondary/30 to-secondary/10 p-5 space-y-4 backdrop-blur-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
                    {t("tableColumns.currentBalance")}
                  </label>
                  <input
                    type="number"
                    value={formData.currentBalance || 0}
                    onChange={(e) => handleChange("currentBalance", Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
                    {t("tableColumns.monthlyContribution")}
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyContribution || 0}
                    onChange={(e) => handleChange("monthlyContribution", Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
                    {t("tableColumns.accumulationFee")} %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.accumulationFeePercent || 0}
                    onChange={(e) => handleChange("accumulationFeePercent", Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-2 block uppercase tracking-wide">
                    {t("tableColumns.depositFee")} %
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.depositFeePercent || 0}
                    onChange={(e) => handleChange("depositFeePercent", Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-border/50 bg-white/80 hover:bg-white focus:outline-none focus:ring-2 focus:ring-asset focus:border-transparent transition-colors"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mock Data Note */}
          <div className="rounded-xl bg-blue-50/50 border border-blue-200/40 p-4 backdrop-blur-sm">
            <p className="text-xs text-blue-900">{t("modal.mockDataNote")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border/20 bg-gradient-to-t from-secondary/10 to-transparent px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-foreground border border-border/40 rounded-lg hover:bg-secondary/30 transition-colors duration-150"
          >
            {t("modal.cancel")}
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2.5 text-sm font-bold text-white bg-asset rounded-lg hover:bg-asset/85 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg"
          >
            {t("modal.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
