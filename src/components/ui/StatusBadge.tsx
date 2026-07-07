const STATUS_MAP: Record<string, { bg: string; text: string }> = {
  "In Stock": { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  "Limited Stock": { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  "On Order": { bg: "bg-[#E5E7EB]", text: "text-[#6B7280]" },
  Delivered: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  Shipped: { bg: "bg-[#DBEAFE]", text: "text-[#1A4F9C]" },
  Confirmed: { bg: "bg-[#DBEAFE]", text: "text-[#1A4F9C]" },
  Pending: { bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
  Cancelled: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
  "Quote Sent": { bg: "bg-[#E0F2FE]", text: "text-[#0EA5E9]" },
  Accepted: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
  Declined: { bg: "bg-[#FEE2E2]", text: "text-[#DC2626]" },
  "In Service": { bg: "bg-[#DBEAFE]", text: "text-[#1A4F9C]" },
  Completed: { bg: "bg-[#DCFCE7]", text: "text-[#16A34A]" },
};

export default function StatusBadge({ status }: { status: string }) {
  const c = STATUS_MAP[status] || { bg: "bg-[#F5F5F7]", text: "text-[#6B7280]" };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide ${c.bg} ${c.text}`}
    >
      {status}
    </span>
  );
}
