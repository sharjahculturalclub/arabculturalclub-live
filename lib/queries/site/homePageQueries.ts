import { gql } from "@apollo/client";

/**
 * Homepage builder query — fetches ACF Flexible Content sections + latest posts
 * 
 * Single combined query to avoid multiple round-trips (PROJECT_CHECKLIST §8: batch GraphQL)
 * Page ID 38 = WordPress homepage
 */
export const GET_HOME_PAGE = gql`
  query HomePageQuery {
    pageBy(pageId: 38) {
      homePageBuilder {
        fieldGroupName
        homePageBuilder {
          ... on HomePageBuilderHomePageBuilderHeroSectionLayout {
            fieldGroupName
            heroImage {
              node {
                altText
                sourceUrl
              }
            }
            sectionBackgroundImage {
              node {
                altText
                sourceUrl
              }
            }
            heroImageTag
            heroImageTitle
            heroContentTag
            heroContentTitle
            heroContentDescription
            heroContentButtoon {
              target
              title
              url
            }
            heroVideoButtonLabel
            heroVideoLink
          }
          ... on HomePageBuilderHomePageBuilderMissionVisionSectionLayout {
            fieldGroupName
            heading
            description
            lists {
              fieldGroupName
              addList
            }
            button {
              title
              url
              target
            }
            imageMissionVision {
              node {
                altText
                sourceUrl
              }
            }
          }
          ... on HomePageBuilderHomePageBuilderEventsLayout {
            fieldGroupName
            sectionTitle
            viewAllButton {
              title
              url
              target
            }
            selectEvents {
              nodes {
                ... on Event {
                  eventId
                  title
                  featuredImage {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                  eventOptions {
                    eventDate
                    eventLocation
                  }
                  categories {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
          }
          ... on HomePageBuilderHomePageBuilderAboutSectionLayout {
            fieldGroupName
            heading
            description
            blocks {
              blockTitle
              blockDescription
            }
            sectionBackgroundImage {
              node {
                altText
                sourceUrl
              }
            }
          }
          ... on HomePageBuilderHomePageBuilderNewsSectionLayout {
            fieldGroupName
            sectionHeading
            viewAllButton {
              title
              url
              target
            }
          }
        }
      }
    }
    posts(first: 6, where: {orderby: [{field: DATE, order: DESC}]}) {
      nodes {
        postId
        title
        categories {
          nodes {
            name
            slug
          }
        }
        date
        excerpt
        featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      }
    }
  }
`;
