"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Smartphone, Check } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/ui/StepIndicator";
import { user } from "@/data/user";
import { useCart } from "@/context/CartContext";
import { getProductById, formatINR } from "@/data/products";

const STEPS = ["Address", "Payment", "Review"];

export default function CheckoutReviewPage() {
  const router = useRouter();
  const { items, subtotal, gst, total } = useCart();
  const [agree, setAgree] = useState(true);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="bg-white px-4 pt-4 pb-2 border-b border-[#E5E7EB] max-w-3xl mx-auto w-full">
        <h1 className="text-base font-bold text-[#111827]">Checkout</h1>
        <p className="text-xs text-[#6B7280]">Step 3 of 3</p>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 pt-3">
        <StepIndicator current={3} steps={STEPS} />
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-40">
        <h2 className="text-lg font-bold text-[#111827] mt-4">Review & Place Order</h2>
        <p className="text-xs text-[#6B7280] mt-1 mb-4">Double-check your order before placing it.</p>

        {/* Items */}
        <Card title={`Items (${items.length})`}>
          {items.map((it) => {
            const p = getProductById(it.productId);
            if (!p) return null;
            return (
              <div key={it.productId} className="flex items-center gap-3 py-2.5">
                <img src={p.images[0]} alt={p.name} className="w-12 h-14 rounded-lg object-cover bg-[#F5F5F7] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#111827] leading-snug line-clamp-2">{p.name}</p>
                  <p className="text-[10px] text-[#6B7280] mt-1">Qty: {it.quantity} · {p.priceLabel}</p>
                </div>
                <p className="text-[13px] font-bold text-[#111827] shrink-0">
                  {p.price ? formatINR(p.price * it.quantity) : "—"}
                </p>
              </div>
            );
          })}
        </Card>

        {/* Address */}
        <Card title="Delivery Address" onEdit={() => router.push("/checkout/address")}>
          <p className="text-[13px] font-bold text-[#111827]">{user.address.fullName}</p>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            {user.address.line1}, {user.address.line2}<br />
            {user.address.city}, {user.address.state} — {user.address.pincode}
          </p>
          <p className="text-xs font-semibold text-[#111827] mt-1.5">{user.address.phone}</p>
        </Card>

        {/* Payment */}
        <Card title="Payment Method" onEdit={() => router.push("/checkout/payment")}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
              <Smartphone className="w-4.5 h-4.5 text-[#1A4F9C]" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-[#111827]">UPI</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">arjun@okaxis</p>
            </div>
          </div>
        </Card>

        {/* Summary */}
        <Card title="Order Summary">
          <SumRow label="Subtotal" value={formatINR(subtotal)} />
          <SumRow label="GST (18%)" value={formatINR(Math.round(gst))} />
          <SumRow label="Shipping" value="FREE" valueClass="text-[#16A34A]" />
          <div className="h-px bg-[#E5E7EB] my-2" />
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#111827]">Grand Total</span>
            <span className="text-lg font-bold text-[#1A4F9C]">{formatINR(Math.round(total))}</span>
          </div>
        </Card>

        {/* T&C */}
        <button onClick={() => setAgree(!agree)} className="flex items-center gap-2.5 py-3 text-left">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${agree ? "bg-[#1A4F9C] border-[#1A4F9C]" : "border-[#D1D5DB]"}`}>
            {agree && <Check className="w-3 h-3 text-white" />}
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            I agree to the{" "}
            <span className="text-[#1A4F9C] font-semibold">Terms & Conditions</span> and{" "}
            <span className="text-[#1A4F9C] font-semibold">Privacy Policy</span>.
          </p>
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-6 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div>
            <p className="text-[11px] text-[#6B7280]">Pay Total</p>
            <p className="text-lg font-bold text-[#111827]">{formatINR(Math.round(total))}</p>
          </div>
          <div className="flex-1">
            <Button label="Place Order" onClick={() => agree && router.push("/checkout/payment")} disabled={!agree} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: () => void }) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 mb-3">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[13px] font-bold text-[#111827]">{title}</p>
        {onEdit && (
          <button onClick={onEdit} className="text-xs font-semibold text-[#1A4F9C]">Edit</button>
        )}
      </div>
      {children}
    </div>
  );
}

function SumRow({ label, value, valueClass = "text-[#111827]" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span className={`text-[13px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
