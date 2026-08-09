"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import BottomTabBar from "@/components/layout/BottomTabBar";

const queryClient = new QueryClient();

const SHOW_TAB_ROUTES = ["/", "/explore"];

function useShowBottomTab() {
  const pathname = usePathname();
  return SHOW_TAB_ROUTES.includes(pathname);
}

function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic =
    pathname.startsWith("/auth") ||
    pathname === "/privacy-policy" ||
    pathname === "/terms";

  useEffect(() => {
    if (!loading && !user && !isPublic) {
      router.replace("/auth/login");
    }
  }, [loading, user, isPublic, router]);

  if (loading && !isPublic) return null;
  if (!user && !isPublic) return null;

  return <>{children}</>;
}

function PageWrapper({ children }: { children: ReactNode }) {
  const showTab = useShowBottomTab();
  return <div className={showTab ? "pb-14 md:pb-0" : ""}>{children}</div>;
}

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <PageWrapper>
              <AuthGuard>{children}</AuthGuard>
            </PageWrapper>
            <BottomTabBar />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
