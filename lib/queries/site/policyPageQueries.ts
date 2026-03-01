import { gql } from "@apollo/client";

export const GET_POLICY_PAGE = gql`
query PolicyPageQuery($pageId: Int!) {
  pageBy(pageId: $pageId) {
    pageOptions {
      pageTitle
      pageDescription
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
