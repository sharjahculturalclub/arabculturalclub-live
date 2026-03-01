import { gql } from "@apollo/client";

/**
 * Authors list page query — fetches all users (authors)
 * Uses ACF fields: userProfileImage.profileImage + authorInfo
 */
export const GET_AUTHORS_LIST = gql`
    query AuthorsListQuery {
        users(first: 50) {
            nodes {
                id
                databaseId
                name
                slug
                description
                avatar {
                    url
                }
                userProfileImage {
                    authorInfo
                    profileImage {
                        node {
                            altText
                            sourceUrl
                        }
                    }
                    address
                    designation
                    memberOf
                    socialProfiles {
                        iconName
                        link
                    }
                }
                posts {
                    nodes {
                        id
                    }
                }
            }
        }
    }
`;

/**
 * Single author detail query — fetches author info + their posts
 * Uses ACF fields: userProfileImage.profileImage + authorInfo
 */
export const GET_AUTHOR_DETAIL = gql`
    query AuthorDetailQuery($id: ID!) {
        user(id: $id, idType: DATABASE_ID) {
            id
            databaseId
            name
            slug
            description
            avatar {
                url
            }
            userProfileImage {
                authorInfo
                profileImage {
                    node {
                        altText
                        sourceUrl
                    }
                }
                address
                designation
                memberOf
                socialProfiles {
                    iconName
                    link
                }
            }
            posts(first: 50, where: { status: PUBLISH }) {
                nodes {
                    id
                    databaseId
                    title
                    slug
                    date
                    excerpt
                    featuredImage {
                        node {
                            sourceUrl
                            altText
                        }
                    }
                    categories {
                        nodes {
                            name
                            slug
                        }
                    }
                }
            }
        }
    }
`;
