import client from "@/lib/client/ApolloClient";
import { GET_CONTACT_PAGE } from "@/lib/queries/site/contactPageQueries";
import { SEOOptions } from "@/lib/actions/site/homePageAction";

// ── Type definitions ──────────────────────────────────────────────

export interface ContactInfoCard {
    title: string | null;
    details: string | null;
    iconName: string | null;
}

export interface ContactFormAndInfoSection {
    fieldGroupName: "ContactPageBuilderContactPageBuilderContactFormAndInfoLayout";
    contactFormId: string | null;
    contactInfoCards: ContactInfoCard[] | null;
}

export interface MapSection {
    fieldGroupName: "ContactPageBuilderContactPageBuilderMapSectionLayout";
    sectionTitle: string | null;
    sectionDescription: string | null;
    mapEmbedCode: string | null;
}

export type ContactPageSection = ContactFormAndInfoSection | MapSection;

export interface ContactPageDataType {
    pageBy: {
        template: {
            templateName: string;
            contactPageBuilder: {
                contactPageBuilder: ContactPageSection[];
            };
        } | null;
        sEOOptions: SEOOptions | null;
    } | null;
}

// ── Helper to find a section by type ──────────────────────────────

export function findContactSection<T extends ContactPageSection>(
    sections: ContactPageSection[],
    fieldGroupName: T["fieldGroupName"]
): T | undefined {
    return sections.find(
        (s) => s.fieldGroupName === fieldGroupName
    ) as T | undefined;
}

// ── Server-side fetch ─────────────────────────────────────────────

/**
 * Fetch contact page ACF sections in a single query.
 * Called from server components only.
 */
export async function fetchContactPageData(): Promise<{
    sections: ContactPageSection[];
    sEOOptions?: SEOOptions | null;
} | null> {
    try {
        const result = await client.query<ContactPageDataType>({
            query: GET_CONTACT_PAGE,
            fetchPolicy: "network-only",
        });

        if (result.error) {
            console.error("Contact page query error:", result.error);
            return null;
        }

        const sections =
            result.data?.pageBy?.template?.contactPageBuilder?.contactPageBuilder ?? [];
        const sEOOptions = result.data?.pageBy?.sEOOptions;

        return { sections, sEOOptions };
    } catch (error) {
        console.error("Error fetching contact page data:", error);
        return null;
    }
}
