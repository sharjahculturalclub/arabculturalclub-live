"use server";

import client from "@/lib/client/ApolloClient";
import { GET_POST_BY_ID, GET_RELATED_POSTS } from "@/lib/queries/site/postQueries";

/* ─── Types ───────────────────────────────────────────────── */

export interface PostAuthor {
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

export interface PostCategory {
    databaseId: number;
    name: string;
    slug: string;
}

export interface PostTag {
    databaseId: number;
    name: string;
    slug: string;
}



export interface PostDetail {
    databaseId: number;
    title: string;
    content: string;
    date: string;
    modified: string;
    author: {
        node: PostAuthor;
    } | null;
    categories: {
        nodes: PostCategory[];
    } | null;
    tags: {
        nodes: PostTag[];
    } | null;
    featuredImage: {
        node: {
            altText: string | null;
            sourceUrl: string;
        };
    } | null;
    sEOOptions?: import("@/lib/types/seo").SEOOptions | null;
}

export interface RelatedPost {
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

/* ─── Fetch Functions ─────────────────────────────────────── */

export async function fetchPostById(id: string): Promise<PostDetail | null> {
    try {
        const { data } = await client.query<{ post: PostDetail | null }>({
            query: GET_POST_BY_ID,
            variables: { id },
            fetchPolicy: "network-only",
        });

        return data?.post ?? null;
    } catch (error) {
        console.error("[fetchPostById] Error fetching post:", error);
        return null;
    }
}

export async function fetchRelatedPosts(
    categoryIds: number[],
    excludePostId: number
): Promise<RelatedPost[]> {
    try {
        if (categoryIds.length === 0) return [];

        const { data } = await client.query<{ posts: { nodes: RelatedPost[] } }>({
            query: GET_RELATED_POSTS,
            variables: {
                categoryIn: categoryIds.map(String),
                notIn: [String(excludePostId)],
                first: 4,
            },
            fetchPolicy: "network-only",
        });

        return data?.posts?.nodes ?? [];
    } catch (error) {
        console.error("[fetchRelatedPosts] Error fetching related posts:", error);
        return [];
    }
}
