import { gql } from "@apollo/client";

export const GET_OUR_PROGRAMS_PAGE = gql`
query OurProgramPageQuery {
  pageBy(pageId: 46) {
    pageOptions {
      pageTitle
      pageDescription
    }
    template {
      ... on Template_OurProgramPage {
        templateName
        ourProgramsPageBuilder {
          fieldGroupName
          ourProgramsPageBuilder {
            fieldGroupName
            ... on OurProgramsPageBuilderOurProgramsPageBuilderMainAreasSectionLayout {
              fieldGroupName
              sectionTitle
              sectionSubtitle
              programs {
                title
                subtitle
                icon
                description
                features {
                  featureText
                }
              }
            }
          }
        }
      }
    }
  }
}
`;
