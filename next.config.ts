import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.greenmangaming.com",
      },
      {
        protocol: "https",
        hostname: "*.greenmangaming.com",
      },
      {
        protocol: "https",
        hostname: "a.impactradius-go.com",
      },
      {
        protocol: "https",
        hostname: "imp.pxf.io",
      },
    ],
  },

  // Exclude studio folder from compilation
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['**/studio/**', '**/node_modules/**'],
      };
    }
    return config;
  },

  // Exclude studio from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
