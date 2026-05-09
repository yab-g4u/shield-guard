/**
 * Configuration options for the ShieldGuard client
 */
export interface ShieldConfig {
  /**
   * Your ShieldGuard API Key. Not required when `demo: true`.
   */
  apiKey?: string;
  /**
   * The base URL for the ShieldGuard API.
   * Defaults to 'https://api.shieldguard.com'
   */
  baseUrl?: string;
  /**
   * Request timeout in milliseconds.
   * Defaults to 10000ms
   */
  timeout?: number;
  /**
   * Maximum number of retries for failed requests.
   * Defaults to 3
   */
  maxRetries?: number;
  /**
   * When true, skips all HTTP calls and returns realistic mocked JSON (demo fixture).
   * Use for demos, tests, or offline development.
   */
  demo?: boolean;
  /**
   * When true (and `demo` is false), a failed network request falls back to the same mocked evaluate response
   * instead of throwing. Useful when the backend may be down but you still want a smooth demo.
   */
  fallbackToMock?: boolean;
}

/**
 * Transaction evaluation input
 */
export interface EvaluateTransactionInput {
  phoneNumber: string;
  amount: number;
  deviceId: string;
  /**
   * Optional webhook URL for asynchronous notifications
   */
  webhookUrl?: string;
  /**
   * Metadata to attach to the transaction
   */
  metadata?: Record<string, any>;
}

/**
 * Decision types returned by the ShieldGuard engine
 */
export type ShieldDecision = 'approve' | 'review' | 'block';

/**
 * Transaction evaluation response
 */
export interface EvaluateTransactionResponse {
  /**
   * Unique ID for the evaluation event
   */
  id: string;
  /**
   * Trust/Risk score from 0 to 100
   */
  riskScore: number;
  /**
   * The final orchestration decision
   */
  decision: ShieldDecision;
  /**
   * Human-readable reasons for the decision
   */
  reasons: string[];
  /**
   * Raw signal flags triggered during evaluation
   */
  fraudSignals: string[];
  /**
   * Timestamp of the evaluation
   */
  timestamp: string;
}

/**
 * Policy configuration
 */
export interface ShieldPolicy {
  blockIfRiskAbove?: number;
  reviewIfRiskAbove?: number;
  requireSimSwapClearance?: boolean;
}
