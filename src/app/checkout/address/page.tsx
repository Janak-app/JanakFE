"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Clock } from "lucide-react";
import Header from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import StepIndicator from "@/components/ui/StepIndicator";
import { user } from "@/data/user";

const STEPS = ["Address", "Payment", "Review"];

export default function CheckoutAddressPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("default");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="bg-white px-4 pt-4 pb-2 border-b border-[#E5E7EB] max-w-3xl mx-auto w-full">
        <h1 className="text-base font-bold text-[#111827]">Checkout</h1>
        <p className="text-xs text-[#6B7280]">Step 1 of 3</p>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 pt-3">
        <StepIndicator current={1} steps={STEPS} />
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full px-4 pb-32">
        <h2 className="text-lg font-bold text-[#111827] mt-4">Delivery Address</h2>
        <p className="text-xs text-[#6B7280] mt-1 mb-4">Where should we ship your order?</p>

        {/* Default address */}
        <button
          onClick={() => setSelected("default")}
          className={`w-full text-left p-3.5 rounded-xl border transition-colors ${
            selected === "default" ? "border-[#1A4F9C] bg-[#EFF6FF]" : "border-[#E5E7EB] bg-white"
          }`}
        >
          <div className="flex gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 ${selected === "default" ? "border-[#1A4F9C]" : "border-[#D1D5DB]"}`}>
              {selected === "default" && <div className="w-2.5 h-2.5 rounded-full bg-[#1A4F9C]" />}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-bold text-[#111827]">{user.address.fullName}</p>
                <span className="text-[9px] font-bold text-[#6B7280] bg-[#F5F5F7] border border-[#E5E7EB] px-1.5 py-0.5 rounded tracking-wide">
                  HOME
                </span>
              </div>
              <p className="text-xs text-[#6B7280] leading-relaxed">
                {user.address.line1}, {user.address.line2}<br />
                {user.address.city}, {user.address.state} — {user.address.pincode}
              </p>
              <p className="text-xs font-semibold text-[#111827] mt-1.5">{user.address.phone}</p>
            </div>
          </div>
        </button>

        {/* Add new */}
        <button className="flex items-center gap-2.5 w-full p-3.5 mt-3 rounded-xl border-2 border-dashed border-[#1A4F9C]">
          <Plus className="w-5 h-5 text-[#1A4F9C]" />
          <span className="text-[13px] font-semibold text-[#1A4F9C]">Add New Address</span>
        </button>

        {/* Delivery note */}
        <div className="flex items-center gap-2.5 p-3 bg-[#E0F2FE] rounded-lg mt-5">
          <Clock className="w-4 h-4 text-[#1A4F9C] shrink-0" />
          <div>
            <p className="text-xs font-semibold text-[#111827]">Estimated Delivery: 5–8 business days</p>
            <p className="text-[11px] text-[#6B7280] mt-0.5">Free shipping on orders above ₹50,000</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-6 z-20">
        <div className="max-w-3xl mx-auto">
          <Button label="Continue to Payment" onClick={() => router.push("/checkout/payment")} />
        </div>
      </div>
    </div>
  );
}
