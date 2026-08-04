"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, User } from "lucide-react";

const TABS = [
  { label: "Home",    href: "/",        icon: Home },
  { label: "Explore", href: "/explore", icon: LayoutGrid },
  { label: "Profile", href: "/profile", icon: User },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  if (pathname.startsWith("/auth")) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E7EB] flex items-stretch">
      {TABS.map(({ label, href, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={label}
            href={href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px]"
          >
            <Icon
              className={`w-6 h-6 ${active ? "text-accent" : "text-[#9CA3AF]"}`}
              strokeWidth={active ? 2.2 : 1.8}
              fill={active && label === "Home" ? "#943C3C" : "none"}
            />
            <span className={`text-[11px] font-medium leading-none ${active ? "text-accent" : "text-[#9CA3AF]"}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
