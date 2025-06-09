import { GraphQLClient } from 'graphql-request';

// Queue types as specified in company policy
type QueueType = 'critical' | 'general';

// Configuration (could be moved to config file)
const MAX_BATCH_SIZE = 10; // Limit concurrent requests
const CRITICAL_BATCH_DELAY = 10;
const GENERAL_BATCH_DELAY = 50;

// Request item structure
interface BatchedRequest<T = unknown> {
  query: string;
  variables?: Record<string, unknown>;
  resolve: (_value: T) => void;
  reject: (_reason: unknown) => void;
}

// Create a single instance of the GraphQL client
const client = new GraphQLClient('https://countries.trevorblades.com/graphql');

// Separate queues for critical and general requests
const criticalQueue: BatchedRequest<unknown>[] = [];
const generalQueue: BatchedRequest<unknown>[] = [];

// Batch processing flags
let criticalBatchScheduled = false;
let generalBatchScheduled = false;

/**
 * Process a batch of parallel requests (since API doesn't support true batching)
 */
async function processBatch(requests: BatchedRequest[]): Promise<void> {
  if (requests.length === 0) return;

  const requestCount = requests.length;

  try {
    // Send requests in parallel with individual error handling
    const promises = requests.map(async (request, index) => {
      try {
        const result = await client.request(request.query, request.variables);
        return { index, result, error: null };
      } catch (error) {
        return { index, result: null, error };
      }
    });

    const results = await Promise.allSettled(promises);

    // Validate we got results for all requests
    if (results.length !== requestCount) {
      throw new Error(
        `Invalid number of results received: expected ${requestCount}, got ${results.length}`,
      );
    }

    // Resolve/reject each request individually
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const { result: data, error } = result.value;
        if (error) {
          requests[index].reject(error);
        } else {
          requests[index].resolve(data);
        }
      } else {
        requests[index].reject(result.reason);
      }
    });
  } catch (error) {
    // If entire batch fails, reject all requests
    requests.forEach(request => request.reject(error));
  }
}

/**
 * Schedule batch processing using process.nextTick for better performance
 */
function scheduleProcessing(
  queue: BatchedRequest[],
  queueType: QueueType,
): void {
  const isScheduled =
    queueType === 'critical' ? criticalBatchScheduled : generalBatchScheduled;

  if (isScheduled || queue.length === 0) return;

  if (queueType === 'critical') {
    criticalBatchScheduled = true;
  } else {
    generalBatchScheduled = true;
  }

  const delay =
    queueType === 'critical' ? CRITICAL_BATCH_DELAY : GENERAL_BATCH_DELAY;

  setTimeout(() => {
    // Process up to MAX_BATCH_SIZE requests
    const requestsToProcess = queue.splice(0, MAX_BATCH_SIZE);

    if (queueType === 'critical') {
      criticalBatchScheduled = false;
    } else {
      generalBatchScheduled = false;
    }

    processBatch(requestsToProcess);

    // Continue processing if more items remain
    if (queue.length > 0) {
      scheduleProcessing(queue, queueType);
    }
  }, delay);
}

/**
 * Batched GraphQL request function
 * Batches requests to prevent network overhead as per company policy
 */
export default async function batchedGraphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  queue: QueueType = 'general',
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const request: BatchedRequest<T> = {
      query,
      variables,
      resolve,
      reject,
    };

    if (queue === 'critical') {
      criticalQueue.push(request as BatchedRequest<unknown>);
      scheduleProcessing(criticalQueue, 'critical');
    } else {
      generalQueue.push(request as BatchedRequest<unknown>);
      scheduleProcessing(generalQueue, 'general');
    }
  });
}
