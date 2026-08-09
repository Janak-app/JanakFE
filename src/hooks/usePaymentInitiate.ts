import useMutationApi, { DynamicMutationPayload } from "./useMutationApi";

export interface PaymentInitiateResponse {
  paymentUrl: string;
  merchantTxnNo: string;
  tranCtx?: string;
}

interface PaymentInitiatePayload extends DynamicMutationPayload {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  returnUrl?: string;
}

export function usePaymentInitiate() {
  return useMutationApi<PaymentInitiateResponse, PaymentInitiatePayload>({
    method: "post",
    endpoint: "v1/payments/initiate",
    headers: {
      "ngrok-skip-browser-warning": "true",
    }
  });
}
