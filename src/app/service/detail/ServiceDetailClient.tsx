"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, Wrench, CheckCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import { serviceRequests } from "@/data/quotes";

export default function ServiceDetailClient() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const router = useRouter();

  const s = serviceRequests.find((x) => x.id === id);

  if (!s) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-[#6B7280]">Service request not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />

      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="w-8 h-8 rounded-full bg-[#F5F5F7] flex items-center justify-center">
            <ChevronLeft className="w-4 h-4 text-[#111827]" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#111827]">Service Detail</h1>
            <p className="text-[11px] text-[#6B7280]">{s.id}</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 pb-10 flex flex-col gap-4">
        {/* Banner */}
        <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#1A4F9C] flex items-center justify-center shrink-0">
            <Wrench className="w-7 h-7 text-white" />
          </div>
          <div>
            <StatusBadge status={s.status} />
            <p className="text-lg font-bold text-[#111827] mt-2">{s.serviceType}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">{s.slotDate} · {s.slotTime}</p>
          </div>
        </div>

        {/* Booking details */}
        <div>
          <p className="text-[13px] font-bold text-[#111827] mb-2">Booking Details</p>
          <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            {[
              { label: "Equipment", value: s.equipment },
              { label: "Serial Number", value: s.serialNumber },
              { label: "Service Mode", value: s.mode },
              { label: "Slot Date", value: s.slotDate },
              { label: "Time Slot", value: s.slotTime },
            ].map((row, i) => (
              <div key={row.label} className={`flex items-center justify-between px-3.5 py-2.5 ${i < 4 ? "border-b border-[#E5E7EB]" : ""}`}>
                <span className="text-xs text-[#6B7280]">{row.label}</span>
                <span className="text-xs font-semibold text-[#111827]">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <p className="text-[13px] font-bold text-[#111827] mb-2">Description</p>
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5">
            <p className="text-[13px] text-[#374151] leading-relaxed">{s.description}</p>
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-[13px] font-bold text-[#111827] mb-2">Timeline</p>
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
            {s.timeline.map((t, i) => (
              <div key={t.label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${t.done ? "bg-[#16A34A]" : "bg-[#E5E7EB]"}`}>
                    {t.done && <CheckCircle className="w-2.5 h-2.5 text-white" />}
                  </div>
                  {i < s.timeline.length - 1 && (
                    <div className={`w-0.5 min-h-[20px] flex-1 mt-0.5 ${t.done ? "bg-[#16A34A]" : "bg-[#E5E7EB]"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p className={`text-[13px] font-semibold ${t.done ? "text-[#111827]" : "text-[#9CA3AF]"}`}>{t.label}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{t.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
