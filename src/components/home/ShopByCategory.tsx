"use client";

import Link from "next/link";
import { Tag, ArrowRight } from "lucide-react";
import useCategories from "@/hooks/useCategories";

export default function ShopByCategory() {
  const { data: categories, loading } = useCategories();

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-6 md:py-14">
        <div className="flex gap-3 overflow-x-auto pb-2 md:hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="shrink-0 w-40 flex flex-col items-center gap-2">
              <div className="w-40 h-40 rounded-2xl bg-[#F3F4F6] animate-pulse" />
              <div className="h-3.5 w-24 rounded bg-[#F3F4F6] animate-pulse" />
            </div>
          ))}
        </div>
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="border border-[#E5E7EB] rounded-2xl p-6 h-36 animate-pulse bg-[#F9FAFB]" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 md:py-14">

      {/* Mobile header */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h2 className="text-[17px] font-bold text-[#111827]">Shop by Category</h2>
        <Link
          href="/explore"
          className="text-[13px] font-semibold text-accent flex items-center gap-0.5 border-b-2 pb-0.5"
        >
          View all
        </Link>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block mb-10">
        <h2 className="text-3xl font-extrabold text-[#111827] mb-1">Shop by Category</h2>
        <p className="text-sm text-[#6B7280]">
          From entry-level RTK rovers to enterprise UAV LiDAR — find the right tool for the job.
        </p>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:hidden [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/explore?cat=${cat.slug}`}
            className="flex flex-col items-center gap-2 shrink-0 w-40"
          >
            <div className="w-40 h-40 rounded-2xl bg-[#E0EAF7] flex items-center justify-center">
              <Tag className="w-10 h-10 text-accent" />
            </div>
            <p className="text-[14px] font-bold text-[#111827] text-center leading-tight">
              {cat.name}
            </p>
          </Link>
        ))}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/explore?cat=${cat.slug}`}
            className="group border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-8 hover:shadow-md hover:border-accent/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-[#E0EAF7] flex items-center justify-center">
                <Tag className="w-6 h-6 text-accent" />
              </div>
              <div className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center group-hover:border-accent group-hover:bg-[#E0EAF7] transition-colors">
                <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-accent transition-colors" />
              </div>
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#111827]">{cat.name}</p>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}
