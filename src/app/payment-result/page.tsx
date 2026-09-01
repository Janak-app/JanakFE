"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useCart } from "@/context/CartContext";

function PaymentResultInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [merchantTxnNo, setMerchantTxnNo] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);

  const isNativeRedirect = searchParams.get("source") === "native";

  // When opened in the browser as the payment gateway's returnUrl on native,
  // immediately redirect back into the app using an intent URL (Android) or
  // custom scheme (iOS). The app's deep link handler then navigates to
  // /payment-result inside the WebView where merchantTxnNo is available.
  useEffect(() => {
    if (!isNativeRedirect) return;
    const isAndroid = /android/i.test(navigator.userAgent);
    if (isAndroid) {
      window.location.href =
        "intent://payment-result#Intent;scheme=janakapp;package=com.janakpositioning.janakglobal;end";
    } else {
      window.location.href = "janakapp://payment-result";
    }
  }, [isNativeRedirect]);

  useEffect(() => {
    if (isNativeRedirect) return;
    const txnNo = localStorage.getItem("merchantTxnNo");
    if (!txnNo) {
      router.replace("/");
      return;
    }
    setMerchantTxnNo(txnNo);
  }, [router, isNativeRedirect]);

  const { status, loading, error } = usePaymentStatus({ merchantTxnNo });

  useEffect(() => {
    if (status === "SUCCESS" && !cartCleared) {
      localStorage.removeItem("merchantTxnNo");
      clearCart();
      setCartCleared(true);
    }
  }, [status, cartCleared, clearCart]);

  if (isNativeRedirect) {
    return <PendingScreen message="Opening app…" />;
  }

  if (!merchantTxnNo || (loading && !status)) {
    return <PendingScreen />;
  }

  if (error || status === "FAILED") {
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
          <Button label="Try Again" onClick={() => router.replace("/checkout/review")} />
          <Button
            label="Go to Cart"
            variant="outlined"
            onClick={() => router.replace("/cart")}
          />
        </div>
      </div>
    );
  }

  if (status === "SUCCESS") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 gap-4">
        <div className="w-24 h-24 rounded-full bg-[#16A34A] flex items-center justify-center shadow-[0_8px_32px_rgba(22,163,74,0.3)]">
          <CheckCircle className="w-14 h-14 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-[#111827]">Payment Successful!</h1>
        <p className="text-sm text-[#6B7280] text-center max-w-xs">
          Your order has been confirmed. You&apos;ll receive a confirmation email shortly.
        </p>
        <div className="w-full max-w-xs mt-4">
          <Button label="View My Orders" onClick={() => router.replace("/orders")} />
        </div>
      </div>
    );
  }

  return <PendingScreen />;
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<PendingScreen />}>
      <PaymentResultInner />
    </Suspense>
  );
}

function PendingScreen({ message = "Confirming your payment…" }: { message?: string }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
      <Loader2 className="w-12 h-12 text-accent animate-spin" />
      <p className="text-base font-semibold text-[#111827]">{message}</p>
      <p className="text-sm text-[#6B7280] text-center">
        Please wait, this may take a few seconds.
      </p>
    </div>
  );
}
