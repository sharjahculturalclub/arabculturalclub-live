import { gql } from "@apollo/client";

/**
 * Membership registration page query — fetches page options + form ID
 * Page ID 56 = WordPress membership registration page
 */
export const GET_MEMBERSHIP_REGISTRATION_PAGE = gql`
    query MembershipRegistrationPageQuery {
        pageBy(pageId: 56) {
            pageOptions {
                pageTitle
                pageDescription
            }
            template {
                ... on Template_MembershipRegistrationPage {
                    templateName
                    membershipRegisteration {
                        formId
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
