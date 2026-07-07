"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import { quotes } from "@/data/quotes";

export default function QuoteListPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-4xl mx-auto px-6 pt-0 pb-8">
        <div className="bg-white border border-t-0 border-[#E5E7EB] rounded-b-2xl overflow-hidden">
          {/* Page title bar */}
          <div className="border-b border-[#E5E7EB]">
            <div className="relative flex items-center justify-center h-14 px-4">
              <Link
                href="/"
                className="absolute left-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F7] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#111827]" />
              </Link>
              <h1 className="text-[17px] font-bold text-[#111827]">My Quotes</h1>
            </div>
            <p className="text-center text-xs text-[#6B7280] pb-2">{quotes.length} active</p>
          </div>

          {/* Quote list */}
          <div className="p-4 flex flex-col gap-3">
            {quotes.map((q) => (
              <Link
                key={q.id}
                href={`/quote/detail?id=${q.id}`}
                className="block bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[13px] font-bold text-[#111827]">{q.id}</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">Submitted on {q.submittedOn}</p>
                  </div>
                  <StatusBadge status={q.status} />
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={q.productImage}
                    alt={q.productName}
                    className="w-14 h-16 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111827] leading-snug line-clamp-2">{q.productName}</p>
                    <div className="flex items-baseline gap-1.5 mt-1.5">
                      <span className="text-[11px] text-[#6B7280]">Quoted</span>
                      <span className="text-[15px] font-bold text-[#1A4F9C]">{q.quotedPriceLabel}</span>
                    </div>
                    <p className="text-[11px] text-[#F59E0B] mt-0.5">Valid until {q.validUntil}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
