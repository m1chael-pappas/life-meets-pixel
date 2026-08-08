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

  // The webpack() hook that used to live here is gone. Next 16 builds with
  // Turbopack by default and FAILS the build outright if a webpack config is
  // present, to stop a config being silently ignored. All it did was add
  // `**/studio/**` and `**/node_modules/**` to the dev watcher's ignore list —
  // Turbopack does not watch unreferenced directories in the first place, and
  // the Studio is a separate pnpm workspace nothing here imports.

  // Exclude studio from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
