import type { ApiQuote } from "@/types/api";

export const QUOTE_STATUS_LABELS: Record<ApiQuote["status"], string> = {
  pending: "Pending",
  quote_sent: "Quote Sent",
  accepted: "Accepted",
  declined: "Declined",
};

export function formatQuoteDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatQuotePrice(price: string) {
  const num = Math.round(parseFloat(price));
  return "₹" + num.toLocaleString("en-IN");
}
