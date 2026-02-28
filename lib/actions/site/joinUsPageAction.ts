import client from "@/lib/client/ApolloClient";
import { GET_JOIN_US_PAGE } from "@/lib/queries/site/joinUsPageQueries";

export interface JoinUsCard {
    title: string | null;
    description: string | null;
    icon: string | null;
    bottomLabel: string | null;
    linkLabel: string | null;
    linkUrl: string | null;
}

export interface JoinUsCardsSection {
    fieldGroupName: "JoinUsPageBuilderJoinUsPageBuilderCardsSectionLayout";
    cards: JoinUsCard[] | null;
}

export type JoinUsPageSection = JoinUsCardsSection;

export interface JoinUsPageData {
    pageOptions?: {
        pageTitle?: string | null;
        pageDescription?: string | null;
    };
    sections: JoinUsPageSection[];
}

export async function fetchJoinUsPageData(): Promise<JoinUsPageData | null> {
    try {
        const result = await client.query<{ pageBy: any }>({
            query: GET_JOIN_US_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Join Us page query error:", result.error);
            return null;
        }

        const pageBy = result.data?.pageBy;
        const pageOptions = pageBy?.pageOptions;
        const sections = pageBy?.template?.joinUsPageBuilder?.joinUsPageBuilder || [];

        return { pageOptions, sections };
    } catch (error) {
        console.error("Error fetching join us page data:", error);
        return null;
    }
}
