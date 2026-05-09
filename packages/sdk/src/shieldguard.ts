import { Client } from './client';
import { ShieldAuthError, ShieldNetworkError } from './errors';
import { buildDemoEvaluateResponse } from './mock';
import {
  ShieldConfig,
  EvaluateTransactionInput,
  EvaluateTransactionResponse,
  ShieldPolicy,
} from './types';

/**
 * Main ShieldGuard SDK Client
 */
export class ShieldGuard {
  private readonly demo: boolean;
  private readonly fallbackToMock: boolean;
  private client: Client | null;
  private currentPolicy: ShieldPolicy = {};

  constructor(config: ShieldConfig) {
    this.demo = config.demo === true;
    this.fallbackToMock = config.fallbackToMock === true;

    if (!this.demo && (!config.apiKey || !String(config.apiKey).trim())) {
      throw new ShieldAuthError('SHIELDGUARD_KEY is missing or invalid.');
    }

    this.client = this.demo ? null : new Client(config);
  }

  /**
   * Evaluate a transaction against mobile network signals and fraud patterns.
   *
   * @param input - Transaction details including phoneNumber, amount, and deviceId
   * @returns Detailed risk evaluation and decision
   * @throws {ShieldError} If API request fails (unless `fallbackToMock` handles network errors)
   */
  public async evaluateTransaction(input: EvaluateTransactionInput): Promise<EvaluateTransactionResponse> {
    const payload = {
      ...input,
      _policy: this.currentPolicy,
    };

    if (this.demo) {
      return buildDemoEvaluateResponse(input, this.currentPolicy);
    }

    try {
      return await this.client!.post<EvaluateTransactionResponse>('/v1/evaluate', payload);
    } catch (err) {
      if (this.fallbackToMock && err instanceof ShieldNetworkError) {
        return buildDemoEvaluateResponse(input, this.currentPolicy);
      }
      throw err;
    }
  }

  /**
   * Dynamically update the risk policy for the current session.
   *
   * @param policy - New policy thresholds
   */
  public setPolicy(policy: ShieldPolicy): void {
    this.currentPolicy = {
      ...this.currentPolicy,
      ...policy,
    };
  }

  /**
   * Verify a webhook signature (Placeholder for future implementation)
   */
  public verifyWebhook(payload: string, signature: string): boolean {
    return !!(payload && signature);
  }
}
