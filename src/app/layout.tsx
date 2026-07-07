import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Janak Positioning — Survey Equipment",
  description:
    "Authorized distributor for Leica, Trimble, Topcon, DJI, Hi-Target & South precision survey instruments.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Janak",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta name="theme-color" content="#1A4F9C" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#111827]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
