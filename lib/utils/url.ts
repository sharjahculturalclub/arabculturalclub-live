/*
|--------------------------------------------------------------------------
| Convert backend image URL → proxied frontend URL
| Only the path is exposed — the backend hostname stays server-side.
|--------------------------------------------------------------------------
*/
const BACKEND_ORIGIN = "https://backend.shjarabclub.ae";

export const normalizeImageUrl = (url: string) => {
  if (!url) return "";

  if (url.startsWith(BACKEND_ORIGIN)) {
    const path = url.slice(BACKEND_ORIGIN.length); // e.g. /wp-content/uploads/...
    return `/api/image?path=${encodeURIComponent(path)}`;
  }

  return url;
};
