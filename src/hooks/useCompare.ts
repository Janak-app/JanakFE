"use client";

import { useEffect } from "react";
import useFetchApi from "./useFetchApi";
import { ApiProduct } from "@/types/api";
import { useToast } from "@/context/ToastContext";

export function useCompare() {
  const { show } = useToast();
  const { data, loading, isError, retrieveWithAttrs } = useFetchApi<ApiProduct[]>({
    endpoint: "v1/compare",
    retrieveOnMount: false,
    resGetter: (res) => res?.data?.data ?? [],
  });

  useEffect(() => {
    if (isError) {
      show("Failed to load comparison. Please try again.", "error");
    }
  }, [isError, show]);

  const compare = async (ids: string[]) => {
    await retrieveWithAttrs(`v1/compare?ids=${ids.join(",")}`);
  };

  return {
    data: data ?? [],
    loading,
    isError,
    compare,
  };
}
