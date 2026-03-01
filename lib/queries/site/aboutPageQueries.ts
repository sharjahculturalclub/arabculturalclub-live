import { gql } from "@apollo/client";

export const GET_ABOUT_PAGE = gql`
    query AboutPageQuery {
        pageBy(pageId: 40) {
            pageOptions {
                pageTitle
                pageDescription
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
            template {
                ... on Template_AboutPage {
                    templateName
                    aboutPageBuilder {
                        aboutPageBuilder {
                            ... on AboutPageBuilderAboutPageBuilderHeroSectionLayout {
                                fieldGroupName
                                image {
                                    node {
                                        altText
                                        sourceUrl
                                    }
                                }
                                preTitle
                                title
                                description
                                signatureTitle
                                signatureSubtitle
                            }
                            ... on AboutPageBuilderAboutPageBuilderVisionMessageSectionLayout {
                                fieldGroupName
                                cards {
                                    fieldGroupName
                                    icon
                                    title
                                    description
                                }
                            }
                            ... on AboutPageBuilderAboutPageBuilderCoreValuesSectionLayout {
                                fieldGroupName
                                sectionTitle
                                values {
                                    icon
                                    title
                                    description
                                    fieldGroupName
                                }
                            }
                            ... on AboutPageBuilderAboutPageBuilderBoardOfDirectorsSectionLayout {
                                fieldGroupName
                                sectionTitle
                                sectionSubtitle
                                directors {
                                    image {
                                        node {
                                            altText
                                            sourceUrl
                                        }
                                    }
                                    name
                                    role
                                }
                            }
                            ... on AboutPageBuilderAboutPageBuilderClubHistorySectionLayout {
                                fieldGroupName
                                sectionTitle
                                sectionSubtitle
                                historyItems {
                                    year
                                    title
                                    image {
                                        node {
                                            altText
                                            sourceUrl
                                        }
                                    }
                                    description
                                    fieldGroupName
                                }
                                footerText
                            }
                        }
                    }
                }
            }
        }
    }
`;
