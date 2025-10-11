import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],

    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/images/**",
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
