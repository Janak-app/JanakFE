"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Copy, Download, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/data/products";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";

const ORDER_ID = "000085752257";
const NET_PAYABLE = 1100500;
const BOOKING_AMOUNT = 50000;
const REMAINING = NET_PAYABLE - BOOKING_AMOUNT;
const DUE_DATE = "Jun 30, 2026";

const MOCK_ITEMS = [
  { id: "1", category: "GNSS Antenna", name: "AgAnt-3S-430x311", quantity: 2 },
  { id: "2", category: "GNSS Antenna", name: "AgAnt-3S-430x311", quantity: 2 },
];

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { show } = useToast();

  const [merchantTxnNo, setMerchantTxnNo] = useState<string | null>(null);

  useEffect(() => {
    const txnNo = sessionStorage.getItem("merchantTxnNo");
    if (txnNo) {
      sessionStorage.removeItem("merchantTxnNo");
      setMerchantTxnNo(txnNo);
    }
  }, []);

  const { status, loading: statusLoading, error: statusError } = usePaymentStatus({ merchantTxnNo });

  // Show spinner while polling
  if (merchantTxnNo && (statusLoading || status === "PENDING" || status === null)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="text-[15px] font-semibold text-[#374151]">Confirming your payment…</p>
      </div>
    );
  }

  // Show error if payment failed or status check errored
  if (merchantTxnNo && (status === "FAILED" || statusError)) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[20px] font-bold text-[#DC2626]">Payment Failed</p>
        <p className="text-[14px] text-[#6B7280]">
          We could not confirm your payment. Please try again.
        </p>
        <button
          onClick={() => router.push("/checkout")}
          className="mt-2 px-6 py-3 bg-accent text-white text-[14px] font-semibold rounded-xl"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(ORDER_ID);
    show("Order ID copied!", "success");
  };

  return (
    <div className="min-h-screen bg-white pb-10">

      {/* ── Logo ── */}
      <div className="px-4 pt-5 pb-4">
        <Image
          src="/logo/janak-logo.svg"
          alt="Janak"
          width={110}
          height={38}
          priority
        />
      </div>

      {/* ── Order Confirmation header ── */}
      <div className="px-4 flex items-center gap-4 mb-6">
        <Image
          src="/common/success-tick.svg"
          alt="Order confirmed"
          width={72}
          height={72}
          className="shrink-0"
        />
        <div>
          <h1 className="text-[26px] font-extrabold text-[#111827] leading-tight">
            Order<br />Confirmation
          </h1>
        </div>
      </div>

      <div className="px-4 flex flex-col gap-6">

        {/* ── Greeting ── */}
        <div>
          <p className="text-[16px] font-bold text-[#111827] mb-1">Hii Ashish</p>
          <p className="text-[14px] text-[#374151] leading-relaxed">
            Thank You for ordering from us. We have successfully received your order
          </p>
          <div className="flex items-center gap-2 mt-3">
            <p className="text-[14px] text-[#374151]">
              Order Id - <span className="font-bold text-[#111827]">{ORDER_ID}</span>
            </p>
            <button onClick={handleCopyOrderId}>
              <Copy className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div>
          <p className="text-[16px] font-bold text-[#111827] mb-3">Order Summary</p>
          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
            {MOCK_ITEMS.map((item, i) => (
              <div key={item.id}>
                <div className="flex items-center gap-3 p-4">
                  <div className="w-24 h-20 bg-[#F3F4F6] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=400"
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-accent mb-1">{item.category}</p>
                    <p className="text-[15px] font-bold text-[#111827] mb-1">{item.name}</p>
                    <p className="text-[13px] font-semibold text-accent">Quantity - {item.quantity}</p>
                  </div>
                </div>
                {i < MOCK_ITEMS.length - 1 && <div className="h-px bg-[#E5E7EB] mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Payment Summary ── */}
        <div>
          <p className="text-[16px] font-bold text-[#111827] mb-3">Payment Summary</p>
          <div className="border border-[#E5E7EB] rounded-2xl overflow-hidden">
            <PaymentRow
              label="Net Payable Amount"
              amount={formatINR(NET_PAYABLE)}
              subtext="Eleven lakh five hundred rupees"
            />
            <PaymentRow
              label="Booking Amount"
              amount={formatINR(BOOKING_AMOUNT)}
              subtext="Fifty thousand"
            />
            <PaymentRow
              label="Amount Remaining"
              amount={formatINR(REMAINING)}
              subtext="Ten lakh twenty five hundred rupees"
              bold
            />
          </div>

          {/* Pay Remaining Amount card */}
          <div className="mt-3 border border-[#E5E7EB] rounded-2xl p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 bg-[#FFA500] rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-white font-bold text-[15px] italic">i</span>
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#D97706]">Pay Remaining Amount</p>
                <p className="text-[13px] text-[#D97706] mt-1 leading-snug">
                  Please Pay{" "}
                  <span className="font-bold">{formatINR(REMAINING)}</span>{" "}
                  by {DUE_DATE} to avoid delay in delivery
                </p>
              </div>
            </div>
            <button
              onClick={() => show("Bank details coming soon", "info")}
              className="flex items-center justify-between w-full pt-3 border-t border-[#E5E7EB]"
            >
              <span className="text-[13px] font-semibold text-accent">View bank details for payment</span>
              <ChevronRight className="w-4 h-4 text-[#6B7280]" />
            </button>
          </div>

          {/* Download Invoice */}
          <button
            onClick={() => show("Preparing invoice...", "info")}
            className="w-full mt-3 flex items-center justify-center gap-2 border border-[#E5E7EB] rounded-2xl py-4 text-[14px] font-semibold text-[#111827]"
          >
            <Download className="w-5 h-5 text-[#374151]" />
            Download Invoice
          </button>
        </div>

        {/* ── Deliver To ── */}
        <div>
          <p className="text-[16px] font-bold text-[#111827] mb-3">Deliver To</p>
          <div className="border border-[#E5E7EB] rounded-2xl p-4">
            <p className="text-[14px] font-bold text-[#111827]">Aashish Sharma</p>
            <p className="text-[13px] text-[#374151] mt-1 leading-snug">
              311, Sunlight Apartment, Sector 44 Noida, 247667
            </p>
            <p className="text-[13px] text-[#374151] mt-2">Contact - 7073250472</p>
            <div className="border-t border-dashed border-[#E5E7EB] mt-4 pt-3">
              <button
                onClick={() => router.push("/checkout/address")}
                className="w-full text-center text-[13px] font-semibold text-accent"
              >
                Change delivery address
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function PaymentRow({
  label,
  amount,
  subtext,
  bold = false,
}: {
  label: string;
  amount: string;
  subtext: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3 border-b border-dashed border-[#E5E7EB] last:border-0">
      <span className={`text-[13px] text-[#6B7280] leading-snug ${bold ? "font-bold text-[#111827]" : ""}`}>
        {label}
      </span>
      <div className="text-right shrink-0">
        <p className={`text-[13px] font-semibold text-[#111827] ${bold ? "font-bold" : ""}`}>{amount}</p>
        <p className="text-[11px] text-[#9CA3AF] mt-0.5">{subtext}</p>
      </div>
    </div>
  );
}
