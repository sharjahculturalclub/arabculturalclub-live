import { cache } from 'react';
import client from "@/lib/client/ApolloClient";
import { GET_LOGO } from "@/lib/queries/site/logoQueries";

export interface SiteInfo {
    siteUrl: string;
    siteName: string;
    siteDescription: string;
}

export interface LogoDataType {
    siteInfo: SiteInfo;
    siteLogoUrl: string;
}

/**
 * Fetch logo and site info from WordPress via GraphQL
 * 
 * Called from server components only.
 * Follows PROJECT_CHECKLIST:
 * - §4: Separate fetch logic from components
 * - §4: Single centralized Apollo instance
 */
export const fetchLogoData = cache(async (): Promise<LogoDataType | null> => {
    try {
        const result = await client.query<LogoDataType>({
            query: GET_LOGO,
            fetchPolicy: 'network-only',
        });

        if (result.error) {
            console.error("Logo query error:", result.error);
            return null;
        }

        return result.data || null;
    } catch (error) {
        console.error("Error fetching logo data:", error);
        return null;
    }
});
