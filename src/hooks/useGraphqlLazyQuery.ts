import { useState, useCallback } from 'react';
import graphqlRequest from '@/lib/graphql/graphqlRequest';
import { print } from 'graphql';
import type { DocumentNode } from 'graphql';
import type { GraphQLOperationError } from '@/types/errors';
import { hasErrorMessage, isGraphQLRequestError } from '@/types/errors';

// Check if error is rate limiting
function isRateLimitError(error: unknown): boolean {
  if (isGraphQLRequestError(error)) {
    return error.response?.status === 429;
  }

  if (hasErrorMessage(error)) {
    return (
      error.message.includes('429') ||
      error.message.includes('Too Many Requests')
    );
  }

  return false;
}

interface LazyQueryResult<T> {
  loading: boolean;
  error: GraphQLOperationError;
  data: T | undefined;
}

interface LazyQueryOptions {
  errorPolicy?: 'all' | 'none';
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

interface LazyQueryExecuteOptions {
  variables?: Record<string, unknown>;
  errorPolicy?: 'all' | 'none';
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

type LazyQueryTuple<T> = [
  (_options?: LazyQueryExecuteOptions) => Promise<void>,
  LazyQueryResult<T>,
];

/**
 * Custom hook that provides Apollo-like lazy query interface using company's single GraphQL requests
 * Perfect for on-demand data fetching (like country details on card flip)
 *
 * @param query - GraphQL DocumentNode
 * @param options - Default options for the query
 * @returns Tuple with [executeQuery function, result object]
 */
export function useGraphqlLazyQuery<T>(
  query: DocumentNode,
  _options: LazyQueryOptions = {},
): LazyQueryTuple<T> {
  const { errorPolicy = 'all', next } = _options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GraphQLOperationError>(null);
  const [data, setData] = useState<T | undefined>(undefined);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const executeQuery = useCallback(
    async (executeOptions: LazyQueryExecuteOptions = {}) => {
      if (isRateLimited) {
        return; // Silently skip when rate limited
      }

      const {
        variables,
        errorPolicy: execErrorPolicy = errorPolicy,
        next: execNext = next,
      } = executeOptions;

      setLoading(true);
      setError(null);

      try {
        const result = await graphqlRequest<T>(
          print(query),
          variables,
          execNext ? { next: execNext } : undefined,
        );
        setData(result);
        // Rate limiting cleared automatically on success
        setIsRateLimited(false); // Reset on success
      } catch (err) {
        console.error('GraphQL lazy query failed:', err);

        // Check if this is a rate limit error
        if (isRateLimitError(err)) {
          setIsRateLimited(true); // Prevent future requests
        }

        if (execErrorPolicy === 'all') {
          setError(err as GraphQLOperationError);
        }
      } finally {
        setLoading(false);
      }
    },
    [query, errorPolicy, next, isRateLimited],
  );

  return [
    executeQuery,
    {
      loading,
      error,
      data,
    },
  ];
}
