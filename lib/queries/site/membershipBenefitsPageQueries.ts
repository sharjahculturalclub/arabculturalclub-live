import { gql } from "@apollo/client";

export const GET_MEMBERSHIP_BENEFITS_PAGE = gql`
query MembershipBenefitsPageQuery {
  pageBy(pageId: 54) {
    pageOptions {
      pageTitle
      pageDescription
    }
    template {
      ... on Template_MembershipBenifitsPage {
        templateName
        membershipPageBuilder {
          fieldGroupName
          membershipPageBuilder {
            fieldGroupName
            ... on MembershipPageBuilderMembershipPageBuilderBenefitsSectionLayout {
              sectionTitle
              sectionSubtitle
              benefits {
                title
                description
                icon
              }
            }
            ... on MembershipPageBuilderMembershipPageBuilderCtaSectionLayout {
              ctaDescription
              ctaTitle
              primaryButtonText
              primaryButtonLink
              secondaryButtonText
              secondaryButtonLink
            }
          }
        }
      }
    }
  }
}
`;
