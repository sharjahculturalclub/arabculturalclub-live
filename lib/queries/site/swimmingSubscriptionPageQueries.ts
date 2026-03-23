import { gql } from "@apollo/client";

/**
 * Swimming Subscription page query
 */
export const GET_SWIMMING_SUBSCRIPTION_PAGE = gql`
    query SwimmingSubscriptionPageQuery {
    pageBy(pageId: 444) {
        pageOptions {
        pageTitle
        pageDescription
        }
        template {
        templateName
        ... on Template_SwimmingActivitySubscriptionPage {
            templateName
            swimmingSubscriptionPageBuilder {
            swimmingSubscriptionPageBuilder {
                ... on SwimmingSubscriptionPageBuilderSwimmingSubscriptionPageBuilderSwimmingSubscriptionFormSectionLayout {
                formId
                }
                ... on SwimmingSubscriptionPageBuilderSwimmingSubscriptionPageBuilderInfoSectionLayout {
                sectionTitle
                infoPoints {
                    pointText
                }
                }
            }
            }
        }
        }
        seoOptions {
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
