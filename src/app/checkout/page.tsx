"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, Star, BadgePercent } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/data/products";
import { usePlaceOrder } from "@/hooks/useCheckoutInitiate";
import { usePaymentInitiate } from "@/hooks/usePaymentInitiate";
import AddressBottomSheet from "@/components/cart/AddressBottomSheet";
import { SavedAddress } from "@/components/checkout/AddressForm";
import useFetchApi from "@/hooks/useFetchApi";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, serverItems, summary, cartCount, cartLoading } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);

  const { data: addresses } = useFetchApi<SavedAddress[]>({
    endpoint: "v1/addresses",
    cacheEnabled: false,
  });

  useEffect(() => {
    if (!addresses?.length || selectedAddress) return;
    const def = addresses.find((a) => a.isDefault) ?? addresses[0];
    setSelectedAddress(def);
  }, [addresses]);

  const placeOrder = usePlaceOrder();
  const paymentInitiate = usePaymentInitiate();

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const order = await placeOrder.mutateAsync({ addressId: selectedAddress?.id ?? "09c8d6e5-bd42-4124-b369-d8869bf43538", paymentMethod: "upi" });
      const payment = await paymentInitiate.mutateAsync({
        orderId: order.orderId,
        customerName: "vinay bachani",
        customerEmail: user?.email ?? "",
        customerMobile: "9016118080",
      });
      sessionStorage.setItem("merchantTxnNo", payment.merchantTxnNo);
      window.location.href = payment.paymentUrl;
    } finally {
      setIsProcessing(false);
    }
  };

  const { subtotal, gstAmount, discountAmount, totalAmount, advanceAmount } = summary;

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-3 px-4 pb-3" style={{ paddingTop: "calc(var(--sat) + 1.25rem)" }}>
        <button onClick={() => router.back()} className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <h1 className="text-[18px] font-bold text-[#111827]">Order Summary</h1>
      </div>

      {cartLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
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
                    <div key={it.productId} className="flex gap-3">
                      {/* Image */}
                      <div className="w-24 h-24 rounded-xl bg-[#F3F4F6] overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={primaryImage?.url}
                          alt={product.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 pt-1">
                        <span className="inline-block text-[11px] font-semibold text-accent border border-accent px-2.5 py-0.5 rounded-full mb-1.5">
                          {product.category?.name ?? "Product"}
                        </span>
                        <p className="text-[14px] font-bold text-[#111827] leading-snug line-clamp-2 mb-1.5">
                          {product.name}
                        </p>
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center gap-1 bg-[#16A34A] text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
                            <span>4.5</span>
                            <Star className="w-3 h-3 fill-white text-white" />
                          </div>
                          <span className="text-[11px] text-[#6B7280]">68 Ratings | 6 Reviews</span>
                        </div>
                        {/* Price + Qty */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[14px] font-bold text-[#111827]">
                            {price ? formatINR(price * it.quantity) : "—"}
                          </span>
                          {originalPrice > 0 && (
                            <>
                              <span className="text-[12px] text-[#9CA3AF] line-through">
                                {formatINR(originalPrice * it.quantity)}
                              </span>
                              <span className="text-[11px] font-semibold text-[#16A34A]">40% Off</span>
                            </>
                          )}
                        </div>
                        <p className="text-[12px] text-[#6B7280] mt-1">Qty: {it.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
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

              {/* Booking card */}
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

          {/* ── Sticky Place Order ── */}
          <div className="fixed bottom-0 left-0 right-0 px-4 py-3 pb-6 bg-white border-t border-[#E5E7EB]">
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full h-13 bg-accent text-white text-[15px] font-bold rounded-xl py-3.5 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Place Order - ${formatINR(advanceAmount)}`
              )}
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
