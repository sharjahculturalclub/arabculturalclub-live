import "server-only";
import { mapBackendUrl } from "./url-map";

/**
 * Sanitize a raw SEO options object returned from WPGraphQL.
 * Rewrites any canonical URL, OG/Twitter image URLs, and schema blobs
 * so the backend domain never appears in rendered metadata.
 */
export function sanitizeSeo<T extends Record<string, unknown>>(
    seo: T | null | undefined
): T | undefined {
    if (!seo) return undefined;

    const out = structuredClone(seo) as Record<string, unknown>;

    for (const [key, value] of Object.entries(out)) {
        if (typeof value === "string") {
            out[key] = mapBackendUrl(value);
            continue;
        }

        // Nested objects like { node: { sourceUrl, altText } }
        if (value && typeof value === "object" && !Array.isArray(value)) {
            const nested = value as Record<string, unknown>;
            if (typeof nested.sourceUrl === "string") {
                nested.sourceUrl = mapBackendUrl(nested.sourceUrl);
            }
            if (typeof nested.url === "string") {
                nested.url = mapBackendUrl(nested.url);
            }
        }
    }

    return out as T;
}

/**
 * Sanitize a raw JSON-LD schema string before injecting into <script>.
 */
export function sanitizeSchemaJson(input: string): string {
    if (!input) return input;
    try {
        const parsed = JSON.parse(input);
        return JSON.stringify(walkSchema(parsed));
    } catch {
        // Not valid JSON — fall back to regex replacement
        return input.replace(
            /https?:\/\/backend\.shjarabclub\.ae[^\s"'<>)]+/gi,
            (m) => mapBackendUrl(m)
        );
    }
}

function walkSchema(value: unknown): unknown {
    if (typeof value === "string") return mapBackendUrl(value);
    if (Array.isArray(value)) return value.map(walkSchema);
    if (value && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) out[k] = walkSchema(v);
        return out;
    }
    return value;
}
