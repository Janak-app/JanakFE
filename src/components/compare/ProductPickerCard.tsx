"use client";

import { CheckCircle } from "lucide-react";
import type { Product } from "@/data/products";

type Props = {
  product: Product;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
};

export default function ProductPickerCard({ product, selected, disabled, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative text-left bg-white rounded-xl border-2 p-2.5 flex flex-col items-center transition-all
        ${selected ? "border-accent" : "border-[#E5E7EB]"}
        ${disabled ? "opacity-40 pointer-events-none" : ""}
      `}
    >
      {selected && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-5 h-5 text-accent fill-[#EFF6FF]" />
        </div>
      )}

      <div className="w-full h-20 bg-[#F5F5F7] rounded-lg overflow-hidden mb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain p-1"
        />
      </div>

      <p className="text-[9px] font-bold text-[#6B7280] tracking-[1.2px] uppercase">
        {product.brand}
      </p>
      <p className="text-[11px] font-bold text-[#111827] text-center leading-tight mt-0.5 min-h-8 line-clamp-2">
        {product.name}
      </p>
    </button>
  );
}
