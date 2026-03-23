import { gql } from "@apollo/client";

/**
 * Lecture Hall Booking page query
 */
export const GET_LECTURE_HALL_BOOKING_PAGE = gql`
    query LectureHallBookingPageQuery {
  pageBy(pageId: 473) {
    pageOptions {
      pageTitle
      pageDescription
    }
    template {
      templateName
      ... on Template_LectureHallBookingPage {
        templateName
        lectureHallBookingPageBuilder {
          lecturehallBookingPageBuilder {
            ... on LectureHallBookingPageBuilderLecturehallBookingPageBuilderLectureHallBookingFormSectionLayout {
              formId
            }
            ... on LectureHallBookingPageBuilderLecturehallBookingPageBuilderInfoSectionLayout {
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
