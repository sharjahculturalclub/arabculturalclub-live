import client from "@/lib/client/ApolloClient";
import { GET_POLICY_PAGE } from "@/lib/queries/site/policyPageQueries";

export interface PolicyCard {
    title: string | null;
    content: string | null;
    icon: string | null;
}

export interface PolicySectionsLayout {
    fieldGroupName: "PolicyPageBuilderPolicyPageBuilderPolicySectionsLayout";
    policyCards: PolicyCard[] | null;
}

export interface PolicyInquiriesSectionLayout {
    fieldGroupName: "PolicyPageBuilderPolicyPageBuilderInquiriesSectionLayout";
    title: string | null;
    subtitle: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
}

export type PolicyPageSection = PolicySectionsLayout | PolicyInquiriesSectionLayout;

export interface PolicyPageData {
    pageOptions?: {
        pageTitle?: string | null;
        pageDescription?: string | null;
    };
    seoOptions?: import("@/lib/types/seo").SEOOptions | null;
    sections: PolicyPageSection[];
}

export async function fetchPolicyPageData(pageId: number): Promise<PolicyPageData | null> {
    try {
        const result = await client.query<{ pageBy: any }>({
            query: GET_POLICY_PAGE,
            variables: { pageId },
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Policy page query error:", result.error);
            return null;
        }

        const pageBy = result.data?.pageBy;
        const pageOptions = pageBy?.pageOptions;
        const sections = pageBy?.template?.policyPageBuilder?.policyPageBuilder || [];
        const seoOptions = pageBy?.seoOptions;

        return { pageOptions, sections, seoOptions };
    } catch (error) {
        console.error("Error fetching policy page data:", error);
        return null;
    }
}
