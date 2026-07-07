"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MapPin, ShoppingCart, User, Search, Menu, X, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import useMutationApi from "@/hooks/useMutationApi";

const NAV = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/explore" },
  { label: "Service", href: "/service/book" },
  { label: "Quotes", href: "/quote/list" },
  { label: "Contact", href: "/chat" },
];

function getInitials(email: string) {
  return email.slice(0, 2).toUpperCase();
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: logout, isPending: isLoggingOut } = useMutationApi({
    endpoint: "v1/auth/logout",
    method: "POST",
    errorOff: true,
  });

  // Close dropdown on outside click
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
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-[9px] bg-[#1A4F9C] flex items-center justify-center">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#111827] tracking-[2px]">JANAK</div>
            <div className="text-[8px] font-medium text-[#1A4F9C] tracking-[3px]">POSITIONING</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3.5 py-2 text-[13px] font-medium rounded transition-colors relative ${
                  active ? "text-[#1A4F9C] font-semibold" : "text-[#111827] hover:text-[#1A4F9C]"
                }`}
              >
                {item.label}
                {active && (
                  <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#1A4F9C] rounded" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex flex-1 max-w-xs ml-auto">
          <div className="flex items-center gap-2 w-full h-10 bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3">
            <Search className="w-4 h-4 text-[#6B7280] shrink-0" />
            <input
              placeholder="Search products, brands..."
              className="flex-1 text-sm bg-transparent outline-none text-[#111827] placeholder:text-[#9CA3AF]"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
        <Link
          href="/cart"
          className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#F5F5F7] transition-colors"
        >
          <ShoppingCart className="w-5 h-5 text-[#111827]" />
          {cartCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-[#DC2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Desktop auth */}
        {!loading && (
          <div className="hidden md:block" ref={menuRef}>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-[#F5F5F7] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[#1A4F9C] flex items-center justify-center text-white text-[11px] font-bold">
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
                className="flex items-center gap-1.5 h-10 px-4 bg-[#1A4F9C] text-white text-[13px] font-semibold rounded-lg hover:bg-[#143E7A] transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        )}

        <button
          className="md:hidden w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#E5E7EB] px-6 py-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="py-2.5 text-sm font-medium text-[#111827] hover:text-[#1A4F9C] transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {!loading && (
            <>
              {user ? (
                <>
                  <div className="mt-2 py-2 border-t border-[#F3F4F6]">
                    <p className="text-[11px] text-[#6B7280]">Signed in as</p>
                    <p className="text-[13px] font-semibold text-[#111827] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => { setMobileOpen(false); handleLogout(); }}
                    disabled={isLoggingOut}
                    className="flex items-center gap-2 py-2.5 text-sm font-semibold text-[#DC2626] disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 py-2.5 text-sm font-semibold text-[#1A4F9C]"
                >
                  Sign In
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}
