# SDK guide

The npm package **`@shieldguard/sdk`** lives in `packages/sdk`.

## Install (from this monorepo)

```bash
npm install ./packages/sdk
```

Or from the published registry when released:

```bash
npm install @shieldguard/sdk
```

## Quick usage

```typescript
import { ShieldGuard } from '@shieldguard/sdk';

const sg = new ShieldGuard({ demo: true });
const result = await sg.evaluateTransaction({
  phoneNumber: '+15551234567',
  amount: 2500,
  deviceId: 'dev_abc',
});
console.log(result.decision, result.riskScore, result.fraudSignals);
```

## Modules

- **`client.ts`** — HTTP transport
- **`shieldguard.ts`** — `ShieldGuard` class
- **`evaluate.ts`** — Evaluation-related type exports
- **`types.ts`** — Request/response contracts
- **`mock.ts`** — Deterministic demo responses

## Testing

See `tests/integration/sdk-harness` for a minimal file-based dependency example.
