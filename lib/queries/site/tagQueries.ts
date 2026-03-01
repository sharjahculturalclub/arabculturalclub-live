import { gql } from "@apollo/client";

/**
 * Get tag information along with posts
 */
export const GET_POSTS_BY_TAG_SLUG = gql`
  query GetPostsByTagSlug($id: ID!, $first: Int = 12, $after: String) {
    tag(id: $id, idType: SLUG) {
      name
      slug
      description
      count
      sEOOptions {
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

      posts(first: $first, after: $after) {
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
  }
`;
