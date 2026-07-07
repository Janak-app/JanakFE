import { ShieldCheck, Wrench, TrendingUp, GraduationCap } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Authorized Distributor",
    description:
      "Direct partnerships with Leica, Trimble, Topcon & DJI — genuine equipment, full warranty.",
  },
  {
    icon: Wrench,
    title: "12 Service Centers",
    description:
      "Pan-India network with certified engineers, NABL-accredited calibration labs & rapid turnaround.",
  },
  {
    icon: TrendingUp,
    title: "Trade Pricing",
    description:
      "Volume discounts for contractors, government tenders & GST-compliant invoicing.",
  },
  {
    icon: GraduationCap,
    title: "Free Training",
    description:
      "On-site team training, software certification & dedicated WhatsApp support for every purchase.",
  },
];

export default function WhyJanak() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-3xl font-extrabold text-[#111827] mb-1">Why Janak Positioning</h2>
      <p className="text-sm text-[#6B7280] mb-10">
        Built on four decades of trust, precision &amp; service excellence.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {PILLARS.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-5 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E0EAF7] flex items-center justify-center">
              <Icon className="w-6 h-6 text-[#1A4F9C]" />
            </div>
            <div>
              <p className="text-[15px] font-bold text-[#111827] mb-1.5">{title}</p>
              <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
