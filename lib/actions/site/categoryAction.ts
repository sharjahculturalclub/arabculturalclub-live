"use server";

import client from "@/lib/client/ApolloClient";
import { GET_POSTS_BY_CATEGORY_SLUG } from "@/lib/queries/site/categoryQueries";
import { RelatedPost } from "./postAction";

export interface CategoryData {
    name: string;
    slug: string;
    description: string | null;
    count: number | null;
    seo: {
        title: string | null;
        metaDesc: string | null;
        canonical: string | null;
    } | null;
    posts: {
        pageInfo: {
            hasNextPage: boolean;
            endCursor: string | null;
        };
        nodes: RelatedPost[];
    };
}

export async function fetchCategoryWithPosts(
    slug: string,
    first: number = 12,
    after?: string
): Promise<CategoryData | null> {
    try {
        const { data } = await client.query<{ category: CategoryData | null }>({
            query: GET_POSTS_BY_CATEGORY_SLUG,
            variables: { id: slug, first, after },
            fetchPolicy: "network-only",
        });

        return data?.category ?? null;
    } catch (error) {
        return null;
    }
}
