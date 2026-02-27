import { gql } from "@apollo/client";

/**
 * Get category information along with posts
 */
export const GET_POSTS_BY_CATEGORY_SLUG = gql`
  query GetPostsByCategorySlug($id: ID!, $first: Int = 12, $after: String) {
    category(id: $id, idType: SLUG) {
      name
      slug
      description
      count
      seo {
        title
        metaDesc
        canonical
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
