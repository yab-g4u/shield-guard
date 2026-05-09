# API reference (conceptual)

Production ShieldGuard exposes REST endpoints such as:

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/evaluate` | Synchronous risk evaluation for a transaction + device context |
| `GET` | `/health` | Liveness (see `services/api-gateway` stub) |

### Evaluate request (illustrative)

Fields align with the Developer Playground JSON editor: subscriber identifier, transaction amount/currency, device fingerprint metadata, optional carrier hints.

### Evaluate response

- `riskScore` — 0–100
- `decision` — `approve` | `review` | `block`
- `fraudSignals` — machine-readable flags
- `explainability` — human- and audit-friendly rationale (where enabled)
- `reasons`, `timestamp`, `id` — audit trail

The **canonical TypeScript types** are defined in `packages/sdk/src/types.ts`.
