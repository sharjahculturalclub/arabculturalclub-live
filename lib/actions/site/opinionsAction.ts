"use server";

import { cache } from "react";
import client from "@/lib/client/ApolloClient";
import {
    GET_OPINION_POSTS,
    GET_OPINION_POSTS_BY_CATEGORY,
    GET_ALL_OPINION_CATEGORIES,
    GET_OPINION_CATEGORY_WITH_POSTS,
    GET_OPINION_PAGE_OPTIONS,
    GET_OPINION_BY_ID,
} from "@/lib/queries/site/opinionsQueries";

/* ─── Types ───────────────────────────────────────────────── */

export interface OpinionCategory {
    databaseId: number;
    name: string;
    slug: string;
}

export interface OpinionPost {
    databaseId: number;
    title: string;
    date: string;
    excerpt: string;
    featuredImage: {
        node: {
            altText: string | null;
            sourceUrl: string;
        };
    } | null;
    opinioncategories?: {
        nodes: OpinionCategory[];
    } | null;
}

export interface OpinionPostsData {
    posts: OpinionPost[];
    hasNextPage: boolean;
    endCursor: string | null;
}

export interface OpinionPageOptions {
    pageTitle: string | null;
    pageDescription: string | null;
}

export interface OpinionSeoOptions {
    seoTitle: string | null;
    metaDescription: string | null;
    focusKeyword: string | null;
    canonicalUrl: string | null;
}

export interface OpinionPageData {
    title: string | null;
    pageOptions: OpinionPageOptions | null;
    seoOptions: OpinionSeoOptions | null;
}

export interface OpinionAuthor {
    databaseId: number;
    name: string;
    slug: string;
    id: string;
    userProfileImage?: {
        authorInfo?: string | null;
        profileImage?: {
            node: {
                altText?: string | null;
                sourceUrl: string;
            };
        } | null;
    } | null;
}

export interface OpinionDetail {
    databaseId: number;
    title: string;
    content: string;
    date: string;
    modified: string;
    author: {
        node: OpinionAuthor;
    } | null;
    featuredImage: {
        node: {
            altText: string | null;
            sourceUrl: string;
        };
    } | null;
    seoOptions?: OpinionSeoOptions | null;
}

export interface OpinionCategoryData {
    databaseId: number;
    name: string;
    slug: string;
    description: string | null;
    seoOptions?: OpinionSeoOptions | null;
    opinions: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: OpinionPost[];
    };
}

/* ─── Fetch Functions ─────────────────────────────────────── */

export const fetchOpinionPosts = cache(async (
    first: number = 9,
    after?: string,
    categorySlug?: string
): Promise<OpinionPostsData> => {
    try {
        if (categorySlug) {
            const { data } = await client.query<{
                opinions: {
                    pageInfo: { hasNextPage: boolean; endCursor: string | null };
                    nodes: OpinionPost[];
                };
            }>({
                query: GET_OPINION_POSTS_BY_CATEGORY,
                variables: { first, after: after || undefined, categorySlug },
                fetchPolicy: "network-only",
            });

            return {
                posts: data?.opinions?.nodes ?? [],
                hasNextPage: data?.opinions?.pageInfo?.hasNextPage ?? false,
                endCursor: data?.opinions?.pageInfo?.endCursor ?? null,
            };
        }

        const { data } = await client.query<{
            opinions: {
                pageInfo: { hasNextPage: boolean; endCursor: string | null };
                nodes: OpinionPost[];
            };
        }>({
            query: GET_OPINION_POSTS,
            variables: { first, after: after || undefined },
            fetchPolicy: "network-only",
        });

        return {
            posts: data?.opinions?.nodes ?? [],
            hasNextPage: data?.opinions?.pageInfo?.hasNextPage ?? false,
            endCursor: data?.opinions?.pageInfo?.endCursor ?? null,
        };
    } catch (error) {
        console.error("[fetchOpinionPosts] Error:", error);
        return { posts: [], hasNextPage: false, endCursor: null };
    }
});

export const fetchOpinionCategories = cache(async (): Promise<OpinionCategory[]> => {
    try {
        const { data } = await client.query<{
            opinioncategories: { nodes: OpinionCategory[] };
        }>({
            query: GET_ALL_OPINION_CATEGORIES,
            fetchPolicy: "network-only",
        });

        return data?.opinioncategories?.nodes ?? [];
    } catch (error) {
        console.error("[fetchOpinionCategories] Error:", error);
        return [];
    }
});

export const fetchOpinionCategoryWithPosts = cache(async (
    slug: string,
    first: number = 9,
    after?: string
): Promise<OpinionCategoryData | null> => {
    try {
        const { data } = await client.query<{ opinioncategory: OpinionCategoryData | null }>({
            query: GET_OPINION_CATEGORY_WITH_POSTS,
            variables: { slug, first, after },
            fetchPolicy: "network-only",
        });

        return data?.opinioncategory ?? null;
    } catch (error) {
        console.error("[fetchOpinionCategoryWithPosts] Error:", error);
        return null;
    }
});

export const fetchOpinionPageOptions = cache(async (): Promise<OpinionPageData | null> => {
    try {
        const { data } = await client.query<{
            pageBy: {
                title: string | null;
                pageOptions: OpinionPageOptions;
                seoOptions: OpinionSeoOptions;
            } | null;
        }>({
            query: GET_OPINION_PAGE_OPTIONS,
            fetchPolicy: "network-only",
        });

        if (!data?.pageBy) return null;
        return {
            title: data.pageBy.title ?? null,
            pageOptions: data.pageBy.pageOptions ?? null,
            seoOptions: data.pageBy.seoOptions ?? null,
        };
    } catch (error) {
        console.error("[fetchOpinionPageOptions] Error:", error);
        return null;
    }
});

export const fetchOpinionById = cache(async (id: string): Promise<OpinionDetail | null> => {
    try {
        const { data } = await client.query<{ opinionBy: OpinionDetail | null }>({
            query: GET_OPINION_BY_ID,
            variables: { id: parseInt(id, 10) },
            fetchPolicy: "network-only",
        });

        return data?.opinionBy ?? null;
    } catch (error) {
        console.error("[fetchOpinionById] Error:", error);
        return null;
    }
});
