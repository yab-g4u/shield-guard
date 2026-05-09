import { ShieldConfig } from './types';
import { ShieldError, ShieldAuthError, ShieldNetworkError } from './errors';
import { withRetry } from './retry';

/**
 * Internal HTTP client for interacting with ShieldGuard API
 */
export class Client {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor(config: ShieldConfig) {
    const apiKey = config.apiKey;
    if (!apiKey || !String(apiKey).trim()) {
      throw new ShieldAuthError('SHIELDGUARD_KEY is missing or invalid.');
    }
    this.apiKey = apiKey;
    this.baseUrl = (config.baseUrl || 'https://api.shieldguard.com').replace(/\/$/, '');
    this.timeout = config.timeout || 10000;
    this.maxRetries = config.maxRetries ?? 3;
  }

  /**
   * Perform a POST request with retry logic
   */
  public async post<T>(endpoint: string, body: any): Promise<T> {
    return withRetry(
      () => this.request<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
      }),
      this.maxRetries
    );
  }

  /**
   * Raw request handler using fetch
   */
  private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'shieldguard-sdk-typescript/1.0.0',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) throw new ShieldAuthError();
        throw await ShieldError.fromResponse(response);
      }

      return await response.json() as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new ShieldNetworkError('Request timed out');
      }
      
      if (error instanceof ShieldError) throw error;
      
      throw new ShieldNetworkError(error.message || 'Connection failed');
    }
  }
}
