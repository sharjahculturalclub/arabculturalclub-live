import { gql } from "@apollo/client";

/**
 * GraphQL query to fetch all posts for sitemap
 */
export const GET_ALL_POSTS_FOR_SITEMAP = gql`
  query GetAllPostsForSitemap($first: Int = 100, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
        modified
        date
        categories {
          nodes {
            slug
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch latest posts for news sitemap
 */
export const GET_LATEST_POSTS_FOR_NEWS_SITEMAP = gql`
  query GetLatestPostsForNewsSitemap($first: Int = 20) {
    posts(first: $first, where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }) {
      nodes {
        databaseId
        title
        slug
        date
        modified
        categories {
          nodes {
            name
            slug
          }
        }
      }
    }
  }
`;

/**
 * GraphQL query to fetch all pages for sitemap
 */
export const GET_ALL_PAGES_FOR_SITEMAP = gql`
  query GetAllPagesForSitemap($first: Int = 100, $after: String) {
    pages(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
        modified
        date
      }
    }
  }
`;

/**
 * GraphQL query to fetch all events for sitemap
 */
export const GET_ALL_EVENTS_FOR_SITEMAP = gql`
  query GetAllEventsForSitemap($first: Int = 100, $after: String) {
    events(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
        modified
        date
      }
    }
  }
`;

/**
 * GraphQL query to fetch all categories for sitemap
 */
export const GET_ALL_CATEGORIES_FOR_SITEMAP = gql`
  query GetAllCategoriesForSitemap($first: Int = 100, $after: String) {
    categories(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        count
      }
    }
  }
`;

/**
 * GraphQL query to fetch all tags for sitemap
 */
export const GET_ALL_TAGS_FOR_SITEMAP = gql`
  query GetAllTagsForSitemap($first: Int = 100, $after: String) {
    tags(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        count
      }
    }
  }
`;

/**
 * GraphQL query to fetch all authors for sitemap
 */
export const GET_ALL_AUTHORS_FOR_SITEMAP = gql`
  query GetAllAuthorsForSitemap($first: Int = 100, $after: String) {
    users(first: $first, after: $after, where: { hasPublishedPosts: POST }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        slug
      }
    }
  }
`;
