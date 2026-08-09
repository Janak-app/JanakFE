"use client";

import { useState } from "react";
import { X, RefreshCw, ChevronDown } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import { useAuth } from "@/context/AuthContext";
import { ApiProduct } from "@/types/api";
import { formatINR } from "@/data/products";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: ApiProduct;
  initialQty: number;
}

function generateCoupon() {
  const letters = Array.from({ length: 4 }, () =>
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join("");
  const digits = String(Math.floor(100000 + Math.random() * 900000));
  return `Jnk-${letters}-${digits}`;
}

function toIndianWords(amount: number): string {
  if (!amount || isNaN(amount)) return "";
  const crore = Math.floor(amount / 10000000);
  const lakh = Math.floor((amount % 10000000) / 100000);
  const thousand = Math.floor((amount % 100000) / 1000);
  const remainder = Math.floor(amount % 1000);
  const parts: string[] = [];
  if (crore) parts.push(`${crore} crore`);
  if (lakh) parts.push(`${lakh} lakh`);
  if (thousand) parts.push(`${thousand} thousand`);
  if (remainder) parts.push(`${remainder}`);
  return parts.join(" ") + " rupees";
}

function DetailRow({
  label,
  value,
  subValue,
  bold,
  children,
}: {
  label: string;
  value?: string;
  subValue?: string;
  bold?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-dashed border-[#E5E7EB] last:border-0">
      <span className={`text-[13px] shrink-0 w-32 ${bold ? "font-bold text-[#111827]" : "text-[#6B7280]"}`}>
        {label}
      </span>
      <div className="flex-1 flex flex-col items-end">
        {children ?? (
          <span className={`text-[13px] font-semibold text-[#111827] text-right ${bold ? "font-bold" : ""}`}>
            {value}
          </span>
        )}
        {subValue && (
          <span className="text-[11px] text-[#6B7280] mt-0.5 text-right capitalize">{subValue}</span>
        )}
      </div>
    </div>
  );
}

export default function QuoteBottomSheet({ isOpen, onClose, product, initialQty }: Props) {
  const { user } = useAuth();
  const [qty, setQty] = useState(initialQty);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [quotationValue, setQuotationValue] = useState("");
  const [couponCode, setCouponCode] = useState(generateCoupon);

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  const actualValue = product.price ? parseFloat(product.price) : 0;
  const quotedNum = parseFloat(quotationValue) || 0;
  const discount = quotedNum > 0 ? actualValue - quotedNum : 0;

  const inputClass =
    "flex-1 text-right text-[13px] font-semibold text-[#111827] outline-none bg-transparent placeholder:text-[#9CA3AF]";

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} bottomSheetMaximumHeight={620}>
      <div className="flex flex-col px-4 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#111827]">Request a Quotation</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Selected Product */}
        <p className="text-[12px] text-[#6B7280] mb-2">Selected Product</p>
        <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-3 mb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primaryImage?.url}
            alt={product.name}
            className="w-14 h-14 rounded-lg bg-[#F3F4F6] object-contain p-1 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-[#0EA5E9]">
              {product.category?.name ?? "Product"}
            </span>
            <p className="text-[13px] font-bold text-[#111827] leading-snug line-clamp-2">
              {product.name}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="relative flex items-center gap-1 border border-[#E5E7EB] rounded-lg px-2 py-1">
              <span className="text-[12px] font-medium text-[#374151]">Qty : {qty}</span>
              <ChevronDown className="w-3 h-3 text-[#6B7280]" />
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-pointer w-full"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            {actualValue > 0 && (
              <span className="text-[13px] font-bold text-accent">
                {formatINR(actualValue * qty)}
              </span>
            )}
          </div>
        </div>

        {/* Quotation Detail card */}
        <div className="border border-[#E5E7EB] rounded-xl px-4 mb-4">
          <p className="text-[14px] font-bold text-[#111827] py-3 border-b border-dashed border-[#E5E7EB]">
            Quotation Detail
          </p>
          <DetailRow label="Customer Name">
            <input
              className={inputClass}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </DetailRow>
          <DetailRow label="Contact">
            <input
              className={inputClass}
              placeholder="+91 XXXXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              inputMode="tel"
            />
          </DetailRow>
          <DetailRow label="Email Address">
            <input
              className={inputClass}
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputMode="email"
            />
          </DetailRow>
          <DetailRow
            label="Actual Value"
            value={actualValue ? formatINR(actualValue) : "—"}
            subValue={actualValue ? toIndianWords(actualValue) : undefined}
          />
          <DetailRow label="Quotation Value">
            <input
              className={inputClass}
              placeholder="₹ Enter amount"
              value={quotationValue}
              onChange={(e) => setQuotationValue(e.target.value.replace(/[^0-9]/g, ""))}
              inputMode="numeric"
            />
          </DetailRow>
          <DetailRow
            label="Discount Requested"
            value={discount > 0 ? formatINR(discount) : "—"}
            subValue={discount > 0 ? toIndianWords(discount) : undefined}
            bold
          />
        </div>

        {/* Generated Coupon */}
        <p className="text-[12px] text-[#6B7280] mb-2">Generated Coupon</p>
        <div className="flex items-center justify-between border border-accent rounded-xl px-4 py-3">
          <span className="text-[15px] font-bold text-[#111827] tracking-wide">{couponCode}</span>
          <button
            onClick={() => setCouponCode(generateCoupon())}
            className="flex items-center gap-1.5 text-accent text-[13px] font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
