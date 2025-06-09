import { gql } from '@apollo/client';

// Basic countries data for homepage list
export const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      code
      name
      emoji
      capital
      currency
      continent {
        name
      }
    }
  }
`;

// Additional country details for card flip
export const GET_COUNTRY_DETAILS = gql`
  query GetCountryDetails($code: ID!) {
    country(code: $code) {
      code
      languages {
        name
        code
      }
      phone
      states {
        name
        code
      }
    }
  }
`;

// Continents for filter dropdown
export const GET_CONTINENTS = gql`
  query GetContinents {
    continents {
      code
      name
      countries {
        code
        name
      }
    }
  }
`;
