import { ShieldNetworkError } from './errors';

/**
 * Simple exponential backoff retry utility
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 500
): Promise<T> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if it's not a network error or if we've reached max retries
      const isRetryable = error instanceof ShieldNetworkError || (error.status && error.status >= 500);
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      // Exponential backoff delay
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}
