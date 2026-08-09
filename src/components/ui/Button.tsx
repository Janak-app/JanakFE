"use client";

import { Loader2 } from "lucide-react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "outlined" | "danger";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit";
  className?: string;
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  loading,
  disabled,
  fullWidth = true,
  type = "button",
  className = "",
}: ButtonProps) {
  const base =
    "h-[52px] rounded-lg flex items-center justify-center px-5 font-semibold text-[15px] tracking-wide transition-colors";
  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 disabled:opacity-50",
    outlined: "bg-white text-accent border border-accent hover:bg-[#F5F5F7] disabled:opacity-50",
    danger: "bg-[#DC2626] text-white hover:bg-[#B91C1C] disabled:opacity-50",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : label}
    </button>
  );
}
