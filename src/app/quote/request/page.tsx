"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Clock, Package } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import { getProductById } from "@/data/products";
import { useToast } from "@/context/ToastContext";

const USE_OPTIONS = ["Construction", "Cadastral Survey", "Infrastructure", "Mining", "Research", "Other"];
const BUDGET_OPTIONS = ["< ₹5 Lakh", "₹5–10 Lakh", "₹10–25 Lakh", "₹25 Lakh+"];

function QuoteRequestForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { show } = useToast();

  const productId = searchParams.get("productId") || "";
  const product = productId ? getProductById(productId) : null;

  const [qty, setQty] = useState("1");
  const [use, setUse] = useState(USE_OPTIONS[0]);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[1]);
  const [required, setRequired] = useState("Within 30 days");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    show("Quote request submitted!", "success");
    setTimeout(() => router.replace("/quote/list"), 600);
  };

  return (
    <div className="flex-1 max-w-3xl mx-auto w-full px-4 py-5 pb-32">
      {product && (
        <div className="flex items-center gap-3 p-3.5 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl mb-5">
          <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-[#1A4F9C]" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-[#1A4F9C] tracking-[1.5px]">PRODUCT</p>
            <p className="text-[13px] font-bold text-[#111827] mt-0.5 leading-snug">{product.name}</p>
          </div>
        </div>
      )}

      <Field label="Quantity">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          className="h-12 w-full bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#111827] outline-none focus:border-[#1A4F9C]"
        />
      </Field>

      <Field label="Intended Use">
        <div className="flex gap-2 flex-wrap">
          {USE_OPTIONS.map((u) => (
            <Chip key={u} label={u} active={use === u} onClick={() => setUse(u)} />
          ))}
        </div>
      </Field>

      <Field label="Required By">
        <input
          type="text"
          value={required}
          onChange={(e) => setRequired(e.target.value)}
          className="h-12 w-full bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3 text-sm text-[#111827] outline-none focus:border-[#1A4F9C]"
        />
      </Field>

      <Field label="Budget Range">
        <div className="flex gap-2 flex-wrap">
          {BUDGET_OPTIONS.map((b) => (
            <Chip key={b} label={b} active={budget === b} onClick={() => setBudget(b)} />
          ))}
        </div>
      </Field>

      <Field label="Additional Notes">
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tell us more about your project requirements..."
          className="w-full bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-3 py-3 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#1A4F9C] resize-none"
        />
      </Field>

      <div className="flex items-center gap-2 p-3 bg-[#E0F2FE] rounded-lg">
        <Clock className="w-4 h-4 text-[#1A4F9C] shrink-0" />
        <p className="text-[11px] text-[#111827]">Our sales team will respond within 24 working hours.</p>
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

export default function QuoteRequestPage() {
  const router = useRouter();
  const { show } = useToast();

  const handleSubmit = () => {
    show("Quote request submitted!", "success");
    setTimeout(() => router.replace("/quote/list"), 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="bg-white px-4 pt-5 pb-3 border-b border-[#E5E7EB] max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Request a Quote</h1>
      </div>

      <Suspense fallback={<div className="flex-1" />}>
        <QuoteRequestForm />
      </Suspense>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-6 z-20">
        <div className="max-w-3xl mx-auto">
          <Button label="Submit Request" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
