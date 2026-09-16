import type { ApiCategory } from "@/types/api";

export function filterCategoriesForPlatform(
  categories: ApiCategory[],
  isNativeApp: boolean
): ApiCategory[] {
  return categories.filter((c) => (isNativeApp ? c.showOnApp : c.showOnWebsite));
}
