// Global next/image loader (next.config.ts -> images.loaderFile).
// Sanity images are resized by Sanity's CDN instead of Vercel Image
// Optimization, so they cost zero Vercel transformations.
export default function imageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("https://cdn.sanity.io/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "max");
    return url.toString();
  }

  // Non-Sanity images pass through untransformed to avoid Vercel image
  // transformation costs.
  return src;
}
