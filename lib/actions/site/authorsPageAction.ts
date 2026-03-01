import client from "@/lib/client/ApolloClient";
import { GET_AUTHORS_LIST, GET_AUTHOR_DETAIL } from "@/lib/queries/site/authorsPageQueries";

// ── Type definitions ──────────────────────────────────────────────

export interface SocialProfile {
    iconName: string | null;
    link: string | null;
}

export interface UserProfileImage {
    authorInfo: string | null;
    profileImage: {
        node: {
            altText: string | null;
            sourceUrl: string | null;
        };
    } | null;
    address: string | null;
    designation: string | null;
    memberOf: string | null;
    socialProfiles: SocialProfile[] | null;
}

export interface AuthorListItem {
    id: string;
    databaseId: number;
    name: string | null;
    slug: string | null;
    description: string | null;
    avatar: {
        url: string | null;
    } | null;
    userProfileImage: UserProfileImage | null;
    posts: {
        nodes: { id: string }[];
    } | null;
}

export interface AuthorPost {
    id: string;
    databaseId: number;
    title: string | null;
    slug: string | null;
    date: string | null;
    excerpt: string | null;
    featuredImage: {
        node: {
            sourceUrl: string | null;
            altText: string | null;
        };
    } | null;
    categories: {
        nodes: { name: string; slug: string }[];
    } | null;
}

export interface AuthorDetail {
    id: string;
    databaseId: number;
    name: string | null;
    slug: string | null;
    description: string | null;
    avatar: {
        url: string | null;
    } | null;
    userProfileImage: UserProfileImage | null;
    posts: {
        nodes: AuthorPost[];
    } | null;
}

// ── Helper: get author image URL ──────────────────────────────────
export function getAuthorImageUrl(author: { avatar?: { url: string | null } | null; userProfileImage?: UserProfileImage | null }): string {
    // Prefer ACF profile image, fallback to Gravatar avatar
    return author.userProfileImage?.profileImage?.node?.sourceUrl
        || author.avatar?.url
        || '';
}

// ── Helper: get author bio ────────────────────────────────────────
export function getAuthorBio(author: { description?: string | null; userProfileImage?: UserProfileImage | null }): string {
    // Prefer ACF authorInfo, fallback to WP description
    return author.userProfileImage?.authorInfo
        || author.description
        || '';
}

// ── Server-side fetchers ──────────────────────────────────────────

/**
 * Fetch all authors for the listing page
 */
export async function fetchAuthorsList(): Promise<AuthorListItem[] | null> {
    try {
        const result = await client.query<{ users: { nodes: AuthorListItem[] } }>({
            query: GET_AUTHORS_LIST,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Authors list query error:", result.error);
            return null;
        }

        return result.data?.users?.nodes ?? null;
    } catch (error) {
        console.error("Error fetching authors list:", error);
        return null;
    }
}

/**
 * Fetch single author detail by database ID
 */
export async function fetchAuthorDetail(id: string): Promise<AuthorDetail | null> {
    try {
        const result = await client.query<{ user: AuthorDetail }>({
            query: GET_AUTHOR_DETAIL,
            variables: { id },
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Author detail query error:", result.error);
            return null;
        }

        return result.data?.user ?? null;
    } catch (error) {
        console.error("Error fetching author detail:", error);
        return null;
    }
}
