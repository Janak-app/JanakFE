import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import FeaturedCard from "@/components/products/FeaturedCard";

const FEATURED_IDS = ["leica-gs18", "trimble-r12i", "topcon-gt-1003", "leica-ts16"];

export default function FeaturedProducts() {
  const featured = products.filter((p) => FEATURED_IDS.includes(p.id));

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 md:py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-10">
        <div>
          <h2 className="text-[17px] md:text-3xl font-extrabold text-[#111827]">Featured Products</h2>
          <p className="hidden md:block text-sm text-[#6B7280] mt-1">
            Our most-requested gear — used on India&apos;s biggest infrastructure projects.
          </p>
        </div>
        <Link
          href="/explore"
          className="shrink-0 inline-flex items-center gap-1 text-[13px] md:text-sm font-semibold text-[#1A4F9C] hover:underline"
        >
          View All <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Link>
      </div>

      {/* Mobile: horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:hidden [&::-webkit-scrollbar]:hidden">
        {featured.map((p) => (
          <div key={p.id} className="w-56 shrink-0">
            <FeaturedCard product={p} />
          </div>
        ))}
      </div>

      {/* Desktop: grid */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((p) => (
          <FeaturedCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
