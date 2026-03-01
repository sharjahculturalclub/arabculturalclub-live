import { gql } from "@apollo/client";

/**
 * Share opinions page query — fetches page options + flexible content
 * Page ID 60 = WordPress share opinions page
 */
export const GET_SHARE_OPINIONS_PAGE = gql`
    query ShareOpinionsPageQuery {
        pageBy(pageId: 60) {
            pageOptions {
                pageTitle
                pageDescription
            }
            template {
                ... on Template_ShareOpinionsPage {
                    templateName
                    shareOpinionsPageBuilder {
                        shareOpinionsPageBuilder {
                            ... on ShareOpinionsPageBuilderShareOpinionsPageBuilderOpinionFormSectionLayout {
                                formId
                            }
                            ... on ShareOpinionsPageBuilderShareOpinionsPageBuilderInfoSectionLayout {
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
