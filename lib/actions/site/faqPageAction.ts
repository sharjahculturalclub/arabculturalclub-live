import client from "@/lib/client/ApolloClient";
import { GET_FAQ_PAGE } from "@/lib/queries/site/faqPageQueries";
import { SEOOptions } from "@/lib/actions/site/homePageAction";

// ── Type definitions ──────────────────────────────────────────────

export interface FaqItem {
    question: string | null;
    answer: string | null;
}

export interface FaqCategory {
    categoryTitle: string | null;
    faqItems: FaqItem[] | null;
}

export interface FaqCategoriesSection {
    fieldGroupName: string;
    faqCategories: FaqCategory[] | null;
}

export interface CtaSection {
    ctaTitle: string | null;
    ctaDescription: string | null;
    buttonText: string | null;
    buttonUrl: string | null;
}

export type FaqPageSection = FaqCategoriesSection | CtaSection;

export interface FaqPageDataType {
    pageBy: {
        pageOptions: {
            pageTitle: string | null;
            pageDescription: string | null;
        } | null;
        template: {
            templateName: string;
            faqPageBuilder: {
                faqPageBuilder: FaqPageSection[];
            } | null;
        } | null;
        sEOOptions: SEOOptions | null;
    } | null;
}

export interface FaqPageData {
    pageTitle: string | null;
    pageDescription: string | null;
    faqCategories: FaqCategory[] | null;
    ctaSection: CtaSection | null;
    sEOOptions: SEOOptions | null;
}

// ── Server-side fetch ─────────────────────────────────────────────

export async function fetchFaqPageData(): Promise<FaqPageData | null> {
    try {
        const result = await client.query<FaqPageDataType>({
            query: GET_FAQ_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("FAQ page query error:", result.error);
            return null;
        }

        const page = result.data?.pageBy;
        if (!page) return null;

        const sections =
            page.template?.faqPageBuilder?.faqPageBuilder ?? [];

        // Extract FAQ categories section
        const categoriesSection = sections.find(
            (s) => 'faqCategories' in s
        ) as FaqCategoriesSection | undefined;

        // Extract CTA section
        const ctaSection = sections.find(
            (s) => 'ctaTitle' in s
        ) as CtaSection | undefined;

        return {
            pageTitle: page.pageOptions?.pageTitle ?? null,
            pageDescription: page.pageOptions?.pageDescription ?? null,
            faqCategories: categoriesSection?.faqCategories ?? null,
            ctaSection: ctaSection ?? null,
            sEOOptions: page.sEOOptions ?? null,
        };
    } catch (error) {
        console.error("Error fetching FAQ page data:", error);
        return null;
    }
}
