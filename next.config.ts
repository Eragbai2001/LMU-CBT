import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["localhost"], // ✅ Allow all images from this domain
  },
};

export default nextConfig;
