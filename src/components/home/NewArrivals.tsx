"use client";

import Link from "next/link";
import useProducts from "@/hooks/useProducts";
import FeaturedCard from "@/components/products/FeaturedCard";

export default function NewArrivals() {
  const { data: newArrivals = [], loading } = useProducts({ newArrival: true });

  return (
    <div className="mt-7 max-w-7xl mx-auto">
      <div className="flex items-center justify-between px-4 mb-3">
        <span className="text-[17px] font-bold text-[#111827]">New Arrivals</span>
        <span className="bg-[#DC2626] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest">
          NEW
        </span>
      </div>

      {loading ? (
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-56 shrink-0 border border-[#E5E7EB] rounded-2xl overflow-hidden">
              <div className="h-48 bg-[#F3F4F6] animate-pulse" />
              <div className="p-4 flex flex-col gap-2">
                <div className="h-4 w-20 rounded-full bg-[#F3F4F6] animate-pulse" />
                <div className="h-5 w-full rounded bg-[#F3F4F6] animate-pulse" />
                <div className="h-4 w-24 rounded bg-[#F3F4F6] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
          {newArrivals.map((p) => (
            <div key={p.id} className="w-56 shrink-0">
              <FeaturedCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
