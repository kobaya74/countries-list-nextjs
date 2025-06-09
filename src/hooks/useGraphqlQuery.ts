import { useState, useEffect, useCallback } from 'react';
import batchedGraphqlRequest from '@/lib/graphql/batchedGraphqlRequest';
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

interface QueryResult<T> {
  loading: boolean;
  error: GraphQLOperationError;
  data: T | undefined;
  refetch: () => Promise<void>;
}

interface QueryOptions {
  skip?: boolean;
  queue?: 'critical' | 'general';
  errorPolicy?: 'all' | 'none';
  initialError?: GraphQLOperationError; // SSR error to check for rate limiting
}

// Apollo-like query hook using company's batched GraphQL requests
export function useGraphqlQuery<T>(
  query: DocumentNode,
  variables?: Record<string, unknown>,
  options: QueryOptions = {},
): QueryResult<T> {
  const {
    skip = false,
    queue = 'general',
    errorPolicy = 'all',
    initialError,
  } = options;

  // Check if initial SSR error was rate limiting
  const [isRateLimited, setIsRateLimited] = useState(() => {
    if (initialError && isRateLimitError(initialError)) {
      console.error(
        '🚫 SSR rate limit detected - skipping client-side requests',
      );
      return true;
    }
    return false;
  });

  const [loading, setLoading] = useState(!skip && !isRateLimited);
  const [error, setError] = useState<GraphQLOperationError>(
    initialError || null,
  );
  const [data, setData] = useState<T | undefined>(undefined);

  const executeQuery = useCallback(async () => {
    if (skip) return;

    if (isRateLimited) {
      return; // Silently skip when rate limited
    }

    setLoading(true);
    setError(null);

    try {
      const result = await batchedGraphqlRequest<T>(
        print(query),
        variables,
        queue,
      );
      setData(result);
      // Rate limiting cleared automatically on success
      setIsRateLimited(false); // Reset on success
    } catch (err) {
      console.error('GraphQL query failed:', err);

      // Check if this is a rate limit error
      if (isRateLimitError(err)) {
        setIsRateLimited(true); // Prevent future requests
      }

      if (errorPolicy === 'all') {
        setError(err as GraphQLOperationError);
      }
    } finally {
      setLoading(false);
    }
  }, [skip, isRateLimited, query, variables, queue, errorPolicy]);

  const refetch = useCallback(async () => {
    await executeQuery();
  }, [executeQuery]);

  useEffect(() => {
    executeQuery();
  }, [executeQuery]);

  return {
    loading,
    error,
    data,
    refetch,
  };
}
