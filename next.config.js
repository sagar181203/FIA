const isExport = process.env.NEXT_EXPORT === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export when building for Capacitor (mobile app)
  // Normal "npm run build" keeps the API route alive for Vercel
  ...(isExport ? {
    output: "export",
    distDir: "dist",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

// Only wrap with PWA in non-export mode (PWA needs service worker, incompatible with pure static)
if (!isExport) {
  const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    disable: process.env.NODE_ENV === "development",
  });
  module.exports = withPWA(nextConfig);
} else {
  module.exports = nextConfig;
}
