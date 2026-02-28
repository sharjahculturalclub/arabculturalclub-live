import { gql } from "@apollo/client";

export const GET_GALLERIES = gql`
  query GetGalleries {
    allGallery {
      nodes {
        databaseId
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
        title
        categories {
          nodes {
            name
          }
        }
        galleryOptions {
          gallery {
            nodes {
              altText
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

export const GET_GALLERY_PAGE_OPTIONS = gql`
  query GetGalleryPageOptions($uri: ID!) {
     page(id: $uri, idType: URI) {
      pageOptions {
        pageTitle
        pageDescription
      }
    }
  }
`;
