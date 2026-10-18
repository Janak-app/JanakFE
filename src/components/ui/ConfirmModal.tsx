"use client";

import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: LucideIcon;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  icon: Icon,
  variant = "primary",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  const isDanger = variant === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="w-full max-w-sm bg-white rounded-2xl p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {Icon && (
          <div
            className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${
              isDanger ? "bg-[#FEE2E2]" : "bg-[#E0F2FE]"
            }`}
          >
            <Icon className={`w-5 h-5 ${isDanger ? "text-[#DC2626]" : "text-accent"}`} />
          </div>
        )}
        <h2 id="confirm-modal-title" className="text-center text-[16px] font-bold text-[#111827]">
          {title}
        </h2>
        <p className="text-center text-[13px] text-[#6B7280] mt-1.5">{message}</p>
        <div className="flex gap-3 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-lg border border-[#E5E7EB] text-sm font-semibold text-[#111827] hover:bg-[#F5F5F7] transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 h-11 rounded-lg text-sm font-semibold text-white transition-colors ${
              isDanger ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "bg-accent hover:bg-accent/90"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
