"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Heart, Trash2 } from "lucide-react";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/context/ToastContext";
import type { ApiWishlistItem } from "@/types/api";

function formatPrice(price: string): string {
  const num = parseFloat(price);
  return Number.isFinite(num) && num > 0
    ? `₹${num.toLocaleString("en-IN")}`
    : "Get Quote";
}

function getPrimaryImage(item: ApiWishlistItem): string {
  const images = item.product.images ?? [];
  return (
    images.find((img) => img.isPrimary)?.url ?? images[0]?.url ?? "/placeholder.png"
  );
}

export default function WishlistPage() {
  const router = useRouter();
  const { show } = useToast();
  const { data: items, loading, retrieve } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const wishlist = items ?? [];

  const handleRemove = async (productId: string) => {
    setRemovingId(productId);
    try {
      await removeFromWishlist.mutateAsync({ dynamicEndpointSuffix: productId });
      show("Removed from wishlist");
      retrieve?.();
    } catch {
      // error toast handled by useMutationApi
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div
        className="flex items-center px-4 pb-2 gap-2 border-b border-[#E5E7EB]"
        style={{ paddingTop: "calc(var(--sat) + 1rem)" }}
      >
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <div>
          <h1 className="text-[16px] font-bold text-[#111827]">My Wishlist</h1>
          {!loading && (
            <p className="text-xs text-[#6B7280]">{wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}</p>
          )}
        </div>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 mt-4 pb-10">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 animate-pulse flex items-center gap-3">
                <div className="w-20 h-20 rounded-xl bg-[#F3F4F6] shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-3/4 bg-[#E5E7EB] rounded" />
                  <div className="h-3 w-1/3 bg-[#E5E7EB] rounded" />
                  <div className="h-4 w-24 bg-[#E5E7EB] rounded" />
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#F3F4F6]" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] flex items-center justify-center">
              <Heart className="w-8 h-8 text-[#DC2626]" />
            </div>
            <p className="text-sm font-semibold text-[#111827]">Your wishlist is empty</p>
            <p className="text-xs text-[#6B7280] text-center max-w-[220px]">
              Tap the heart icon on any product to save it here.
            </p>
            <button
              onClick={() => router.push("/")}
              className="mt-2 px-5 py-2.5 bg-accent text-white text-sm font-semibold rounded-xl"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {wishlist.map((item) => (
              <WishlistCard
                key={item.id}
                item={item}
                isRemoving={removingId === item.product.id}
                onPress={() => router.push(`/product/detail?id=${item.product.id}`)}
                onRemove={() => handleRemove(item.product.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistCard({
  item,
  isRemoving,
  onPress,
  onRemove,
}: {
  item: ApiWishlistItem;
  isRemoving: boolean;
  onPress: () => void;
  onRemove: () => void;
}) {
  const { product } = item;
  const image = getPrimaryImage(item);
  const isInStock = product.stockStatus === "in_stock";

  return (
    <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl p-3.5">
      <button onClick={onPress} className="flex items-center gap-3 flex-1 min-w-0 text-left">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F5F5F7] shrink-0 flex items-center justify-center">
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-contain p-1"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-[#6B7280] tracking-[1.5px] mb-0.5">
            {product.brand?.name?.toUpperCase() ?? ""}
          </p>
          <p className="text-[13px] font-semibold text-[#111827] leading-snug line-clamp-2">
            {product.name}
          </p>
          <p className="text-[13px] font-bold text-accent mt-1">
            {formatPrice(product.price)}
          </p>
          <span
            className={`text-[10px] font-semibold mt-1 inline-block ${
              isInStock ? "text-[#16A34A]" : "text-[#6B7280]"
            }`}
          >
            {isInStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-[#9CA3AF] shrink-0" />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        disabled={isRemoving}
        className="w-9 h-9 rounded-lg bg-[#FEF2F2] flex items-center justify-center shrink-0 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4 text-[#DC2626]" />
      </button>
    </div>
  );
}
