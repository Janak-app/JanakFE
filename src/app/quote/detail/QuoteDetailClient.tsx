"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, FileText, Tag } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import useQuoteDetail from "@/hooks/useQuoteDetail";
import { salesRep } from "@/data/user";
import { useToast } from "@/context/ToastContext";
import { QUOTE_STATUS_LABELS, formatQuoteDate, formatQuotePrice } from "@/utils/quote";
import { getPrimaryProductImage } from "@/utils/product";

const STATUS_BANNER: Record<string, string> = {
  pending: "Quote request received, awaiting response from our team",
  quote_sent: "Quote received from sales team",
  accepted: "Quote accepted",
  declined: "Quote declined",
};

export default function QuoteDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const { show } = useToast();

  const { data: q, loading } = useQuoteDetail(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col gap-4 animate-pulse">
          <div className="h-24 bg-[#E5E7EB] rounded-xl" />
          <div className="h-24 bg-[#E5E7EB] rounded-xl" />
          <div className="h-32 bg-[#E5E7EB] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#6B7280]">Quote not found.</p>
        </div>
      </div>
    );
  }

  const showActions = q.status === "quote_sent";

  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-[#111827]" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#111827]">Quote Detail</h1>
            <p className="text-[11px] text-[#6B7280]">{q.quoteId}</p>
          </div>
        </div>
      </div>

      <div className={`max-w-3xl mx-auto px-4 py-4 flex flex-col gap-4 ${showActions ? "pb-36" : "pb-8"}`}>
        {/* Banner */}
        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4 flex items-center justify-between">
          <div>
            <StatusBadge status={QUOTE_STATUS_LABELS[q.status] ?? q.status} />
            <p className="text-sm font-bold text-[#111827] mt-2">{STATUS_BANNER[q.status] ?? "Quote request"}</p>
            {q.validUntil && (
              <p className="text-[11px] text-[#F59E0B] mt-1">Valid until {formatQuoteDate(q.validUntil)}</p>
            )}
          </div>
          <FileText className="w-8 h-8 text-accent shrink-0" />
        </div>

        {/* Products */}
        <div>
          <p className="text-[13px] font-bold text-[#111827] mb-2">Items</p>
          <div className="flex flex-col gap-2.5">
            {q.items.map((item) => (
              <div key={item.id} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 flex items-center gap-3">
                <img
                  src={getPrimaryProductImage(item.product)}
                  alt={item.product.name}
                  className="w-16 h-20 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
                />
                <div className="flex-1">
                  <p className="text-[13px] font-bold text-[#111827] leading-snug">{item.product.name}</p>
                  <p className="text-xs text-[#6B7280] mt-1">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quoted price */}
        <div>
          <p className="text-[13px] font-bold text-[#111827] mb-2">Quoted Price</p>
          {q.quotedPrice ? (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col items-center">
              <p className="text-4xl font-bold text-accent tracking-tight">{formatQuotePrice(q.quotedPrice)}</p>
              <p className="text-[11px] text-[#6B7280] mt-1.5">+ 18% GST</p>
              <div className="flex items-center gap-1.5 bg-[#DCFCE7] px-3 py-1.5 rounded-full mt-3">
                <Tag className="w-3 h-3 text-[#16A34A]" />
                <span className="text-[10px] font-semibold text-[#16A34A]">Volume discount applied</span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col items-center">
              <p className="text-sm text-[#6B7280]">Awaiting quote from our team</p>
            </div>
          )}
        </div>

        {/* Requirement details */}
        <div>
          <p className="text-[13px] font-bold text-[#111827] mb-2">Requirement Details</p>
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#6B7280]">Intended Use</span>
              <span className="text-[13px] font-semibold text-[#111827]">{q.intendedUse}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#6B7280]">Timeline</span>
              <span className="text-[13px] font-semibold text-[#111827]">{q.timeline}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-[#6B7280]">Budget Range</span>
              <span className="text-[13px] font-semibold text-[#111827]">{q.budgetRange}</span>
            </div>
          </div>
        </div>

        {/* Admin response */}
        {q.adminResponse && (
          <div>
            <p className="text-[13px] font-bold text-[#111827] mb-2">Admin&apos;s Response</p>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">{salesRep.initials}</span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111827]">{salesRep.name}</p>
                  <p className="text-[10px] text-[#6B7280]">Sales Manager · {salesRep.region}</p>
                </div>
              </div>
              <p className="text-[13px] text-[#374151] leading-relaxed">{q.adminResponse}</p>
            </div>
          </div>
        )}

        {/* Notes */}
        {q.notes && (
          <div>
            <p className="text-[13px] font-bold text-[#111827] mb-2">Your Notes</p>
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">
              <p className="text-[13px] text-[#6B7280] leading-relaxed">{q.notes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      {showActions && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 pt-3 pb-6 z-20">
          <div className="max-w-3xl mx-auto flex gap-2 mb-2">
            <div className="flex-1">
              <Button
                label="Negotiate"
                variant="outlined"
                onClick={() => show("Negotiation request sent", "info")}
              />
            </div>
            <button
              onClick={() => show("Quote declined", "error")}
              className="h-[52px] px-5 rounded-lg border border-[#DC2626] text-[#DC2626] text-sm font-semibold"
            >
              Decline
            </button>
          </div>
          <div className="max-w-3xl mx-auto">
            <Button
              label="Accept Quote · Proceed to Cart"
              onClick={() => show("Quote accepted!", "success")}
            />
          </div>
        </div>
      )}
    </div>
  );
}
