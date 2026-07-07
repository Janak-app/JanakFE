"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Phone, CheckCircle, Download } from "lucide-react";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import { orders } from "@/data/orders";
import { user, salesRep } from "@/data/user";
import { useToast } from "@/context/ToastContext";

const TIMELINE: Record<string, { label: string; done: boolean; date: string }[]> = {
  Delivered: [
    { label: "Order Placed", done: true, date: "12 Jan 2026" },
    { label: "Confirmed", done: true, date: "12 Jan 2026" },
    { label: "Shipped", done: true, date: "14 Jan 2026" },
    { label: "Out for Delivery", done: true, date: "18 Jan 2026" },
    { label: "Delivered", done: true, date: "19 Jan 2026" },
  ],
  Shipped: [
    { label: "Order Placed", done: true, date: "18 Mar 2026" },
    { label: "Confirmed", done: true, date: "18 Mar 2026" },
    { label: "Shipped", done: true, date: "20 Mar 2026" },
    { label: "Out for Delivery", done: false, date: "—" },
    { label: "Delivered", done: false, date: "—" },
  ],
};

export default function OrderDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const { show } = useToast();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#6B7280]">Order not found.</p>
        </div>
      </div>
    );
  }

  const timeline = TIMELINE[order.status] || TIMELINE.Delivered;
  const canCancel = order.status === "Pending" || order.status === "Confirmed";

  const statusMsg =
    order.status === "Delivered"
      ? "Order delivered successfully"
      : order.status === "Shipped"
      ? "Your order is on the way"
      : "Order is being processed";

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />

      {/* Page header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-[#111827]" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#111827]">Order Detail</h1>
            <p className="text-[11px] text-[#6B7280]">{order.id}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 pb-10 flex flex-col gap-4">
        {/* Status banner */}
        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <StatusBadge status={order.status} />
              <span className="text-[11px] text-[#6B7280]">{order.date}</span>
            </div>
            <p className="text-sm font-semibold text-[#111827]">{statusMsg}</p>
          </div>
          {order.status === "Delivered" ? (
            <CheckCircle className="w-8 h-8 text-[#16A34A]" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#1A4F9C]/10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full border-2 border-[#1A4F9C] border-t-transparent animate-spin" />
            </div>
          )}
        </div>

        {/* Item */}
        <Section title="Items">
          <div className="flex items-center gap-3">
            <img
              src={order.productImage}
              alt={order.productName}
              className="w-16 h-20 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
            />
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#111827] leading-snug">{order.productName}</p>
              <p className="text-[11px] text-[#6B7280] mt-1">Qty: {order.quantity}</p>
              {order.serialNumber && <p className="text-[11px] text-[#6B7280] mt-0.5">S/N: {order.serialNumber}</p>}
              <p className="text-sm font-bold text-[#1A4F9C] mt-1.5">{order.amountLabel}</p>
            </div>
          </div>
        </Section>

        {/* Tracking */}
        <Section title="Tracking">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[13px] font-bold text-[#111827]">{order.trackingCarrier}</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">AWB: {order.trackingId}</p>
            </div>
            <button onClick={() => show("Opening carrier site...", "info")} className="text-xs font-semibold text-[#1A4F9C]">
              Track Shipment ↗
            </button>
          </div>
          <div className="pl-1 flex flex-col">
            {timeline.map((t, i) => (
              <div key={t.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${t.done ? "bg-[#16A34A]" : "bg-[#E5E7EB]"}`}>
                    {t.done && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                  </div>
                  {i < timeline.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[20px] ${t.done ? "bg-[#16A34A]" : "bg-[#E5E7EB]"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className={`text-xs font-semibold ${t.done ? "text-[#111827]" : "text-[#9CA3AF]"}`}>{t.label}</p>
                  <p className="text-[10px] text-[#9CA3AF] mt-0.5">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Delivery address */}
        <Section title="Delivery Address">
          <p className="text-[13px] font-bold text-[#111827]">{user.address.fullName}</p>
          <p className="text-xs text-[#6B7280] mt-1 leading-relaxed">
            {user.address.line1}, {user.address.line2}<br />
            {user.address.city}, {user.address.state} — {user.address.pincode}
          </p>
          <p className="text-xs font-semibold text-[#111827] mt-2">{user.address.phone}</p>
        </Section>

        {/* Payment */}
        <Section title="Payment">
          <PayRow label="Method" value={order.paymentMethod} />
          <PayRow label="Transaction ID" value={order.transactionId} />
          <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] mt-1">
            <span className="text-sm font-bold text-[#111827]">Total Paid</span>
            <span className="text-sm font-bold text-[#1A4F9C]">{order.amountLabel}</span>
          </div>
        </Section>

        {/* Sales rep */}
        <Section title="Sales Rep">
          <button
            onClick={() => window.open(`tel:${salesRep.phone.replace(/\s/g, "")}`, "_self")}
            className="flex items-center gap-3 w-full text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#1A4F9C] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{salesRep.initials}</span>
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#111827]">{salesRep.name}</p>
              <p className="text-[11px] text-[#6B7280] mt-0.5">{salesRep.phone}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#16A34A] flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </button>
        </Section>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <Button
            label="Download GST Invoice"
            variant="outlined"
            onClick={() => show("Preparing invoice...", "info")}
          />
          {(canCancel || order.status === "Shipped") && (
            <button
              onClick={() => {
                if (canCancel) show("Cancellation requested", "success");
                else show("Cannot cancel a shipped order", "error");
              }}
              className={`h-[52px] rounded-lg border text-sm font-semibold transition-colors ${
                canCancel
                  ? "border-[#DC2626] text-[#DC2626]"
                  : "border-[#E5E7EB] text-[#9CA3AF] opacity-60"
              }`}
            >
              {canCancel ? "Cancel Order" : "Cannot Cancel (Shipped)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[13px] font-bold text-[#111827] mb-2">{title}</p>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">{children}</div>
    </div>
  );
}

function PayRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs text-[#6B7280]">{label}</span>
      <span className="text-xs font-semibold text-[#111827]">{value}</span>
    </div>
  );
}
