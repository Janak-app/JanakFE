"use client";

import useFetchApi from "./useFetchApi";
import { ApiQuote } from "@/types/api";

export function useQuotes() {
  const { data, loading, error, retrieve } = useFetchApi<ApiQuote[]>({
    endpoint: "v1/quotes",
    resGetter: (res) => res?.data?.data ?? [],
    retrieveOnMount: true,
  });

  return {
    quotes: data ?? [],
    loading,
    error,
    retrieve,
  };
}
