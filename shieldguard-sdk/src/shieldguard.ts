import { Client } from './client';
import { 
  ShieldConfig, 
  EvaluateTransactionInput, 
  EvaluateTransactionResponse,
  ShieldPolicy
} from './types';

/**
 * Main ShieldGuard SDK Client
 */
export class ShieldGuard {
  private client: Client;
  private currentPolicy: ShieldPolicy = {};

  constructor(config: ShieldConfig) {
    this.client = new Client(config);
  }

  /**
   * Evaluate a transaction against mobile network signals and fraud patterns.
   * 
   * @param input - Transaction details including phoneNumber, amount, and deviceId
   * @returns Detailed risk evaluation and decision
   * @throws {ShieldError} If API request fails
   */
  public async evaluateTransaction(input: EvaluateTransactionInput): Promise<EvaluateTransactionResponse> {
    // Add policy context if set
    const payload = {
      ...input,
      _policy: this.currentPolicy
    };

    return this.client.post<EvaluateTransactionResponse>('/v1/evaluate', payload);
  }

  /**
   * Dynamically update the risk policy for the current session.
   * 
   * @param policy - New policy thresholds
   */
  public setPolicy(policy: ShieldPolicy): void {
    this.currentPolicy = {
      ...this.currentPolicy,
      ...policy
    };
  }

  /**
   * Verify a webhook signature (Placeholder for future implementation)
   */
  public verifyWebhook(payload: string, signature: string): boolean {
    // Logic for HMAC verification would go here
    return !!(payload && signature);
  }
}
