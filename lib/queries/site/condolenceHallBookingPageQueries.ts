import { gql } from "@apollo/client";

/**
 * Condolence Hall Booking page query
 */
export const GET_CONDOLENCE_HALL_BOOKING_PAGE = gql`
    query condolenceHallBookingPageQuery {
  pageBy(pageId: 480) {
    pageOptions {
      pageTitle
      pageDescription
    }
    template {
      templateName
      ... on Template_CondolenceHallBookingPage {
        templateName
        condolenceHallBookingPageBuilder {
          condolenceHallBookingPageBuilder {
            ... on CondolenceHallBookingPageBuilderCondolenceHallBookingPageBuilderCondolenceHallBookingFormSectionLayout {
              formId
            }
            ... on CondolenceHallBookingPageBuilderCondolenceHallBookingPageBuilderInfoSectionLayout {
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
