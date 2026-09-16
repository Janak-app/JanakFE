import type { AxiosResponse } from "axios";
import useFetchApi from "./useFetchApi";
import type { ApiQuote } from "@/types/api";

function useQuoteDetail(id: string) {
  return useFetchApi<ApiQuote | null>({
    endpoint: `v1/quotes/${id}`,
    retrieveOnMount: !!id,
    resGetter: (res: AxiosResponse) => res?.data?.data ?? null,
  });
}

export default useQuoteDetail;
