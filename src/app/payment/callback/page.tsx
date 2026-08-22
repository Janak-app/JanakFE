"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { Suspense } from "react";

function PaymentCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const redirectedRef = useRef(false);

  const status = searchParams.get("status")?.toLowerCase();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (redirectedRef.current || status !== "success") return;
    redirectedRef.current = true;
    localStorage.removeItem("merchantTxnNo");
    clearCart();
    const dest = orderId
      ? `/checkout/success?orderId=${encodeURIComponent(orderId)}`
      : "/checkout/success";
    router.replace(dest);
  }, [status, orderId, clearCart, router]);

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-base font-semibold text-[#111827]">Redirecting…</p>
      </div>
    );
  }

  if (status === "failed" || status === "failure" || status === "cancelled") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-4">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
          <XCircle className="w-14 h-14 text-[#DC2626]" />
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Payment Failed</h1>
        <p className="text-sm text-[#6B7280] text-center max-w-xs">
          Your payment could not be completed. No amount has been charged.
        </p>
        <div className="w-full max-w-xs flex flex-col gap-2.5 mt-4">
          <Button
            label="Try Again"
            onClick={() => router.replace("/checkout/payment")}
          />
          <Button
            label="Go to Cart"
            variant="outlined"
            onClick={() => router.replace("/cart")}
          />
        </div>
      </div>
    );
  }

  // Unknown / missing status
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
      <Loader2 className="w-12 h-12 text-accent animate-spin" />
      <p className="text-base font-semibold text-[#111827]">Confirming your payment…</p>
      <p className="text-sm text-[#6B7280] text-center">Please wait, this may take a few seconds.</p>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
          <Loader2 className="w-12 h-12 text-accent animate-spin" />
          <p className="text-base font-semibold text-[#111827]">Loading…</p>
        </div>
      }
    >
      <PaymentCallbackInner />
    </Suspense>
  );
}
