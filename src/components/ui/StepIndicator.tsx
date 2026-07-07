type Props = {
  current: number;
  steps: string[];
};

export default function StepIndicator({ current, steps }: Props) {
  return (
    <div className="flex items-start px-4 py-4 bg-white border-b border-[#E5E7EB]">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const active = stepNum <= current;
        const isLast = idx === steps.length - 1;
        return (
          <div key={label} className="flex items-start flex-1">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                  active ? "bg-[#1A4F9C] text-white" : "bg-[#E5E7EB] text-[#6B7280]"
                }`}
              >
                {stepNum}
              </div>
              <span
                className={`text-[11px] font-medium text-center leading-none ${
                  active ? "text-[#1A4F9C]" : "text-[#6B7280]"
                }`}
              >
                {label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`flex-1 h-0.5 mt-3.5 mx-1 ${
                  stepNum < current ? "bg-[#1A4F9C]" : "bg-[#E5E7EB]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
