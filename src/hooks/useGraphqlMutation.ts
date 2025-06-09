import { useState, useCallback } from 'react';
import graphqlRequest from '@/lib/graphql/graphqlRequest';
import { print } from 'graphql';
import type { DocumentNode } from 'graphql';

import type { GraphQLOperationError } from '@/types/errors';

interface MutationResult<T> {
  loading: boolean;
  error: GraphQLOperationError;
  data: T | undefined;
}

interface MutationOptions {
  errorPolicy?: 'all' | 'none';
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

interface MutationExecuteOptions {
  variables?: Record<string, unknown>;
  errorPolicy?: 'all' | 'none';
  next?: {
    revalidate?: number;
    tags?: string[];
  };
}

type MutationTuple<T> = [
  (_options?: MutationExecuteOptions) => Promise<T | undefined>,
  MutationResult<T>,
];

/**
 * Custom hook that provides Apollo-like mutation interface using company's single GraphQL requests
 * Perfect for tracking mutations and other one-off operations
 *
 * @param mutation - GraphQL DocumentNode
 * @param options - Default options for the mutation
 * @returns Tuple with [executeMutation function, result object]
 */
export function useGraphqlMutation<T>(
  mutation: DocumentNode,
  _options: MutationOptions = {},
): MutationTuple<T> {
  const { errorPolicy = 'all', next } = _options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<GraphQLOperationError>(null);
  const [data, setData] = useState<T | undefined>(undefined);

  const executeMutation = useCallback(
    async (executeOptions: MutationExecuteOptions = {}) => {
      const {
        variables,
        errorPolicy: execErrorPolicy = errorPolicy,
        next: execNext = next,
      } = executeOptions;

      setLoading(true);
      setError(null);

      try {
        const result = await graphqlRequest<T>(print(mutation), variables, {
          ...(execNext ? { next: execNext } : {}),
          silent: execErrorPolicy === 'none',
        });
        setData(result);
        return result;
      } catch (err) {
        if (execErrorPolicy === 'all') {
          console.error('GraphQL mutation failed:', err);
          setError(err as GraphQLOperationError);
        } else {
          // TODO: Implement tracking
          // For 'none' error policy, show a friendly tracking message instead of the error
          if (variables?.countryCode && variables?.action) {
            console.warn(
              `Tracking country view: ${variables.countryCode}, action: ${variables.action}`,
            );
          }
        }
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [mutation, errorPolicy, next],
  );

  return [
    executeMutation,
    {
      loading,
      error,
      data,
    },
  ];
}
