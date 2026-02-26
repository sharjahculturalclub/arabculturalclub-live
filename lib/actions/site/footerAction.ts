import client from "@/lib/client/ApolloClient";
import { GET_FOOTER_SETTINGS } from "@/lib/queries/site/footerQueries";

export interface FooterLink {
    title: string;
    url: string;
    target: string;
}

export interface FooterLinkSection {
    title: string;
    links: FooterLink[];
}

export interface FooterContactInfo {
    title: string;
    address: string;
    phone: string;
    email: string;
}

export interface FooterAboutSection {
    title: string;
    description: string;
}

export interface FooterSocialLink {
    iconName: string;
    url: string;
}

export interface FooterCopyright {
    text: string;
    links: FooterLink[];
}

export interface FooterSettingsData {
    footerSettings: {
        contactInfo: FooterContactInfo;
        programs: FooterLinkSection;
        joinUs: FooterLinkSection;
        quickLinks: FooterLinkSection;
        about: FooterAboutSection;
        socialLinks: FooterSocialLink[];
        copyright: FooterCopyright;
    };
}

/**
 * Fetch footer settings from WordPress via GraphQL
 * 
 * Called from server components only.
 * Follows PROJECT_CHECKLIST:
 * - §4: Separate fetch logic from components
 * - §4: Single centralized Apollo instance
 */
export async function fetchFooterSettings(): Promise<FooterSettingsData['footerSettings'] | null> {
    try {
        const result = await client.query<FooterSettingsData>({
            query: GET_FOOTER_SETTINGS,
            fetchPolicy: 'network-only',
        });

        if (result.error) {
            console.error("Footer settings query error:", result.error);
            return null;
        }

        return result.data?.footerSettings || null;
    } catch (error) {
        console.error("Error fetching footer settings:", error);
        return null;
    }
}
