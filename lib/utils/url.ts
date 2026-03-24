/*
|--------------------------------------------------------------------------
| Convert backend image URL → proxied /cms-media/ path
| The backend hostname is never exposed in the browser.
|--------------------------------------------------------------------------
*/
const BACKEND_ORIGIN = "https://backend.shjarabclub.ae";

export const normalizeImageUrl = (url: string): string => {
    if (!url) return "";

    if (url.startsWith(BACKEND_ORIGIN + "/wp-content/uploads/")) {
        // Strip the backend origin — keep only the path so the URL is served
        // through the /cms-media/[...path] proxy route.
        return `/cms-media${url.slice(BACKEND_ORIGIN.length)}`;
    }

    return url;
};
