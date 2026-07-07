import type { AxiosResponse } from "axios";
import useFetchApi from "./useFetchApi";
import type { ApiCategory } from "@/types/api";

function useCategories() {
  return useFetchApi<ApiCategory[]>({
    endpoint: "v1/categories",
    resGetter: (res: AxiosResponse) => res?.data?.data ?? [],
  });
}

export default useCategories;
