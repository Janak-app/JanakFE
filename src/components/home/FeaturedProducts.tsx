import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import type { Product } from "@/data/products";

const FEATURED_IDS = ["leica-gs18", "trimble-r12i", "topcon-gt-1003", "leica-ts16"];

const DOT_COLOR: Record<string, string> = {
  "In Stock": "bg-green-500",
  "Limited Stock": "bg-amber-400",
  "On Order": "bg-amber-400",
};

function FeaturedCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/detail?id=${product.id}`}
      className="group flex flex-col border border-[#E5E7EB] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
    >
      {/* Image */}
      <div className="relative h-52 bg-[#F5F5F7] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Stock badge overlay */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
          <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLOR[product.stock] ?? "bg-gray-400"}`} />
          <span className="text-[11px] font-semibold text-[#111827]">{product.stock}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <p className="text-[10px] font-bold text-[#9CA3AF] tracking-[1.5px] mb-1.5">
            {product.brand.toUpperCase()}
          </p>
          <p className="text-[15px] font-bold text-[#111827] leading-snug line-clamp-2 min-h-[40px]">
            {product.name}
          </p>
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto pt-1">
          {product.price ? (
            <span className="text-[17px] font-extrabold text-[#1A4F9C]">{product.priceLabel}</span>
          ) : (
            <span className="text-[15px] font-semibold text-[#1A4F9C]">Price on Request</span>
          )}
          <div className="w-9 h-9 rounded-full bg-[#E0EAF7] flex items-center justify-center group-hover:bg-[#1A4F9C] transition-colors shrink-0">
            <ArrowRight className="w-4 h-4 text-[#1A4F9C] group-hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProducts() {
  const featured = products.filter((p) => FEATURED_IDS.includes(p.id));

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-10">
        <div>
          <h2 className="text-[17px] md:text-3xl font-extrabold text-[#111827] mb-1">Featured Products</h2>
          <p className="hidden md:block text-sm text-[#6B7280]">
            Our most-requested gear — used on India&apos;s biggest infrastructure projects.
          </p>
        </div>
        <Link
          href="/explore"
          className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A4F9C] hover:underline mt-1"
        >
          View All Products <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((p) => (
          <FeaturedCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
