"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import BottomTabBar from "@/components/layout/BottomTabBar";
import { useBackButton } from "@/hooks/useBackButton";
import { useDeepLink } from "@/hooks/useDeepLink";

const queryClient = new QueryClient();

const ROOT_ROUTES = ["/", "/explore"];
const SHOW_TAB_ROUTES = ROOT_ROUTES;

function useShowBottomTab() {
  const pathname = usePathname();
  return SHOW_TAB_ROUTES.includes(pathname);
}

function BackButtonHandler() {
  const pathname = usePathname();
  useBackButton(ROOT_ROUTES.includes(pathname));
  return null;
}

function DeepLinkHandler() {
  useDeepLink();
  return null;
}

function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic =
    pathname.startsWith("/auth") ||
    pathname === "/privacy-policy" ||
    pathname === "/terms" ||
    pathname === "/payment-result" ||
    pathname === "/payment-complete" ||
    pathname.startsWith("/payment/callback");

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
            <BackButtonHandler />
            <DeepLinkHandler />
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
