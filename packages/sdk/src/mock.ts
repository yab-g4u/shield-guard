import type { EvaluateTransactionInput, EvaluateTransactionResponse, ShieldPolicy, ShieldDecision } from './types';

function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Deterministic "fake-real" evaluate payload for demos when the API is down or `demo: true`.
 */
export function buildDemoEvaluateResponse(
  input: EvaluateTransactionInput,
  policy: ShieldPolicy
): EvaluateTransactionResponse {
  const seed = simpleHash(`${input.phoneNumber}|${input.deviceId}|${input.amount}`);
  const jitter = seed % 17;

  const highValue = input.amount >= 10_000;
  const veryHigh = input.amount >= 50_000;
  const metaRisky =
    input.metadata &&
    (String(input.metadata.simSwap) === 'true' ||
      String(input.metadata.rootedDevice) === 'true' ||
      String(input.metadata.proxyDetected) === 'true');

  let riskScore = 12 + (jitter % 9);
  if (highValue) riskScore += 18;
  if (veryHigh) riskScore += 22;
  if (metaRisky) riskScore += 28;
  riskScore = Math.min(99, riskScore);

  if (policy.blockIfRiskAbove != null && riskScore >= policy.blockIfRiskAbove) {
    riskScore = Math.max(riskScore, policy.blockIfRiskAbove);
  } else if (policy.reviewIfRiskAbove != null && riskScore >= policy.reviewIfRiskAbove) {
    riskScore = Math.max(riskScore, policy.reviewIfRiskAbove - 1);
  }

  let decision: ShieldDecision = 'approve';
  const reasons: string[] = [];
  const fraudSignals: string[] = [];

  if (riskScore >= 72 || veryHigh) {
    decision = 'block';
    reasons.push('Elevated risk score relative to policy thresholds.');
    reasons.push('Velocity and device posture inconsistent with trusted baseline.');
    fraudSignals.push('HIGH_VALUE_TRANSFER', 'DEVICE_TRUST_LOW');
    if (metaRisky) fraudSignals.push('SIM_SWAP_WATCH', 'PROXY_OR_VPN');
  } else if (riskScore >= 42 || highValue || metaRisky) {
    decision = 'review';
    reasons.push('Additional verification recommended before settlement.');
    reasons.push('Carrier signals within ambiguous band; step-up auth advised.');
    fraudSignals.push('GEO_VELOCITY_WARN', 'NEW_DEVICE_ENROLLMENT');
    if (metaRisky) fraudSignals.push('SIM_SWAP_WATCH');
  } else {
    decision = 'approve';
    reasons.push('Telecom trust signals aligned; transaction within normal parameters.');
    fraudSignals.push('CARRIER_VERIFIED', 'LOCATION_MATCH');
  }

  const id = `sg_demo_${Date.now().toString(36)}_${(seed % 1_000_000).toString(36)}`;

  return {
    id,
    riskScore,
    decision,
    reasons,
    fraudSignals: [...new Set(fraudSignals)],
    timestamp: new Date().toISOString(),
  };
}
