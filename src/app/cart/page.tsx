"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Plus, Minus, Tag } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatINR } from "@/data/products";

export default function CartPage() {
  const router = useRouter();
  const { items, serverItems, updateQty, removeItem, subtotal, gst, total, cartCount } = useCart();
  const { show } = useToast();
  const [coupon, setCoupon] = useState("");
  const empty = items.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <div className="max-w-3xl mx-auto w-full px-4 pt-5 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">Cart</h1>
          <p className="text-xs text-text-secondary mt-0.5">{cartCount} {cartCount === 1 ? "item" : "items"}</p>
        </div>
        {!empty && (
          <button
            onClick={() => items.forEach((i) => removeItem(i.productId))}
            className="text-[13px] font-semibold text-error"
          >
            Clear
          </button>
        )}
      </div>

      {empty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
          <div className="w-24 h-24 rounded-full bg-info flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-primary" />
          </div>
          <p className="text-lg font-bold text-text-primary">Your cart is empty</p>
          <p className="text-sm text-text-secondary text-center">
            Browse our catalog to add precision survey equipment.
          </p>
          <Button label="Browse Catalog" onClick={() => router.push("/explore")} fullWidth={false} className="px-8" />
        </div>
      ) : (
        <>
          <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-36">
            {/* Items */}
            <div className="flex flex-col gap-3">
              {items.map((it) => {
                const serverItem = serverItems.find((s) => s.product.id === it.productId);
                if (!serverItem) return null;
                const { product } = serverItem;
                const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
                return (
                  <div key={it.productId} className="flex gap-3 bg-white border border-border rounded-xl p-3">
                    <img src={primaryImage?.url} alt={product.name} className="w-20 h-24 rounded-lg object-cover bg-surface shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-text-secondary tracking-[1.2px]">{product.brand.name.toUpperCase()}</p>
                      <p className="text-sm font-semibold text-text-primary mt-0.5 leading-snug line-clamp-2">{product.name}</p>
                      <p className="text-xs text-text-secondary mt-1">Model: {product.modelNumber}</p>
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(it.productId, it.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-surface"
                          >
                            <Minus className="w-3.5 h-3.5 text-text-primary" />
                          </button>
                          <span className="w-7 text-center text-sm font-bold text-text-primary">{it.quantity}</span>
                          <button
                            onClick={() => updateQty(it.productId, it.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-surface"
                          >
                            <Plus className="w-3.5 h-3.5 text-text-primary" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {product.price ? formatINR(parseFloat(product.price) * it.quantity) : "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => { removeItem(it.productId); show("Saved for later"); }}
                          className="text-[11px] font-semibold text-primary"
                        >
                          Save for later
                        </button>
                        <span className="w-px h-3 bg-border" />
                        <button
                          onClick={() => { removeItem(it.productId); show("Item removed", "info"); }}
                          className="text-[11px] font-semibold text-error"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mt-4">
              <div className="flex-1 flex items-center gap-2 h-12 bg-surface border border-border rounded-lg px-3">
                <Tag className="w-4 h-4 text-text-secondary shrink-0" />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Apply coupon code"
                  className="flex-1 text-sm bg-transparent outline-none text-text-primary placeholder:text-text-tertiary"
                />
              </div>
              <button
                onClick={() => show("Coupon applied!", "success")}
                className="h-12 px-5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors"
              >
                Apply
              </button>
            </div>

            {/* Summary */}
            <div className="mt-4 bg-white border border-border rounded-xl p-4">
              <p className="text-sm font-bold text-text-primary mb-3">Order Summary</p>
              <SummaryRow label="Subtotal" value={formatINR(subtotal)} />
              <SummaryRow label="GST (18%)" value={formatINR(Math.round(gst))} />
              <SummaryRow label="Shipping" value="FREE" valueClass="text-success" />
              <div className="h-px bg-border my-2.5" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text-primary">Grand Total</span>
                <span className="text-lg font-bold text-primary">{formatINR(Math.round(total))}</span>
              </div>
            </div>
          </div>

          {/* Checkout bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-4 py-3 pb-5">
            <div className="max-w-3xl mx-auto flex items-center gap-4">
              <div>
                <p className="text-[11px] text-text-secondary">Total</p>
                <p className="text-lg font-bold text-text-primary">{formatINR(Math.round(total))}</p>
              </div>
              <div className="flex-1">
                <Button label="Proceed to Checkout" onClick={() => router.push("/checkout/address")} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SummaryRow({ label, value, valueClass = "text-text-primary" }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[13px] text-text-secondary">{label}</span>
      <span className={`text-[13px] font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
}
