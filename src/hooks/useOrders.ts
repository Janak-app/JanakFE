"use client";

import useFetchApi from "./useFetchApi";
import { ApiOrder } from "@/types/api";

export function formatOrderAmount(amount: string): string {
  const num = Math.round(parseFloat(amount));
  return "₹" + num.toLocaleString("en-IN");
}

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function getOrderPrimaryImage(order: ApiOrder): string {
  const firstItem = order.items[0];
  if (!firstItem) return "";
  const primary = firstItem.product.images.find((img) => img.isPrimary);
  return primary?.url ?? firstItem.product.images[0]?.url ?? "";
}

export function getOrderProductLabel(order: ApiOrder): string {
  if (order.items.length === 0) return "—";
  const first = order.items[0].productName;
  if (order.items.length === 1) return first;
  return `${first} + ${order.items.length - 1} more`;
}

export function useOrders() {
  const { data, loading, error, retrieve } = useFetchApi<ApiOrder[]>({
    endpoint: "v1/orders",
    resGetter: (res) => res?.data?.data ?? [],
    retrieveOnMount: true,
  });

  return {
    orders: data ?? [],
    loading,
    error,
    retrieve,
  };
}

export function useOrder(id: string) {
  const { data, loading, error, retrieve } = useFetchApi<ApiOrder | null>({
    endpoint: `v1/orders/${id}`,
    resGetter: (res) => res?.data?.data ?? null,
    retrieveOnMount: !!id,
  });

  return {
    order: data ?? null,
    loading,
    error,
    retrieve,
  };
}
