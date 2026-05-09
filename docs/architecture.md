# Architecture

ShieldGuard is organized as a **monorepo** with clear separation between the **product UI**, **SDK**, **domain packages**, and **future backend services**.

## Runtime (today)

- **`apps/dashboard`** — Single-page application (Vite + React) containing landing, docs experience, flow builder, and the Developer Playground (simulation + analytics backed by browser storage).
- **`packages/sdk`** — TypeScript client for `evaluate`-style calls; supports demo/mock mode for offline use.

## Target production shape

- **`services/api-gateway`** — Edge routing, authentication, rate limits.
- **`services/fraud-engine-service`** — Real-time scoring using `packages/core-engine` and `packages/telecom-adapter`.
- **`services/analytics-service`** — Durable logs, metrics, and reporting APIs.
- **`services/auth-service`** — API keys and developer identity.

Shared contracts and small utilities live in **`packages/shared`**; internal HTTP helpers in **`packages/api-client`**.

## Data flow (conceptual)

```text
Client / Partner App
        │
        ▼
   @shieldguard/sdk  ──►  API Gateway  ──►  Fraud engine  ──►  Decision + explainability
                                │
                                └──► Analytics service (audit / BI)
```

## Threat boundaries

See [threat-model.md](./threat-model.md) for trust zones and key material handling.
