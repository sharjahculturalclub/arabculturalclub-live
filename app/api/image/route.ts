import { type NextRequest } from "next/server";

const BACKEND_ORIGIN = "https://backend.shjarabclub.ae";

/*
|--------------------------------------------------------------------------
| URL Validation
| Only allow paths under /wp-content/uploads/ to prevent SSRF abuse.
|--------------------------------------------------------------------------
*/
const ALLOWED_PATH_PREFIX = "/wp-content/uploads/";
const ALLOWED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg", ".ico",
]);

function isValidPath(path: string): boolean {
  if (!path.startsWith(ALLOWED_PATH_PREFIX)) return false;
  const ext = path.slice(path.lastIndexOf(".")).toLowerCase();
  return ALLOWED_EXTENSIONS.has(ext);
}

/*
|--------------------------------------------------------------------------
| In-Memory Cache
| Stores raw image buffers with content-type to avoid re-fetching.
|--------------------------------------------------------------------------
*/
interface CacheEntry {
  buffer: ArrayBuffer;
  contentType: string;
  cachedAt: number;
}

const imageCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours
const MAX_CACHE_SIZE = 200;

function getFromCache(path: string): CacheEntry | null {
  const entry = imageCache.get(path);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    imageCache.delete(path);
    return null;
  }
  return entry;
}

function setCache(path: string, entry: CacheEntry) {
  if (imageCache.size >= MAX_CACHE_SIZE) {
    // Evict oldest entry
    const firstKey = imageCache.keys().next().value;
    if (firstKey) imageCache.delete(firstKey);
  }
  imageCache.set(path, entry);
}

/*
|--------------------------------------------------------------------------
| Rate Limiter
| Sliding window: max 60 requests per IP per minute.
|--------------------------------------------------------------------------
*/
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 60;
const RATE_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

/*
|--------------------------------------------------------------------------
| Route Handler
|--------------------------------------------------------------------------
*/
export async function GET(request: NextRequest) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (isRateLimited(ip)) {
    return new Response("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    });
  }

  // Path validation
  const path = request.nextUrl.searchParams.get("path") ?? "";
  if (!isValidPath(path)) {
    return new Response("Invalid path", { status: 400 });
  }

  // Serve from cache if available
  const cached = getFromCache(path);
  if (cached) {
    return new Response(cached.buffer, {
      headers: {
        "Content-Type": cached.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Cache": "HIT",
      },
    });
  }

  // Fetch from backend
  try {
    const backendUrl = `${BACKEND_ORIGIN}${path}`;
    const res = await fetch(backendUrl, { next: { revalidate: 86400 } });

    if (!res.ok) {
      return new Response("Image not found", { status: 404 });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";

    setCache(path, { buffer, contentType, cachedAt: Date.now() });

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Cache": "MISS",
      },
    });
  } catch {
    return new Response("Image not found", { status: 404 });
  }
}
