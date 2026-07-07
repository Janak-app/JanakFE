const TESTIMONIALS = [
  {
    initials: "VS",
    name: "Vikram Singh",
    role: "Director, Singh Survey Co.",
    quote:
      "Janak's after-sales is unmatched. We've bought 14 GNSS rovers over 8 years — every calibration on time, every replacement under warranty.",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    role: "Sr. Engineer, NIRMAN Infra",
    quote:
      "Switched to the GS18 I last quarter — productivity jumped 35%. The Janak team handled training, integration & even helped us migrate our project data.",
  },
  {
    initials: "AK",
    name: "Anand Krishnan",
    role: "Procurement Head, BharatRoads",
    quote:
      "Best pricing in the market for our highway project. GST-compliant invoicing made tender compliance painless. Rajesh is one call away.",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-[#F5F5F7] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-[#111827] mb-10">
          Trusted by India&apos;s leading survey teams
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-white border border-[#E5E7EB] rounded-2xl p-6 flex flex-col gap-5"
            >
              <div>
                <Stars />
                <p className="text-[15px] text-[#374151] leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#1A4F9C] flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{t.initials}</span>
                </div>
                <div>
                  <p className="text-[13px] font-bold text-[#111827]">{t.name}</p>
                  <p className="text-[12px] text-[#6B7280]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
