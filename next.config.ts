import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Custom loader: Sanity images resize on Sanity's CDN, third-party
    // affiliate images pass through untouched. Avoids Vercel image
    // transformation costs entirely (remotePatterns are unused with a
    // custom loader).
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
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
