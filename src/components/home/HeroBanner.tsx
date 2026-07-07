"use client";

import Link from "next/link";
import { ArrowRight, FileText, Award, Wrench } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { heroBanners } from "@/data/products";

const sliderSettings = {
  dots: true,
  arrows: false,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3500,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  customPaging: () => <div className="hero-dot" />,
  appendDots: (dots: React.ReactNode) => (
    <div style={{ bottom: "-28px" }}>
      <ul className="flex justify-center gap-1.5 m-0 p-0 list-none">{dots}</ul>
    </div>
  ),
};

export default function HeroBanner() {
  return (
    <>
      {/* ── Mobile slider ── */}
      <section className="md:hidden pl-4 pt-4 pb-8 overflow-hidden">
        {/* Scoped styles: overflow visible for peek + pill dots */}
        <style>{`
          .hero-slider .slick-list { overflow: visible !important; }
          .hero-dot {
            width: 8px; height: 8px;
            border-radius: 9999px;
            background: #D1D5DB;
            transition: width 0.3s, background 0.3s;
          }
          .slick-active .hero-dot {
            width: 20px;
            background: #1A4F9C;
          }
        `}</style>
        <Slider {...sliderSettings} className="hero-slider">
          {heroBanners.map((banner) => (
            <div key={banner.id} className="outline-none pr-4">
              <div
                className="relative rounded-2xl overflow-hidden px-5 py-6"
                style={{
                  background: `linear-gradient(135deg, ${banner.from} 0%, ${banner.to} 100%)`,
                }}
              >
                {/* Subtitle */}
                <p className="text-[10px] font-semibold text-white/70 tracking-[2px] uppercase mb-1">
                  {banner.subtitle}
                </p>

                {/* Title */}
                <h2 className="text-[22px] font-extrabold text-white leading-tight mb-2 max-w-[65%]">
                  {banner.title}
                </h2>

                {/* Description */}
                <p className="text-[12px] text-white/80 leading-relaxed max-w-[65%] mb-5">
                  {banner.description}
                </p>

                {/* Button */}
                <Link
                  href={banner.productId ? `/product/detail?id=${banner.productId}` : "/explore"}
                  className="inline-flex items-center gap-1.5 bg-white text-[#1A4F9C] font-bold text-[12px] px-4 py-2 rounded-lg"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {/* Decorative crosshair */}
                <svg
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20"
                  width="90"
                  height="90"
                  viewBox="0 0 90 90"
                  fill="none"
                >
                  <circle cx="45" cy="45" r="42" stroke="white" strokeWidth="2" />
                  <circle cx="45" cy="45" r="28" stroke="white" strokeWidth="1.5" />
                  <circle cx="45" cy="45" r="4" fill="white" />
                  <line x1="45" y1="3" x2="45" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="45" y1="70" x2="45" y2="87" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="3" y1="45" x2="20" y2="45" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="70" y1="45" x2="87" y2="45" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* ── Desktop — unchanged ── */}
      <section
        className="hidden md:block relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0a1628 0%, #0d2046 40%, #1a3a7a 70%, #1e4fc2 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 shrink-0" />
              <span className="text-[11px] font-bold text-white/90 tracking-widest uppercase">
                New — Leica GS18 I Now Available
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-2">
              Precision survey
              <br />
              equipment
            </h1>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#4d9fff] leading-tight mb-6">
              built for the field.
            </h1>

            <p className="text-sm text-white/75 leading-relaxed max-w-md mb-8">
              India&apos;s most trusted partner in GNSS, total stations, UAV LiDAR &amp; data
              controllers. Authorized distributor for Leica · Trimble · Topcon · DJI since 1985.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 bg-white text-[#1A4F9C] font-bold text-sm px-5 py-3 rounded-lg hover:bg-white/90 transition-colors"
              >
                Explore Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-white/20 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Request a Quote
              </Link>
            </div>

            <div className="flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-white/60 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="relative flex-shrink-0 w-full md:w-[460px]">
            <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] bg-[#1a2a50] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-survey.jpg"
                alt="Surveyor working with precision equipment"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg className="w-24 h-24 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="absolute -left-4 top-1/3 bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 min-w-[190px]">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Award className="w-4 h-4 text-orange-500" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900">2-Year Warranty</p>
                <p className="text-[11px] text-gray-500">On most equipment</p>
              </div>
            </div>

            <div className="absolute -right-2 top-4 bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 min-w-[190px]">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Wrench className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-[13px] font-bold text-gray-900">Free Calibration</p>
                <p className="text-[11px] text-gray-500">For first-time buyers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const STATS = [
  { value: "40+", label: "Years in Business" },
  { value: "5,000+", label: "Surveyors Served" },
  { value: "₹500Cr+", label: "Equipment Delivered" },
  { value: "12", label: "Service Centers" },
];
