"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, ClipboardList, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

const TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: LayoutGrid },
  { label: "Cart", href: "/cart", icon: ShoppingCart },
  { label: "Orders", href: "/orders", icon: ClipboardList },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] flex items-stretch">
      {TABS.map(({ label, href, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        const isCart = label === "Cart";

        return (
          <Link
            key={label}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px]"
          >
            <div className="relative">
              <Icon
                className={`w-6 h-6 ${active ? "text-[#1A4F9C]" : "text-[#9CA3AF]"}`}
                strokeWidth={active ? 2.2 : 1.8}
                fill={active && label === "Home" ? "#1A4F9C" : "none"}
              />
              {isCart && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-0.5 bg-[#DC2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-medium leading-none ${
                active ? "text-[#1A4F9C]" : "text-[#9CA3AF]"
              }`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
