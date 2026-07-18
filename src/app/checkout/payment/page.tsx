"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Smartphone, Building2, CreditCard, ShieldCheck, AtSign, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/ui/StepIndicator";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { usePlaceOrder } from "@/hooks/useCheckoutInitiate";
import { usePaymentInitiate } from "@/hooks/usePaymentInitiate";
import { formatINR } from "@/data/products";

const STEPS = ["Address", "Payment", "Review"];

type PayMethod = "upi" | "netbanking" | "card";

const METHODS: { key: PayMethod; label: string; sub: string; Icon: React.ElementType }[] = [
  { key: "upi", label: "UPI", sub: "GPay · PhonePe · BHIM", Icon: Smartphone },
  { key: "netbanking", label: "Net Banking", sub: "All major banks", Icon: Building2 },
  { key: "card", label: "Credit / Debit Card", sub: "Visa · Mastercard · Rupay", Icon: CreditCard },
];

export default function CheckoutPaymentPage() {
  const [method, setMethod] = useState<PayMethod>("upi");
  const [upiId, setUpiId] = useState("");

  const searchParams = useSearchParams();
  const addressId = searchParams.get("addressId") ?? "";

  const { items, serverItems, subtotal, gst, total } = useCart();
  const { user } = useAuth();
  const placeOrderMutation = usePlaceOrder();
  const paymentInitiateMutation = usePaymentInitiate();

  const isPending = placeOrderMutation.isPending || paymentInitiateMutation.isPending;

  const handlePay = () => {
    if (!user) return;
    placeOrderMutation.mutate(
      { addressId, paymentMethod: method },
      {
        onSuccess: (order) => {
          paymentInitiateMutation.mutate(
            {
              orderId: order.orderId,
              customerName: user.email,   // TODO: replace with real name once available
              customerEmail: user.email,
              customerMobile: "919999999999", // TODO: replace with real mobile once available
            },
            {
              onSuccess: (payment) => {
                localStorage.setItem("merchantTxnNo", payment.merchantTxnNo);
                window.location.href = payment.paymentUrl;
              },
            }
          );
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="bg-white px-4 pt-4 pb-2 border-b border-[#E5E7EB] max-w-3xl mx-auto w-full">
        <h1 className="text-base font-bold text-[#111827]">Checkout</h1>
        <p className="text-xs text-[#6B7280]">Step 2 of 3</p>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 pt-3">
        <StepIndicator current={2} steps={STEPS} />
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-36">

        {/* Order Summary */}
        <h2 className="text-base font-bold text-[#111827] mt-4 mb-3">Order Summary</h2>
        <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mb-5">
          {items.map((it) => {
            const serverItem = serverItems.find((s) => s.product.id === it.productId);
            if (!serverItem) return null;
            const { product } = serverItem;
            if (!product?.images) return null;
            const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
            return (
              <div
                key={it.productId}
                className="flex items-center gap-3 p-3 border-b border-[#E5E7EB] last:border-b-0 bg-white"
              >
                <img
                  src={primaryImage?.url}
                  alt={product.name}
                  className="w-12 h-14 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#111827] line-clamp-2 leading-snug">
                    {product.name}
                  </p>
                  <p className="text-xs text-[#6B7280] mt-0.5">Qty: {it.quantity}</p>
                </div>
                <p className="text-sm font-bold text-[#111827] shrink-0">
                  {product.price ? formatINR(parseFloat(product.price) * it.quantity) : "—"}
                </p>
              </div>
            );
          })}

          {/* Totals */}
          <div className="p-3 bg-[#F9FAFB]">
            <SumRow label="Subtotal" value={formatINR(subtotal)} />
            <SumRow label="GST (18%)" value={formatINR(Math.round(gst))} />
            <SumRow label="Shipping" value="FREE" valueClass="text-[#16A34A]" />
            <div className="h-px bg-[#E5E7EB] my-2" />
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#111827]">Grand Total</span>
              <span className="text-base font-bold text-[#1A4F9C]">{formatINR(Math.round(total))}</span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <h2 className="text-base font-bold text-[#111827] mb-3">Payment Method</h2>
        <p className="text-xs text-[#6B7280] mb-4">Choose how you&apos;d like to pay</p>

        <div className="flex flex-col gap-2.5">
          {METHODS.map(({ key, label, sub, Icon }) => {
            const active = method === key;
            return (
              <button
                key={key}
                onClick={() => setMethod(key)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-colors ${
                  active ? "border-[#1A4F9C] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    active ? "border-[#1A4F9C]" : "border-[#D1D5DB]"
                  }`}
                >
                  {active && <div className="w-2.5 h-2.5 rounded-full bg-[#1A4F9C]" />}
                </div>
                <div className="w-9 h-9 rounded-lg bg-[#E0F2FE] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#1A4F9C]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#111827]">{label}</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{sub}</p>
                </div>
                {key === "upi" && (
                  <span className="text-[8px] font-bold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-1 rounded tracking-wide">
                    RECOMMENDED
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {method === "upi" && (
          <div className="mt-4">
            <p className="text-xs font-semibold text-[#111827] mb-2">UPI ID</p>
            <div className="flex items-center gap-2 h-12 bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3">
              <AtSign className="w-4 h-4 text-[#6B7280] shrink-0" />
              <input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@bank"
                className="flex-1 bg-transparent text-sm text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                autoCapitalize="none"
              />
              {upiId && (
                <div className="flex items-center gap-1 bg-[#DCFCE7] px-1.5 py-1 rounded">
                  <CheckCircle className="w-3 h-3 text-[#16A34A]" />
                  <span className="text-[8px] font-bold text-[#16A34A] tracking-wide">VERIFIED</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2.5 p-3 mt-5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg">
          <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
          <p className="text-[11px] font-medium text-[#166534] leading-relaxed">
            All transactions are encrypted & 100% secure. PCI-DSS Compliant.
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-6 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div>
            <p className="text-[11px] text-[#6B7280]">Pay Total</p>
            <p className="text-lg font-bold text-[#111827]">{formatINR(Math.round(total))}</p>
          </div>
          <div className="flex-1">
            <Button
              label="Pay Now"
              onClick={handlePay}
              loading={isPending}
              disabled={isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SumRow({
  label,
  value,
  valueClass = "text-[#111827]",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span className={`text-[13px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
