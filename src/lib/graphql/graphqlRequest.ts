import { GraphQLClient } from 'graphql-request';

// Next.js fetch options type
type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

// Create a single instance of the GraphQL client as per company policy
const client = new GraphQLClient('https://countries.trevorblades.com/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Single GraphQL request function with Next.js fetch options support
 * Use this for:
 * - Slow queries
 * - Mutations
 * - When you need Next.js fetch options (caching, revalidation, etc.)
 */
export default async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  fetchOptions?: {
    headers?: Record<string, string>;
    next?: NextFetchRequestConfig;
    silent?: boolean; // Don't log errors if true
  },
): Promise<T> {
  try {
    // If Next.js fetch options are provided, use native fetch with those options
    if (fetchOptions?.next) {
      const response = await fetch(
        'https://countries.trevorblades.com/graphql',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
          ...fetchOptions,
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.errors) {
        throw new Error(
          result.errors.map((e: { message: string }) => e.message).join(', '),
        );
      }

      return result.data;
    }

    // Otherwise, use graphql-request client for simpler requests
    return await client.request<T>(query, variables);
  } catch (error) {
    if (!fetchOptions?.silent) {
      console.error('GraphQL request failed:', error);
    }
    throw error;
  }
}
