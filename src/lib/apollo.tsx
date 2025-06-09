'use client';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  HttpLink,
} from '@apollo/client';
import { useMemo } from 'react';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

// Define a simple schema extension for our mutations
const typeDefs = `
  type TrackingResponse {
    success: Boolean!
    message: String
  }
  
  # Need a Query type to make the schema valid
  type Query {
    _dummy: String
  }
  
  type Mutation {
    trackCountryView(countryCode: String!, action: String!): TrackingResponse
  }
`;

// Define mock resolvers
const resolvers = {
  Query: {
    _dummy: () => 'dummy',
  },
  Mutation: {
    trackCountryView: (
      _: any,
      { countryCode, action }: { countryCode: string; action: string },
    ) => {
      // TODO: Implement tracking
      console.warn(`Tracking country view: ${countryCode}, action: ${action}`);
      return {
        success: true,
        message: `Successfully tracked ${action} for ${countryCode}`,
      };
    },
  },
};

// Create the executable schema
const schema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers,
});

// Create client-side Apollo Client
export function createClientApolloClient() {
  // HTTP link for the external GraphQL API
  const httpLink = new HttpLink({
    uri: 'https://countries.trevorblades.com/graphql',
  });

  // Schema link for local mutations
  const schemaLink = new SchemaLink({ schema });

  // Split links based on operation
  const splitLink = split(
    // Split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'mutation' &&
        definition.name?.value === 'TrackCountryView' // Only handle our specific mutation
      );
    },
    schemaLink, // If it's our specific mutation, use our local schema
    httpLink, // Otherwise, use the remote API
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
}

// Client component for Apollo Provider
export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => createClientApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
