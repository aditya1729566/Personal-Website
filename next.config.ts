import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.adityaag.com" }],
        destination: "https://adityaag.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
