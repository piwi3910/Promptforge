import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Configure font optimization for Turbopack
  images: {
    domains: ['fonts.gstatic.com'],
  },
};

export default nextConfig;
