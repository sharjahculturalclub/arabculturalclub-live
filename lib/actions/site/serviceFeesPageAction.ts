import { cache } from 'react';
import client from "@/lib/client/ApolloClient";
import { GET_SERVICE_FEES_PAGE, GET_SERVICE_FEES_TABLE_DATA } from "@/lib/queries/site/serviceFeesPageQueries";
import { SEOOptions } from "@/lib/actions/site/homePageAction";

export interface ServiceFeesTable {
    header: string[];
    body: string[][];
}

export interface ServiceFeesTableEntry {
    heading: string;
    subHeading: string;
    description: string;
    table: ServiceFeesTable;
}

export interface ServiceFeesPageData {
    pageOptions: {
        pageTitle: string | null;
        pageDescription: string | null;
    } | null;
    seoOptions: SEOOptions | null;
    featuredImage?: { node: { altText: string; sourceUrl: string } | null } | null;
    serviceFeesTableData: ServiceFeesTableEntry[];
}

export const fetchServiceFeesPageData = cache(async (): Promise<ServiceFeesPageData | null> => {
    try {
        // Fetch both queries in parallel
        const [pageResult, tableResult] = await Promise.all([
            client.query<{ pageBy: any }>({
                query: GET_SERVICE_FEES_PAGE,
                fetchPolicy: "network-only",
            }),
            client.query<{ serviceFeesTableData: ServiceFeesTableEntry[] }>({
                query: GET_SERVICE_FEES_TABLE_DATA,
                fetchPolicy: "network-only",
            })
        ]);

        const page = pageResult.data?.pageBy;
        const tableData = tableResult.data?.serviceFeesTableData ?? [];

        if (!page && tableData.length === 0) return null;

        return {
            pageOptions: page?.pageOptions ?? null,
            seoOptions: page?.seoOptions ?? null,
            featuredImage: page?.featuredImage ?? null,
            serviceFeesTableData: tableData,
        };
    } catch (error) {
        console.error("Error fetching Service Fees page data:", error);
        return null;
    }
});
