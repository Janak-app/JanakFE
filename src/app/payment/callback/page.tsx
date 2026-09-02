"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, XCircle, CheckCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";
import { Suspense } from "react";

function buildDeepLink(orderId: string | null) {
  const path = orderId
    ? `order-success?orderId=${encodeURIComponent(orderId)}`
    : "order-success";
  return `janakapp://${path}`;
}

function buildIntentUrl(orderId: string | null) {
  const path = orderId
    ? `order-success?orderId=${encodeURIComponent(orderId)}`
    : "order-success";
  return `intent://${path}#Intent;scheme=janakapp;package=com.janakpositioning.janakglobal;end`;
}

function PaymentCallbackInner() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const clearedRef = useRef(false);
  const [showFallback, setShowFallback] = useState(false);

  const status = searchParams.get("status")?.toLowerCase();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (status !== "success") return;

    // Clean up cart state once.
    if (!clearedRef.current) {
      clearedRef.current = true;
      localStorage.removeItem("merchantTxnNo");
      clearCart();
    }

    // Redirect back into the native app.
    const isAndroid = /android/i.test(navigator.userAgent);
    window.location.href = isAndroid
      ? buildIntentUrl(orderId)
      : buildDeepLink(orderId);

    // If the deep link didn't open the app within 2 s, show a manual button.
    const timer = setTimeout(() => setShowFallback(true), 2000);
    return () => clearTimeout(timer);
  }, [status, orderId, clearCart]);

  if (status === "success") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 px-6">
        <div className="w-20 h-20 rounded-full bg-[#16A34A] flex items-center justify-center shadow-[0_8px_32px_rgba(22,163,74,0.3)]">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold text-[#111827]">Payment Successful!</h1>
          <p className="text-sm text-[#6B7280] mt-1">Opening the Janak app…</p>
        </div>

        {!showFallback && <Loader2 className="w-8 h-8 text-accent animate-spin" />}

        {showFallback && (
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <p className="text-sm text-[#6B7280] text-center">
              Tap below to return to the app.
            </p>
            <a
              href={buildDeepLink(orderId)}
              className="w-full text-center bg-accent text-white text-sm font-semibold px-6 py-3 rounded-xl"
            >
              Open Janak App
            </a>
          </div>
        )}
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
          <a
            href={buildDeepLink(null).replace("order-success", "checkout/payment")}
            className="w-full text-center bg-accent text-white text-sm font-semibold px-6 py-3 rounded-xl"
          >
            Try Again
          </a>
        </div>
      </div>
    );
  }

  // Unknown / missing status — just show spinner.
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
