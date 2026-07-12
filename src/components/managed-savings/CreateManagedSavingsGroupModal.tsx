"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { FolderPlus, X } from "lucide-react";
import { createManagedSavingsGroup } from "@/lib/actions/managed-savings-group-actions";

interface CreateManagedSavingsGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (group: { id: string; name: string; displayOrder: number }) => void;
}

export function CreateManagedSavingsGroupModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateManagedSavingsGroupModalProps) {
  const tGroups = useTranslations("managedSavings.groups");
  const tValidation = useTranslations("managedSavings.validation");
  const [name, setName] = useState("");
  const [errorKey, setErrorKey] = useState<string | null>(null);
  const [showValidation, setShowValidation] = useState(false);
  const [isPending, startTransition] = useTransition();

  const nameInvalid = showValidation && !name.trim();

  const handleCreate = () => {
    setErrorKey(null);
    if (!name.trim()) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    startTransition(async () => {
      const result = await createManagedSavingsGroup({ name });
      if (result.ok) {
        setName("");
        onSuccess(result.group);
      } else if (result.error === "duplicate_name") {
        setErrorKey("duplicateGroupName");
      } else {
        setErrorKey("groupActionFailed");
      }
    });
  };

  const handleClose = () => {
    setName("");
    setErrorKey(null);
    setShowValidation(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop-in">
      <div className="rounded-3xl bg-white border border-border/40 shadow-2xl w-full max-w-md mx-4 modal-panel-in">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-asset/15 p-2">
              <FolderPlus className="h-5 w-5 text-asset" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {tGroups("createGroupTitle")}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isPending}
            className="text-muted-foreground hover:text-foreground hover:bg-secondary/40 rounded-lg p-2 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-muted-foreground">{tValidation("requiredFieldsHelper")}</p>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
            {tGroups("groupNameLabel")}
            <span className="text-red-600 ms-0.5" aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorKey(null);
            }}
            onBlur={() => setShowValidation(true)}
            placeholder={tGroups("groupNamePlaceholder")}
            className={
              nameInvalid
                ? "w-full h-11 px-3.5 text-sm rounded-xl border border-red-400 bg-red-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-500"
                : "w-full h-11 px-3.5 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-asset/40 focus:border-asset"
            }
            aria-required="true"
            aria-invalid={nameInvalid}
            autoFocus
          />
          {nameInvalid && (
            <p className="text-xs text-red-600">{tValidation("fieldRequired")}</p>
          )}
          {errorKey && (
            <p className="text-xs text-red-700">{tGroups(errorKey as "duplicateGroupName" | "groupActionFailed")}</p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/20">
          <button
            onClick={handleClose}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-foreground border border-border/40 rounded-lg hover:bg-secondary/30 transition-colors disabled:opacity-50"
          >
            {tGroups("cancel")}
          </button>
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-bold text-white bg-asset rounded-lg hover:bg-asset/90 active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            {isPending ? tGroups("creating") : tGroups("create")}
          </button>
        </div>
      </div>
    </div>
  );
}
