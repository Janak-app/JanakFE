import Link from "next/link";
import type { Product } from "@/data/products";

export default function FeaturedCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/detail?id=${product.id}`}
      className="group flex flex-col border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white"
    >
      {/* Image */}
      <div className="h-48 bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2">
        <span className="self-start text-[11px] font-semibold text-[#374151] bg-[#F3F4F6] px-3 py-1 rounded-full">
          {product.category}
        </span>
        <p className="text-[16px] font-bold text-[#111827] leading-snug line-clamp-2">
          {product.name}
        </p>
        {product.price ? (
          <p className="text-[16px] font-bold text-[#1A4F9C]">{product.priceLabel}</p>
        ) : (
          <p className="text-[14px] font-semibold text-[#1A4F9C]">Price on Request</p>
        )}
      </div>
    </Link>
  );
}
