"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft, GitCompare, Heart, Share2, Phone, HelpCircle,
  Star, Download, FileText, BarChart2, CheckCircle,
} from "lucide-react";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/products/ProductCard";
import useProductDetail from "@/hooks/useProductDetail";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const TABS = ["Overview", "Specifications", "Downloads", "Reviews"] as const;
type TabKey = typeof TABS[number];

export default function ProductDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const { addItem } = useCart();
  const { show } = useToast();

  const { data, loading, isError } = useProductDetail(id);
  const product = data?.product ?? null;
  const salesRepName = data?.salesRepName ?? "Sales Team";
  const salesRepPhone = data?.salesRepPhone ?? "";
  const salesRepInitials = salesRepName.slice(0, 2).toUpperCase();

  const [tab, setTab] = useState<TabKey>("Overview");
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [askVisible, setAskVisible] = useState(false);
  const [askText, setAskText] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#1A4F9C] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#6B7280]">Product not found.</p>
        </div>
      </div>
    );
  }

  const related: typeof product[] = [];

  const handleAddToCart = () => {
    addItem(product.id, 1);
    show("Added to cart", "success");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] flex items-center px-2 py-2 gap-1">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <div className="flex-1" />
        <button
          onClick={() => show("Compare feature coming soon", "info")}
          className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center"
        >
          <GitCompare className="w-4.5 h-4.5 text-[#111827]" />
        </button>
        <button
          onClick={() => { setWishlisted(!wishlisted); show(wishlisted ? "Removed from wishlist" : "Added to wishlist"); }}
          className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center"
        >
          <Heart className={`w-4.5 h-4.5 ${wishlisted ? "fill-[#DC2626] text-[#DC2626]" : "text-[#111827]"}`} />
        </button>
        <button
          onClick={() => show("Link copied!", "success")}
          className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center"
        >
          <Share2 className="w-4 h-4 text-[#111827]" />
        </button>
      </div>

      <div className="flex-1 pb-28 max-w-3xl mx-auto w-full">
        {/* Image gallery */}
        <div className="bg-[#F5F5F7] relative overflow-hidden">
          <div className="relative h-72 md:h-96">
            <img
              src={product.images[imgIdx]}
              alt={product.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex justify-center gap-1.5 pb-3">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-5 bg-[#1A4F9C]" : "w-1.5 bg-[#CBD5E1]"}`}
              />
            ))}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 px-4 pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? "border-[#1A4F9C]" : "border-transparent"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded border border-[#E5E7EB] bg-[#F5F5F7] text-[10px] font-bold text-[#111827] tracking-[1.5px]">
              {product.brand.toUpperCase()}
            </span>
            <StatusBadge status={product.stock} />
          </div>
          <h1 className="text-xl font-bold text-[#111827] leading-snug tracking-tight">{product.name}</h1>
          <p className="text-xs text-[#6B7280] mt-1">Model: {product.model}</p>

          <div className="mt-3 mb-4">
            {product.price ? (
              <>
                <p className="text-2xl font-bold text-[#1A4F9C] tracking-tight">{product.priceLabel}</p>
                <p className="text-[11px] text-[#6B7280] mt-1">+ 18% GST · Inclusive of warranty</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-[#1A4F9C] tracking-tight">Price on Request</p>
                <p className="text-[11px] text-[#6B7280] mt-1">Tailored pricing for your project</p>
              </>
            )}
          </div>

          {/* Sales rep card */}
          <button
            onClick={() => window.open(`tel:${salesRepPhone.replace(/\s/g, "")}`, "_self")}
            className="w-full flex items-center gap-3 bg-[#F5F5F7] border border-[#E5E7EB] rounded-xl p-3 mb-5 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-[#1A4F9C] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">{salesRepInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold text-[#6B7280] tracking-[1.5px]">YOUR SALES REP</p>
              <p className="text-sm font-bold text-[#111827] mt-0.5">{salesRepName}</p>
              <p className="text-xs text-[#6B7280]">{salesRepPhone}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4 text-white" />
            </div>
          </button>

          {/* Tabs */}
          <div className="flex border-b border-[#E5E7EB] mb-4">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-xs font-medium border-b-2 transition-colors ${
                  tab === t
                    ? "border-[#1A4F9C] text-[#1A4F9C] font-semibold"
                    : "border-transparent text-[#6B7280]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <div>
              <p className="text-sm text-[#374151] leading-relaxed">{product.description}</p>
              <p className="text-sm font-bold text-[#111827] mt-4 mb-2.5">Key Highlights</p>
              <div className="flex flex-col gap-2.5">
                {product.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="w-4.5 h-4.5 rounded-full bg-[#16A34A] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm text-[#374151] leading-snug">{h}</p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setAskVisible(true)}
                className="flex items-center gap-1.5 mt-4 pt-3.5 border-t border-[#E5E7EB] w-full text-left"
              >
                <HelpCircle className="w-4 h-4 text-[#1A4F9C]" />
                <span className="text-[13px] font-semibold text-[#1A4F9C]">Ask a Question</span>
              </button>
            </div>
          )}

          {tab === "Specifications" && (
            <div className="border border-[#E5E7EB] rounded-xl overflow-hidden">
              {product.specs.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex items-center justify-between px-3.5 py-2.5 ${i < product.specs.length - 1 ? "border-b border-[#E5E7EB]" : ""} ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}
                >
                  <span className="text-xs text-[#6B7280] flex-1">{s.label}</span>
                  <span className="text-xs font-semibold text-[#111827] text-right flex-1">{s.value}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "Downloads" && (
            <div className="flex flex-col gap-3">
              {[
                { name: "Product Brochure", size: "2.4 MB", Icon: FileText },
                { name: "Technical Datasheet", size: "1.1 MB", Icon: BarChart2 },
              ].map(({ name, size, Icon }) => (
                <button
                  key={name}
                  onClick={() => show("Downloading...", "info")}
                  className="flex items-center gap-3 p-3.5 bg-white border border-[#E5E7EB] rounded-xl text-left"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-[#FEE2E2] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold text-[#111827]">{name}</p>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">PDF · {size}</p>
                  </div>
                  <Download className="w-5 h-5 text-[#1A4F9C]" />
                </button>
              ))}
            </div>
          )}

          {tab === "Reviews" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 p-4 bg-[#F5F5F7] rounded-xl">
                <span className="text-4xl font-bold text-[#111827]">4.7</span>
                <div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-[#FCD34D] text-[#FCD34D]"}`} />
                    ))}
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-1">Based on {product.reviews.length} reviews</p>
                </div>
              </div>
              {product.reviews.map((r) => (
                <div key={r.name} className="p-3.5 bg-white border border-[#E5E7EB] rounded-xl">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[13px] font-bold text-[#111827]">{r.name}</p>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= r.rating ? "fill-[#F59E0B] text-[#F59E0B]" : "text-[#E5E7EB]"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B7280]">{r.date}</p>
                  <p className="text-[13px] text-[#374151] mt-2 leading-snug">{r.text}</p>
                </div>
              ))}
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-8">
              <p className="text-sm font-bold text-[#111827] mb-3">Related Products</p>
              <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {related.map((p) => (
                  <div key={p.id} className="w-48 shrink-0">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-5 z-20">
        <div className="max-w-3xl mx-auto flex gap-3">
          <div className="flex-1">
            <Button
              label="Request Quote"
              variant="outlined"
              onClick={() => router.push(`/quote/request?productId=${product.id}`)}
            />
          </div>
          {product.price && (
            <div className="flex-1">
              <Button label="Add to Cart" onClick={handleAddToCart} />
            </div>
          )}
        </div>
      </div>

      {askVisible && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAskVisible(false)} />
          <div className="relative bg-white w-full max-w-3xl rounded-t-2xl p-5 pb-8">
            <div className="w-10 h-1 bg-[#E5E7EB] rounded mx-auto mb-4" />
            <h2 className="text-lg font-bold text-[#111827]">Ask a Question</h2>
            <p className="text-xs text-[#6B7280] mt-1 mb-3">About {product.name}</p>
            <textarea
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              placeholder="Type your question here..."
              rows={4}
              className="w-full bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg p-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none resize-none mb-3"
            />
            <Button
              label="Send Question"
              onClick={() => {
                setAskVisible(false);
                setAskText("");
                show("Question sent to sales team", "success");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
