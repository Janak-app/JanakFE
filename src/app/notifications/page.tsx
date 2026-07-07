"use client";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Megaphone, Wrench, Info } from "lucide-react";
import Header from "@/components/layout/Header";

type LucideIcon = typeof Bell;

type Pref = {
  key: string;
  label: string;
  sub: string;
  Icon: LucideIcon;
};

const PREFS: Pref[] = [
  { key: "push", label: "Push Notifications", sub: "Order updates, deals & promotions", Icon: Bell },
  { key: "email", label: "Email Updates", sub: "Newsletter, invoices, statements", Icon: Mail },
  { key: "sms", label: "SMS Alerts", sub: "Critical order & delivery updates", Icon: MessageSquare },
  { key: "marketing", label: "Marketing Communications", sub: "Personalized offers from sales reps", Icon: Megaphone },
  { key: "service", label: "Service Reminders", sub: "Calibration & AMC due reminders", Icon: Wrench },
];

const DEFAULT_STATE: Record<string, boolean> = {
  push: true,
  email: true,
  sms: true,
  marketing: false,
  service: true,
};

export default function NotificationsPage() {
  const [state, setState] = useState(DEFAULT_STATE);
  const enabled = Object.values(state).filter(Boolean).length;

  const toggle = (key: string) => setState((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />

      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto px-4 pt-5 pb-3">
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Notifications</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Manage your preferences</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4">
        {/* Summary */}
        <div className="flex items-center gap-3 p-4 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl mb-5">
          <div className="w-10 h-10 rounded-full bg-[#1A4F9C] flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[15px] font-bold text-[#111827]">{enabled} of {PREFS.length} enabled</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Stay in the loop on what matters</p>
          </div>
        </div>

        {/* Channels */}
        <p className="text-[13px] font-bold text-[#111827] mb-2">Channels</p>
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mb-4">
          {PREFS.map(({ key, label, sub, Icon }, idx) => (
            <div
              key={key}
              className={`flex items-center gap-3 px-3.5 py-3.5 ${idx < PREFS.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}
            >
              <div className="w-8 h-8 rounded-[10px] bg-[#E0F2FE] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#1A4F9C]" />
              </div>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-[#111827]">{label}</p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{sub}</p>
              </div>
              {/* Toggle */}
              <button
                onClick={() => toggle(key)}
                className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${state[key] ? "bg-[#1A4F9C]" : "bg-[#D1D5DB]"}`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${state[key] ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="flex items-start gap-2 p-3 bg-[#F5F5F7] rounded-lg">
          <Info className="w-4 h-4 text-[#6B7280] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            Critical security & order notifications cannot be disabled.
          </p>
        </div>
      </div>
    </div>
  );
}
