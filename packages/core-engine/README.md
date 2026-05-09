# @shieldguard/core-engine

Fraud detection primitives: risk scoring, rules, signals, and anomaly helpers.

Planned layout:

- `src/risk-scoring/` — composite scores and thresholds
- `src/rules/` — policy DSL / compiled rules
- `src/signals/` — normalized signal vectors
- `src/anomaly-detection/` — statistical and velocity checks

Today this package holds a minimal stub so the monorepo matches the target architecture without changing runtime behavior of `apps/dashboard`.
