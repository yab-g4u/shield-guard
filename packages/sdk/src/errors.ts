/**
 * Custom error class for all ShieldGuard related failures
 */
export class ShieldError extends Error {
  public readonly code?: string;
  public readonly status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = 'ShieldError';
    this.code = code;
    this.status = status;

    // Fix prototype chain for custom errors in TypeScript
    Object.setPrototypeOf(this, ShieldError.prototype);
  }

  /**
   * Create a ShieldError from a fetch Response
   */
  static async fromResponse(response: Response): Promise<ShieldError> {
    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';
    
    try {
      const data = await response.json();
      message = data.message || message;
      code = data.code || code;
    } catch {
      message = `HTTP ${response.status}: ${response.statusText}`;
    }

    return new ShieldError(message, code, response.status);
  }
}

export class ShieldAuthError extends ShieldError {
  constructor(message: string = 'Invalid API key provided') {
    super(message, 'AUTHENTICATION_FAILED', 401);
    this.name = 'ShieldAuthError';
  }
}

export class ShieldNetworkError extends ShieldError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR', 0);
    this.name = 'ShieldNetworkError';
  }
}
