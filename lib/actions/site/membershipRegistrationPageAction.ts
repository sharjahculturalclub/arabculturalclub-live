import client from "@/lib/client/ApolloClient";
import { GET_MEMBERSHIP_REGISTRATION_PAGE } from "@/lib/queries/site/membershipRegistrationPageQueries";
import { SEOOptions } from "@/lib/actions/site/homePageAction";

// ── Type definitions ──────────────────────────────────────────────

export interface MembershipRegistrationPageDataType {
    pageBy: {
        pageOptions: {
            pageTitle: string | null;
            pageDescription: string | null;
        } | null;
        template: {
            templateName: string;
            membershipRegisteration: {
                formId: string | null;
            } | null;
        } | null;
        sEOOptions: SEOOptions | null;
    } | null;
}

export interface MembershipRegistrationPageData {
    pageTitle: string | null;
    pageDescription: string | null;
    formId: string | null;
    sEOOptions: SEOOptions | null;
}

// ── Server-side fetch ─────────────────────────────────────────────

/**
 * Fetch membership registration page data in a single query.
 * Called from server components only.
 */
export async function fetchMembershipRegistrationPageData(): Promise<MembershipRegistrationPageData | null> {
    try {
        const result = await client.query<MembershipRegistrationPageDataType>({
            query: GET_MEMBERSHIP_REGISTRATION_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Membership registration page query error:", result.error);
            return null;
        }

        const page = result.data?.pageBy;
        if (!page) return null;

        return {
            pageTitle: page.pageOptions?.pageTitle ?? null,
            pageDescription: page.pageOptions?.pageDescription ?? null,
            formId: page.template?.membershipRegisteration?.formId ?? null,
            sEOOptions: page.sEOOptions ?? null,
        };
    } catch (error) {
        console.error("Error fetching membership registration page data:", error);
        return null;
    }
}
