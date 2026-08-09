"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft, Share2, Heart, Star,
  CheckCircle, FileText, BarChart2, Download,
  ChevronRight, ClipboardList,
} from "lucide-react";
import InfoBanner from "@/components/ui/InfoBanner";
import FeaturedCard from "@/components/products/FeaturedCard";
import { orders } from "@/data/orders";
import { products } from "@/data/products";

const TABS = ["Overview", "Specifications", "Downloads", "Reviews"] as const;
type TabKey = typeof TABS[number];

export default function OrderDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();

  const order = orders.find((o) => o.id === id);

  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [tab, setTab] = useState<TabKey>("Overview");

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-sm text-[#6B7280]">Order not found.</p>
      </div>
    );
  }

  const images = [order.productImage];
  const bookingAmount = "₹60,000";

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center px-4 pt-4 pb-2 gap-2">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <p className="flex-1 text-[16px] font-bold text-[#111827]">Receiver</p>
        <button className="w-9 h-9 flex items-center justify-center">
          <Share2 className="w-5 h-5 text-[#111827]" />
        </button>
        <button
          onClick={() => setWishlisted((v) => !v)}
          className="w-9 h-9 flex items-center justify-center"
        >
          <Heart className={`w-5 h-5 ${wishlisted ? "fill-accent text-accent" : "text-[#111827]"}`} />
        </button>
      </div>

      {/* ── Image carousel ── */}
      <div className="bg-[#F5F5F7] mx-4 rounded-2xl overflow-hidden">
        <div className="h-64 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[imgIdx]}
            alt={order.productName}
            className="w-full h-full object-contain p-4"
          />
        </div>
        {/* Dot indicators */}
        <div className="flex justify-center gap-1.5 pb-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === imgIdx ? "w-5 bg-[#9CA3AF]" : "w-1.5 bg-[#D1D5DB]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Product info ── */}
      <div className="px-4 pt-4 flex flex-col gap-3 pb-28">

        {/* Category pill */}
        <span className="self-start text-[12px] font-semibold text-accent border border-accent px-3 py-0.5 rounded-full">
          GNSS Antenna
        </span>

        {/* Product name */}
        <h1 className="text-[22px] font-bold text-[#111827] leading-snug">
          {order.productName}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-semibold text-[#111827]">4.4</span>
          <Star className="w-4 h-4 fill-[#1A4F9C] text-accent" />
          <span className="text-[13px] text-[#6B7280]">(400 Rating)</span>
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[22px] font-bold text-[#111827]">{order.amountLabel}</span>
          <span className="text-[14px] text-[#9CA3AF] line-through">₹10,99,999</span>
          <span className="text-[13px] font-semibold text-[#16A34A]">40% Off</span>
        </div>

        {/* Book now banner */}
        <InfoBanner
          title={`Book this at just ${bookingAmount}`}
          subtitle="Pay remaining amount after order confirmation"
        />

        {/* ── Tabs ── */}
        <div className="flex border-b border-[#E5E7EB] mt-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`shrink-0 px-4 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                tab === t
                  ? "border-accent text-accent font-semibold"
                  : "border-transparent text-[#6B7280]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "Overview" && (
          <div className="flex flex-col gap-4 pt-1">
            <p className="text-[14px] text-[#374151] leading-relaxed">
              &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.&rdquo;
            </p>
            <button className="w-full flex items-center gap-3 border border-[#E5E7EB] rounded-2xl p-4 text-left">
              <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center shrink-0">
                <ClipboardList className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-[#111827]">Need a different price?</p>
                <p className="text-[12px] text-[#6B7280] mt-0.5">Request Quote Adjustment</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#9CA3AF] shrink-0" />
            </button>
          </div>
        )}

        {tab === "Specifications" && (
          <div className="border border-[#E5E7EB] rounded-xl overflow-hidden mt-1">
            {[
              { label: "Frequency Bands", value: "L1/L2/L5" },
              { label: "Connector", value: "TNC Female" },
              { label: "Gain", value: "40 dB typical" },
              { label: "Operating Temp", value: "-40°C to +85°C" },
              { label: "Dimensions", value: "Ø 185 × 67 mm" },
              { label: "Weight", value: "680 g" },
            ].map((s, i, arr) => (
              <div
                key={s.label}
                className={`flex items-center justify-between px-3.5 py-2.5 ${
                  i < arr.length - 1 ? "border-b border-[#E5E7EB]" : ""
                } ${i % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}
              >
                <span className="text-[12px] text-[#6B7280]">{s.label}</span>
                <span className="text-[12px] font-semibold text-[#111827]">{s.value}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "Downloads" && (
          <div className="flex flex-col gap-3 mt-1">
            {[
              { name: "Product Brochure", size: "2.4 MB", Icon: FileText },
              { name: "Technical Datasheet", size: "1.1 MB", Icon: BarChart2 },
            ].map(({ name, size, Icon }) => (
              <div key={name} className="flex items-center gap-3 p-3.5 bg-white border border-[#E5E7EB] rounded-xl">
                <div className="w-10 h-10 rounded-[10px] bg-[#FEE2E2] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#DC2626]" />
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#111827]">{name}</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">PDF · {size}</p>
                </div>
                <Download className="w-5 h-5 text-accent" />
              </div>
            ))}
          </div>
        )}

        {tab === "Reviews" && (
          <div className="flex flex-col gap-3 mt-1">
            {/* Summary row */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#16A34A] text-white text-[13px] font-bold px-3 py-1.5 rounded-xl">
                <span>4.5</span>
                <Star className="w-3.5 h-3.5 fill-white text-white" />
              </div>
              <span className="text-[13px] text-[#374151] font-medium">68 Ratings | 6 Reviews</span>
            </div>

            {/* Horizontal scroll cards */}
            <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 [&::-webkit-scrollbar]:hidden">
              {[
                { name: "Samantha Payne", rating: 1.0, date: "23 Nov 2021", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non e..." },
                { name: "Rajan Mehta", rating: 4.5, date: "10 Jun 2026", text: "Excellent antenna, very accurate phase centre. Works perfectly with our Leica GS18. Highly recommend for any RTK application." },
                { name: "Sonal Patel", rating: 5.0, date: "22 May 2026", text: "Solid build, IP67 rating gives confidence in the field. Fast lock-on, stable signal. Worth every rupee." },
              ].map((r) => (
                <div key={r.name} className="shrink-0 w-64 border border-[#E5E7EB] rounded-2xl p-4 bg-white">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-[13px] font-bold text-[#111827] leading-snug">{r.name}</p>
                    <div className="flex items-center gap-1 bg-accent text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shrink-0">
                      <span>{r.rating.toFixed(1)}</span>
                      <Star className="w-3 h-3 fill-white text-white" />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mb-2">{r.date}</p>
                  <p className="text-[12px] text-[#374151] leading-relaxed line-clamp-4">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Always visible: More Product Like This ── */}
        <div className="flex items-center gap-3 mt-4">
          <hr className="flex-1 border-[#E5E7EB]" />
          <span className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase whitespace-nowrap">
            More Product Like This
          </span>
          <hr className="flex-1 border-[#E5E7EB]" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((p) => (
            <FeaturedCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      {/* ── Sticky bottom actions ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-5 flex gap-3 z-20">
        <button className="flex-1 h-12 bg-accent text-white text-[15px] font-semibold rounded-xl">
          Buy Now
        </button>
        <button className="flex-1 h-12 border border-accent text-accent text-[15px] font-semibold rounded-xl bg-white">
          Add To Cart
        </button>
      </div>
    </div>
  );
}
