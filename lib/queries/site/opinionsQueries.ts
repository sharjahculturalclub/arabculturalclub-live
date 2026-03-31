import { gql } from "@apollo/client";

export const GET_OPINION_POSTS = gql`
  query GetOpinionPosts($first: Int = 8, $after: String) {
    openions(first: $first, after: $after) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        databaseId
        title
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

export const GET_OPINION_PAGE_OPTIONS = gql`
  query GetOpinionPageOptions {
    pageBy(pageId: 851) {
      title
      pageOptions {
        pageDescription
        pageTitle
      }
      seoOptions {
        seoTitle
        metaDescription
        focusKeyword
        canonicalUrl
      }
    }
  }
`;

export const GET_OPINION_BY_ID = gql`
  query GetOpinionById($id: Int!) {
    opinionBy(opinionId: $id) {
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
      featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      seoOptions {
        seoTitle
        metaDescription
        focusKeyword
        canonicalUrl
      }
    }
  }
`;
