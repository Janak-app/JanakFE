"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import { useToast } from "@/context/ToastContext";
import useProducts from "@/hooks/useProducts";
import { useCompare } from "@/hooks/useCompare";
import ProductPickerCard from "@/components/compare/ProductPickerCard";
import CompareStickyBar from "@/components/compare/CompareStickyBar";
import CompareTable from "@/components/compare/CompareTable";

type Mode = "pick" | "compare";

export default function ComparePage() {
  const router = useRouter();
  const { show } = useToast();
  const { data: products, loading: productsLoading } = useProducts();
  const { data: compareData, loading: compareLoading, compare } = useCompare();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [mode, setMode] = useState<Mode>("pick");

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } else if (selectedIds.length >= 4) {
      show("You can compare up to 4 products at a time", "info");
    } else {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const handleCompare = async () => {
    await compare(selectedIds);
    setMode("compare");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="hidden md:block">
        <Header />
      </div>

      {/* Title bar */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto px-4 pb-3 flex items-center gap-3" style={{ paddingTop: "calc(var(--sat) + 1.25rem)" }}>
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-[#111827]" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Compare Products</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {mode === "pick"
                ? `Select up to 4 products to compare`
                : `${compareData.length} products`}
            </p>
          </div>
          {mode === "compare" && (
            <button
              onClick={() => setMode("pick")}
              className="text-[13px] font-semibold text-accent"
            >
              Change
            </button>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 pb-28">
        {/* ── Pick mode ── */}
        {mode === "pick" && (
          <>
            {productsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {(products ?? []).map((p) => (
                  <ProductPickerCard
                    key={p.id}
                    product={p}
                    selected={selectedIds.includes(p.id)}
                    disabled={selectedIds.length >= 4 && !selectedIds.includes(p.id)}
                    onToggle={() => toggleSelection(p.id)}
                  />
                ))}
              </div>
            )}
            <CompareStickyBar
              selectedCount={selectedIds.length}
              onCompare={handleCompare}
              loading={compareLoading}
            />
          </>
        )}

        {/* ── Compare mode ── */}
        {mode === "compare" && (
          <>
            {compareLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-accent" />
              </div>
            ) : compareData.length > 0 ? (
              <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <CompareTable products={compareData} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
