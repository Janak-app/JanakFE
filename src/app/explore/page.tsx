"use client";

import { Suspense, useState } from "react";
import { useDebounce } from "@/hooks/shared/useDebounce";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, X, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/Button";
import useProducts, { ProductFilters } from "@/hooks/useProducts";
import useCategories from "@/hooks/useCategories";

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  );
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("cat") || "all");
  const [searchInput, setSearchInput] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Filter modal state
  const [brand, setBrand] = useState("");
  const [inStock, setInStock] = useState(false);
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const search = useDebounce(searchInput, 400);

  const filters: ProductFilters = {
    search: search || undefined,
    category: tab !== "all" ? tab : undefined,
    brand: brand || undefined,
    inStock: inStock || undefined,
    minPrice,
    maxPrice,
  };

  const { data: products = [], loading: productsLoading } = useProducts(filters);
  const { data: categories = [], loading: categoriesLoading } = useCategories();

  const tabs = [
    { key: "all", label: "All" },
    ...categories.map((c) => ({ key: c.slug, label: c.name })),
  ];

  const loading = productsLoading || categoriesLoading;

  const handleClearFilters = () => {
    setBrand("");
    setInStock(false);
    setMinPrice(undefined);
    setMaxPrice(undefined);
    setShowFilter(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Page hero */}
      <div className="bg-[#F5F5F7] border-b border-[#E5E7EB] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-medium text-[#6B7280] tracking-wide mb-2">Home / Catalog</p>
          <h1 className="text-4xl font-bold text-[#111827] tracking-tight">Browse Survey Equipment</h1>
          <p className="text-sm text-[#6B7280] mt-2">
            {products.length} products · Authorized distributor for Leica · Trimble · Topcon · DJI
          </p>
          {loading && (
            <div className="flex items-center gap-2 mt-3 text-sm text-[#6B7280]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </div>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white border-b border-[#E5E7EB] py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 h-10 bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3 flex-1 max-w-96">
            <Search className="w-4 h-4 text-[#6B7280] shrink-0" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products, brands..."
              className="flex-1 text-sm bg-transparent outline-none text-[#111827] placeholder:text-[#9CA3AF]"
            />
            {searchInput && (
              <button onClick={() => setSearchInput("")}>
                <X className="w-4 h-4 text-[#6B7280]" />
              </button>
            )}
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 flex-wrap">
            {tabs.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? "bg-[#1A4F9C] text-white border-[#1A4F9C]"
                      : "bg-white text-[#6B7280] border-[#E5E7EB] hover:border-[#1A4F9C]"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Filters + Sort */}
          <button
            onClick={() => setShowFilter(true)}
            className="flex items-center gap-2 h-10 px-4 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-semibold text-[#1A4F9C] hover:bg-[#F5F5F7] transition-colors ml-auto"
          >
            <SlidersHorizontal className="w-4 h-4" />
            More Filters
          </button>
          <div className="flex items-center gap-1.5 h-10 px-3.5 bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg text-xs text-[#111827]">
            <span className="text-[#6B7280]">Sort:</span>
            <span className="font-semibold">Newest</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 bg-[#F5F5F7] py-8">
        <div className="max-w-7xl mx-auto px-6">
          {products.length === 0 && !loading ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4" />
              <p className="text-base font-semibold text-[#111827]">No products found</p>
              <p className="text-sm text-[#6B7280] mt-1">Try a different search or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Filter modal */}
      {showFilter && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilter(false)}
          />
          <div className="relative bg-white w-full md:w-[480px] rounded-t-2xl md:rounded-2xl p-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="w-10 h-1 bg-[#E5E7EB] rounded mx-auto mb-4 md:hidden" />
            <h2 className="text-lg font-bold text-[#111827] mb-4">Filters</h2>

            {/* Brand */}
            <div className="flex items-center justify-between py-3.5 border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#111827]">Brand</span>
              <input
                type="text"
                placeholder="e.g. Leica"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="text-sm text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-1.5 outline-none w-40"
              />
            </div>

            {/* Stock Availability */}
            <div className="flex items-center justify-between py-3.5 border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#111827]">Stock Availability</span>
              <label className="flex items-center gap-2 text-sm text-[#6B7280] cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="accent-[#1A4F9C] w-4 h-4"
                />
                In Stock only
              </label>
            </div>

            {/* Price Range */}
            <div className="flex items-center justify-between py-3.5 border-b border-[#E5E7EB]">
              <span className="text-sm font-medium text-[#111827]">Price Range</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice ?? ""}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-24 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-xs outline-none text-[#111827]"
                />
                <span className="text-[#6B7280] text-xs">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice ?? ""}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-24 border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-xs outline-none text-[#111827]"
                />
              </div>
            </div>

            {/* Non-functional rows */}
            {[
              { label: "Accuracy Rating", value: "Any" },
              { label: "Warranty", value: "Any" },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center justify-between py-3.5 border-b border-[#E5E7EB]"
              >
                <span className="text-sm font-medium text-[#111827]">{f.label}</span>
                <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
                  {f.value}
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            ))}

            <div className="mt-4 flex flex-col gap-2">
              <Button label="Apply Filters" onClick={() => setShowFilter(false)} />
              <button
                onClick={handleClearFilters}
                className="text-[13px] font-medium text-[#DC2626] py-3 text-center"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
