import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://localhost:3000", "http://localhost:3333"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3333/:path*",
      },
    ];
  },
};

export default nextConfig;
