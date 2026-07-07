"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, CloudUpload, Car, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";

const SERVICE_TYPES = ["Calibration", "Repair", "AMC", "Inspection", "Software Update"];
const TIME_SLOTS = [
  { label: "Morning", sub: "9–12" },
  { label: "Afternoon", sub: "1–4" },
  { label: "Evening", sub: "4–7" },
];
const MODES = [
  { label: "Bring to Centre", sub: "Bring to Mumbai service centre", icon: Building2 },
  { label: "On-site Visit", sub: "Engineer visits your site (+₹1,500)", icon: Car },
];

const MONTH = { name: "May 2026", daysInMonth: 31, startWeekday: 5 };
const UNAVAILABLE = new Set([4, 11, 18, 25, 1, 8, 15, 22, 29]);

export default function ServiceBookPage() {
  const router = useRouter();
  const { show } = useToast();

  const [serviceType, setServiceType] = useState(SERVICE_TYPES[0]);
  const [selectedDate, setSelectedDate] = useState<number | null>(22);
  const [slot, setSlot] = useState("Morning");
  const [mode, setMode] = useState("Bring to Centre");
  const [desc, setDesc] = useState("");

  const handleBook = () => {
    show("Service request submitted!", "success");
    setTimeout(() => router.replace("/service/list"), 600);
  };

  const days = [
    ...Array.from({ length: MONTH.startWeekday }, (_, i) => ({ day: null, key: `e${i}` })),
    ...Array.from({ length: MONTH.daysInMonth }, (_, i) => ({ day: i + 1, key: `${i + 1}` })),
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="bg-white px-4 pt-5 pb-3 border-b border-[#E5E7EB] max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Book Service</h1>
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 pb-32">
        {/* Service type */}
        <Field label="Service Type">
          <div className="flex gap-2 flex-wrap">
            {SERVICE_TYPES.map((s) => (
              <Chip key={s} label={s} active={serviceType === s} onClick={() => setServiceType(s)} />
            ))}
          </div>
        </Field>

        {/* Equipment */}
        <Field label="Equipment">
          <div className="flex items-center gap-2.5 p-3 bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-[#1A4F9C]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#111827]">Leica GS18 I</p>
              <p className="text-[10px] text-[#6B7280] mt-0.5">S/N: LG18-220451 · Purchased 12 Jan 2026</p>
            </div>
            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
          </div>
        </Field>

        {/* Description */}
        <Field label="Issue Description (optional)">
          <textarea
            rows={3}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Describe the issue or service required..."
            className="w-full bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#1A4F9C] resize-none"
          />
        </Field>

        {/* Upload */}
        <button
          onClick={() => show("Upload coming soon", "info")}
          className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-[#1A4F9C] rounded-lg mb-4 text-sm font-semibold text-[#1A4F9C]"
        >
          <CloudUpload className="w-4 h-4" />
          Upload Photos (Optional)
        </button>

        {/* Calendar */}
        <Field label="Select Date">
          <div className="bg-[#F5F5F7] border border-[#E5E7EB] rounded-xl p-3">
            <div className="flex items-center justify-between px-1 mb-3">
              <p className="text-sm font-bold text-[#111827]">{MONTH.name}</p>
              <div className="flex gap-2">
                <button className="text-[#9CA3AF]"><ChevronLeft className="w-4 h-4" /></button>
                <button className="text-[#1A4F9C]"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 mb-1">
              {["S","M","T","W","T","F","S"].map((d, i) => (
                <div key={i} className="text-center text-[10px] font-bold text-[#6B7280] tracking-wide">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map(({ day, key }) =>
                day === null ? (
                  <div key={key} />
                ) : (
                  <button
                    key={key}
                    disabled={UNAVAILABLE.has(day)}
                    onClick={() => setSelectedDate(day)}
                    className={`h-9 w-full flex flex-col items-center justify-center rounded-lg text-[13px] relative transition-colors ${
                      selectedDate === day
                        ? "bg-[#1A4F9C] text-white font-bold"
                        : UNAVAILABLE.has(day)
                        ? "text-[#D1D5DB] cursor-not-allowed"
                        : day === 19
                        ? "text-[#1A4F9C] font-bold"
                        : "text-[#111827] hover:bg-white"
                    }`}
                  >
                    {day}
                    {!UNAVAILABLE.has(day) && selectedDate !== day && (
                      <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#1A4F9C]" />
                    )}
                  </button>
                )
              )}
            </div>
          </div>
        </Field>

        {/* Time slot */}
        <Field label="Time Slot">
          <div className="flex gap-2">
            {TIME_SLOTS.map((s) => (
              <button
                key={s.label}
                onClick={() => setSlot(s.label)}
                className={`flex-1 py-3 rounded-lg border text-center transition-colors ${
                  slot === s.label
                    ? "bg-[#1A4F9C] border-[#1A4F9C] text-white"
                    : "bg-[#F5F5F7] border-[#E5E7EB] text-[#111827]"
                }`}
              >
                <p className={`text-[13px] font-semibold`}>{s.label}</p>
                <p className={`text-[10px] mt-0.5 ${slot === s.label ? "text-white/80" : "text-[#6B7280]"}`}>{s.sub}</p>
              </button>
            ))}
          </div>
        </Field>

        {/* Service mode */}
        <Field label="Service Mode">
          <div className="flex flex-col gap-2">
            {MODES.map(({ label, sub, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setMode(label)}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                  mode === label ? "border-[#1A4F9C] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white"
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${mode === label ? "border-[#1A4F9C]" : "border-[#D1D5DB]"}`}>
                  {mode === label && <div className="w-2.5 h-2.5 rounded-full bg-[#1A4F9C]" />}
                </div>
                <Icon className="w-4.5 h-4.5 text-[#1A4F9C] shrink-0" />
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">{label}</p>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </Field>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-6 z-20">
        <div className="max-w-3xl mx-auto">
          <Button label="Book Service" onClick={handleBook} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-[#111827] mb-2">{label}</p>
      {children}
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
        active ? "bg-[#1A4F9C] text-white border-[#1A4F9C]" : "bg-[#F5F5F7] text-[#6B7280] border-[#E5E7EB]"
      }`}
    >
      {label}
    </button>
  );
}
