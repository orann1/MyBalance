"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Trash2, X } from "lucide-react";
import { archiveManagedSavingsHolding } from "@/lib/actions/managed-savings-actions";
import type { ManagedSavingsInvestment } from "@/lib/mock/managed-savings-data";

interface DeleteHoldingConfirmModalProps {
  investment: ManagedSavingsInvestment;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (id: string) => void;
}

export function DeleteHoldingConfirmModal({
  investment,
  isOpen,
  onClose,
  onSuccess,
}: DeleteHoldingConfirmModalProps) {
  const t = useTranslations("managedSavings");
  const [isPending, startTransition] = useTransition();
  const [hasError, setHasError] = useState(false);

  const handleConfirm = () => {
    setHasError(false);
    startTransition(async () => {
      const result = await archiveManagedSavingsHolding({ id: investment.id });
      if (result.ok) {
        onSuccess(investment.id);
      } else {
        setHasError(true);
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop-in">
      <div className="rounded-3xl bg-white border border-border/40 shadow-2xl w-full max-w-md mx-4 modal-panel-in">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {t("deleteModal.title")}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("deleteModal.body", { name: investment.name })}
          </p>
          {hasError && (
            <div className="rounded-lg bg-red-50 border border-red-200/60 p-3">
              <p className="text-xs text-red-800">{t("errors.archiveFailed")}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/20">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-foreground border border-border/40 rounded-lg hover:bg-secondary/30 transition-colors duration-150 disabled:opacity-50"
          >
            {t("modal.cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 active:scale-95 transition-all duration-150 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {t("deleteModal.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
