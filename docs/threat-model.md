# Threat model (summary)

## Assets

- **API keys** — Gate access to evaluation and analytics APIs; must never ship to browsers in production integrations.
- **Subscriber data** — MSISDN, device identifiers, transaction metadata; subject to privacy regulation.
- **Decisions and logs** — Used for fraud ops and disputes; must be integrity-protected and access-controlled.

## Trust zones

1. **Partner backend** — Holds API keys; calls ShieldGuard server-side.
2. **ShieldGuard control plane** — Key issuance, rotation, audit.
3. **Carrier signal plane** — MNO / CAMARA sources; authenticity depends on operator contracts.

## Key risks

- **Credential theft** — Stolen keys enable abusive evaluation volume or data exfiltration; mitigate with rotation, IP allow lists, and anomaly detection.
- **SIM swap / account takeover** — Core fraud class this product addresses; signals must be fresh and bound to policy.
- **Client-side-only demos** — The dashboard playground stores demo logs in `localStorage`; **not** a security model for production.

## Roadmap

Formal STRIDE / data-flow review should accompany any production deployment and regional privacy assessment.
