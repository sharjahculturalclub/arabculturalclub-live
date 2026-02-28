import { gql } from "@apollo/client";

/**
 * Fetch paginated posts for the News listing page.
 * Supports optional category filtering via $categoryName.
 * Returns posts sorted by date (newest first).
 */
export const GET_NEWS_POSTS = gql`
  query GetNewsPosts($first: Int = 12, $after: String, $categoryName: String) {
    posts(
      first: $first
      after: $after
      where: {
        categoryName: $categoryName
        orderby: [{ field: DATE, order: DESC }]
      }
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        title
        date
        excerpt
        categories {
          nodes {
            name
            slug
          }
        }
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

/**
 * Fetch page title & description from WordPress ACF pageOptions
 * for the News (المركز الإعلامي) page.
 */
export const GET_NEWS_PAGE_OPTIONS = gql`
  query GetNewsPageOptions($uri: String!) {
    pageBy(uri: $uri) {
      pageOptions {
        pageDescription
        pageTitle
      }
    }
  }
`;

/**
 * Fetch all non-empty categories for the news filter.
 */
export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories(where: { hideEmpty: true }, first: 50) {
      nodes {
        databaseId
        name
        slug
        count
      }
    }
  }
`;
