"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { usePaymentStatus } from "@/hooks/usePaymentStatus";
import { useCart } from "@/context/CartContext";

export default function PaymentResultPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [merchantTxnNo, setMerchantTxnNo] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    const txnNo = localStorage.getItem("merchantTxnNo");
    if (!txnNo) {
      router.replace("/");
      return;
    }
    setMerchantTxnNo(txnNo);
  }, [router]);

  const { status, loading, error } = usePaymentStatus({ merchantTxnNo });

  useEffect(() => {
    if (status === "SUCCESS" && !cartCleared) {
      localStorage.removeItem("merchantTxnNo");
      clearCart();
      setCartCleared(true);
    }
  }, [status, cartCleared, clearCart]);

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

function PendingScreen() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 px-6">
      <Loader2 className="w-12 h-12 text-[#1A4F9C] animate-spin" />
      <p className="text-base font-semibold text-[#111827]">Confirming your payment…</p>
      <p className="text-sm text-[#6B7280] text-center">
        Please wait, this may take a few seconds.
      </p>
    </div>
  );
}
