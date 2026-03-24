import "server-only";

const BACKEND_ORIGIN = "https://backend.shjarabclub.ae";
const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shjarabclub.ae";

/**
 * Map any backend URL to a frontend-safe equivalent.
 *
 * - Uploads       → /cms-media/wp-content/uploads/...  (proxied, no backend exposed)
 * - Internal links → frontend origin + same path
 * - Other URLs    → unchanged
 */
export function mapBackendUrl(input: string): string {
    if (!input || !input.includes("backend.shjarabclub.ae")) return input;

    try {
        const url = new URL(input);
        if (url.origin !== BACKEND_ORIGIN) return input;

        // Media files — stream through cms-media proxy
        if (url.pathname.startsWith("/wp-content/uploads/")) {
            return `/cms-media${url.pathname}${url.search}`;
        }

        // Everything else (internal WP links) → rewrite to frontend origin
        return `${SITE_ORIGIN}${url.pathname}${url.search}${url.hash}`;
    } catch {
        return input;
    }
}
