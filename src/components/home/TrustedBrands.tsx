"use client";

import { motion } from "framer-motion";
import { brands } from "@/data/products";

// Duplicate brands so the loop appears seamless
const loopedBrands = [...brands, ...brands];

export default function TrustedBrands() {
  return (
    <section className="border-y border-[#E5E7EB] py-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-4">
        <p className="text-[10px] font-bold tracking-[3px] text-[#9CA3AF] uppercase">
          Trusted by the world&apos;s leading survey brands
        </p>

        {/* Desktop: static wrap */}
        <div className="hidden md:flex flex-wrap justify-center gap-x-12 gap-y-3">
          {brands.map((b) => (
            <span
              key={b.name}
              className="text-[15px] font-bold tracking-[2px] text-[#C0C7D1] uppercase"
            >
              {b.name}
            </span>
          ))}
        </div>

        {/* Mobile: smooth infinite marquee */}
        <div className="md:hidden w-full overflow-hidden">
          <motion.div
            className="flex gap-10 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 12,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {loopedBrands.map((b, i) => (
              <span
                key={`${b.name}-${i}`}
                className="text-[13px] font-bold tracking-[2px] text-[#C0C7D1] uppercase whitespace-nowrap"
              >
                {b.name}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
