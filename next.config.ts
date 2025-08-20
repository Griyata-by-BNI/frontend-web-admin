import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://128bc6f7a82a.ngrok-free.app/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
