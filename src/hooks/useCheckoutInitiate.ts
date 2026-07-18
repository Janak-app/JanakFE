import useMutationApi, { DynamicMutationPayload } from "./useMutationApi";

export interface PlaceOrderResponse {
  orderId: string;
  id: string;
  totalAmount: number;
  estimatedDeliveryStart: string;
  estimatedDeliveryEnd: string;
  paymentMethod: string;
  message: string;
}

interface PlaceOrderPayload extends DynamicMutationPayload {
  addressId: string;
  paymentMethod: string;
  transactionId?: string;
  couponCode?: string;
}

export function usePlaceOrder() {
  return useMutationApi<PlaceOrderResponse, PlaceOrderPayload>({
    method: "post",
    endpoint: "v1/checkout/place-order",
  });
}
