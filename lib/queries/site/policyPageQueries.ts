import { gql } from "@apollo/client";

export const GET_POLICY_PAGE = gql`
query PolicyPageQuery($pageId: Int!) {
  pageBy(pageId: $pageId) {
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
      ... on Template_PolicyPage {
        templateName
        policyPageBuilder {
          policyPageBuilder {
            ... on PolicyPageBuilderPolicyPageBuilderPolicySectionsLayout {
              fieldGroupName
              policyCards {
                icon
                title
                content
              }
            }
            ... on PolicyPageBuilderPolicyPageBuilderInquiriesSectionLayout {
              fieldGroupName
              title
              subtitle
              phone
              email
              address
            }
          }
        }
      }
    }
  }
}
`;
