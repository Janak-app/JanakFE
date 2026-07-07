import type { NextConfig } from "next";

const isCapacitorBuild = process.env.BUILD_TARGET === "capacitor";

const nextConfig: NextConfig = {
  // Only apply static export settings when building for Capacitor.
  // During `next dev` these are omitted so dynamic routes work without generateStaticParams.
  ...(isCapacitorBuild && {
    output: "export",
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
