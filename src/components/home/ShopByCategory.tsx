import Link from "next/link";
import { Navigation, ScanLine, Plane, Tablet, Code2, Wrench, ArrowRight } from "lucide-react";
import { categories, products } from "@/data/products";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  navigation: Navigation,
  "scan-line": ScanLine,
  plane: Plane,
  tablet: Tablet,
  "code-2": Code2,
  wrench: Wrench,
};

export default function ShopByCategory() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-14">

      {/* Mobile header */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <h2 className="text-[17px] font-bold text-[#111827]">Shop by Category</h2>
        <Link
          href="/explore"
          className="text-[13px] font-semibold text-[#1A4F9C] flex items-center gap-0.5 border-b-2 pb-0.5"
        >
          View all
        </Link>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block mb-10">
        <h2 className="text-3xl font-extrabold text-[#111827] mb-1">Shop by Category</h2>
        <p className="text-sm text-[#6B7280]">
          From entry-level RTK rovers to enterprise UAV LiDAR — find the right tool for the job.
        </p>
      </div>

      {/* Mobile grid: 2 columns, icon centered, label below */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon];
          return (
            <Link
              key={cat.key}
              href={`/explore?cat=${cat.key}`}
              className="border border-[#E5E7EB] rounded-2xl p-4 flex flex-col items-center gap-3 active:bg-[#F9FAFB] transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-[#E8F0FB] flex items-center justify-center">
                {Icon && <Icon className="w-6 h-6 text-[#1A4F9C]" />}
              </div>
              <p className="text-[13px] font-semibold text-[#111827] text-center leading-tight">
                {cat.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Desktop grid: existing layout */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon];
          const count = products.filter((p) => p.categoryKey === cat.key).length;
          return (
            <Link
              key={cat.key}
              href={`/explore?cat=${cat.key}`}
              className="group border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-8 hover:shadow-md hover:border-[#1A4F9C]/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#E0EAF7] flex items-center justify-center">
                  {Icon && <Icon className="w-6 h-6 text-[#1A4F9C]" />}
                </div>
                <div className="w-8 h-8 rounded-full border border-[#E5E7EB] flex items-center justify-center group-hover:border-[#1A4F9C] group-hover:bg-[#E0EAF7] transition-colors">
                  <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#1A4F9C] transition-colors" />
                </div>
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#111827] mb-0.5">{cat.label}</p>
                <p className="text-sm text-[#6B7280]">{count} products</p>
              </div>
            </Link>
          );
        })}
      </div>

    </section>
  );
}
