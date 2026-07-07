"use client";

import { useRouter } from "next/navigation";
import { Check, Mail } from "lucide-react";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { show } = useToast();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Success icon */}
        <div className="w-28 h-28 rounded-full bg-[#16A34A] flex items-center justify-center mb-6 shadow-[0_8px_32px_rgba(22,163,74,0.3)]">
          <Check className="w-14 h-14 text-white" strokeWidth={3} />
        </div>

        <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Order Placed!</h1>
        <p className="text-sm text-[#6B7280] text-center mt-2 leading-relaxed max-w-xs">
          Thank you for your purchase. We&apos;ll get your gear delivered fast.
        </p>

        {/* Details card */}
        <div className="w-full max-w-xs bg-[#F5F5F7] border border-[#E5E7EB] rounded-xl p-4 mt-7">
          <DetailRow label="Order ID" value="JP-2026-00312" />
          <div className="h-px bg-[#E5E7EB] my-2" />
          <DetailRow label="Estimated Delivery" value="28 May – 2 Jun 2026" valueClass="text-[#16A34A]" />
          <div className="h-px bg-[#E5E7EB] my-2" />
          <DetailRow label="Payment" value="UPI · arjun@okaxis" />
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2.5 p-3 mt-4 bg-[#E0F2FE] rounded-lg w-full max-w-xs">
          <Mail className="w-4 h-4 text-[#1A4F9C] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#111827] leading-relaxed">
            A confirmation email & GST invoice will be sent to your registered email.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-8 flex flex-col gap-2.5 max-w-sm mx-auto w-full">
        <Button
          label="Download Invoice"
          variant="outlined"
          onClick={() => show("Preparing invoice...", "info")}
        />
        <Button
          label="Track Order"
          onClick={() => router.replace("/orders")}
        />
      </div>
    </div>
  );
}

function DetailRow({ label, value, valueClass = "text-[#111827]" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span className={`text-[13px] font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}
