import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backendshjarabclub.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_DB_URI?.replace('http://', '').replace('https://', '') || 'backendshjarabclub.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_DB_URI?.replace('http://', '').replace('https://', '') || 'backendshjarabclub.local',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Image optimization: AVIF + WebP (checklist §2)
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    unoptimized: false,
    qualities: [75, 90],
  },
  // Enable React Compiler for better performance
  reactCompiler: true,
  reactStrictMode: true,
  // Remove console.log in production (keep error/warn)
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Optimize package imports (checklist §2)
  experimental: {
    optimizePackageImports: ['@/components', '@/lib'],
  },
  // Security & performance headers
  async headers() {
    return [
      {
        // Static assets: immutable, 1 year cache
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Optimized images: 1 year cache
        source: '/_next/image(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // API routes: no cache
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
      {
        // All pages: security headers (no aggressive caching on HTML per checklist §2)
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
