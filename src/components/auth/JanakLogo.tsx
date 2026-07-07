import { Crosshair } from "lucide-react";

export default function JanakLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center">
        <Crosshair className="w-6 h-6 text-white" />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-gray-900 tracking-widest leading-tight">
          JANAK
        </span>
        <span className="text-[10px] text-gray-500 tracking-widest uppercase">
          Positioning
        </span>
      </div>
    </div>
  );
}
