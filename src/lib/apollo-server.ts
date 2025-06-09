import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { registerApolloClient } from '@apollo/client-integration-nextjs';

// Create server-side Apollo Client (for SSR)
function createServerApolloClient() {
  // For server-side, we only need the HTTP link to fetch from external API
  const httpLink = new HttpLink({
    uri: 'https://countries.trevorblades.com/graphql',
    // Ensure fetch is available in server environment
    fetch: fetch,
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
    // Disable caching for server-side to ensure fresh data
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });
}

// Register the server-side Apollo Client
export const { getClient: getServerApolloClient } = registerApolloClient(
  createServerApolloClient,
);
