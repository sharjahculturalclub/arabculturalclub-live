import { gql } from "@apollo/client";

/**
 * Service Fees page query — fetches page options + SEO
 * Page ID 1016 = WordPress Service Fees page
 */
export const GET_SERVICE_FEES_PAGE = gql`
    query ServicePageQuery {
        pageBy(pageId: 1016) {
            pageOptions {
                pageTitle
                pageDescription
            }
            seoOptions {
                seoTitle
                metaDescription
                focusKeyword
                canonicalUrl
            }
            featuredImage {
                node {
                    altText
                    sourceUrl
                }
            }
        }
    }
`;

/**
 * Service Fees table data query
 */
export const GET_SERVICE_FEES_TABLE_DATA = gql`
    query serviceFeesTableQuery {
        serviceFeesTableData {
            heading
            subHeading
            description
            table {
                header
                body
            }
        }
    }
`;
