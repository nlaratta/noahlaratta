import type { NextConfig } from "next";

const basePath =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BASE_PATH || '/noahlaratta'
    : ''

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
