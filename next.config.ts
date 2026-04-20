import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/spam-detector-frontend',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
