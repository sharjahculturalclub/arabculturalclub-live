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

export async function fetchPreviewPostById(id: string, token: string): Promise<PostDetail | null> {
    try {
        const wpUrl = process.env.NEXT_PUBLIC_DB_URI;
        if (!wpUrl) return null;

        const previewUrl = `${wpUrl}/wp-json/nextjs/v1/preview-post?post_id=${id}&token=${encodeURIComponent(token)}`;
        const response = await fetch(previewUrl, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 0 },
        });

        if (!response.ok) {
            console.error('[fetchPreviewPostById] Error:', response.statusText);
            return null;
        }

        const data = await response.json();
        if (!data || data.code) return null; // WP_Error returns structure with 'code'

        return {
            databaseId: data.id,
            title: data.title,
            content: data.content,
            date: data.date,
            modified: data.modified || data.date, // simple fallback
            author: data.author ? {
                node: {
                    databaseId: data.author.id,
                    id: String(data.author.id),
                    name: data.author.name,
                    slug: data.author.slug,
                }
            } : null,
            categories: {
                nodes: (data.categories || []).map((c: { id: number; name: string; slug: string }) => ({
                    databaseId: c.id,
                    name: c.name,
                    slug: c.slug
                }))
            },
            tags: {
                nodes: (data.tags || []).map((t: { id: number, name: string; slug: string }) => ({
                    databaseId: t.id,
                    name: t.name,
                    slug: t.slug
                }))
            },
            featuredImage: data.featured_image ? {
                node: {
                    sourceUrl: data.featured_image,
                    altText: data.title
                }
            } : null,
            sEOOptions: data.seo || null,
        };
    } catch (error) {
        console.error("[fetchPreviewPostById] Error fetching preview:", error);
        return null;
    }
}
