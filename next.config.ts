import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Headless Chromium (social template renderer) must not be bundled, and
  // its brotli-packed binaries are loaded via fs at runtime so the file
  // tracer misses them without an explicit include (pnpm layout needs the
  // .pnpm glob; the plain one covers the symlink).
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/social": [
      "./node_modules/@sparticuz/chromium/bin/**",
      "./node_modules/.pnpm/@sparticuz+chromium*/node_modules/@sparticuz/chromium/bin/**",
    ],
  },

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
