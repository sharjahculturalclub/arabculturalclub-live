import { gql } from "@apollo/client";

/**
 * Get single post by Database ID
 * Includes full content, SEO metadata, author, categories, tags, featured image
 */
export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      databaseId
      title
      content
      date
      modified
      author {
        node {
          databaseId
          name
          slug
          id
          userProfileImage {
            authorInfo
            profileImage {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
      }
      categories {
        nodes {
          databaseId
          name
          slug
        }
      }
      tags {
        nodes {
          databaseId
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
    }
  }
`;

/**
 * Get related posts by category IDs, excluding the current post
 * Returns up to 4 posts from the same categories
 */
export const GET_RELATED_POSTS = gql`
  query GetRelatedPosts($categoryIn: [ID!], $notIn: [ID!], $first: Int = 4) {
    posts(
      where: {
        categoryIn: $categoryIn
        notIn: $notIn
        orderby: [{ field: DATE, order: DESC }]
      }
      first: $first
    ) {
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
