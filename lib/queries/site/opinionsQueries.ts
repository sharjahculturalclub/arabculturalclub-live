import { gql } from "@apollo/client";

export const GET_OPINION_POSTS = gql`
  query GetOpinionPosts($first: Int = 9, $after: String) {
    opinions(first: $first, after: $after) {
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
        opinioncategories {
          nodes {
            databaseId
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_OPINION_POSTS_BY_CATEGORY = gql`
  query GetOpinionPostsByCategory($first: Int = 9, $after: String, $categorySlug: String!) {
    opinions(
      first: $first
      after: $after
      where: {
        taxQuery: {
          taxArray: [{ taxonomy: OPINIONCATEGORY, terms: [$categorySlug], field: SLUG }]
        }
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
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        opinioncategories {
          nodes {
            databaseId
            name
            slug
          }
        }
      }
    }
  }
`;

export const GET_ALL_OPINION_CATEGORIES = gql`
  query GetAllOpinionCategories {
    opinioncategories(where: { hideEmpty: true }, first: 50) {
      nodes {
        databaseId
        name
        slug
      }
    }
  }
`;

export const GET_OPINION_CATEGORY_WITH_POSTS = gql`
  query GetOpinionCategoryWithPosts($slug: ID!, $first: Int = 9, $after: String) {
    opinioncategory(id: $slug, idType: SLUG) {
      databaseId
      name
      slug
      description
      seoOptions {
        seoTitle
        metaDescription
        focusKeyword
        canonicalUrl
      }
      opinions(first: $first, after: $after) {
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
          opinioncategories {
            nodes {
              databaseId
              name
              slug
            }
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
