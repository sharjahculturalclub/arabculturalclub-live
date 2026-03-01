import client from "@/lib/client/ApolloClient";
import { GET_SHARE_OPINIONS_PAGE } from "@/lib/queries/site/shareOpinionsPageQueries";
import { SEOOptions } from "@/lib/actions/site/homePageAction";

// ── Type definitions ──────────────────────────────────────────────

export interface InfoPointItem {
    pointText: string | null;
}

export interface OpinionFormSection {
    formId: string | null;
}

export interface InfoSection {
    sectionTitle: string | null;
    infoPoints: InfoPointItem[] | null;
}

export type ShareOpinionsSection = OpinionFormSection | InfoSection;

export interface ShareOpinionsPageDataType {
    pageBy: {
        pageOptions: {
            pageTitle: string | null;
            pageDescription: string | null;
        } | null;
        template: {
            templateName: string;
            shareOpinionsPageBuilder: {
                shareOpinionsPageBuilder: ShareOpinionsSection[];
            } | null;
        } | null;
        sEOOptions: SEOOptions | null;
    } | null;
}

export interface ShareOpinionsPageData {
    pageTitle: string | null;
    pageDescription: string | null;
    formId: string | null;
    infoSection: InfoSection | null;
    sEOOptions: SEOOptions | null;
}

// ── Server-side fetch ─────────────────────────────────────────────

export async function fetchShareOpinionsPageData(): Promise<ShareOpinionsPageData | null> {
    try {
        const result = await client.query<ShareOpinionsPageDataType>({
            query: GET_SHARE_OPINIONS_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Share opinions page query error:", result.error);
            return null;
        }

        const page = result.data?.pageBy;
        if (!page) return null;

        const sections =
            page.template?.shareOpinionsPageBuilder?.shareOpinionsPageBuilder ?? [];

        const formSection = sections.find(
            (s) => 'formId' in s
        ) as OpinionFormSection | undefined;

        const infoSection = sections.find(
            (s) => 'sectionTitle' in s
        ) as InfoSection | undefined;

        return {
            pageTitle: page.pageOptions?.pageTitle ?? null,
            pageDescription: page.pageOptions?.pageDescription ?? null,
            formId: formSection?.formId ?? null,
            infoSection: infoSection ?? null,
            sEOOptions: page.sEOOptions ?? null,
        };
    } catch (error) {
        console.error("Error fetching share opinions page data:", error);
        return null;
    }
}
