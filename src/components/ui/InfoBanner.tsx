import { ChevronRight } from "lucide-react";

interface InfoBannerProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
}

export default function InfoBanner({ title, subtitle, onClick }: InfoBannerProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-[#FFC107] rounded-2xl px-4 py-3.5 text-left"
    >
      {/* Icon */}
      <div className="w-9 h-9 rounded-xl bg-[#F0A500] flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-[15px] italic leading-none">i</span>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold text-[#1C1C1C] leading-snug">{title}</p>
        <p className="text-[12px] text-[#3D2B00] mt-0.5 leading-snug truncate">{subtitle}</p>
      </div>

      {/* Chevron */}
      <ChevronRight className="w-5 h-5 text-[#1C1C1C] shrink-0" />
    </button>
  );
}
