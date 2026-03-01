import { gql } from "@apollo/client";

/**
 * FAQ page query — fetches page options + flexible content
 * Page ID 395 = WordPress FAQ page
 */
export const GET_FAQ_PAGE = gql`
    query FaqPageQuery {
        pageBy(pageId: 395) {
            pageOptions {
                pageTitle
                pageDescription
            }
            template {
                ... on Template_FAQPage {
                    templateName
                    faqPageBuilder {
                        faqPageBuilder {
                            ... on FaqPageBuilderFaqPageBuilderFaqCategoriesSectionLayout {
                                fieldGroupName
                                faqCategories {
                                    categoryTitle
                                    faqItems {
                                        question
                                        answer
                                    }
                                }
                            }
                            ... on FaqPageBuilderFaqPageBuilderCtaSectionLayout {
                                ctaTitle
                                ctaDescription
                                buttonText
                                buttonUrl
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
