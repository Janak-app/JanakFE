"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  Package,
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import InfoBanner from "@/components/ui/InfoBanner";
import {
  useOrder,
  formatOrderAmount,
  formatOrderDate,
} from "@/hooks/useOrders";

const TABS = ["Summary", "Tracking", "Shipping", "Payment"] as const;
type TabKey = typeof TABS[number];

export default function OrderDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();

  const { order, loading } = useOrder(id);
  const [imgIdx, setImgIdx] = useState(0);
  const [tab, setTab] = useState<TabKey>("Summary");

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center px-4 pt-4 pb-2 gap-2">
          <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-[#111827]" />
          </button>
          <div className="h-5 w-32 bg-[#E5E7EB] rounded animate-pulse" />
        </div>
        <div className="mx-4 rounded-2xl bg-[#E5E7EB] h-64 animate-pulse" />
        <div className="px-4 pt-4 flex flex-col gap-3">
          <div className="h-4 w-24 bg-[#E5E7EB] rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-[#E5E7EB] rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-[#E5E7EB] rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Order not found.</p>
      </div>
    );
  }

  const firstItem = order.items[0];
  const images = firstItem?.product.images
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => img.url) ?? [];

  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center px-4 pt-4 pb-2 gap-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <p className="flex-1 text-[16px] font-bold text-[#111827]">{order.orderId}</p>
        <StatusBadge status={order.status} />
      </div>

      {/* ── Image carousel ── */}
      {images.length > 0 && (
        <div className="bg-[#F5F5F7] mx-4 rounded-2xl overflow-hidden">
          <div className="h-64 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[imgIdx]}
              alt={firstItem?.productName ?? "Product"}
              className="w-full h-full object-contain p-4"
            />
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-1.5 pb-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === imgIdx ? "w-5 bg-[#9CA3AF]" : "w-1.5 bg-[#D1D5DB]"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Order info ── */}
      <div className="px-4 pt-4 flex flex-col gap-3 pb-10">

        {/* Product name + meta */}
        <h1 className="text-[20px] font-bold text-[#111827] leading-snug">
          {order.items.length === 1
            ? firstItem?.productName
            : `${firstItem?.productName} + ${order.items.length - 1} more`}
        </h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[13px] text-[#6B7280]">
            Placed on {formatOrderDate(order.createdAt)}
          </span>
          <span className="text-[13px] text-[#6B7280]">·</span>
          <span className="text-[13px] text-[#6B7280]">Qty: {totalQty}</span>
        </div>

        {/* Total amount */}
        <p className="text-[22px] font-bold text-[#111827]">
          {formatOrderAmount(order.totalAmount)}
        </p>

        {/* Advance / balance banner */}
        {order.advancePaid && !order.balancePaid && (
          <InfoBanner
            title={`Balance due: ${formatOrderAmount(order.balanceAmount)}`}
            subtitle={`Advance of ${formatOrderAmount(order.advanceAmount)} paid`}
          />
        )}
        {!order.advancePaid && (
          <InfoBanner
            title={`Advance payment pending: ${formatOrderAmount(order.advanceAmount)}`}
            subtitle="Pay advance to confirm your order"
          />
        )}

        {/* ── Tabs ── */}
        <div className="flex border-b border-[#E5E7EB] mt-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-[#6B7280]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Summary ── */}
        {tab === "Summary" && (
          <div className="flex flex-col gap-4 pt-1">
            {/* Items */}
            {order.items.map((item) => {
              const primary =
                item.product.images.find((img) => img.isPrimary) ??
                item.product.images[0];
              return (
                <div key={item.id} className="flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primary?.url}
                    alt={item.productName}
                    className="w-14 h-16 rounded-lg object-contain bg-[#F5F5F7] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111827] line-clamp-2">{item.productName}</p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">Model: {item.product.modelNumber}</p>
                    <p className="text-[12px] text-[#6B7280]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-[14px] font-bold text-[#111827] shrink-0">
                    {formatOrderAmount(item.totalPrice)}
                  </p>
                </div>
              );
            })}

            {/* Price breakdown */}
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              {[
                { label: "Subtotal", value: formatOrderAmount(order.subtotal) },
                { label: "GST", value: formatOrderAmount(order.gstAmount) },
                { label: "Shipping", value: parseFloat(order.shippingAmount) === 0 ? "Free" : formatOrderAmount(order.shippingAmount) },
              ].map((row, i) => (
                <div
                  key={row.label}
                  className={`flex justify-between items-center px-4 py-3 ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"} border-b border-[#E5E7EB]`}
                >
                  <span className="text-[13px] text-[#6B7280]">{row.label}</span>
                  <span className="text-[13px] font-medium text-[#111827]">{row.value}</span>
                </div>
              ))}
              <div className="flex justify-between items-center px-4 py-3 bg-white">
                <span className="text-[14px] font-bold text-[#111827]">Total</span>
                <span className="text-[14px] font-bold text-accent">{formatOrderAmount(order.totalAmount)}</span>
              </div>
            </div>

            {/* Advance / balance breakdown */}
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              <div className={`flex justify-between items-center px-4 py-3 bg-white border-b border-[#E5E7EB]`}>
                <span className="text-[13px] text-[#6B7280]">Advance (10%)</span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#111827]">{formatOrderAmount(order.advanceAmount)}</span>
                  {order.advancePaid && <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />}
                </div>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-[#F9FAFB]">
                <span className="text-[13px] text-[#6B7280]">Balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#111827]">{formatOrderAmount(order.balanceAmount)}</span>
                  {order.balancePaid
                    ? <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                    : <Clock className="w-4 h-4 text-[#D97706]" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tracking ── */}
        {tab === "Tracking" && (
          <div className="flex flex-col gap-4 pt-1">
            {/* Estimated delivery */}
            <div className="flex items-start gap-3 bg-[#EFF6FF] rounded-xl p-4">
              <Truck className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="text-[13px] font-semibold text-[#111827]">Estimated Delivery</p>
                <p className="text-[12px] text-[#6B7280] mt-0.5">
                  {formatOrderDate(order.estimatedDeliveryStart)} – {formatOrderDate(order.estimatedDeliveryEnd)}
                </p>
              </div>
            </div>

            {/* Courier info */}
            {order.tracking.courierName && (
              <div className="border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-1">
                <p className="text-[12px] text-[#6B7280]">Courier</p>
                <p className="text-[14px] font-semibold text-[#111827]">{order.tracking.courierName}</p>
                {order.tracking.awbNumber && (
                  <p className="text-[12px] text-[#6B7280]">AWB: {order.tracking.awbNumber}</p>
                )}
              </div>
            )}

            {/* Timeline */}
            <div className="flex flex-col">
              {order.tracking.events.map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${i === 0 ? "bg-accent" : "bg-[#D1D5DB]"}`} />
                    {i < order.tracking.events.length - 1 && (
                      <div className="w-px flex-1 bg-[#E5E7EB] my-1" />
                    )}
                  </div>
                  <div className="pb-5">
                    <p className="text-[13px] font-semibold text-[#111827]">{event.status}</p>
                    <p className="text-[12px] text-[#6B7280] mt-0.5">{event.message}</p>
                    <p className="text-[11px] text-[#9CA3AF] mt-0.5">{formatOrderDate(event.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>

            {!order.tracking.courierName && order.tracking.events.length === 0 && (
              <p className="text-sm text-[#6B7280] text-center py-6">No tracking updates yet.</p>
            )}
          </div>
        )}

        {/* ── Shipping ── */}
        {tab === "Shipping" && (
          <div className="pt-1">
            <div className="border border-[#E5E7EB] rounded-xl p-4 flex gap-3">
              <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div className="flex flex-col gap-0.5">
                <p className="text-[14px] font-semibold text-[#111827]">{order.shippingAddress.fullName}</p>
                <p className="text-[13px] text-[#374151]">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-[13px] text-[#374151]">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-[13px] text-[#374151]">
                  {order.shippingAddress.city}, {order.shippingAddress.state} – {order.shippingAddress.pincode}
                </p>
                <p className="text-[13px] text-[#6B7280] mt-1">Phone: {order.shippingAddress.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Payment ── */}
        {tab === "Payment" && (
          <div className="flex flex-col gap-3 pt-1">
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              {[
                { label: "Payment Method", value: order.paymentMethod.toUpperCase() },
                { label: "Transaction ID", value: order.transactionId ?? "—" },
                { label: "Advance Paid", value: order.advancePaid ? "Yes" : "No" },
                { label: "Balance Paid", value: order.balancePaid ? "Yes" : "No" },
                ...(order.neftReferenceNumber
                  ? [{ label: "NEFT Ref (Advance)", value: order.neftReferenceNumber }]
                  : []),
                ...(order.balanceNeftReferenceNumber
                  ? [{ label: "NEFT Ref (Balance)", value: order.balanceNeftReferenceNumber }]
                  : []),
                { label: "GST Invoice", value: order.requiresGstBill ? "Required" : "Not Required" },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className={`flex justify-between items-center px-4 py-3 ${
                    i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"
                  } ${i < arr.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}
                >
                  <span className="text-[12px] text-[#6B7280]">{row.label}</span>
                  <span className="text-[12px] font-semibold text-[#111827] text-right max-w-[55%] break-all">{row.value}</span>
                </div>
              ))}
            </div>

            {order.salesRepName && (
              <div className="border border-[#E5E7EB] rounded-xl p-4 flex gap-3">
                <CreditCard className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">Sales Representative</p>
                  <p className="text-[13px] text-[#374151] mt-0.5">{order.salesRepName}</p>
                  {order.salesRepPhone && (
                    <p className="text-[12px] text-[#6B7280]">{order.salesRepPhone}</p>
                  )}
                </div>
              </div>
            )}

            {!order.salesRepName && (
              <div className="flex items-center gap-3 bg-[#F9FAFB] rounded-xl p-4">
                <Package className="w-5 h-5 text-[#9CA3AF] shrink-0" />
                <p className="text-[13px] text-[#6B7280]">No sales representative assigned.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
