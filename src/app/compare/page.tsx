"use client";

import { useRouter } from "next/navigation";
import { Lightbulb } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { getProductById } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const COMPARE_IDS = ["leica-gs18", "hi-target-irtk5"];

const SPEC_LABELS = [
  "Horizontal Accuracy (RTK)",
  "Vertical Accuracy (RTK)",
  "Channels",
  "Weight",
  "IP Rating",
  "Battery Life",
  "Connectivity",
  "Warranty",
];

export default function ComparePage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { show } = useToast();

  const p1 = getProductById(COMPARE_IDS[0])!;
  const p2 = getProductById(COMPARE_IDS[1])!;

  const findSpec = (p: typeof p1, label: string) =>
    p.specs.find((s) => s.label === label)?.value || "—";

  const handleAdd = (id: string) => {
    addItem(id, 1);
    show("Added to cart", "success");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />

      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto px-4 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Compare Products</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">{COMPARE_IDS.length} of 4</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 pb-10">
        {/* Product headers */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[p1, p2].map((p) => (
            <div key={p.id} className="bg-white border border-[#E5E7EB] rounded-xl p-2.5 flex flex-col items-center">
              <div className="w-full h-24 bg-[#F5F5F7] rounded-lg overflow-hidden mb-2">
                <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-[9px] font-bold text-[#6B7280] tracking-[1.2px]">{p.brand.toUpperCase()}</p>
              <p className="text-[12px] font-bold text-[#111827] text-center leading-tight mt-1 min-h-8 line-clamp-2">
                {p.name}
              </p>
              <p className="text-sm font-bold text-[#1A4F9C] mt-1.5">{p.priceLabel}</p>
            </div>
          ))}
        </div>

        {/* Spec table */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-4">
          {SPEC_LABELS.map((label, idx) => (
            <div
              key={label}
              className={`grid grid-cols-3 ${idx < SPEC_LABELS.length - 1 ? "border-b border-[#E5E7EB]" : ""} ${idx % 2 === 1 ? "bg-[#F9FAFB]" : "bg-white"}`}
            >
              <div className="px-3 py-3 col-span-1">
                <p className="text-[11px] font-semibold text-[#6B7280] leading-snug">{label}</p>
              </div>
              <div className="px-2 py-3 text-center border-l border-[#E5E7EB]">
                <p className="text-[11px] font-medium text-[#111827]">{findSpec(p1, label)}</p>
              </div>
              <div className="px-2 py-3 text-center border-l border-[#E5E7EB]">
                <p className="text-[11px] font-medium text-[#111827]">{findSpec(p2, label)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Verdict */}
        <div className="flex gap-3 p-4 bg-[#FFFBEB] border border-[#FCD34D] rounded-xl mb-4">
          <div className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center shrink-0">
            <Lightbulb className="w-4.5 h-4.5 text-[#F59E0B]" />
          </div>
          <div>
            <p className="text-[13px] font-bold text-[#111827] mb-1">Quick Take</p>
            <p className="text-xs text-[#374151] leading-relaxed">
              The <strong>Leica GS18 I</strong> offers superior accuracy (6mm vs 8mm), while the{" "}
              <strong>Hi-Target iRTK5</strong> provides better value & longer battery life.
            </p>
          </div>
        </div>

        {/* Add to cart row */}
        <div className="grid grid-cols-2 gap-2.5">
          {[p1, p2].map((p) =>
            p.price ? (
              <Button key={p.id} label="Add to Cart" onClick={() => handleAdd(p.id)} />
            ) : (
              <Button
                key={p.id}
                label="Get Quote"
                variant="outlined"
                onClick={() => router.push(`/quote/request?productId=${p.id}`)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
