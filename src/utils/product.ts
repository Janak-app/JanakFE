import type { ApiProduct } from "@/types/api";

export function getPrimaryProductImage(product: ApiProduct | undefined | null): string {
  if (!product) return "";
  const primary = product.images.find((img) => img.isPrimary);
  return primary?.url ?? product.images[0]?.url ?? "";
}
