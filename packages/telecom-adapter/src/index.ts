/** Normalized SIM / carrier event (stub). */
export interface SimLifecycleHint {
  msisdn: string;
  simChangeObservedAt?: string;
  swapRiskTier?: 'low' | 'medium' | 'high';
}

export function stubSimHint(msisdn: string): SimLifecycleHint {
  return { msisdn, swapRiskTier: 'low' };
}
