"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { formatINR } from "@/data/products";
import useProductDetail from "@/hooks/useProductDetail";

interface QuoteItem {
  productId: string;
  name: string;
  category: string;
  image: string;
  price: number;
  qty: number;
}

function QuoteRequestForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { show } = useToast();
  const { user } = useAuth();

  const productId = searchParams.get("productId") ?? "";
  const { data } = useProductDetail(productId);
  const product = data?.product ?? null;

  const [editingCustomer, setEditingCustomer] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [quotationValue, setQuotationValue] = useState("");
  const [note, setNote] = useState("");

  const [items, setItems] = useState<QuoteItem[]>(() => {
    if (!product) return [];
    return [{
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.images[0] ?? "",
      price: product.price ?? 0,
      qty: 1,
    }];
  });

  // Sync first item when product loads
  if (product && items.length === 0) {
    setItems([{
      productId: product.id,
      name: product.name,
      category: product.category,
      image: product.images[0] ?? "",
      price: product.price ?? 0,
      qty: 1,
    }]);
  }

  const totalMRP = items.reduce((sum, it) => sum + it.price * it.qty, 0);

  const updateQty = (productId: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((it) => it.productId === productId ? { ...it, qty } : it));
  };

  const handleSubmit = () => {
    show("Quotation request submitted!", "success");
    setTimeout(() => router.replace("/quote/list"), 600);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-28">

      {/* Customer Detail */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] font-bold text-[#111827]">Customer Detail</p>
          <button
            onClick={() => setEditingCustomer(!editingCustomer)}
            className="text-[13px] font-semibold text-accent"
          >
            {editingCustomer ? "Done" : "Change"}
          </button>
        </div>
        <div className="flex flex-col">
          <CustomerRow
            label="Customer Name"
            value={name}
            placeholder="Enter your name"
            editing={editingCustomer}
            onChange={setName}
          />
          <CustomerRow
            label="Contact"
            value={phone}
            placeholder="+91 XXXXXXXXXX"
            editing={editingCustomer}
            inputMode="tel"
            onChange={setPhone}
          />
          <CustomerRow
            label="Email Address"
            value={email}
            placeholder="email@example.com"
            editing={editingCustomer}
            inputMode="email"
            onChange={setEmail}
          />
        </div>
      </div>
      <div className="h-2 bg-[#F5F5F7]" />

      {/* Items for Quotation */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] font-bold text-[#111827]">Item for Quotation</p>
          <button
            onClick={() => router.push("/explore")}
            className="text-[13px] font-semibold text-accent"
          >
            Add More Products
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {items.map((it) => (
            <div key={it.productId} className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.image}
                alt={it.name}
                className="w-16 h-16 rounded-xl bg-[#F3F4F6] object-contain p-1.5 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[11px] font-semibold text-[#0EA5E9]">{it.category}</span>
                <p className="text-[13px] font-bold text-[#111827] leading-snug line-clamp-2">{it.name}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                {/* Outlined stepper */}
                <div className="flex items-center border border-accent rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQty(it.productId, it.qty - 1)}
                    className="w-8 h-8 flex items-center justify-center text-accent text-lg font-bold"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-[13px] font-bold text-[#111827]">
                    {String(it.qty).padStart(2, "0")}
                  </span>
                  <button
                    onClick={() => updateQty(it.productId, it.qty + 1)}
                    className="w-8 h-8 flex items-center justify-center text-accent text-lg font-bold"
                  >
                    +
                  </button>
                </div>
                {it.price > 0 && (
                  <span className="text-[13px] font-bold text-[#111827]">
                    {formatINR(it.price * it.qty)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-2 bg-[#F5F5F7]" />

      {/* Price Negotiation */}
      <div className="px-4 pt-4">
        <p className="text-[15px] font-bold text-[#111827] mb-4">Price Negotiation</p>
      </div>
      <div className="bg-white px-4 pb-4">
        <p className="text-[13px] text-[#6B7280] mb-1">Total MRP</p>
        <p className="text-[22px] font-bold text-[#111827] mb-5">
          {totalMRP > 0 ? formatINR(totalMRP) : "—"}
        </p>

        <p className="text-[13px] text-[#6B7280] mb-1.5">Quotation Value</p>
        <input
          value={quotationValue}
          onChange={(e) => setQuotationValue(e.target.value.replace(/[^0-9]/g, ""))}
          inputMode="numeric"
          placeholder="Add Quotation value here"
          className="w-full h-12 bg-white border border-[#E5E7EB] rounded-xl px-4 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-accent mb-4"
        />

        <p className="text-[13px] text-[#6B7280] mb-1.5">Additional Note</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Tell us more about your requirement"
          rows={4}
          className="w-full bg-white border border-[#E5E7EB] rounded-xl px-4 py-3 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-accent resize-none"
        />
      </div>

      {/* Submit */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-6 z-20">
        <button
          onClick={handleSubmit}
          className="w-full h-13 bg-accent text-white text-[15px] font-bold rounded-xl py-3.5"
        >
          Raise Quotation Request
        </button>
      </div>
    </div>
  );
}

function CustomerRow({
  label,
  value,
  placeholder,
  editing,
  inputMode,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  editing: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-dashed border-[#E5E7EB] last:border-0">
      <span className="text-[13px] text-[#6B7280] w-32 shrink-0">{label}</span>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className="flex-1 text-right text-[13px] font-semibold text-[#111827] outline-none bg-transparent placeholder:text-[#9CA3AF]"
        />
      ) : (
        <span className="flex-1 text-right text-[13px] font-semibold text-[#111827]">
          {value || <span className="text-[#9CA3AF] font-normal">{placeholder}</span>}
        </span>
      )}
    </div>
  );
}

export default function QuoteRequestPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 border-b border-[#E5E7EB]">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center"
        >
          <ChevronLeft className="w-5 h-5 text-[#111827]" />
        </button>
        <h1 className="text-[18px] font-bold text-[#111827]">Request a Quotation</h1>
      </div>

      <Suspense fallback={<div className="flex-1" />}>
        <QuoteRequestForm />
      </Suspense>
    </div>
  );
}
