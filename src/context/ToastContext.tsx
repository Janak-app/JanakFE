"use client";

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

type ToastCtx = {
  show: (msg: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>("success");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((m: string, t: ToastType = "success") => {
    setMsg(m);
    setType(t);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setMsg(null), 2200);
  }, []);

  const bg =
    type === "success" ? "bg-[#111827]" : type === "error" ? "bg-[#DC2626]" : "bg-[#1A4F9C]";

  const Icon = type === "success" ? CheckCircle : type === "error" ? XCircle : Info;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {msg ? (
        <div
          className={`fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto sm:max-w-sm z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${bg} text-white`}
        >
          <Icon className="w-4 h-4 shrink-0" />
          <span className="text-sm flex-1">{msg}</span>
          <button onClick={() => setMsg(null)} className="ml-1 opacity-70 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be in ToastProvider");
  return ctx;
}
