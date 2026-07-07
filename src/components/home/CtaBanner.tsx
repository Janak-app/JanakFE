import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12">
      <div
        className="rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8"
        style={{ background: "linear-gradient(135deg, #1A4F9C 0%, #2563EB 50%, #38BDF8 100%)" }}
      >
        {/* Left */}
        <div className="min-w-0">
          <h2 className="text-2xl font-extrabold text-white mb-2">
            Ready to upgrade your fleet?
          </h2>
          <p className="text-sm text-white/80 leading-relaxed max-w-sm">
            Talk to our sales engineers — get tailored recommendations, trade-in valuations &amp;
            volume pricing within 24 hours.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 bg-white text-[#1A4F9C] font-bold text-sm px-5 py-3 rounded-lg hover:bg-white/90 transition-colors"
          >
            Request a Quote <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-white/15 border border-white/30 text-white font-semibold text-sm px-5 py-3 rounded-lg hover:bg-white/25 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
