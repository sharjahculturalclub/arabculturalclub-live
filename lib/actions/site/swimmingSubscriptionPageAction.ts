import client from "@/lib/client/ApolloClient";
import { GET_SWIMMING_SUBSCRIPTION_PAGE } from "@/lib/queries/site/swimmingSubscriptionPageQueries";
import { SEOOptions } from "@/lib/actions/site/homePageAction";

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

export interface SwimmingSubscriptionPageData {
    pageTitle: string | null;
    pageDescription: string | null;
    formId: string | null;
    infoSection: InfoSection | null;
    seoOptions: SEOOptions | null;
}

export async function fetchSwimmingSubscriptionPageData(): Promise<SwimmingSubscriptionPageData | null> {
    try {
        const result = await client.query<{
            pageBy: {
                pageOptions: {
                    pageTitle: string | null;
                    pageDescription: string | null;
                } | null;
                template: {
                    swimmingSubscriptionPageBuilder: {
                        swimmingSubscriptionPageBuilder: any[];
                    } | null;
                } | null;
                seoOptions: SEOOptions | null;
            } | null;
        }>({
            query: GET_SWIMMING_SUBSCRIPTION_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Swimming Subscription page query error:", result.error);
            return null;
        }

        const page = result.data?.pageBy;
        if (!page) return null;

        const sections =
            page.template?.swimmingSubscriptionPageBuilder?.swimmingSubscriptionPageBuilder ?? [];

        const formSection = sections.find(
            (s: any) => 'formId' in s
        ) as OpinionFormSection | undefined;

        const infoSection = sections.find(
            (s: any) => 'sectionTitle' in s
        ) as InfoSection | undefined;

        return {
            pageTitle: page.pageOptions?.pageTitle ?? null,
            pageDescription: page.pageOptions?.pageDescription ?? null,
            formId: formSection?.formId ?? null,
            infoSection: infoSection ?? null,
            seoOptions: page.seoOptions ?? null,
        };
    } catch (error) {
        console.error("Error fetching swimming subscription page data:", error);
        return null;
    }
}
