"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Receipt, FileText, Wrench, Heart, Cpu, Download,
  Bell, MessageSquare, LogOut, Building2, GitCompare, ChevronRight,
} from "lucide-react";
import Header from "@/components/layout/Header";
import { useToast } from "@/context/ToastContext";
import { user } from "@/data/user";

export default function ProfilePage() {
  const router = useRouter();
  const { show } = useToast();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      router.replace("/auth");
    }
  };

  const menu = [
    { icon: Receipt, label: "My Orders", sub: "3 orders", href: "/orders" },
    { icon: FileText, label: "My Quotes", sub: "1 active", badge: "1", href: "/quote/list" },
    { icon: Wrench, label: "My Service Requests", sub: "1 confirmed", href: "/service/list" },
    { icon: Heart, label: "My Wishlist", sub: "No items saved", onClick: () => show("No saved items yet", "info") },
    { icon: Cpu, label: "My Equipment", sub: "1 registered", onClick: () => show("Equipment registry — coming soon", "info") },
    { icon: Download, label: "Download Invoices", onClick: () => show("Preparing download...", "info") },
    { icon: Bell, label: "Notification Preferences", href: "/notifications" },
    { icon: MessageSquare, label: "Contact Support", sub: "Mon–Sat · 9AM–6PM", href: "/chat" },
    { icon: LogOut, label: "Logout", onClick: handleLogout, danger: true },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white px-4 pt-5 pb-3 border-b border-[#E5E7EB]">
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Profile</h1>
        </div>

        {/* Profile card */}
        <div className="mx-4 mt-4 bg-white border border-[#E5E7EB] rounded-xl p-5 flex flex-col items-center">
          <div className="w-[72px] h-[72px] rounded-full bg-[#1A4F9C] flex items-center justify-center mb-3">
            <span className="text-white font-bold text-2xl">{user.initials}</span>
          </div>
          <p className="text-lg font-bold text-[#111827]">{user.name}</p>
          <p className="text-xs font-medium text-[#6B7280] mt-1">{user.userType}</p>
          <div className="flex items-center gap-1.5 bg-[#E0EAF7] px-3 py-1.5 rounded-full mt-2.5">
            <Building2 className="w-3 h-3 text-[#1A4F9C]" />
            <span className="text-[11px] font-semibold text-[#1A4F9C]">{user.company}</span>
          </div>
          <div className="flex w-full mt-4 pt-4 border-t border-[#E5E7EB]">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-medium text-[#6B7280] tracking-[1px] uppercase mb-1">Email</span>
              <span className="text-xs font-semibold text-[#111827]">{user.email}</span>
            </div>
            <div className="w-px bg-[#E5E7EB]" />
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[10px] font-medium text-[#6B7280] tracking-[1px] uppercase mb-1">Phone</span>
              <span className="text-xs font-semibold text-[#111827]">{user.phone}</span>
            </div>
          </div>
        </div>

        {/* Compare CTA */}
        <Link
          href="/compare"
          className="mx-4 mt-3 bg-white border border-[#E5E7EB] rounded-xl p-3.5 flex items-center gap-3 hover:shadow-sm transition-shadow"
        >
          <div className="w-10 h-10 rounded-full bg-[#E0F2FE] flex items-center justify-center">
            <GitCompare className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[#111827]">Product Comparison</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Compare specs side-by-side</p>
          </div>
          <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
        </Link>

        {/* Menu */}
        <div className="mx-4 mt-3 bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
          {menu.map((m, idx) => {
            const Icon = m.icon;
            const isLast = idx === menu.length - 1;
            const content = (
              <div className={`flex items-center gap-3 px-3.5 py-3.5 ${isLast ? "" : "border-b border-[#E5E7EB]"}`}>
                <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${"danger" in m && m.danger ? "bg-[#FEE2E2]" : "bg-[#E0F2FE]"}`}>
                  <Icon className={`w-4 h-4 ${"danger" in m && m.danger ? "text-[#DC2626]" : "text-[#1A4F9C]"}`} />
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${"danger" in m && m.danger ? "text-[#DC2626]" : "text-[#111827]"}`}>{m.label}</p>
                  {"sub" in m && m.sub ? <p className="text-[11px] text-[#6B7280] mt-0.5">{m.sub}</p> : null}
                </div>
                {"badge" in m && m.badge ? (
                  <span className="min-w-[18px] h-[18px] px-1 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {m.badge}
                  </span>
                ) : null}
                {!("danger" in m && m.danger) ? <ChevronRight className="w-4 h-4 text-[#9CA3AF]" /> : null}
              </div>
            );

            return "href" in m && m.href ? (
              <Link key={m.label} href={m.href}>{content}</Link>
            ) : (
              <button key={m.label} onClick={"onClick" in m ? m.onClick : undefined} className="w-full text-left">
                {content}
              </button>
            );
          })}
        </div>

        <p className="text-center text-[11px] text-[#9CA3AF] mt-5 mb-8 tracking-wide">
          Janak Positioning · v1.0.0 (Prototype)
        </p>
      </div>
    </div>
  );
}
