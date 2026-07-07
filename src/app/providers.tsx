"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import BottomTabBar from "@/components/layout/BottomTabBar";

const queryClient = new QueryClient();

function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = pathname.startsWith("/auth");

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/auth/login");
    }
  }, [loading, user, isPublic, router]);

  if (loading) return null;
  if (!user && !isPublic) return null;

  return <>{children}</>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="pb-14 md:pb-0">
              <AuthGuard>{children}</AuthGuard>
            </div>
            <BottomTabBar />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
