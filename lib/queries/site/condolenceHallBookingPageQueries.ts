import { gql } from "@apollo/client";

/**
 * Condolence Hall Booking page query
 */
export const GET_CONDOLENCE_HALL_BOOKING_PAGE = gql`
    query condolenceHallBookingPageQuery {
        pageBy(pageId: 480) {
            pageOptions {
                pageTitle
                pageDescription
            }
            template {
                ... on Template_CondolenceHallBookingPage {
                    templateName
                    condolenceHallBookingPageBuilder {
                        lecturehallBookingPageBuilder {
                            ... on CondolenceHallBookingPageBuilderLecturehallBookingPageBuilderCondolenceHallBookingFormSectionLayout {
                                fieldGroupName
                                formId
                            }
                            ... on CondolenceHallBookingPageBuilderLecturehallBookingPageBuilderInfoSectionLayout {
                                fieldGroupName
                                sectionTitle
                                infoPoints {
                                    pointText
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
