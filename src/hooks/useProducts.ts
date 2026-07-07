import type { AxiosResponse } from "axios";
import useFetchApi from "./useFetchApi";
import type { ApiProduct } from "@/types/api";
import type { Product } from "@/data/products";

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  accuracyRating?: string;
  warranty?: string;
  featured?: boolean;
  newArrival?: boolean;
}

const STOCK_MAP: Record<ApiProduct["stockStatus"], Product["stock"]> = {
  in_stock: "In Stock",
  limited_stock: "Limited Stock",
  out_of_stock: "On Order",
};

export function mapApiProduct(p: ApiProduct): Product {
  const price = p.price ? parseFloat(p.price) : null;
  const sortedImages = [...p.images].sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: p.id,
    name: p.name,
    brand: p.brand.name,
    category: p.category.name,
    categoryKey: p.category.slug,
    model: p.modelNumber,
    price,
    priceLabel: price
      ? `₹${price.toLocaleString("en-IN")}`
      : "Get Quote",
    stock: STOCK_MAP[p.stockStatus] ?? "On Order",
    images: sortedImages.map((img) => img.url),
    description: p.description,
    highlights: [],
    specs: [...(p.specs ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ key, value }) => ({ label: key, value })),
    reviews: [],
  };
}

function buildParams(
  filters: ProductFilters = {}
): Record<string, string | number | boolean> {
  const raw: Record<string, string | number | boolean | undefined> = {
    search: filters.search,
    category: filters.category,
    brand: filters.brand,
    inStock: filters.inStock === true ? true : undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    accuracyRating: filters.accuracyRating,
    warranty: filters.warranty,
    featured: filters.featured === true ? true : undefined,
    newArrival: filters.newArrival === true ? true : undefined,
  };

  return Object.fromEntries(
    Object.entries(raw).filter(([, v]) => v !== undefined && v !== "")
  ) as Record<string, string | number | boolean>;
}

function useProducts(filters?: ProductFilters) {
  const params = buildParams(filters);
  return useFetchApi<Product[]>({
    endpoint: "v1/products",
    options: { params },
    resGetter: (res: AxiosResponse) => {
      const items: ApiProduct[] = res?.data?.data?.items ?? [];
      return items.map(mapApiProduct);
    },
  });
}

export default useProducts;
