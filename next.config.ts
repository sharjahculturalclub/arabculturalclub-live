import type { NextConfig } from "next";

/*
|--------------------------------------------------------------------------
| Backend URL (Production)
|--------------------------------------------------------------------------
*/
const BACKEND_URL = "https://backend.shjarabclub.ae";

/*
|--------------------------------------------------------------------------
| Extract hostname
|--------------------------------------------------------------------------
*/
const BACKEND_HOSTNAME = "backend.shjarabclub.ae";

const nextConfig: NextConfig = {
  /*
  |--------------------------------------------------------------------------
  | Image Configuration
  |--------------------------------------------------------------------------
  */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: BACKEND_HOSTNAME,
        pathname: "/wp-content/uploads/**",
      },
    ],

    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",

    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    unoptimized: false,
    qualities: [75, 90],
  },

  /*
  |--------------------------------------------------------------------------
  | React + Compiler
  |--------------------------------------------------------------------------
  */
  reactCompiler: true,
  reactStrictMode: true,

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  /*
  |--------------------------------------------------------------------------
  | Experimental Optimizations
  |--------------------------------------------------------------------------
  */
  experimental: {
    optimizePackageImports: ["@/components", "@/lib"],
    serverActions: {
      bodySizeLimit: "20mb",
    },
  },

  /*
  |--------------------------------------------------------------------------
  | Headers (Performance + Security)
  |--------------------------------------------------------------------------
  */
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/image(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/((?!image).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
        ],
      },
    ];
  },
};

export default nextConfig;