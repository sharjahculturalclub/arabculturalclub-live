import { gql } from "@apollo/client";

/**
 * Contact page builder query — fetches ACF Flexible Content sections
 * Page ID 52 = WordPress contact page
 */
export const GET_CONTACT_PAGE = gql`
    query ContactPageQuery {
        pageBy(pageId: 52) {
            pageOptions {
                pageTitle
                pageDescription
            }
            template {
                ... on Template_ContactPage {
                    templateName
                    contactPageBuilder {
                        contactPageBuilder {
                            ... on ContactPageBuilderContactPageBuilderContactFormAndInfoLayout {
                                fieldGroupName
                                contactFormId
                                contactInfoCards {
                                    title
                                    details
                                    iconName
                                }
                            }
                            ... on ContactPageBuilderContactPageBuilderMapSectionLayout {
                                fieldGroupName
                                sectionTitle
                                sectionDescription
                                mapEmbedCode
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
