"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import QuoteCard from "@/components/quote/QuoteCard";
import { useQuotes } from "@/hooks/useQuotes";
import { ApiQuote } from "@/types/api";
import { QUOTE_STATUS_LABELS } from "@/utils/quote";

type FilterValue = "All" | ApiQuote["status"];

const FILTERS: FilterValue[] = ["All", "pending", "quote_sent", "accepted", "declined"];

export default function QuoteListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterValue>("All");
  const { quotes, loading } = useQuotes();

  const filtered = useMemo(() => {
    if (filter === "All") return quotes;
    return quotes.filter((q) => q.status === filter);
  }, [filter, quotes]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex items-center px-4 pb-2 gap-2" style={{ paddingTop: "calc(var(--sat) + 1rem)" }}>
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <div>
          <h1 className="text-[16px] font-bold text-[#111827]">My Quotes</h1>
          {!loading && <p className="text-xs text-[#6B7280]">{quotes.length} total quotes</p>}
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
                {f === "All" ? "All" : QUOTE_STATUS_LABELS[f]}
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
            <FileText className="w-12 h-12 text-[#9CA3AF]" />
            <p className="text-sm font-semibold text-[#111827]">
              {quotes.length === 0 ? "No quotes yet" : "No quotes in this status"}
            </p>
            {quotes.length === 0 && (
              <p className="text-xs text-[#6B7280]">Your submitted quote requests will appear here</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((quote) => (
              <QuoteCard key={quote.id} quote={quote} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
