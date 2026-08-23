"use client";

import { Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Copy, Download, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/data/products";
import useFetchApi from "@/hooks/useFetchApi";

type OrderImage = {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
};

type OrderProduct = {
  id: string;
  name: string;
  images: OrderImage[];
};

type OrderItem = {
  id: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  productName: string;
  product: OrderProduct;
};

type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string;
};

type OrderDetail = {
  id: string;
  orderId: string;
  status: string;
  totalAmount: string;
  advanceAmount: string;
  balanceAmount: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  estimatedDeliveryStart?: string;
  estimatedDeliveryEnd?: string;
};

function formatDate(dateStr?: string) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderConfirmationInner() {
  const router = useRouter();
  const { show } = useToast();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const { data: order, loading } = useFetchApi<OrderDetail>({
    endpoint: `v1/orders/${orderId}`,
    cacheEnabled: false,
  });

  const handleCopyOrderId = () => {
    if (!order?.orderId) return;
    navigator.clipboard.writeText(order.orderId);
    show("Order ID copied!", "success");
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-[15px] font-semibold text-[#374151]">Loading order details…</p>
      </div>
    );
  }

  const total = parseFloat(order.totalAmount);
  const advance = parseFloat(order.advanceAmount);
  const balance = parseFloat(order.balanceAmount);
  const customerName = order.shippingAddress?.fullName ?? "Customer";

  return (
    <div className="min-h-screen bg-white pb-10">

      {/* ── Logo ── */}
      <div className="px-4 pb-4" style={{ paddingTop: "calc(var(--sat) + 1.25rem)" }}>
        <Image src="/logo/janak-logo.svg" alt="Janak" width={110} height={38} priority />
      </div>

      {/* ── Order Confirmation header ── */}
      <div className="px-4 flex items-center gap-4 mb-6">
        <Image
          src="/common/success-tick.svg"
          alt="Order confirmed"
          width={72}
          height={72}
          className="shrink-0"
        />
        <h1 className="text-[26px] font-extrabold text-[#111827] leading-tight">
          Order<br />Confirmation
        </h1>
      </div>

      <div className="px-4 flex flex-col gap-6">

        {/* ── Greeting ── */}
        <div>
          <p className="text-[16px] font-bold text-[#111827] mb-1">Hi {customerName}</p>
          <p className="text-[14px] text-[#374151] leading-relaxed">
            Thank you for ordering from us. We have successfully received your order.
          </p>
          <div className="flex items-center gap-2 mt-3">
            <p className="text-[14px] text-[#374151]">
              Order Id — <span className="font-bold text-[#111827]">{order.orderId}</span>
            </p>
            <button onClick={handleCopyOrderId}>
              <Copy className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>

        {/* ── Order Summary ── */}
        {order.items?.length > 0 && (
          <div>
            <p className="text-[16px] font-bold text-[#111827] mb-3">Order Summary</p>
            <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
              {order.items.map((item, i) => {
                const primaryImage =
                  item.product.images?.find((img) => img.isPrimary) ?? item.product.images?.[0];
                return (
                  <div key={item.id}>
                    <div className="flex items-center gap-3 p-4">
                      <div className="w-24 h-20 bg-[#F3F4F6] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={primaryImage?.url ?? "/placeholder.png"}
                          alt={item.productName}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>
                      <div>
                        <p className="text-[15px] font-bold text-[#111827] mb-1">{item.productName}</p>
                        <p className="text-[13px] font-semibold text-accent">
                          Qty — {item.quantity}
                        </p>
                        <p className="text-[13px] text-[#6B7280] mt-0.5">
                          {formatINR(parseFloat(item.totalPrice))}
                        </p>
                      </div>
                    </div>
                    {i < order.items.length - 1 && <div className="h-px bg-[#E5E7EB] mx-4" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Payment Summary ── */}
        <div>
          <p className="text-[16px] font-bold text-[#111827] mb-3">Payment Summary</p>
          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <PaymentRow label="Net Payable Amount" amount={formatINR(total)} />
            <PaymentRow label="Booking Amount Paid" amount={formatINR(advance)} />
            <PaymentRow label="Amount Remaining" amount={formatINR(balance)} bold />
          </div>

          {/* Pay Remaining Amount card */}
          {balance > 0 && (
            <div className="mt-3 border border-[#E5E7EB] rounded-2xl p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 bg-[#FFA500] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white font-bold text-[15px] italic">i</span>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-[#D97706]">Pay Remaining Amount</p>
                  <p className="text-[13px] text-[#D97706] mt-1 leading-snug">
                    Please pay{" "}
                    <span className="font-bold">{formatINR(balance)}</span>
                    {order.estimatedDeliveryStart
                      ? ` before ${formatDate(order.estimatedDeliveryStart)}`
                      : ""}{" "}
                    to avoid delay in delivery
                  </p>
                </div>
              </div>
              <button
                onClick={() => show("Bank details coming soon", "info")}
                className="flex items-center justify-between w-full pt-3 border-t border-[#E5E7EB]"
              >
                <span className="text-[13px] font-semibold text-accent">View bank details for payment</span>
                <ChevronRight className="w-4 h-4 text-[#6B7280]" />
              </button>
            </div>
          )}

          {/* Download Invoice */}
          <button
            onClick={() => show("Preparing invoice...", "info")}
            className="w-full mt-3 flex items-center justify-center gap-2 border border-[#E5E7EB] rounded-2xl py-4 text-[14px] font-semibold text-[#111827]"
          >
            <Download className="w-5 h-5 text-[#374151]" />
            Download Invoice
          </button>
        </div>

        {/* ── Go to Home ── */}
        <button
          onClick={() => router.push("/")}
          className="w-full h-12 bg-accent text-white text-[15px] font-semibold rounded-2xl"
        >
          Go to Home
        </button>

        {/* ── Deliver To ── */}
        {order.shippingAddress && (
          <div>
            <p className="text-[16px] font-bold text-[#111827] mb-3">Deliver To</p>
            <div className="border border-[#E5E7EB] rounded-2xl p-4">
              <p className="text-[14px] font-bold text-[#111827]">{order.shippingAddress.fullName}</p>
              <p className="text-[13px] text-[#374151] mt-1 leading-snug">
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ""},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
              </p>
              <p className="text-[13px] text-[#374151] mt-2">Contact — {order.shippingAddress.phone}</p>
              <div className="border-t border-dashed border-[#E5E7EB] mt-4 pt-3">
                <button
                  onClick={() => router.push("/checkout/address")}
                  className="w-full text-center text-[13px] font-semibold text-accent"
                >
                  Change delivery address
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <p className="text-[15px] font-semibold text-[#374151]">Loading…</p>
        </div>
      }
    >
      <OrderConfirmationInner />
    </Suspense>
  );
}

function PaymentRow({
  label,
  amount,
  bold = false,
}: {
  label: string;
  amount: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-dashed border-[#E5E7EB] last:border-0">
      <span className={`text-[13px] leading-snug ${bold ? "font-bold text-[#111827]" : "text-[#6B7280]"}`}>
        {label}
      </span>
      <p className={`text-[13px] font-semibold text-[#111827] shrink-0 ${bold ? "font-bold" : ""}`}>
        {amount}
      </p>
    </div>
  );
}
