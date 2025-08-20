import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://bf64d6793881.ngrok-free.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
