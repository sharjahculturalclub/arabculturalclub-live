import "server-only";

function require_env(key: string): string {
    const value = process.env[key];
    if (!value) throw new Error(`Missing required environment variable: ${key}`);
    return value;
}

export const env = {
    WP_BACKEND_URL: require_env("WP_BACKEND_URL"),
    WP_GRAPHQL_AUTH: process.env.WP_GRAPHQL_AUTH ?? "",
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://shjarabclub.ae",
};
