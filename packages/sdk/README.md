# @shieldguard/sdk

![npm](https://img.shields.io/npm/v/@shieldguard/sdk)
![license](https://img.shields.io/npm/l/@shieldguard/sdk)

TypeScript SDK for the ShieldGuard fraud detection and transaction risk API. The published package contains **compiled JavaScript and `.d.ts` types** in `dist/` only—install and ship without pulling raw source.

## Requirements

- Node.js **18+** (global `fetch`)

## Installation

```bash
npm install @shieldguard/sdk
```

## Build (maintainers)

From this repo:

```bash
npm install
npm run build
```

Output is written to `dist/`. `prepublishOnly` runs `npm run build` before `npm publish`.

## Usage

```typescript
import { ShieldGuard, ShieldError } from "@shieldguard/sdk";

const shield = new ShieldGuard({
  apiKey: process.env.SHIELDGUARD_KEY!,
  // baseUrl: "https://api.shieldguard.com", // optional override
});

try {
  const result = await shield.evaluateTransaction({
    phoneNumber: "+251911223344",
    amount: 500,
    deviceId: "device_123",
  });

  if (result.decision === "approve") {
    // proceed
  }
} catch (error) {
  if (error instanceof ShieldError) {
    console.error(`Shield error: ${error.message} (${error.code})`);
  }
  throw error;
}
```

### CommonJS

```javascript
const { ShieldGuard } = require("@shieldguard/sdk");
```

### Demo / offline mode (mocked responses)

When the backend is not running—or for pitches and tests—use **`demo: true`** to skip HTTP entirely and receive deterministic, realistic JSON (`id`, `riskScore`, `decision`, `reasons`, `fraudSignals`, `timestamp`). High amounts and optional `metadata` flags nudge risk toward `review` / `block`.

```typescript
const shield = new ShieldGuard({
  apiKey: "demo_key",
  demo: true,
});
```

To **call the real API when available** but fall back to the same mock on network failure, use **`fallbackToMock: true`** (without `demo`).

## Local pack test

```bash
npm pack
# in another project:
npm install ../shieldguard-sdk/shieldguard-sdk-1.0.0.tgz
```

## License

MIT
