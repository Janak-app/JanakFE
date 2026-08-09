"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import useMe, { MeUser } from "@/hooks/useMe";

interface AuthContextValue {
  user: MeUser | null;
  loading: boolean;
  isFetching: boolean;
  isError: boolean;
  isSuccess: boolean;
  refetch: () => void;
  setUser: (user: MeUser) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const me = useMe();
  const [overrideUser, setOverrideUser] = useState<MeUser | null>(null);

  const setUser = (user: MeUser) => setOverrideUser(user);

  const value: AuthContextValue = {
    ...me,
    user: overrideUser ?? me.user,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
