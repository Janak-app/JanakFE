"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Receipt, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  useOrders,
  formatOrderAmount,
  formatOrderDate,
  getOrderPrimaryImage,
  getOrderProductLabel,
} from "@/hooks/useOrders";
import { ApiOrder, ApiOrderStatus } from "@/types/api";

type FilterValue = "All" | ApiOrderStatus;

const FILTERS: FilterValue[] = [
  "All",
  "pending_advance_payment",
  "advance_paid",
  "shipped",
  "delivered",
  "cancelled",
];

const FILTER_LABELS: Record<FilterValue, string> = {
  All: "All",
  pending_advance_payment: "Pending",
  advance_paid: "Advance Paid",
  balance_paid: "Fully Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function OrdersPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterValue>("All");
  const { orders, loading } = useOrders();

  const filtered = useMemo(() => {
    if (filter === "All") return orders;
    return orders.filter((o) => o.status === filter);
  }, [filter, orders]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex items-center px-4 pt-4 pb-2 gap-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <div>
          <h1 className="text-[16px] font-bold text-[#111827]">My Orders</h1>
          {!loading && <p className="text-xs text-[#6B7280]">{orders.length} total orders</p>}
        </div>
      </div>

      {/* Filter chips */}
      <div className="max-w-3xl mx-auto w-full px-4 mt-3">
        <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? "bg-accent text-white border-accent"
                    : "bg-white text-[#6B7280] border-[#E5E7EB]"
                }`}
              >
                {FILTER_LABELS[f]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 mt-4 pb-10">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 animate-pulse">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="h-3.5 w-28 bg-[#E5E7EB] rounded mb-1.5" />
                    <div className="h-3 w-20 bg-[#E5E7EB] rounded" />
                  </div>
                  <div className="h-6 w-20 bg-[#E5E7EB] rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg bg-[#E5E7EB] shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-3/4 bg-[#E5E7EB] rounded" />
                    <div className="h-3 w-16 bg-[#E5E7EB] rounded" />
                    <div className="h-4 w-24 bg-[#E5E7EB] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Receipt className="w-12 h-12 text-[#9CA3AF]" />
            <p className="text-sm font-semibold text-[#111827]">No orders in this status</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: ApiOrder }) {
  const totalQty = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href={`/order/detail?id=${order.id}`}
      className="block bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[13px] font-bold text-[#111827] tracking-wide">{order.orderId}</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">{formatOrderDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex items-center gap-3">
        <img
          src={getOrderPrimaryImage(order)}
          alt={order.items[0]?.productName ?? "Product"}
          className="w-14 h-16 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#111827] leading-snug line-clamp-2">
            {getOrderProductLabel(order)}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">Qty: {totalQty}</p>
          <p className="text-[15px] font-bold text-accent mt-1">{formatOrderAmount(order.totalAmount)}</p>
        </div>
        <ChevronRight className="w-4.5 h-4.5 text-[#9CA3AF] shrink-0" />
      </div>
    </Link>
  );
}
