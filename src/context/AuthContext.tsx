"use client";
import { createContext, useContext, ReactNode } from "react";
import useMe, { MeUser } from "@/hooks/useMe";

interface AuthContextValue {
  user: MeUser | null;
  loading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const me = useMe();
  return <AuthContext.Provider value={me}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
