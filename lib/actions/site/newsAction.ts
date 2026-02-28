"use server";

import client from "@/lib/client/ApolloClient";
import {
    GET_NEWS_POSTS,
    GET_ALL_CATEGORIES,
    GET_NEWS_PAGE_OPTIONS,
} from "@/lib/queries/site/newsQueries";

/* ─── Types ───────────────────────────────────────────────── */

export interface NewsPost {
    databaseId: number;
    title: string;
    date: string;
    excerpt: string;
    categories: {
        nodes: { name: string; slug: string }[];
    } | null;
    featuredImage: {
        node: {
            altText: string | null;
            sourceUrl: string;
        };
    } | null;
}

export interface NewsCategory {
    databaseId: number;
    name: string;
    slug: string;
    count: number | null;
}

export interface NewsPageData {
    posts: NewsPost[];
    hasNextPage: boolean;
    endCursor: string | null;
}

/* ─── Fetch Functions ─────────────────────────────────────── */

/**
 * Fetch posts for the news listing page.
 * Pass categoryName to filter by category, or omit for all posts.
 */
export async function fetchNewsPosts(
    first: number = 12,
    after?: string,
    categoryName?: string
): Promise<NewsPageData> {
    try {
        const { data } = await client.query<{
            posts: {
                pageInfo: { hasNextPage: boolean; endCursor: string | null };
                nodes: NewsPost[];
            };
        }>({
            query: GET_NEWS_POSTS,
            variables: {
                first,
                after: after || undefined,
                categoryName: categoryName || undefined,
            },
            fetchPolicy: "network-only",
        });

        return {
            posts: data?.posts?.nodes ?? [],
            hasNextPage: data?.posts?.pageInfo?.hasNextPage ?? false,
            endCursor: data?.posts?.pageInfo?.endCursor ?? null,
        };
    } catch (error) {
        console.error("[fetchNewsPosts] Error fetching news:", error);
        return { posts: [], hasNextPage: false, endCursor: null };
    }
}

/**
 * Fetch all non-empty categories for the news category filter.
 */
export async function fetchNewsCategories(): Promise<NewsCategory[]> {
    try {
        const { data } = await client.query<{
            categories: { nodes: NewsCategory[] };
        }>({
            query: GET_ALL_CATEGORIES,
            fetchPolicy: "network-only",
        });

        return data?.categories?.nodes ?? [];
    } catch (error) {
        console.error("[fetchNewsCategories] Error fetching categories:", error);
        return [];
    }
}

/* ─── Page Options (Title & Description) ─────────────────── */

export interface NewsPageOptions {
    pageTitle: string | null;
    pageDescription: string | null;
}

/**
 * Fetch the News page title & description from WordPress ACF pageOptions.
 * @param uri - The WordPress page URI (e.g. "news" or the Arabic slug)
 */
export async function fetchNewsPageOptions(
    uri: string
): Promise<NewsPageOptions | null> {
    try {
        const { data } = await client.query<{
            pageBy: {
                pageOptions: NewsPageOptions;
            } | null;
        }>({
            query: GET_NEWS_PAGE_OPTIONS,
            variables: { uri },
            fetchPolicy: "network-only",
        });

        return data?.pageBy?.pageOptions ?? null;
    } catch (error) {
        console.error("[fetchNewsPageOptions] Error fetching page options:", error);
        return null;
    }
}
