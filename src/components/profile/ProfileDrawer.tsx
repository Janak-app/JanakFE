"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Receipt, FileText, Wrench, Heart, Cpu, Download,
  Bell, MessageSquare, LogOut, GitCompare, ChevronRight, X,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
  const router = useRouter();
  const { show } = useToast();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => {
    onClose();
    if (window.confirm("Are you sure you want to logout?")) {
      router.replace("/auth");
    }
  };

  const menu = [
    { icon: GitCompare, label: "Product Comparison", sub: "Compare specs side-by-side", href: "/compare" },
    { icon: Receipt, label: "My Orders", sub: "3 orders", href: "/orders" },
    { icon: FileText, label: "My Quotes", sub: "1 active", badge: "1", href: "/quote/list" },
    { icon: Wrench, label: "My Service Requests", sub: "1 confirmed", href: "/service/list" },
    { icon: Heart, label: "My Wishlist", sub: "No items saved", onClick: () => { onClose(); show("No saved items yet", "info"); } },
    { icon: Cpu, label: "My Equipment", sub: "1 registered", onClick: () => { onClose(); show("Equipment registry — coming soon", "info"); } },
    { icon: Download, label: "Download Invoices", onClick: () => { onClose(); show("Preparing download...", "info"); } },
    { icon: Bell, label: "Notification Preferences", href: "/notifications" },
    { icon: MessageSquare, label: "Contact Support", sub: "Mon–Sat · 9AM–6PM", href: "/chat" },
    { icon: LogOut, label: "Logout", onClick: handleLogout, danger: true },
  ] as const;

  return (
    <>
      {/* Backdrop */}
      <div
        ref={overlayRef}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-[#F5F5F7] rounded-t-2xl transition-transform duration-300 ease-out max-h-[85vh] flex flex-col ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Handle + close */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="w-8" />
          <div className="w-10 h-1 rounded-full bg-[#D1D5DB]" />
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#E5E7EB]"
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto pb-24 px-4 pt-1">
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            {menu.map((item, idx) => {
              const Icon = item.icon;
              const isLast = idx === menu.length - 1;
              const isDanger = "danger" in item && item.danger;

              const content = (
                <div
                  className={`flex items-center gap-3 px-3.5 py-3.5 ${
                    isLast ? "" : "border-b border-[#E5E7EB]"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-[10px] flex items-center justify-center ${
                      isDanger ? "bg-[#FEE2E2]" : "bg-[#E0F2FE]"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isDanger ? "text-[#DC2626]" : "text-[#1A4F9C]"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-semibold ${
                        isDanger ? "text-[#DC2626]" : "text-[#111827]"
                      }`}
                    >
                      {item.label}
                    </p>
                    {"sub" in item && item.sub ? (
                      <p className="text-[11px] text-[#6B7280] mt-0.5">{item.sub}</p>
                    ) : null}
                  </div>
                  {"badge" in item && item.badge ? (
                    <span className="min-w-[18px] h-[18px] px-1 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  ) : null}
                  {!isDanger && <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />}
                </div>
              );

              if ("href" in item && item.href) {
                return (
                  <Link key={item.label} href={item.href} onClick={onClose}>
                    {content}
                  </Link>
                );
              }
              return (
                <button
                  key={item.label}
                  onClick={"onClick" in item ? item.onClick : undefined}
                  className="w-full text-left"
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
