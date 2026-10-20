import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Cloudinary + local uploads. Tighten the hostname list once the final hosts are known.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
