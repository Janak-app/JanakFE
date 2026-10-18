"use client";

import { Phone } from "lucide-react";

// Fixed sales lines shown alongside the product's assigned rep
// TODO: replace the second (placeholder) number with the real sales line
const SALES_PHONES = ["+91 22 4040 1985", "+91 98765 43210"];

type SalesRepCardProps = {
  name: string;
  phone: string;
  onCall: () => void;
};

export default function SalesRepCard({ name, phone, onCall }: SalesRepCardProps) {
  const initials = name.slice(0, 2).toUpperCase();
  const numbers = [...new Set([phone, ...SALES_PHONES].filter(Boolean))];

  const call = (number: string) => {
    onCall();
    window.open(`tel:${number.replace(/\s/g, "")}`, "_self");
  };

  return (
    <div className="w-full bg-[#F5F5F7] border border-[#E5E7EB] rounded-xl p-3 mb-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] font-bold text-[#6B7280] tracking-[1.5px]">YOUR SALES REP</p>
          <p className="text-sm font-bold text-[#111827] mt-0.5">{name}</p>
        </div>
      </div>
      <div className="mt-2.5 flex flex-col gap-2">
        {numbers.map((number) => (
          <button
            key={number}
            onClick={() => call(number)}
            className="w-full flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-left"
          >
            <p className="flex-1 text-xs font-medium text-[#111827]">{number}</p>
            <div className="w-8 h-8 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0">
              <Phone className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
