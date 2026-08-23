"use client";

import { useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft, ChevronRight, GitCompare, Heart, Share2, Phone,
  Star, CheckCircle, ShoppingCart, ClipboardList, FileText, Download,
} from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import Button from "@/components/ui/Button";
import ProductCard from "@/components/products/ProductCard";
import useProductDetail from "@/hooks/useProductDetail";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

const TABS = ["Overview", "Key Specifications", "Reviews", "Downloads"] as const;
type TabKey = typeof TABS[number];

export default function ProductDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();
  const { addItem, items, updateQty, cartCount } = useCart();
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
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#6B7280]">Product not found.</p>
        </div>
      </div>
    );
  }

  const related: typeof product[] = [];

  const cartItem = items.find((i) => i.productId === product.id);
  const cartQty = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    addItem(product.id, 1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] flex items-center px-2 pb-2 gap-1" style={{ paddingTop: "calc(var(--sat) + 0.5rem)" }}>
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
          <GitCompare className="w-4 h-4 text-[#111827]" />
        </button>
        <button
          onClick={() => { setWishlisted(!wishlisted); show(wishlisted ? "Removed from wishlist" : "Added to wishlist"); }}
          className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center"
        >
          <Heart className={`w-4 h-4 ${wishlisted ? "fill-[#DC2626] text-[#DC2626]" : "text-[#111827]"}`} />
        </button>
        <button
          onClick={() => show("Link copied!", "success")}
          className="w-9 h-9 rounded-full bg-[#F5F5F7] flex items-center justify-center"
        >
          <Share2 className="w-4 h-4 text-[#111827]" />
        </button>
      </div>

      <div className="flex-1 pb-32 max-w-3xl mx-auto w-full">
        {/* Image gallery */}
        <div className="bg-[#F5F5F7] relative overflow-hidden">
          <div className="relative h-72 md:h-96">
            <Image
              src={product.images[imgIdx]}
              alt={product.name}
              fill
              className="object-contain"
            />
          </div>
          <div className="flex justify-center gap-1.5 pb-3">
            {product.images.map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === imgIdx ? "w-5 bg-accent" : "w-1.5 bg-[#CBD5E1]"}`}
              />
            ))}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 px-4 pb-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`relative shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? "border-accent" : "border-transparent"}`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
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
                <p className="text-2xl font-bold text-accent tracking-tight">{product.priceLabel}</p>
                <p className="text-[11px] text-[#6B7280] mt-1">+ 18% GST · Inclusive of warranty</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-accent tracking-tight">Price on Request</p>
                <p className="text-[11px] text-[#6B7280] mt-1">Tailored pricing for your project</p>
              </>
            )}
          </div>

          {/* Sales rep card */}
          <button
            onClick={() => window.open(`tel:${salesRepPhone.replace(/\s/g, "")}`, "_self")}
            className="w-full flex items-center gap-3 bg-[#F5F5F7] border border-[#E5E7EB] rounded-xl p-3 mb-5 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0">
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
                    ? "border-accent text-accent font-semibold"
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

              {/* Request Quote card */}
              <button
                onClick={() => router.push(`/quote/request?productId=${product.id}`)}
                className="w-full flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-4 mt-5 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <ClipboardList className="w-5 h-5 text-[#1A4F9C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-[#111827]">Need a different price?</p>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">Request Quote Adjustment</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#9CA3AF] shrink-0" />
              </button>
            </div>
          )}

          {tab === "Key Specifications" && (
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

          {tab === "Downloads" && (
            <div className="flex flex-col gap-3">
              {product.documents && product.documents.length > 0 ? (
                product.documents.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#1A4F9C]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#111827] truncate">{doc.name}</p>
                      <p className="text-[11px] text-[#6B7280] mt-0.5">PDF Document</p>
                    </div>
                    <Download className="w-4 h-4 text-[#6B7280] shrink-0" />
                  </a>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#F5F5F7] flex items-center justify-center">
                    <FileText className="w-7 h-7 text-[#9CA3AF]" />
                  </div>
                  <p className="text-sm font-semibold text-[#111827]">No downloads available</p>
                  <p className="text-xs text-[#6B7280] text-center">
                    Documents and brochures for this product will appear here.
                  </p>
                </div>
              )}
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
          <button
            onClick={() => router.push("/cart")}
            className="flex-1 h-[52px] flex items-center justify-center gap-2.5 border border-accent rounded-xl"
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-[#111827]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[15px] font-semibold text-[#111827]">View Cart</span>
          </button>

          <div className="flex-1">
            {cartQty > 0 ? (
              <div className="flex items-center justify-between h-[52px] rounded-xl overflow-hidden bg-accent">
                <button
                  onClick={() => updateQty(product.id, cartQty - 1)}
                  className="w-12 h-full flex items-center justify-center text-white text-2xl font-bold"
                >
                  −
                </button>
                <span className="text-white font-bold text-lg">{cartQty}</span>
                <button
                  onClick={() => updateQty(product.id, cartQty + 1)}
                  className="w-12 h-full flex items-center justify-center text-white text-2xl font-bold"
                >
                  +
                </button>
              </div>
            ) : (
              <Button label="Add to Cart" onClick={handleAddToCart} />
            )}
          </div>
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
