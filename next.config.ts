import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Headless Chromium (social template renderer) must not be bundled;
  // chromium-min downloads its binary pack to /tmp at cold start, so no
  // file-tracing includes are needed (pnpm symlinks break those anyway).
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],

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
