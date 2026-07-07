import type { AxiosResponse } from "axios";
import useFetchApi from "./useFetchApi";
import type { ApiProduct } from "@/types/api";
import type { Product } from "@/data/products";
import { mapApiProduct } from "./useProducts";

export interface ProductDetail {
  product: Product;
  salesRepName: string;
  salesRepPhone: string;
}

function useProductDetail(id: string) {
  return useFetchApi<ProductDetail | null>({
    endpoint: `v1/products/${id}`,
    retrieveOnMount: !!id,
    resGetter: (res: AxiosResponse) => {
      const p: ApiProduct = res?.data?.data;
      if (!p) return null;
      return {
        product: mapApiProduct(p),
        salesRepName: p.salesRepName ?? "Sales Team",
        salesRepPhone: p.salesRepPhone ?? "",
      };
    },
  });
}

export default useProductDetail;
