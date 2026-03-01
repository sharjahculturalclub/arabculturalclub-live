import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * Apollo Client configured for Next.js App Router with proper cache invalidation
 * 
 * Strategy:
 * - Use cache tags for all GraphQL requests
 * - revalidatePath() will clear Next.js fetch cache
 * - Apollo cache set to network-only to always fetch fresh data after revalidation
 * 
 * Follows PROJECT_CHECKLIST:
 * - §1: No hardcoded secrets (uses process.env)
 * - §2: network-only policy, Next.js Data Cache with tags
 * - §4: Single centralized Apollo instance
 * - §7: Cache tags for surgical revalidation
 */

const client = new ApolloClient({
    link: new HttpLink({
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
    }),
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
