import "server-only";
import { parseHTML } from "linkedom";
import { mapBackendUrl } from "./url-map";

const BACKEND_HOSTNAME = "backend.shjarabclub.ae";
const ABS_URL_RE = /https?:\/\/backend\.shjarabclub\.ae[^\s"'<>)]+/gi;
const CSS_URL_RE = /url\((['"]?)(.*?)\1\)/gi;

/**
 * Rewrite srcset strings — each comma-separated descriptor has a URL + optional
 * width/density value. We only touch the URL part.
 */
function rewriteSrcset(srcset: string): string {
    return srcset
        .split(",")
        .map((part) => {
            const trimmed = part.trim();
            if (!trimmed) return trimmed;
            const firstSpace = trimmed.indexOf(" ");
            if (firstSpace === -1) return mapBackendUrl(trimmed);
            const url = trimmed.slice(0, firstSpace);
            const descriptor = trimmed.slice(firstSpace);
            return `${mapBackendUrl(url)}${descriptor}`;
        })
        .join(", ");
}

/**
 * Rewrite CSS inline-style values — handles url(...) and raw URL occurrences.
 */
function rewriteStyleValue(style: string): string {
    return style
        .replace(CSS_URL_RE, (_: string, quote: string, rawUrl: string) => {
            return `url(${quote}${mapBackendUrl(rawUrl)}${quote})`;
        })
        .replace(ABS_URL_RE, (m) => mapBackendUrl(m));
}

/**
 * Parse an HTML fragment with linkedom and rewrite all backend URLs in:
 *   - href, src, poster, action attributes
 *   - srcset
 *   - inline style=""
 *   - data-* attributes
 *   - any remaining raw text nodes
 *
 * Falls back to a simple regex pass if no HTML tags are present.
 */
export function rewriteHtmlFragment(input: string): string {
    if (!input || !input.includes(BACKEND_HOSTNAME)) return input;

    // Plain-string (no HTML) — just replace raw URLs
    if (!/<[a-z]/i.test(input)) {
        return input.replace(ABS_URL_RE, (m) => mapBackendUrl(m));
    }

    const { document } = parseHTML(`<div id="__root__">${input}</div>`);
    const root = document.querySelector("#__root__");
    if (!root) {
        return input.replace(ABS_URL_RE, (m) => mapBackendUrl(m));
    }

    for (const el of root.querySelectorAll("*")) {
        // Standard URL attributes
        for (const attr of ["href", "src", "poster", "action"]) {
            const val = el.getAttribute(attr);
            if (val) el.setAttribute(attr, mapBackendUrl(val));
        }

        // srcset
        const srcset = el.getAttribute("srcset");
        if (srcset) el.setAttribute("srcset", rewriteSrcset(srcset));

        // Inline style
        const style = el.getAttribute("style");
        if (style && style.includes(BACKEND_HOSTNAME)) {
            el.setAttribute("style", rewriteStyleValue(style));
        }

        // data-* attributes (plugins often store URLs here)
        for (const name of el.getAttributeNames()) {
            if (!name.startsWith("data-")) continue;
            const val = el.getAttribute(name);
            if (val && val.includes(BACKEND_HOSTNAME)) {
                el.setAttribute(name, mapBackendUrl(val));
            }
        }
    }

    // Catch any raw backend URLs that survived (e.g. inside text nodes)
    return root.innerHTML.replace(ABS_URL_RE, (m) => mapBackendUrl(m));
}
