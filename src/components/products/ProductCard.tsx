import Link from "next/link";
import type { Product } from "@/data/products";
import StatusBadge from "@/components/ui/StatusBadge";

type Props = {
  product: Product;
  hidePrice?: boolean;
};

export default function ProductCard({ product, hidePrice }: Props) {
  return (
    <Link
      href={`/product/detail?id=${product.id}`}
      className="block bg-white rounded-xl border border-[#E5E7EB] overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="h-36 bg-[#F5F5F7] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-[#6B7280] tracking-[1.2px]">
          {product.brand.toUpperCase()}
        </span>
        <span className="text-sm font-semibold text-[#111827] leading-[18px] min-h-9 line-clamp-2">
          {product.name}
        </span>
        <div className="flex items-center justify-between mt-1 gap-2">
          {hidePrice ? (
            <span className="text-sm font-bold text-[#1A4F9C]">Login to view price</span>
          ) : product.price ? (
            <span className="text-sm font-bold text-[#1A4F9C]">{product.priceLabel}</span>
          ) : (
            <span className="bg-[#E0F2FE] text-[#0EA5E9] text-[11px] font-semibold px-2 py-0.5 rounded">
              Get Quote
            </span>
          )}
          <StatusBadge status={product.stock} />
        </div>
      </div>
    </Link>
  );
}
