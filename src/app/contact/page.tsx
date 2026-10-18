"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Clock, Mail, Phone } from "lucide-react";
import Header from "@/components/layout/Header";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white px-4 pb-3 border-b border-[#E5E7EB] flex items-center gap-3" style={{ paddingTop: "calc(var(--sat) + 1.25rem)" }}>
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F5F5F7] transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#111827]" />
          </button>
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Contact Us</h1>
        </div>

        <div className="mx-4 mt-4 bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-2.5 text-sm text-[#374151]">
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent shrink-0" />
            Mon–Sat · 9AM–6PM IST
          </span>
          <span className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-accent shrink-0" />
            +91 22 4040 1985
          </span>
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-accent shrink-0" />
            hello@janakpositioning.com
          </span>
        </div>

        <div className="mx-4 mt-3 mb-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
