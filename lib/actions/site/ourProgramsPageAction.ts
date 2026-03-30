import { cache } from 'react';
import client from "@/lib/client/ApolloClient";
import { GET_OUR_PROGRAMS_PAGE } from "@/lib/queries/site/ourProgramsPageQueries";

export interface ProgramFeature {
    featureText: string | null;
}

export interface ProgramItem {
    title: string | null;
    subtitle: string | null;
    icon: string | null;
    description: string | null;
    features: ProgramFeature[] | null;
}

export interface OurProgramsPageMainAreasSection {
    fieldGroupName: "OurProgramsPageBuilderOurProgramsPageBuilderMainAreasSectionLayout";
    sectionTitle: string | null;
    sectionSubtitle: string | null;
    programs: ProgramItem[] | null;
}

export type OurProgramsPageSection = OurProgramsPageMainAreasSection;

export interface SeoOptions {
    seoTitle?: string | null;
    metaDescription?: string | null;
    focusKeyword?: string | null;
    canonicalUrl?: string | null;
}

export interface OurProgramsPageData {
    pageOptions?: {
        pageTitle?: string | null;
        pageDescription?: string | null;
    };
    seoOptions?: SeoOptions | null;
    sections: OurProgramsPageSection[];
}

export const fetchOurProgramsPageData = cache(async (): Promise<OurProgramsPageData | null> => {
    try {
        const result = await client.query<{ pageBy: any }>({
            query: GET_OUR_PROGRAMS_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Our Programs page query error:", result.error);
            return null;
        }

        const pageBy = result.data?.pageBy;
        const pageOptions = pageBy?.pageOptions;
        const seoOptions = pageBy?.seoOptions ?? null;
        const sections = pageBy?.template?.ourProgramsPageBuilder?.ourProgramsPageBuilder || [];

        return { pageOptions, seoOptions, sections };
    } catch (error) {
        console.error("Error fetching our programs page data:", error);
        return null;
    }
});
