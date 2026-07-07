"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, ArrowRight, ShieldCheck, BadgeCheck } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = {
  Products: [
    { label: "GNSS / RTK Rovers", href: "/explore?cat=gnss" },
    { label: "Total Stations", href: "/explore?cat=total_stations" },
    { label: "UAV / Drones", href: "/explore?cat=uav" },
    { label: "Data Controllers", href: "/explore?cat=controllers" },
    { label: "Survey Software", href: "/explore?cat=software" },
    { label: "Accessories", href: "/explore?cat=accessories" },
  ],
  Company: [
    { label: "About Janak", href: "/" },
    { label: "Why Choose Us", href: "/" },
    { label: "Brands We Carry", href: "/explore" },
    { label: "Service Centers", href: "/service/book" },
    { label: "Careers", href: "/" },
    { label: "Press & Media", href: "/" },
  ],
  Support: [
    { label: "Contact Sales", href: "/chat" },
    { label: "Request a Quote", href: "/quote" },
    { label: "Book Service", href: "/service/book" },
    { label: "Calibration & AMC", href: "/service/book" },
    { label: "Track Order", href: "/orders" },
    { label: "Returns Policy", href: "/" },
  ],
  Resources: [
    { label: "Product Catalog", href: "/explore" },
    { label: "Datasheets", href: "/" },
    { label: "Training Videos", href: "/" },
    { label: "Survey Blog", href: "/" },
    { label: "Industry Reports", href: "/" },
    { label: "FAQ", href: "/" },
  ],
};

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/" },
  { label: "Terms of Service", href: "/" },
  { label: "Cookie Settings", href: "/" },
  { label: "GST Information", href: "/" },
  { label: "Sitemap", href: "/" },
];

// const SOCIALS = [
//   { icon: Linkedin, href: "/", label: "LinkedIn" },
//   { icon: Youtube, href: "/", label: "YouTube" },
//   { icon: Instagram, href: "/", label: "Instagram" },
//   { icon: Twitter, href: "/", label: "Twitter" },
// ];

export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#0a1628] text-white mt-auto">
      {/* Newsletter strip */}
      <div className="bg-[#1A4F9C]">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-lg font-bold text-white mb-1">Stay ahead of the survey curve</p>
            <p className="text-sm text-white/75">
              Get product launches, calibration reminders &amp; exclusive trade pricing — directly in
              your inbox.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 w-full md:w-auto shrink-0"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 md:w-72 bg-white/15 border border-white/30 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/60"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-white text-[#1A4F9C] font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors shrink-0"
            >
              Subscribe <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand column */}
          <div className="md:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-[9px] bg-[#1A4F9C] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold tracking-[2px]">JANAK</div>
                <div className="text-[8px] font-medium text-[#0EA5E9] tracking-[3px]">POSITIONING</div>
              </div>
            </div>

            <p className="text-sm text-gray-400 leading-6 mb-5">
              India&apos;s most trusted partner in precision survey equipment since 1985. Authorized
              distributor for Leica, Trimble, Topcon, DJI &amp; more.
            </p>

            <div className="flex flex-col gap-2.5 text-sm text-gray-400 mb-6">
              <span className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                304 Survey House, Andheri East, Mumbai 400069
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                +91 22 4040 1985 · Mon–Sat 9AM–6PM
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                hello@janakpositioning.com
              </span>
            </div>

            {/* Socials */}
            {/* <div className="flex gap-2">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:border-white hover:text-white transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div> */}
          </div>

          {/* Nav columns */}
          {Object.entries(NAV_LINKS).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-white mb-4">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>© 2026 Janak Positioning Pvt. Ltd. · All rights reserved.</span>

          <div className="flex flex-wrap items-center gap-4">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-gray-300 transition-colors">
                {l.label}
              </Link>
            ))}
            <span className="inline-flex items-center gap-1 bg-green-900/50 border border-green-700 text-green-400 rounded px-2 py-0.5 font-semibold">
              <ShieldCheck className="w-3 h-3" /> ISO 9001:2015
            </span>
            <span className="inline-flex items-center gap-1 bg-gray-800 border border-gray-700 text-gray-300 rounded px-2 py-0.5 font-semibold">
              <BadgeCheck className="w-3 h-3 text-[#1A4F9C]" /> Authorized Dealer
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
