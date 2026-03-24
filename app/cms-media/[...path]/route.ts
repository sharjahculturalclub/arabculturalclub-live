import { type NextRequest } from "next/server";

export const runtime = "nodejs";

const BACKEND_ORIGIN = process.env.WP_BACKEND_URL ?? "https://backend.shjarabclub.ae";

// Headers that must not be forwarded (hop-by-hop)
const HOP_BY_HOP = new Set([
    "connection",
    "keep-alive",
    "proxy-authenticate",
    "proxy-authorization",
    "te",
    "trailer",
    "transfer-encoding",
    "upgrade",
]);

// Only serve files from the uploads directory
const ALLOWED_PREFIX = "/wp-content/uploads/";

// Only allow image and document extensions
const ALLOWED_EXTENSIONS = new Set([
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".svg",
    ".ico", ".pdf", ".mp4", ".mp3", ".webm",
]);

function hasAllowedExtension(pathname: string): boolean {
    const ext = pathname.slice(pathname.lastIndexOf(".")).toLowerCase();
    return ALLOWED_EXTENSIONS.has(ext);
}

/*
|--------------------------------------------------------------------------
| Rate limiter — sliding window, 120 req / IP / minute
|--------------------------------------------------------------------------
*/
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 120;
const RATE_WINDOW_MS = 60_000;

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

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    // Rate limiting
    const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
        return new Response("Too Many Requests", {
            status: 429,
            headers: { "Retry-After": "60" },
        });
    }

    const { path } = await context.params;
    const pathname = "/" + path.join("/");

    // Validate: uploads only, allowed extensions
    if (!pathname.startsWith(ALLOWED_PREFIX) || !hasAllowedExtension(pathname)) {
        return new Response("Not found", { status: 404 });
    }

    const upstreamUrl = `${BACKEND_ORIGIN}${pathname}${request.nextUrl.search}`;

    try {
        const upstream = await fetch(upstreamUrl, {
            method: "GET",
            redirect: "manual", // Never follow — would expose backend location header
            headers: {
                ...(request.headers.get("range")
                    ? { range: request.headers.get("range")! }
                    : {}),
            },
        });

        // Block redirects — a Location header would expose the backend URL
        if (upstream.status >= 300 && upstream.status < 400) {
            return new Response("Upstream redirect blocked", { status: 502 });
        }

        if (!upstream.ok && upstream.status !== 206) {
            return new Response("Not found", { status: 404 });
        }

        // Forward safe headers only
        const headers = new Headers();
        upstream.headers.forEach((value, key) => {
            if (HOP_BY_HOP.has(key.toLowerCase())) return;
            if (key.toLowerCase() === "location") return; // never leak
            headers.set(key, value);
        });

        // Ensure long-lived cache for immutable media
        if (!headers.has("cache-control")) {
            headers.set("cache-control", "public, max-age=31536000, immutable");
        }

        // Stream body directly — do not buffer large files
        return new Response(upstream.body, {
            status: upstream.status,
            headers,
        });
    } catch {
        return new Response("Not found", { status: 404 });
    }
}

// Support HEAD requests (used by browsers for preload / caching checks)
export async function HEAD(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const res = await GET(request, context);
    return new Response(null, { status: res.status, headers: res.headers });
}
