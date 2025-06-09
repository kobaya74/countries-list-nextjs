import { gql } from '@apollo/client';

export const TRACK_COUNTRY_VIEW = gql`
  mutation TrackCountryView($countryCode: String!, $action: String!) {
    trackCountryView(countryCode: $countryCode, action: $action) {
      success
      message
    }
  }
`;
