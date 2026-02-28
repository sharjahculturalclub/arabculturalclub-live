import { gql } from "@apollo/client";

export const GET_JOIN_US_PAGE = gql`
query JoinUsPageQuery {
  pageBy(pageId: 50) {
    pageOptions {
      pageTitle
      pageDescription
    }
    template {
      ... on Template_JoinUsPage {
        templateName
        joinUsPageBuilder {
          joinUsPageBuilder {
            ... on JoinUsPageBuilderJoinUsPageBuilderCardsSectionLayout {
              fieldGroupName
              cards {
                title
                description
                icon
                bottomLabel
                linkLabel
                linkUrl
              }
            }
          }
        }
      }
    }
  }
}
`;
