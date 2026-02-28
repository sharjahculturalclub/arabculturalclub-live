import client from "@/lib/client/ApolloClient";
import { GET_MEMBERSHIP_BENEFITS_PAGE } from "@/lib/queries/site/membershipBenefitsPageQueries";

export interface BenefitItem {
    title: string | null;
    description: string | null;
    icon: string | null;
}

export interface BenefitsSection {
    fieldGroupName: "MembershipPageBuilderMembershipPageBuilderBenefitsSectionLayout";
    sectionTitle: string | null;
    sectionSubtitle: string | null;
    benefits: BenefitItem[] | null;
}

export interface CtaSection {
    fieldGroupName: "MembershipPageBuilderMembershipPageBuilderCtaSectionLayout";
    ctaTitle: string | null;
    ctaDescription: string | null;
    primaryButtonText: string | null;
    primaryButtonLink: string | null;
    secondaryButtonText: string | null;
    secondaryButtonLink: string | null;
}

export type MembershipPageSection = BenefitsSection | CtaSection;

export interface MembershipPageData {
    pageOptions?: {
        pageTitle?: string | null;
        pageDescription?: string | null;
    };
    sections: MembershipPageSection[];
}

export async function fetchMembershipBenefitsPageData(): Promise<MembershipPageData | null> {
    try {
        const result = await client.query<{ pageBy: any }>({
            query: GET_MEMBERSHIP_BENEFITS_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Membership page query error:", result.error);
            return null;
        }

        const pageBy = result.data?.pageBy;
        const pageOptions = pageBy?.pageOptions;
        const sections = pageBy?.template?.membershipPageBuilder?.membershipPageBuilder || [];

        return { pageOptions, sections };
    } catch (error) {
        console.error("Error fetching membership benefits page data:", error);
        return null;
    }
}
