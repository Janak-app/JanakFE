"use client";
import useFetchApi from "./useFetchApi";

export interface MeUser {
  id: string;
  email: string;
  role: "customer" | "admin" | "guest";
}

export interface MeApiResponse {
  success: boolean;
  data: MeUser;
  message: string;
  timestamp: string;
}

function useMe() {
  const { data, loading, isError, isFetching, isSuccess, retrieve } =
    useFetchApi<MeUser>({
      endpoint: "v1/auth/me",
      errorOff: true,
      cacheEnabled: false,
    });

  return {
    user: data ?? null,
    loading,
    isFetching,
    isError,
    isSuccess,
    refetch: retrieve,
  };
}

export default useMe;
