import "server-only";
import { mapBackendUrl } from "./url-map";

const BACKEND_HOSTNAME = "backend.shjarabclub.ae";

/**
 * Recursively walk a GraphQL response payload and rewrite every string
 * that contains the backend hostname. Safe to call on any JSON-serialisable
 * value — objects, arrays, primitives.
 */
export function sanitizeGraphQLPayload<T>(value: T): T {
    return walk(value) as T;
}

function walk(value: unknown): unknown {
    if (typeof value === "string") {
        return sanitizeString(value);
    }

    if (Array.isArray(value)) {
        return value.map(walk);
    }

    if (value !== null && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) {
            out[k] = walk(v);
        }
        return out;
    }

    return value;
}

function sanitizeString(input: string): string {
    if (!input.includes(BACKEND_HOSTNAME)) return input;
    // Rewrite absolute backend URLs; leave everything else untouched
    return input.replace(
        /https?:\/\/backend\.shjarabclub\.ae[^\s"'<>)]+/gi,
        (match) => mapBackendUrl(match)
    );
}
