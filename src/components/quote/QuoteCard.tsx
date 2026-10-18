import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { ApiQuote } from "@/types/api";
import { QUOTE_STATUS_LABELS, formatQuoteDate, formatQuotePrice } from "@/utils/quote";
import { getPrimaryProductImage } from "@/utils/product";

export default function QuoteCard({ quote }: { quote: ApiQuote }) {
  const product = quote.items[0]?.product;
  const extraItems = quote.items.length - 1;
  const totalQty = quote.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link
      href={`/quote/detail?id=${quote.id}`}
      className="block bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:shadow-sm transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[13px] font-bold text-[#111827] tracking-wide">{quote.quoteId}</p>
          <p className="text-[11px] text-[#6B7280] mt-0.5">{formatQuoteDate(quote.createdAt)}</p>
        </div>
        <StatusBadge status={QUOTE_STATUS_LABELS[quote.status] ?? quote.status} />
      </div>
      <div className="flex items-center gap-3">
        <img
          src={getPrimaryProductImage(product)}
          alt={product?.name ?? "Product"}
          className="w-14 h-16 rounded-lg object-cover bg-[#F5F5F7] shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-[#111827] leading-snug line-clamp-2">
            {product?.name ?? "—"}
            {extraItems > 0 && (
              <span className="text-[#6B7280] font-normal"> +{extraItems} more</span>
            )}
          </p>
          <p className="text-xs text-[#6B7280] mt-1">Qty: {totalQty}</p>
          {quote.quotedPrice ? (
            <p className="text-[15px] font-bold text-accent mt-1">{formatQuotePrice(quote.quotedPrice)}</p>
          ) : (
            <p className="text-xs text-[#6B7280] mt-1">Awaiting quote</p>
          )}
          {quote.validUntil && (
            <p className="text-[11px] text-[#F59E0B] mt-0.5">Valid until {formatQuoteDate(quote.validUntil)}</p>
          )}
        </div>
        <ChevronRight className="w-4.5 h-4.5 text-[#9CA3AF] shrink-0" />
      </div>
    </Link>
  );
}
