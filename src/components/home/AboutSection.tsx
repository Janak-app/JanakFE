import { Download } from "lucide-react";

const STATS = [
  { value: "1985", label: "Founded" },
  { value: "40+", label: "Years experience" },
  { value: "5,000+", label: "Customers served" },
  { value: "12", label: "Service centers" },
  { value: "₹500Cr+", label: "Lifetime sales" },
  { value: "98%", label: "Customer retention" },
];

export default function AboutSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold text-[#111827] mb-10">About Janak Positioning</h2>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left — copy */}
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-extrabold text-[#111827] leading-snug mb-5">
            Four decades of precision.
            <br />
            One promise: get the job done.
          </h3>

          <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
            Founded in 1985 in Mumbai, Janak Positioning began as a single-store dealership for
            Leica theodolites. Today we are India&apos;s largest authorized distributor of premium
            survey equipment — operating 12 service centers from Srinagar to Trivandrum, serving
            5,000+ survey professionals, government bodies, contractors &amp; research institutions.
          </p>

          <p className="text-sm text-[#6B7280] leading-relaxed mb-8">
            We don&apos;t just sell instruments — we partner with you for the lifetime of the asset:
            calibration, training, AMC, software support, trade-ins &amp; buy-backs.
          </p>

          <button className="inline-flex items-center gap-2 bg-[#F5F5F7] border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-sm font-semibold text-[#1A4F9C] hover:bg-[#E9E9EC] transition-colors">
            <Download className="w-4 h-4" />
            Download Company Brochure
          </button>
        </div>

        {/* Right — stats grid */}
        <div className="lg:w-[460px] grid grid-cols-2 gap-3 content-start">
          {STATS.map((s) => (
            <div key={s.label} className="bg-[#F5F5F7] border border-[#E5E7EB] rounded-2xl px-5 py-4">
              <p className="text-2xl font-extrabold text-[#1A4F9C] mb-0.5">{s.value}</p>
              <p className="text-sm text-[#6B7280]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
