"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { /* ShoppingCart, */ User, Search, LogOut, ChevronDown, Navigation } from "lucide-react";
// import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import useMutationApi from "@/hooks/useMutationApi";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  // { label: "Catalog", href: "/explore" },
  // { label: "Service", href: "/service/book" },
  // { label: "Quotes", href: "/quote/list" },
  // { label: "Contact", href: "/chat" },
];

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  // const { cartCount } = useCart();
  const { user, loading } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: logout, isPending: isLoggingOut } = useMutationApi({
    endpoint: "v1/auth/logout",
    method: "POST",
    errorOff: true,
  });

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout({});
    } finally {
      setUserMenuOpen(false);
      router.push("/auth/login");
    }
  };

  return (
    <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">

      {/* ── Mobile header (3-row layout) ── */}
      <div className="md:hidden px-4 pt-3 pb-3 flex flex-col gap-2">

        {/* Row 1: Logo */}
        <div className="flex items-center justify-center">
          <Link href="/">
            <Image
              src="/logo/janak-logo.svg"
              alt="Janak Positioning & Surveying Systems"
              width={130}
              height={44}
              priority
            />
          </Link>
        </div>

        {/* Row 2: Delivery location */}
        <div className="flex items-center justify-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-accent fill-[#1A4F9C]" />
          <span className="text-[13px] font-semibold text-[#111827]">
            Deliver to : Sector 62, Noida, UP
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-[#111827]" />
        </div>

        {/* Row 3: Search + Cart */}
        <div className="flex items-center gap-2">
          {/* <div className="flex-1 flex items-center gap-2 h-10 bg-white border border-[#E5E7EB] rounded-full px-4">
            <Search className="w-4 h-4 text-[#9CA3AF] shrink-0" />
            <input
              placeholder="Search Product"
              className="flex-1 text-sm bg-transparent outline-none text-[#111827] placeholder:text-[#9CA3AF]"
            />
          </div> */}
          {/* <Link
            href="/cart"
            className={`relative w-10 h-10 flex items-center justify-center rounded-xl shrink-0 transition-colors ${
              cartCount > 0 ? "bg-accent" : "border border-[#E5E7EB]"
            }`}
          >
            <ShoppingCart className={`w-5 h-5 ${cartCount > 0 ? "text-white" : "text-[#111827]"}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 bg-[#1C1C1C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link> */}
        </div>
      </div>

      {/* ── Desktop header (single row) ── */}
      <div className="hidden md:flex max-w-7xl mx-auto px-6 h-[72px] items-center gap-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo/janak-logo.svg"
            alt="Janak Positioning & Surveying Systems"
            width={130}
            height={44}
            priority
          />
        </Link>

        <nav className="flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3.5 py-2 text-[13px] font-medium rounded transition-colors relative ${
                  active ? "text-accent font-semibold" : "text-[#111827] hover:text-accent"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-accent rounded" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-1 max-w-xs ml-auto">
          <div className="flex items-center gap-2 w-full h-10 bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3">
            <Search className="w-4 h-4 text-[#6B7280] shrink-0" />
            <input
              placeholder="Search products, brands..."
              className="flex-1 text-sm bg-transparent outline-none text-[#111827] placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* <Link
            href="/cart"
            className={`relative w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
              cartCount > 0 ? "bg-accent" : "hover:bg-[#F5F5F7]"
            }`}
          >
            <ShoppingCart className={`w-5 h-5 ${cartCount > 0 ? "text-white" : "text-[#111827]"}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-0.5 bg-[#1C1C1C] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link> */}

          {!loading && (
            <div ref={menuRef}>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-[#F5F5F7] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center text-white text-[11px] font-bold">
                      {getInitials(user.email)}
                    </div>
                    <span className="text-[13px] font-medium text-[#111827] max-w-[120px] truncate">
                      {user.email}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#6B7280] transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-lg py-1 z-50">
                      <div className="px-3 py-2 border-b border-[#F3F4F6]">
                        <p className="text-[11px] text-[#6B7280]">Signed in as</p>
                        <p className="text-[13px] font-semibold text-[#111827] truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-[#DC2626] hover:bg-[#FEF2F2] transition-colors disabled:opacity-50"
                      >
                        <LogOut className="w-4 h-4" />
                        {isLoggingOut ? "Signing out..." : "Sign Out"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-1.5 h-10 px-4 bg-accent text-white text-[13px] font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

    </header>
  );
}
