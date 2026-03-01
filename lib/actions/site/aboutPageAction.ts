import client from "@/lib/client/ApolloClient";
import { GET_ABOUT_PAGE } from "@/lib/queries/site/aboutPageQueries";
import { ACFImage } from "./homePageAction";

export interface AboutPageHeroSection {
    fieldGroupName: "AboutPageBuilderAboutPageBuilderHeroSectionLayout";
    image: ACFImage | null;
    preTitle: string | null;
    title: string | null;
    description: string | null;
    signatureTitle: string | null;
    signatureSubtitle: string | null;
}

export interface AboutPageVisionMessageSection {
    fieldGroupName: "AboutPageBuilderAboutPageBuilderVisionMessageSectionLayout";
    cards: {
        fieldGroupName: string;
        icon: string | null;
        title: string | null;
        description: string | null;
    }[] | null;
}

export interface AboutPageCoreValuesSection {
    fieldGroupName: "AboutPageBuilderAboutPageBuilderCoreValuesSectionLayout";
    sectionTitle: string | null;
    values: {
        icon: string | null;
        title: string | null;
        description: string | null;
        fieldGroupName: string;
    }[] | null;
}

export interface AboutPageBoardOfDirectorsSection {
    fieldGroupName: "AboutPageBuilderAboutPageBuilderBoardOfDirectorsSectionLayout";
    sectionTitle: string | null;
    sectionSubtitle: string | null;
    directors: {
        image: ACFImage | null;
        name: string | null;
        role: string | null;
    }[] | null;
}

export interface AboutPageClubHistorySection {
    fieldGroupName: "AboutPageBuilderAboutPageBuilderClubHistorySectionLayout";
    sectionTitle: string | null;
    sectionSubtitle: string | null;
    historyItems: {
        year: string | null;
        title: string | null;
        image: ACFImage | null;
        description: string | null;
        fieldGroupName: string;
    }[] | null;
    footerText: string | null;
}

export type AboutPageSection =
    | AboutPageHeroSection
    | AboutPageVisionMessageSection
    | AboutPageCoreValuesSection
    | AboutPageBoardOfDirectorsSection
    | AboutPageClubHistorySection;

export interface AboutPageData {
    pageOptions?: {
        pageTitle?: string | null;
        pageDescription?: string | null;
    };
    sEOOptions?: import("@/lib/types/seo").SEOOptions | null;
    sections: AboutPageSection[];
}

export async function fetchAboutPageData(): Promise<AboutPageData | null> {
    try {
        const result = await client.query<{ pageBy: any }>({
            query: GET_ABOUT_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("About page query error:", result.error);
            return null;
        }

        const pageBy = result.data?.pageBy;
        const pageOptions = pageBy?.pageOptions;
        const sections = pageBy?.template?.aboutPageBuilder?.aboutPageBuilder || [];
        const sEOOptions = pageBy?.sEOOptions;

        return { pageOptions, sections, sEOOptions };
    } catch (error) {
        console.error("Error fetching about page data:", error);
        return null;
    }
}
