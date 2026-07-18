import { useState, useEffect } from "react";
import { axiosInstance } from "@/utils/axiosInstance";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

interface UsePaymentStatusOptions {
  merchantTxnNo: string | null;
  intervalMs?: number;
  maxAttempts?: number;
}

export function usePaymentStatus({
  merchantTxnNo,
  intervalMs = 2000,
  maxAttempts = 15,
}: UsePaymentStatusOptions) {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!merchantTxnNo) return;

    setLoading(true);
    setStatus(null);
    setError(false);

    let attempts = 0;
    let intervalId: ReturnType<typeof setInterval>;

    const stop = () => {
      clearInterval(intervalId);
      setLoading(false);
    };

    const poll = async () => {
      attempts++;
      try {
        const res = await axiosInstance.get(`/payments/status/${merchantTxnNo}`);
        const localStatus: PaymentStatus =
          res.data?.data?.localStatus ?? res.data?.localStatus;
        setStatus(localStatus);
        if (localStatus !== "PENDING" || attempts >= maxAttempts) {
          if (attempts >= maxAttempts && localStatus === "PENDING") {
            setStatus("FAILED");
          }
          stop();
        }
      } catch {
        setError(true);
        stop();
      }
    };

    poll();
    intervalId = setInterval(poll, intervalMs);

    return () => clearInterval(intervalId);
  }, [merchantTxnNo, intervalMs, maxAttempts]);

  return { status, loading, error };
}
