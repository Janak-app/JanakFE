const STATUS_MAP: Record<string, { bg: string; text: string }> = {
  "In Stock": { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  "Limited Stock": { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  "On Order": { bg: "bg-[#E5E7EB]", text: "text-[#6B7280]" },
  Delivered: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  Shipped: { bg: "bg-[#DBEAFE]", text: "text-accent" },
  Confirmed: { bg: "bg-[#DBEAFE]", text: "text-accent" },
  Pending: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  Cancelled: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
  "Quote Sent": { bg: "bg-[#E0F2FE]", text: "text-[#0EA5E9]" },
  Accepted: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  Declined: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
  "In Service": { bg: "bg-[#DBEAFE]", text: "text-accent" },
  Completed: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  // API snake_case order statuses
  pending_advance_payment: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  advance_paid: { bg: "bg-[#DBEAFE]", text: "text-accent" },
  balance_paid: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  processing: { bg: "bg-[#DBEAFE]", text: "text-accent" },
  shipped: { bg: "bg-[#DBEAFE]", text: "text-accent" },
  delivered: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  cancelled: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
};

const STATUS_LABELS: Record<string, string> = {
  pending_advance_payment: "Pending",
  advance_paid: "Advance Paid",
  balance_paid: "Fully Paid",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function StatusBadge({ status }: { status: string }) {
  const c = STATUS_MAP[status] || { bg: "bg-[#F5F5F7]", text: "text-[#6B7280]" };
  const label = STATUS_LABELS[status] ?? status;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${c.bg} ${c.text}`}
    >
      {label}
    </span>
  );
}
