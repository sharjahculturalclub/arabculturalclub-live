import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents($first: Int = 12, $after: String) {
    events(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        eventId
        title
        content
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        eventOptions {
          eventDate
          eventLocation
          eventRegistrationBlockDescription
          eventRegistrationBlockHeading
          eventTime
          registerButtonLink
        }
        categories {
          nodes {
            name
          }
        }
      }
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    event(id: $id, idType: DATABASE_ID) {
      eventId
      title
      content
      featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      eventOptions {
        eventDate
        eventLocation
        eventRegistrationBlockDescription
        eventRegistrationBlockHeading
        eventTime
        registerButtonLink
      }
      categories {
        nodes {
          name
        }
      }
    }
  }
`;

export const GET_EVENTS_PAGE_OPTIONS = gql`
  query GetEventsPageOptions($uri: String!) {
    pageBy(uri: $uri) {
      pageOptions {
        pageDescription
        pageTitle
      }
    }
  }
`;
