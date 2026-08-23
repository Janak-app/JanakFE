"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, ChevronLeft, BadgePercent, Loader2, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/data/products";
import AddressBottomSheet from "@/components/cart/AddressBottomSheet";
import { SavedAddress } from "@/components/checkout/AddressForm";
import useFetchApi from "@/hooks/useFetchApi";

export default function CartPage() {
  const router = useRouter();
  const { items, serverItems, updateQty, removeItem, summary, cartCount, cartLoading, refetchCart } = useCart();
  const { show } = useToast();
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);

  const { data: addresses } = useFetchApi<SavedAddress[]>({
    endpoint: "v1/addresses",
    cacheEnabled: false,
  });

  useEffect(() => {
    refetchCart();
  }, []);

  // Auto-select default address (or first) on load
  useEffect(() => {
    if (!addresses?.length || selectedAddress) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    setSelectedAddress(def);
  }, [addresses]);

  const { subtotal, gstAmount, discountAmount, totalAmount, advanceAmount } = summary;
  const empty = !cartLoading && items.length === 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 pb-3" style={{ paddingTop: "calc(var(--sat) + 1.25rem)" }}>
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <h1 className="text-[18px] font-bold text-[#111827]">My Cart</h1>
      </div>

      {cartLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      ) : empty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
          <div className="w-24 h-24 rounded-full bg-[#E0F2FE] flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-accent" />
          </div>
          <p className="text-lg font-bold text-[#111827]">Your cart is empty</p>
          <p className="text-sm text-[#6B7280] text-center">Browse our catalog to add precision survey equipment.</p>
          <button
            onClick={() => router.push("/explore")}
            className="px-8 h-11 bg-accent text-white text-sm font-semibold rounded-xl"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 pb-28 overflow-y-auto">

            {/* ── Deliver To ── */}
            <div className="px-4 py-4">
              <p className="text-[15px] font-bold text-[#111827] mb-3">
                Deliver To{selectedAddress ? ` : ${selectedAddress.fullName}` : ""}
              </p>
              <div className="flex items-start justify-between gap-4">
                <p className="text-[14px] text-[#374151] leading-snug">
                  {selectedAddress ? (
                    <>
                      {selectedAddress.addressLine1}
                      {selectedAddress.addressLine2 ? `, ${selectedAddress.addressLine2}` : ""}<br />
                      {selectedAddress.city}, {selectedAddress.state} — {selectedAddress.pincode}
                    </>
                  ) : (
                    <span className="text-[#9CA3AF]">No address selected</span>
                  )}
                </p>
                <button
                  onClick={() => setAddressSheetOpen(true)}
                  className="text-[14px] font-semibold text-accent shrink-0"
                >
                  Change
                </button>
              </div>
            </div>
            <div className="h-px bg-[#E5E7EB] mx-4" />

            {/* ── Items ── */}
            <div className="px-4 py-4">
              <p className="text-[15px] font-bold text-[#111827] mb-4">
                {cartCount} Items for Purchase
              </p>
              <div className="flex flex-col gap-4">
                {items.map((it) => {
                  const serverItem = serverItems.find((s) => s.product.id === it.productId);
                  if (!serverItem?.product?.images) return null;
                  const { product } = serverItem;
                  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
                  const price = product.price ? parseFloat(product.price) : 0;
                  const originalPrice = Math.round(price * 1.4);

                  return (
                    <div key={it.productId} className="flex gap-3 items-start">
                      {/* Image */}
                      <div className="w-20 h-20 rounded-xl bg-[#F3F4F6] overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={primaryImage?.url}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Middle: category + name + remove */}
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5 pt-0.5">
                        <span className="text-[11px] font-semibold text-[#0EA5E9]">
                          {product.category?.name ?? "Product"}
                        </span>
                        <p className="text-[14px] font-bold text-[#111827] leading-snug line-clamp-3">
                          {product.name}
                        </p>
                        <button
                          onClick={() => removeItem(it.productId)}
                          className="mt-1.5 flex items-center gap-1 text-[12px] font-semibold text-[#DC2626] w-fit"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Remove
                        </button>
                      </div>

                      {/* Right: stepper + price stacked */}
                      <div className="flex flex-col items-center gap-2 shrink-0 pt-0.5">
                        {/* Outlined stepper */}
                        <div className="flex items-center border border-accent rounded-xl overflow-hidden">
                          <button
                            onClick={() => it.quantity > 1 && updateQty(it.productId, it.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-accent text-lg font-bold"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-[13px] font-bold text-[#111827]">
                            {String(it.quantity).padStart(2, "0")}
                          </span>
                          <button
                            onClick={() => updateQty(it.productId, it.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-accent text-lg font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="flex flex-col items-center">
                          <span className="text-[13px] font-bold text-[#111827]">
                            {price ? formatINR(price * it.quantity) : "Price on Request"}
                          </span>
                          {originalPrice > 0 && (
                            <span className="text-[11px] text-[#9CA3AF] line-through">
                              {formatINR(originalPrice * it.quantity)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="h-px bg-[#E5E7EB] mx-4" />

            {/* ── Coupons & Offers ── */}
            <div className="px-4 py-4">
              <p className="text-[15px] font-bold text-[#111827] mb-4">Coupons &amp; Offers</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <BadgePercent className="w-5 h-5 text-accent" />
                </div>
                <span className="flex-1 text-[14px] font-bold text-[#111827] tracking-wide">FIRSTBUY</span>
                <button
                  onClick={() => show("Coupon applied!", "success")}
                  className="bg-accent text-white text-[13px] font-semibold px-5 py-2 rounded-full"
                >
                  Apply
                </button>
              </div>
              <p className="text-[12px] font-semibold text-[#16A34A] mt-2 ml-12">
                You can save ₹1200 on this order
              </p>
              <div className="border-t border-dashed border-[#E5E7EB] my-4" />
              <button
                onClick={() => show("All offers coming soon", "info")}
                className="w-full text-center text-[14px] font-semibold text-accent"
              >
                View All Offers
              </button>
            </div>
            <div className="h-px bg-[#E5E7EB] mx-4" />

            {/* ── Price Detail ── */}
            <div className="px-4 py-4 flex flex-col gap-4">
              <p className="text-[15px] font-bold text-[#111827]">Price Detail ({cartCount} Items)</p>

              <PriceRow label="Subtotal (excl. GST)" amount={formatINR(subtotal)} />
              <PriceRow label="GST" amount={formatINR(gstAmount)} />
              {discountAmount > 0 && (
                <PriceRow
                  label="Discount"
                  amount={`-${formatINR(discountAmount)}`}
                  amountClass="text-[#DC2626]"
                />
              )}
              <PriceRow label="Net Payable Amount" amount={formatINR(totalAmount)} />

              {/* Book this at just */}
              <div className="flex items-center gap-3 border border-[#E5E7EB] rounded-2xl p-4 mt-1">
                <div className="w-9 h-9 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0">
                  <BadgePercent className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#111827]">
                    Book this at just{" "}
                    <span className="text-accent">{formatINR(advanceAmount)}</span>
                  </p>
                  <p className="text-[12px] text-[#6B7280] mt-0.5">Pay remaining amount after order confirmation</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sticky Continue Payment ── */}
          <div className="fixed bottom-0 left-0 right-0 px-4 py-3 pb-6 bg-white border-t border-[#E5E7EB]">
            <button
              onClick={() => router.push("/checkout")}
              className="w-full h-13 bg-accent text-white text-[15px] font-bold rounded-xl py-3.5"
            >
              Continue Payment - {formatINR(advanceAmount)}
            </button>
          </div>
        </>
      )}

      <AddressBottomSheet
        isOpen={addressSheetOpen}
        onClose={() => setAddressSheetOpen(false)}
        onSelect={(addr) => setSelectedAddress(addr)}
        selectedId={selectedAddress?.id}
      />
    </div>
  );
}

function PriceRow({
  label,
  amount,
  amountClass = "text-[#111827]",
}: {
  label: string;
  amount: string;
  amountClass?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-dashed border-[#E5E7EB] pb-3">
      <span className="text-[13px] text-[#6B7280]">{label}</span>
      <span className={`text-[13px] font-semibold text-right ${amountClass}`}>{amount}</span>
    </div>
  );
}
