"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Trash2, X } from "lucide-react";
import { deleteEmptyManagedSavingsGroup } from "@/lib/actions/managed-savings-group-actions";

interface DeleteManagedSavingsGroupModalProps {
  group: { id: string; name: string };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (groupId: string) => void;
}

export function DeleteManagedSavingsGroupModal({
  group,
  isOpen,
  onClose,
  onSuccess,
}: DeleteManagedSavingsGroupModalProps) {
  const tGroups = useTranslations("managedSavings.groups");
  const [isPending, startTransition] = useTransition();
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const handleConfirm = () => {
    setErrorKey(null);
    startTransition(async () => {
      const result = await deleteEmptyManagedSavingsGroup({ id: group.id });
      if (result.ok) {
        onSuccess(group.id);
      } else if (result.error === "group_not_empty") {
        setErrorKey("deleteGroupNotEmpty");
      } else {
        setErrorKey("groupActionFailed");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm modal-backdrop-in">
      <div className="rounded-3xl bg-white border border-border/40 shadow-2xl w-full max-w-md mx-4 modal-panel-in">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-border/20">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-foreground">
              {tGroups("deleteGroupTitle")}
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

        <div className="px-6 py-5 space-y-3">
          <p className="text-sm text-muted-foreground">
            {tGroups("deleteGroupBody", { name: group.name })}
          </p>
          {errorKey && (
            <div className="rounded-lg bg-red-50 border border-red-200/60 p-3">
              <p className="text-xs text-red-800">{tGroups(errorKey as "deleteGroupNotEmpty" | "groupActionFailed")}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border/20">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-foreground border border-border/40 rounded-lg hover:bg-secondary/30 transition-colors disabled:opacity-50"
          >
            {tGroups("cancel")}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 active:scale-95 transition-all shadow-md disabled:opacity-50"
          >
            {tGroups("deleteGroupConfirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
