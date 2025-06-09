// GraphQL Error types to replace 'any' usage

export interface GraphQLError {
  message: string;
  locations?: Array<{
    line: number;
    column: number;
  }>;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: GraphQLError[];
}

export interface GraphQLRequestError extends Error {
  response?: {
    status?: number;
    headers?: Record<string, string>;
    data?: GraphQLResponse;
  };
  request?: {
    query: string;
    variables?: Record<string, unknown>;
  };
}

// Union type for all possible error types in our GraphQL operations
export type GraphQLOperationError =
  | GraphQLRequestError
  | Error
  | string
  | null
  | undefined;

// Type guard to check if error is a GraphQL request error
export function isGraphQLRequestError(
  error: unknown,
): error is GraphQLRequestError {
  return (
    error instanceof Error &&
    'response' in error &&
    typeof (error as GraphQLRequestError).response === 'object'
  );
}

// Type guard to check if error has a message property
export function hasErrorMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}
