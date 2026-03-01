import { gql } from "@apollo/client";

/**
 * Facility booking page query — fetches page options + flexible content
 * Page ID 58 = WordPress facility booking page
 */
export const GET_FACILITY_BOOKING_PAGE = gql`
    query FacilityBookingPageQuery {
        pageBy(pageId: 58) {
            pageOptions {
                pageTitle
                pageDescription
            }
            template {
                ... on Template_FacilityBookingPage {
                    templateName
                    facilityBookingPageBuilder {
                        facilityBookingPageBuilder {
                            ... on FacilityBookingPageBuilderFacilityBookingPageBuilderBookingFormSectionLayout {
                                formId
                            }
                            ... on FacilityBookingPageBuilderFacilityBookingPageBuilderNotesSectionLayout {
                                sectionTitle
                                notes {
                                    noteText
                                }
                            }
                        }
                    }
                }
            }
            sEOOptions {
                seoTitle
                metaDescription
                focusKeyword
                canonicalUrl
                ogTitle
                ogDescription
                ogImage {
                    node {
                        altText
                        sourceUrl
                    }
                }
                twitterTitle
                twitterDescription
                twitterImage {
                    node {
                        altText
                        sourceUrl
                    }
                }
            }
        }
    }
`;
