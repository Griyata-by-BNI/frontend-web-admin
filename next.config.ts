import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://6726fbe9b185.ngrok-free.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
