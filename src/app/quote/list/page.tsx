"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import { useQuotes } from "@/hooks/useQuotes";
import { ApiQuote } from "@/types/api";
import { useRouter } from "next/navigation";

const STATUS_MAP: Record<ApiQuote["status"], string> = {
  pending: "Pending",
  quote_sent: "Quote Sent",
  accepted: "Accepted",
  declined: "Declined",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(price: string) {
  const num = Math.round(parseFloat(price));
  return "₹" + num.toLocaleString("en-IN");
}

function getPrimaryImage(quote: ApiQuote): string {
  const primary = quote.product.images.find((img) => img.isPrimary);
  return primary?.url ?? quote.product.images[0]?.url ?? "";
}

export default function QuoteListPage() {
  const { quotes, loading } = useQuotes();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-0 pb-8">
        <div className="bg-white border border-t-0 border-[#E5E7EB] rounded-b-2xl overflow-hidden">
          {/* Page title bar */}
          <div className="border-b border-[#E5E7EB]">
            <div className="relative flex items-center justify-center h-14 px-4">
              <button
                onClick={() => router.back()}
                className="absolute left-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F7] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#111827]" />
              </button>
              <h1 className="text-[17px] font-bold text-[#111827]">My Quotes</h1>
            </div>
            {!loading && (
              <p className="text-center text-xs text-[#6B7280] pb-2">{quotes.length} active</p>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col gap-3">
            {loading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="h-3.5 w-28 bg-[#E5E7EB] rounded mb-1.5" />
                      <div className="h-3 w-24 bg-[#E5E7EB] rounded" />
                    </div>
                    <div className="h-6 w-20 bg-[#E5E7EB] rounded-full" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-lg bg-[#E5E7EB] shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-3/4 bg-[#E5E7EB] rounded" />
                      <div className="h-4 w-24 bg-[#E5E7EB] rounded" />
                      <div className="h-3 w-20 bg-[#E5E7EB] rounded" />
                    </div>
                  </div>
                </div>
              ))
            ) : quotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <FileText className="w-12 h-12 text-[#9CA3AF]" />
                <p className="text-sm font-semibold text-[#111827]">No quotes yet</p>
                <p className="text-xs text-[#6B7280]">Your submitted quote requests will appear here</p>
              </div>
            ) : (
              quotes.map((q) => (
                <Link
                  key={q.id}
                  href={`/quote/detail?id=${q.id}`}
                  className="block bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-[13px] font-bold text-[#111827]">{q.id}</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">Submitted on {formatDate(q.createdAt)}</p>
                    </div>
                    <StatusBadge status={STATUS_MAP[q.status] ?? q.status} />
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={getPrimaryImage(q)}
                      alt={q.product.name}
                      className="w-14 h-16 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111827] leading-snug line-clamp-2">{q.product.name}</p>
                      {q.quotedPrice ? (
                        <div className="flex items-baseline gap-1.5 mt-1.5">
                          <span className="text-[11px] text-[#6B7280]">Quoted</span>
                          <span className="text-[15px] font-bold text-accent">{formatPrice(q.quotedPrice)}</span>
                        </div>
                      ) : (
                        <p className="text-[12px] text-[#6B7280] mt-1.5">Awaiting quote</p>
                      )}
                      {q.validUntil && (
                        <p className="text-[11px] text-[#F59E0B] mt-0.5">Valid until {formatDate(q.validUntil)}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
