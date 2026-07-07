"use client";

import Link from "next/link";
import { Plus, ChevronRight, Car, Building2 } from "lucide-react";
import Header from "@/components/layout/Header";
import StatusBadge from "@/components/ui/StatusBadge";
import { serviceRequests } from "@/data/quotes";

export default function ServiceListPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Header />

      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-3xl mx-auto px-4 pt-5 pb-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Service Requests</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">{serviceRequests.length} active</p>
          </div>
          <Link
            href="/service/book"
            className="w-9 h-9 rounded-full bg-[#1A4F9C] flex items-center justify-center"
          >
            <Plus className="w-5 h-5 text-white" />
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col gap-3">
        {serviceRequests.map((s) => (
          <Link
            key={s.id}
            href={`/service/detail?id=${s.id}`}
            className="block bg-white border border-[#E5E7EB] rounded-xl p-3.5 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[13px] font-bold text-[#111827]">{s.id}</p>
                <p className="text-[11px] text-[#6B7280] mt-0.5">{s.equipment} · S/N {s.serialNumber}</p>
              </div>
              <StatusBadge status={s.status} />
            </div>

            <div className="flex gap-4 mb-3">
              <div>
                <p className="text-[9px] font-bold text-[#6B7280] tracking-[1px] mb-1">SERVICE TYPE</p>
                <p className="text-[13px] font-bold text-[#111827]">{s.serviceType}</p>
              </div>
              <div>
                <p className="text-[9px] font-bold text-[#6B7280] tracking-[1px] mb-1">SLOT</p>
                <p className="text-[13px] font-bold text-[#111827]">{s.slotDate}</p>
                <p className="text-[10px] text-[#6B7280] mt-0.5">{s.slotTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-2.5 border-t border-[#E5E7EB]">
              {s.mode === "On-site Visit" ? (
                <Car className="w-3.5 h-3.5 text-[#6B7280]" />
              ) : (
                <Building2 className="w-3.5 h-3.5 text-[#6B7280]" />
              )}
              <span className="text-[11px] text-[#6B7280]">{s.mode}</span>
              <div className="flex-1" />
              <ChevronRight className="w-4 h-4 text-[#9CA3AF]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
