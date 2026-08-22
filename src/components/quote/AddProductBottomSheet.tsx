"use client";

import { useState } from "react";
import { X, Search, Loader2 } from "lucide-react";
import BottomSheet from "@/components/ui/BottomSheet";
import useProducts from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/shared/useDebounce";
import { formatINR } from "@/data/products";
import type { Product } from "@/data/products";
import type { QuoteItem } from "@/app/quote/request/page";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  onAdd: (product: Product) => void;
  onUpdateQty: (productId: string, qty: number) => void;
}

export default function AddProductBottomSheet({ isOpen, onClose, items, onAdd, onUpdateQty }: Props) {
  const [searchInput, setSearchInput] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const search = useDebounce(searchInput, 400);

  const { data: products = [], loading: productsLoading } = useProducts({
    search: search || undefined,
    category: activeCategory || undefined,
  });

  const { data: categories = [], loading: categoriesLoading } = useCategories();

  const loading = productsLoading || categoriesLoading;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} bottomSheetMaximumHeight={620}>
      <div className="flex flex-col h-full px-4 pb-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-[16px] font-bold text-[#111827]">Add Product For Quotation</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center">
            <X className="w-5 h-5 text-[#6B7280]" />
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 h-11 bg-white border border-[#E5E7EB] rounded-full px-4 mb-3 shrink-0">
          <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search Product"
            className="flex-1 text-sm bg-transparent outline-none text-[#111827] placeholder:text-[#9CA3AF]"
          />
          {searchInput && (
            <button onClick={() => setSearchInput("")}>
              <X className="w-4 h-4 text-[#9CA3AF]" />
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden mb-4 shrink-0">
          <button
            onClick={() => setActiveCategory("")}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors ${
              activeCategory === ""
                ? "bg-accent text-white"
                : "bg-white text-[#6B7280] border border-[#E5E7EB]"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug === activeCategory ? "" : cat.slug)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === cat.slug
                  ? "bg-accent text-white"
                  : "bg-white text-[#6B7280] border border-[#E5E7EB]"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {loading && (
            <div className="flex items-center justify-center gap-2 py-10 text-[#6B7280]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading...</span>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="flex flex-col items-center py-14 text-[#9CA3AF]">
              <Search className="w-8 h-8 mb-2" />
              <p className="text-[13px] font-medium">No products found</p>
            </div>
          )}

          {!loading && products.length > 0 && (
            <div className="divide-y divide-[#F3F4F6]">
              {products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  currentItem={items.find((it) => it.productId === product.id)}
                  onAdd={onAdd}
                  onUpdateQty={onUpdateQty}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </BottomSheet>
  );
}

interface ProductRowProps {
  product: Product;
  currentItem: QuoteItem | undefined;
  onAdd: (product: Product) => void;
  onUpdateQty: (productId: string, qty: number) => void;
}

function ProductRow({ product, currentItem, onAdd, onUpdateQty }: ProductRowProps) {
  const isAdded = !!currentItem;
  const qty = currentItem?.qty ?? 0;

  return (
    <div className="flex items-center gap-3 py-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.images[0] ?? ""}
        alt={product.name}
        className="w-14 h-14 rounded-xl bg-[#F3F4F6] object-contain p-1.5 shrink-0"
      />

      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-semibold text-[#0EA5E9] block">{product.category}</span>
        <p className="text-[13px] font-bold text-[#111827] leading-snug line-clamp-2">{product.name}</p>
        {product.price ? (
          <span className="text-[12px] font-semibold text-accent mt-0.5 block">
            {formatINR(product.price)}
          </span>
        ) : (
          <span className="text-[11px] font-medium text-[#9CA3AF] mt-0.5 block">Get Quote</span>
        )}
      </div>

      <div className="shrink-0">
        {!isAdded ? (
          <button
            onClick={() => onAdd(product)}
            className="px-4 py-1.5 bg-accent text-white text-[13px] font-bold rounded-xl"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center border border-accent rounded-xl overflow-hidden">
            <button
              onClick={() => onUpdateQty(product.id, qty - 1)}
              disabled={qty <= 1}
              className="w-8 h-8 flex items-center justify-center text-accent text-lg font-bold disabled:opacity-40"
            >
              −
            </button>
            <span className="w-7 text-center text-[13px] font-bold text-[#111827]">
              {String(qty).padStart(2, "0")}
            </span>
            <button
              onClick={() => onUpdateQty(product.id, qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-accent text-lg font-bold"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
