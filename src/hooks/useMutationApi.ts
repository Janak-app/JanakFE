"use client";
import { axiosInstance } from "@/utils/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from "axios";

// API response structure
interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  status?: number;
}

interface MutationApiOptions<TData> {
  method?: Method;
  endpoint: string;
  resGetter?: (res: AxiosResponse<ApiResponse<TData>>) => TData;
  errorOff?: boolean;
  options?: AxiosRequestConfig;
  headers?: Record<string, string>;
  onSuccess?: () => void;
  onError?: () => void;
}

export interface DynamicMutationPayload {
  dynamicEndpointSuffix?: string;
  [key: string]: unknown;
}

const useMutationApi = <
  TData = unknown,
  TVariables extends DynamicMutationPayload = DynamicMutationPayload,
>({
  method = "post",
  endpoint,
  resGetter = (res: AxiosResponse<ApiResponse<TData>>) => res?.data?.data as TData,
  errorOff = false,
  options,
  headers,
  onSuccess,
  onError,
}: MutationApiOptions<TData>) => {
  const mutation = useMutation<TData, AxiosError<ApiResponse>, TVariables>({
    mutationFn: async (data: TVariables) => {
      let url = endpoint;
      let payload: unknown = data;

      if (data instanceof FormData) {
        if ("dynamicEndpointSuffix" in data) {
          url = `${endpoint}/${(data as unknown as { dynamicEndpointSuffix: string }).dynamicEndpointSuffix}`;
          data.delete("dynamicEndpointSuffix");
        }
        payload = data;
      } else {
        const { dynamicEndpointSuffix, ...restData } = data || ({} as TVariables);
        if (dynamicEndpointSuffix) {
          url = `${endpoint}/${dynamicEndpointSuffix}`;
        }
        payload = restData;
      }

      const response = await axiosInstance({
        url,
        method,
        data: payload,
        headers: { ...headers },
        ...options,
      });

      return resGetter(response);
    },
    onSuccess() {
      if (onSuccess) onSuccess();
    },
    onError() {
      if (onError) onError();
    },
  });

  useEffect(() => {
    if (mutation.error && !errorOff) {
      const axiosError = mutation.error as AxiosError<ApiResponse>;
      const message = axiosError?.response?.data?.message;
      console.error("[useMutationApi] error:", {
        status: axiosError?.response?.status,
        message,
        data: axiosError?.response?.data,
        isNetworkError: !axiosError?.response,
      });
      toast.error(message || "Cannot perform the operation");
    }
  }, [mutation.error, errorOff]);

  return mutation;
};

export default useMutationApi;
