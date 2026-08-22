"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/home/HeroBanner";
import TrustedBrands from "@/components/home/TrustedBrands";
import WhyJanak from "@/components/home/WhyJanak";
import ShopByCategory from "@/components/home/ShopByCategory";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import NewArrivals from "@/components/home/NewArrivals";
import Testimonials from "@/components/home/Testimonials";
import AboutSection from "@/components/home/AboutSection";
import CtaBanner from "@/components/home/CtaBanner";
import PayRemainingBanner from "@/components/home/PayRemainingBanner";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero banner */}
        <HeroBanner />

        {/* Trusted brands — desktop only */}
        <div className="hidden md:block">
          <TrustedBrands />
        </div>

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
        <NewArrivals />

        {/* CTA */}
        <CtaBanner />
      </main>

      {/* Pay Remaining Amount — mobile fixed banner above bottom tab bar */}
      <PayRemainingBanner />

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
