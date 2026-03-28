"use server";

import client from "@/lib/client/ApolloClient";
import { GET_GALLERIES, GET_GALLERY_PAGE_OPTIONS } from "@/lib/queries/site/galleryQueries";

export interface GalleryNode {
    databaseId: number;
    title: string;
    featuredImage: {
        node: {
            altText: string;
            sourceUrl: string;
        };
    } | null;
    categories: {
        nodes: {
            name: string;
        }[];
    } | null;
    galleryOptions: {
        gallery: {
            nodes: {
                altText: string;
                sourceUrl: string;
            }[];
        } | null;
    } | null;
}

export interface SeoOptions {
    seoTitle: string | null;
    metaDescription: string | null;
    focusKeyword: string | null;
    canonicalUrl: string | null;
}

export interface GalleryPageOptions {
    pageTitle: string | null;
    pageDescription: string | null;
}

export interface GalleryPageData {
    pageOptions: GalleryPageOptions | null;
    seoOptions: SeoOptions | null;
}

export async function fetchGalleries(): Promise<GalleryNode[]> {
    try {
        const { data } = await client.query<{
            allGallery: {
                nodes: GalleryNode[];
            };
        }>({
            query: GET_GALLERIES,
            fetchPolicy: "network-only",
        });

        return data?.allGallery?.nodes ?? [];
    } catch (error) {
        console.error("[fetchGalleries] Error fetching galleries:", error);
        return [];
    }
}

export async function fetchGalleryPageOptions(uri: string): Promise<GalleryPageData | null> {
    try {
        const { data } = await client.query<{
            page: {
                pageOptions: GalleryPageOptions;
                seoOptions: SeoOptions;
            } | null;
        }>({
            query: GET_GALLERY_PAGE_OPTIONS,
            variables: { uri },
            fetchPolicy: "network-only",
        });

        if (!data?.page) return null;

        return {
            pageOptions: data.page.pageOptions ?? null,
            seoOptions: data.page.seoOptions ?? null,
        };
    } catch (error) {
        console.error("[fetchGalleryPageOptions] Error fetching page options:", error);
        return null;
    }
}
