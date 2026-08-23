"use client";

import Button from "@/components/ui/Button";

type Props = {
  selectedCount: number;
  onCompare: () => void;
  loading: boolean;
};

export default function CompareStickyBar({ selectedCount, onCompare, loading }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-3 pb-5 flex items-center justify-between gap-4 z-40">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i < selectedCount ? "bg-accent" : "bg-[#E5E7EB]"
              }`}
            />
          ))}
        </div>
        <span className="text-[13px] text-[#6B7280] font-medium">
          {selectedCount} of 4 selected
        </span>
      </div>

      <Button
        label="Compare"
        onClick={onCompare}
        loading={loading}
        disabled={selectedCount < 2}
        fullWidth={false}
        className="h-10 px-6 text-[14px]"
      />
    </div>
  );
}
