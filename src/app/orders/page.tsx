"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Receipt, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import { orders, Order, OrderStatus } from "@/data/orders";

const FILTERS: ("All" | OrderStatus)[] = ["All", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [filter, setFilter] = useState<typeof FILTERS[number]>("All");

  const filtered = useMemo(() => {
    if (filter === "All") return orders;
    return orders.filter((o) => o.status === filter);
  }, [filter]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="max-w-3xl mx-auto w-full px-4 pt-5">
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">My Orders</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">{orders.length} total orders</p>
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
                    ? "bg-[#1A4F9C] text-white border-[#1A4F9C]"
                    : "bg-white text-[#6B7280] border-[#E5E7EB]"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 mt-4 pb-10">
        {filtered.length === 0 ? (
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

function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      href={`/order/detail?id=${order.id}`}
      className="block bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[13px] font-bold text-[#111827] tracking-wide">{order.id}</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">{order.date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="flex items-center gap-3">
        <img
          src={order.productImage}
          alt={order.productName}
          className="w-14 h-16 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#111827] leading-snug line-clamp-2">{order.productName}</p>
          <p className="text-xs text-[#6B7280] mt-1">Qty: {order.quantity}</p>
          <p className="text-[15px] font-bold text-[#1A4F9C] mt-1">{order.amountLabel}</p>
        </div>
        <ChevronRight className="w-4.5 h-4.5 text-[#9CA3AF] shrink-0" />
      </div>
    </Link>
  );
}
