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
    <section className="max-w-7xl mx-auto px-4 py-6 md:py-14">

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

      {/* Mobile: horizontal scroll row with product images */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:hidden [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const repImage = products.find((p) => p.categoryKey === cat.key)?.images?.[0];
          return (
            <Link
              key={cat.key}
              href={`/explore?cat=${cat.key}`}
              className="flex flex-col items-center gap-2 shrink-0 w-40"
            >
              <div className="w-40 h-40 rounded-2xl bg-[#F3F4F6] flex items-center justify-center overflow-hidden">
                {repImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={repImage}
                    alt={cat.label}
                    className="w-full h-full object-contain p-3"
                  />
                ) : (
                  <span className="text-[#9CA3AF] text-xs">No image</span>
                )}
              </div>
              <p className="text-[14px] font-bold text-[#111827] text-center leading-tight">
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
