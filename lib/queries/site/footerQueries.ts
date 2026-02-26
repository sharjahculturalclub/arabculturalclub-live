import { gql } from "@apollo/client";

export const GET_FOOTER_SETTINGS = gql`
  query FooterSettings {
    footerSettings {
      contactInfo {
        title
        address
        phone
        email
      }
      programs {
        title
        links {
          title
          url
          target
        }
      }
      joinUs {
        title
        links {
          title
          url
          target
        }
      }
      quickLinks {
        title
        links {
          title
          url
          target
        }
      }
      about {
        title
        description
      }
      socialLinks {
        iconName
        url
      }
      copyright {
        text
        links {
          title
          url
          target
        }
      }
    }
  }
`;
