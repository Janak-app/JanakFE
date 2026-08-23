"use client";

import { createContext, useContext, useState, useMemo, useRef, useEffect, ReactNode } from "react";
import useMutationApi from "@/hooks/useMutationApi";
import useFetchApi from "@/hooks/useFetchApi";
import { ApiCart, ApiCartItem, ApiCartSummary } from "@/types/api";

export type CartItem = {
  productId: string;
  quantity: number;
};

type AddItemPayload = { productId: string; quantity: number };
type AddItemResponse = { id: string; productId: string; quantity: number };
type UpdateItemPayload = { dynamicEndpointSuffix: string; quantity: number };
type UpdateItemResponse = { id: string; productId: string; quantity: number };
type DeleteItemPayload = { dynamicEndpointSuffix: string };

const DEFAULT_SUMMARY: ApiCartSummary = {
  subtotal: 0,
  gstAmount: 0,
  discountAmount: 0,
  shippingAmount: 0,
  totalAmount: 0,
  advanceAmount: 0,
  balanceAmount: 0,
};

type CartContextType = {
  items: CartItem[];
  serverItems: ApiCartItem[];
  addItem: (productId: string, qty?: number) => void;
  removeItem: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  refetchCart: () => void;
  cartCount: number;
  summary: ApiCartSummary;
  cartLoading: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [serverItems, setServerItems] = useState<ApiCartItem[]>([]);

  // productId → server-assigned cart item id (needed for PUT /v1/cart/items/:id)
  const serverIds = useRef<Record<string, string>>({});
  // per-item debounce timers so rapid +/- clicks collapse into one API call
  const updateTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const { data: cartData, loading: cartLoading, retrieve: refetchCart } = useFetchApi<ApiCart>({
    endpoint: "/v1/cart",
    cacheEnabled: false,
  });

  // Seed local state from server on first load
  useEffect(() => {
    if (!cartData?.items?.length) return;
    setServerItems(cartData.items);
    setItems(cartData.items.map(({ product, quantity }) => ({ productId: product.id, quantity })));
    cartData.items.forEach(({ id, product }) => {
      serverIds.current[product.id] = id;
    });
  }, [cartData]);

  const addMutation = useMutationApi<AddItemResponse, AddItemPayload>({
    method: "post",
    endpoint: "/v1/cart/items",
    errorOff: true, // we handle rollback manually below
  });

  const updateMutation = useMutationApi<UpdateItemResponse, UpdateItemPayload>({
    method: "PATCH",
    endpoint: "/v1/cart/items",
  });

  const deleteMutation = useMutationApi<void, DeleteItemPayload>({
    method: "delete",
    endpoint: "/v1/cart/items",
    errorOff: true,
  });

  const addItem = (productId: string, qty = 1) => {
    // optimistic update
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + qty } : i
        );
      }
      return [...prev, { productId, quantity: qty }];
    });

    addMutation.mutate(
      { productId, quantity: qty },
      {
        onSuccess: (data) => {
          // store the server id so updateQty can reference it
          serverIds.current[data.productId] = data.id;
        },
        onError: () => {
          // rollback — remove item if it was newly added, or restore original qty
          setItems((prev) => prev.filter((i) => i.productId !== productId));
        },
      }
    );
  };

  const removeItem = (productId: string) => {
    // cancel any pending debounced update for this item
    clearTimeout(updateTimers.current[productId]);
    delete updateTimers.current[productId];

    // optimistic remove
    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.productId !== productId));

    const serverId = serverIds.current[productId];
    if (!serverId) return;

    deleteMutation.mutate(
      { dynamicEndpointSuffix: serverId },
      {
        onSuccess: () => refetchCart(),
        onError: () => {
          // rollback
          setItems(snapshot);
        },
      }
    );
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }

    // 1. update UI immediately
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity: qty } : i))
    );

    // 2. debounce the API call — rapid clicks collapse into one PUT
    clearTimeout(updateTimers.current[productId]);
    updateTimers.current[productId] = setTimeout(() => {
      const serverId = serverIds.current[productId];
      if (!serverId) return; // item not yet synced to server, skip
      updateMutation.mutate(
        { dynamicEndpointSuffix: serverId, quantity: qty },
        { onSuccess: () => refetchCart() }
      );
    }, 700);
  };

  const clearCart = () => {
    // cancel all pending update timers
    Object.values(updateTimers.current).forEach(clearTimeout);
    updateTimers.current = {};
    setItems([]);
  };

  const cartCount = useMemo(() => items.reduce((acc, it) => acc + it.quantity, 0), [items]);

  const summary = cartData?.summary ?? DEFAULT_SUMMARY;

  return (
    <CartContext.Provider
      value={{ items, serverItems, addItem, removeItem, updateQty, clearCart, refetchCart, cartCount, summary, cartLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
