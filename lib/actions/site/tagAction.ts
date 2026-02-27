"use server";

import client from "@/lib/client/ApolloClient";
import { GET_POSTS_BY_TAG_SLUG } from "@/lib/queries/site/tagQueries";
import { RelatedPost } from "./postAction";

export interface TagData {
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

export async function fetchTagWithPosts(
    slug: string,
    first: number = 12,
    after?: string
): Promise<TagData | null> {
    try {
        const { data } = await client.query<{ tag: TagData | null }>({
            query: GET_POSTS_BY_TAG_SLUG,
            variables: { id: slug, first, after },
            fetchPolicy: "network-only",
        });

        return data?.tag ?? null;
    } catch (error) {
        return null;
    }
}
