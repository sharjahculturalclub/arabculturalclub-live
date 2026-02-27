import client from "@/lib/client/ApolloClient";
import { GET_HOME_PAGE } from "@/lib/queries/site/homePageQueries";

// ── Type definitions ──────────────────────────────────────────────

export interface ACFLink {
    title: string;
    url: string;
    target: string;
}

export interface ACFImage {
    node: {
        altText: string;
        sourceUrl: string;
    };
}

export interface HeroSection {
    fieldGroupName: "HomePageBuilderHomePageBuilderHeroSectionLayout";
    heroImage: ACFImage | null;
    heroImageTag: string | null;
    heroImageTitle: string | null;
    heroContentTag: string | null;
    heroContentTitle: string | null;
    heroContentDescription: string | null;
    heroContentButtoon: ACFLink | null;
    heroVideoButtonLabel: string | null;
    heroVideoLink: string | null;
}

export interface MissionVisionSection {
    fieldGroupName: "HomePageBuilderHomePageBuilderMissionVisionSectionLayout";
    heading: string | null;
    description: string | null;
    lists: { fieldGroupName: string; addList: string }[] | null;
    button: ACFLink | null;
    imageMissionVision: ACFImage | null;
}

export interface EventNode {
    eventId: number;
    title: string;
    featuredImage: ACFImage | null;
    eventOptions: {
        eventDate: string | null;
        eventLocation: string | null;
    } | null;
    categories: {
        nodes: { name: string }[];
    } | null;
}

export interface EventsSection {
    fieldGroupName: "HomePageBuilderHomePageBuilderEventsLayout";
    sectionTitle: string | null;
    viewAllButton: ACFLink | null;
    selectEvents: {
        nodes: EventNode[];
    } | null;
}

export interface AboutBlock {
    blockTitle: string;
    blockDescription: string;
}

export interface AboutSection {
    fieldGroupName: "HomePageBuilderHomePageBuilderAboutSectionLayout";
    heading: string | null;
    description: string | null;
    blocks: AboutBlock[] | null;
    sectionBackgroundImage: ACFImage | null;
}

export interface NewsSection {
    fieldGroupName: "HomePageBuilderHomePageBuilderNewsSectionLayout";
    sectionHeading: string | null;
    viewAllButton: ACFLink | null;
}

export type HomePageSection =
    | HeroSection
    | MissionVisionSection
    | EventsSection
    | AboutSection
    | NewsSection;

export interface PostNode {
    postId: number;
    title: string;
    categories: {
        nodes: { name: string }[];
    };
    date: string;
    excerpt: string;
    featuredImage: ACFImage | null;
}

export interface HomePageDataType {
    pageBy: {
        homePageBuilder: {
            fieldGroupName: string;
            homePageBuilder: HomePageSection[];
        };
    };
    posts: {
        nodes: PostNode[];
    };
}

// ── Helper to find a section by type ──────────────────────────────

export function findSection<T extends HomePageSection>(
    sections: HomePageSection[],
    fieldGroupName: T["fieldGroupName"]
): T | undefined {
    return sections.find(
        (s) => s.fieldGroupName === fieldGroupName
    ) as T | undefined;
}

// ── Server-side fetch ─────────────────────────────────────────────

/**
 * Fetch homepage ACF sections + latest 6 posts in a single query
 *
 * Called from server components only.
 * Follows PROJECT_CHECKLIST:
 * - §2: Single batched query (parallelize)
 * - §4: Separate fetch logic from components
 * - §4: Single centralized Apollo instance
 * - §8: Server Components by default
 */
export async function fetchHomePageData(): Promise<{
    sections: HomePageSection[];
    posts: PostNode[];
} | null> {
    try {
        const result = await client.query<HomePageDataType>({
            query: GET_HOME_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Homepage query error:", result.error);
            return null;
        }

        const sections =
            result.data?.pageBy?.homePageBuilder?.homePageBuilder ?? [];
        const posts = result.data?.posts?.nodes ?? [];

        return { sections, posts };
    } catch (error) {
        console.error("Error fetching homepage data:", error);
        return null;
    }
}
