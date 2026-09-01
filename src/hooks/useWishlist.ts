import useFetchApi from "./useFetchApi";
import useMutationApi from "./useMutationApi";
import type { ApiWishlistItem } from "@/types/api";

interface WishlistPayload {
  productId: string;
  [key: string]: unknown;
}

export function useWishlist() {
  return useFetchApi<ApiWishlistItem[]>({
    endpoint: "v1/wishlist",
    resGetter: (res) => res?.data?.data ?? [],
  });
}

export function useAddToWishlist() {
  return useMutationApi<void, WishlistPayload>({
    method: "POST",
    endpoint: "v1/wishlist/items",
  });
}

export function useRemoveFromWishlist() {
  return useMutationApi<void, { dynamicEndpointSuffix: string }>({
    method: "DELETE",
    endpoint: "v1/wishlist/items",
  });
}
