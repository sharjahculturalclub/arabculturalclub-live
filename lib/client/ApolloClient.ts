import "server-only";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { sanitizeGraphQLPayload } from "@/lib/cms/sanitize-response";
import { rewriteHtmlFragment } from "@/lib/cms/rewrite-html";

/**
 * Apollo Client configured for Next.js App Router with proper cache invalidation.
 *
 * - server-only: never runs in the browser, backend URL never exposed
 * - All GraphQL responses are recursively sanitized to strip backend URLs
 * - RetryLink handles transient 502/503/504 errors with exponential back-off
 */

function sanitizeDeep(value: unknown): unknown {
    if (typeof value === "string") return rewriteHtmlFragment(value);
    if (Array.isArray(value)) return value.map(sanitizeDeep);
    if (value !== null && typeof value === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) out[k] = sanitizeDeep(v);
        return out;
    }
    return value;
}

const retryLink = new RetryLink({
    delay: { initial: 1000, max: 5000, jitter: true },
    attempts: {
        max: 5,
        retryIf: (error) => {
            const statusCode =
                (error as any)?.statusCode || (error as any).response?.status;
            return !!error || statusCode === 503 || statusCode === 502 || statusCode === 504;
        },
    },
});

const httpLink = new HttpLink({
    uri: `${process.env.WP_BACKEND_URL}/graphql`,
    fetch: (uri, options) =>
        fetch(uri as string, {
            ...(options as RequestInit),
            next: {
                revalidate: false,
                tags: ["wordpress"],
            },
        }),
});

const client = new ApolloClient({
    link: retryLink.concat(httpLink),
    cache: new InMemoryCache({
        typePolicies: {
            ThemeOptions: {
                keyFields: false,
                merge: (existing = {}, incoming, { mergeObjects }) =>
                    mergeObjects(existing, incoming),
            },
            Page: {
                merge: (_existing, incoming, { mergeObjects }) =>
                    mergeObjects(_existing, incoming),
            },
            Query: {
                fields: {
                    category: { merge: (_e, incoming) => incoming },
                    tag:      { merge: (_e, incoming) => incoming },
                    posts:    { merge: (_e, incoming) => incoming },
                    events:   { merge: (_e, incoming) => incoming },
                    galleries:{ merge: (_e, incoming) => incoming },
                },
            },
        },
    }),
    defaultOptions: {
        query: { fetchPolicy: "network-only", errorPolicy: "all" },
    },
});

/**
 * Drop-in replacement for `client.query` that automatically sanitizes the
 * response — every string in the payload is passed through the HTML rewriter
 * and URL map so no backend reference leaks to the caller.
 */
const originalQuery = client.query.bind(client);
client.query = async function sanitizedQuery(options) {
    const result = await originalQuery(options);
    if (result.data) {
        result.data = sanitizeGraphQLPayload(sanitizeDeep(result.data)) as typeof result.data;
    }
    return result;
} as typeof client.query;

export default client;
