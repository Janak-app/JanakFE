"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import HeroBanner from "@/components/home/HeroBanner";
import TrustedBrands from "@/components/home/TrustedBrands";
import WhyJanak from "@/components/home/WhyJanak";
import ShopByCategory from "@/components/home/ShopByCategory";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import CtaBanner from "@/components/home/CtaBanner";
import { products } from "@/data/products";

const newArrivals = products.filter((p) =>
  ["hi-target-irtk5", "south-galaxy-g7"].includes(p.id)
);

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero banner */}
        <HeroBanner />

        {/* Trusted brands — desktop only */}
        {/* <div className="hidden md:block"> */}
          <TrustedBrands />
        {/* </div> */}

        {/* Why Janak — desktop only */}
        <div className="hidden md:block">
          <WhyJanak />
        </div>

        {/* Categories */}
        <ShopByCategory />

        {/* Featured */}
        <FeaturedProducts />

        {/* Testimonials — desktop only */}
        <div className="hidden md:block">
          <Testimonials />
        </div>

        {/* About — desktop only */}
        <div className="hidden md:block">
          <AboutSection />
        </div>

        {/* New Arrivals */}
        <div className="mt-7 max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-[17px] font-bold text-[#111827]">New Arrivals</span>
            <span className="bg-[#DC2626] text-white text-[9px] font-bold px-2 py-0.5 rounded tracking-widest">
              NEW
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden">
            {newArrivals.map((p) => (
              <div key={p.id} className="w-52 shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <CtaBanner />
      </main>

      <Footer />
    </div>
  );
}
