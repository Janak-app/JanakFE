"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Send, Paperclip, Phone } from "lucide-react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { salesRep } from "@/data/user";

type Msg = { id: string; from: "user" | "rep"; text: string; time: string };

const INITIAL: Msg[] = [
  {
    id: "m1",
    from: "user",
    text: "Hi, I wanted to know more about the Leica GS18 accuracy in RTK mode.",
    time: "10:24",
  },
  {
    id: "m2",
    from: "rep",
    text: "Hi Arjun! The GS18 I achieves 6mm + 0.5ppm horizontal accuracy in RTK. Happy to arrange a demo for you.",
    time: "10:26",
  },
];

const QUICK = ["Schedule a demo", "Pricing details", "Bulk order discount"];

function nowTime() {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}`, from: "user", text: trimmed, time: nowTime() },
    ]);
    setText("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `m${Date.now() + 1}`,
          from: "rep",
          text: "Thanks for your message! I'll get back to you shortly with the details.",
          time: nowTime(),
        },
      ]);
    }, 1400);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />

      {/* Chat box — flush below header, centered, fixed height fills remaining space */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full border-x border-b border-[#E5E7EB] overflow-hidden">

        {/* Chat header */}
        <div className="shrink-0 border-b border-[#E5E7EB] bg-white">
          <div className="relative flex items-center justify-center h-14 px-4">
            <Link
              href="/"
              className="absolute left-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F7] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#111827]" />
            </Link>
            <div className="text-center">
              <p className="text-[15px] font-bold text-[#111827]">{salesRep.name}</p>
              <p className="text-[11px] text-[#6B7280]">Available Mon–Sat · 9AM–6PM IST</p>
            </div>
            <button
              onClick={() => window.open(`tel:${salesRep.phone.replace(/\s/g, "")}`, "_self")}
              className="absolute right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F5F5F7] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#111827]" />
            </button>
          </div>
        </div>

        {/* Messages — scrollable */}
        <div className="flex-1 overflow-y-auto bg-white px-4 py-4 flex flex-col gap-2.5">
          {/* Date chip */}
          <div className="flex justify-center">
            <span className="bg-white border border-[#E5E7EB] rounded-full px-3 py-1 text-[9px] font-bold text-[#6B7280] tracking-[1.5px]">
              TODAY
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${m.from === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.from === "rep" && (
                <div className="w-7 h-7 rounded-full bg-[#1A4F9C] flex items-center justify-center shrink-0 mb-1">
                  <span className="text-white text-[10px] font-bold">{salesRep.initials}</span>
                </div>
              )}
              <div
                className={`max-w-[72%] px-4 py-3 rounded-2xl ${
                  m.from === "user"
                    ? "bg-[#1A4F9C] rounded-br-sm"
                    : "bg-white border border-[#E5E7EB] rounded-bl-sm"
                }`}
              >
                <p className={`text-[13px] leading-relaxed ${m.from === "user" ? "text-white" : "text-[#111827]"}`}>
                  {m.text}
                </p>
                <p className={`text-[10px] mt-1 text-right ${m.from === "user" ? "text-white/60" : "text-[#9CA3AF]"}`}>
                  {m.time}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        <div className="shrink-0 px-4 py-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden bg-white">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => setText(q)}
              className="shrink-0 px-3 py-1.5 bg-white border border-[#E5E7EB] rounded-full text-[12px] font-medium text-[#1A4F9C] hover:bg-[#F5F5F7] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <div className="shrink-0 border-t border-[#E5E7EB] bg-white px-3 py-3 flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center text-[#6B7280]">
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="Type a message..."
            className="flex-1 h-10 bg-[#F5F5F7] rounded-full px-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none"
          />
          <button
            onClick={send}
            disabled={!text.trim()}
            className="w-9 h-9 rounded-full bg-[#1A4F9C] flex items-center justify-center disabled:opacity-40 transition-opacity"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
