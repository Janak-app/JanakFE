import useMutationApi, { DynamicMutationPayload } from "./useMutationApi";

export interface RaiseQuoteResponse {
  id: string;
  status: string;
}

interface RaiseQuoteItemPayload {
  productId: string;
  quantity: number;
}

export interface RaiseQuotePayload extends DynamicMutationPayload {
  items: RaiseQuoteItemPayload[];
  intendedUse: string;
  budgetRange: string;
  timeline: string;
  notes?: string;
}

export function useRaiseQuote() {
  return useMutationApi<RaiseQuoteResponse, RaiseQuotePayload>({
    method: "post",
    endpoint: "v1/quotes",
  });
}
