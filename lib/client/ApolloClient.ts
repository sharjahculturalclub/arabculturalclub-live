import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, from } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";

/**
 * Apollo Client configured for Next.js App Router with proper cache invalidation
 * 
 * Strategy:
 * - Use cache tags for all GraphQL requests
 * - revalidatePath() will clear Next.js fetch cache
 * - Apollo cache set to network-only to always fetch fresh data after revalidation
 * - Retry strategy for flaky backend (503 Service Unavailable)
 * 
 * Follows PROJECT_CHECKLIST:
 * - §1: No hardcoded secrets (uses process.env)
 * - §2: network-only policy, Next.js Data Cache with tags
 * - §4: Single centralized Apollo instance
 * - §7: Cache tags for surgical revalidation
 */

const retryLink = new RetryLink({
    delay: {
        initial: 1000,
        max: 5000,
        jitter: true,
    },
    attempts: {
        max: 5,
        retryIf: (error, _operation) => {
            // Retry on network errors or 503 Service Unavailable
            const statusCode = (error as any)?.statusCode || (error as any).response?.status;
            return !!error || statusCode === 503 || statusCode === 502 || statusCode === 504;
        },
    },
});

const httpLink = new HttpLink({
    uri: `${process.env.NEXT_PUBLIC_DB_URI}/graphql`,
    fetch: (uri, options) => {
        return fetch(uri, {
            ...options,
            next: {
                revalidate: false, // Static by default — use on-demand revalidation
                tags: ['wordpress'], // Tag all WordPress requests for selective invalidation
            },
        });
    },
});

const client = new ApolloClient({
    link: from([retryLink, httpLink]),
    cache: new InMemoryCache({
        typePolicies: {
            ThemeOptions: {
                keyFields: false,
                merge(existing = {}, incoming, { mergeObjects }) {
                    return mergeObjects(existing, incoming);
                },
            },
            Page: {
                merge(existing, incoming, { mergeObjects }) {
                    return mergeObjects(existing, incoming);
                },
            },
            Query: {
                fields: {
                    category: {
                        merge(existing, incoming) { return incoming; },
                    },
                    tag: {
                        merge(existing, incoming) { return incoming; },
                    },
                    posts: {
                        merge(existing, incoming) { return incoming; },
                    },
                    events: {
                        merge(existing, incoming) { return incoming; },
                    },
                    galleries: {
                        merge(existing, incoming) { return incoming; },
                    },
                },
            },
        },
    }),
    // CRITICAL: Use network-only to bypass Apollo's cache
    // This ensures fresh data is fetched after Next.js cache is cleared
    defaultOptions: {
        query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
        },
    },
});

export default client;

