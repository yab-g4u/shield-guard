/**
 * Placeholder for deterministic risk helpers shared by services and demos.
 * Production scoring runs in fraud-engine-service; this package is the future home for portable logic.
 */
export function placeholderAggregate(flags: string[]): number {
  return Math.min(100, flags.length * 12);
}
