import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://b66cd980be45.ngrok-free.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
