# ShieldGuard

**AI-assisted telecom trust and fraud orchestration for mobile money and carrier-backed workflows.** ShieldGuard combines a React developer experience (marketing site, flow builder, and sandbox playground) with a TypeScript SDK for evaluating transactions against policy, risk scores, and explainable fraud signals.

---

## Overview

This repository is a full-stack-style **frontend product demo** and tooling surface. It is designed to showcase how operators and fintechs can:

- Run **transaction evaluations** with synthetic CAMARA-style signals (SIM lifecycle, device trust, geo hints).
- Inspect **risk scores**, **decisions** (`approve` · `review` · `block`), and **explainability** (per-signal narratives and evidence).
- Explore **analytics** over sandbox evaluation logs (decision mix, risk trend, latency, fraud-signal frequency).
- Model orchestration flows in a **visual flow builder** and browse **documentation / quickstart** experiences.

This demo specifically targets the hackathon themes for Sub-Saharan Africa by showing how developer-friendly Open Gateway / CAMARA APIs can protect mobile money, onboarding, and digital payments.

> **Note:** Evaluation traffic in the Developer Playground persists **locally** (e.g. browser storage) for demos. Production deployments would wire the same contracts to your ShieldGuard API and analytics backend.

---

## Features

| Area | Description |
|------|-------------|
| **Developer Playground** | JSON request editor, simulation toggles (SIM swap, new device, high value, etc.), live response panel, request logs. |
| **Analytics** | KPIs and charts driven from logged evaluations: decision distribution, risk trend, latency bars, top fraud signals. |
| **Flow Builder** | Drag-and-drop style orchestration UI for trust and decision flows. |
| **ShieldGuard SDK** (`shieldguard-sdk/`) | TypeScript client with typed `evaluate` input/output, retries, demo/mock responses for offline use. |
| **Copilot (optional)** | Gemini-powered explanations when `GEMINI_API_KEY` is configured. |

---

## CAMARA API Integration

ShieldGuard is built around programmable Open Gateway / CAMARA signal orchestration, modeled on Nokia Network as Code CAMARA APIs available through the Network-as-Code Developer Portal. The project surfaces the following CAMARA-style APIs in the demo and flow builder:

- **SIM Swap** – Detects unauthorized SIM replacement and protects accounts from takeover.
- **Device Status** – Validates whether a device is trusted, new, or suspicious.
- **Number Verification** – Confirms active subscriber identity for onboarding and transaction trust.
- **KYC Match** – Cross-checks customer identity against known profiles and registry data.
- **Location Verification** – Uses telecom-derived location hints to confirm customer context and geography.

These signals are fused into a single risk evaluation so the user journey shows a secure, reliable experience: enter transaction details, run the evaluation, and receive a transparent decision with explainable fraud signals.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** (dev server and build)
- **Tailwind CSS** + **shadcn-style** UI primitives
- **Recharts** (playground analytics visualizations)
- **Monaco Editor** (playground payload editing)
- **Framer Motion** / **GSAP** (motion and visuals elsewhere in the app)

---

## Prerequisites

- **Node.js** 20+ recommended (LTS)
- **npm** (or compatible package manager)

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a **`.env.local`** file in the project root when you want AI Copilot features in the playground:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

If this key is missing, the app still runs; Copilot-style calls fall back to a short offline message.

### 3. Development server

```bash
npm run dev
```

The default Vite config serves on **port 3000** (see `package.json` scripts). Open the URL shown in the terminal to use the app.

### 4. Production build

```bash
npm run build
npm run preview
```

`npm run build` emits optimized assets to `dist/`. Use `preview` to smoke-test the build locally.

### 5. Typecheck

```bash
npm run lint
```

Runs `tsc --noEmit` for static type checking.

---

## Repository Layout

```text
├── src/                    # Main React application (pages, components, services)
├── components/             # Shared UI (legacy / cross-app paths)
├── shieldguard-sdk/      # Publishable TypeScript SDK (client, types, demo/mock helpers)
├── shieldguard-test/     # Small harness for SDK experimentation
├── index.html            # Vite entry HTML
├── vite.config.ts
├── package.json
└── README.md
```

Key entry points:

- **`src/main.tsx`** – application bootstrap
- **`src/App.tsx`** – routing / top-level shell
- **`src/pages/DeveloperPlaygroundPage.tsx`** – sandbox API UI, logs, **Analytics** tab

---

## Developer Playground

Open the **Developer Playground** from the product navigation. Available workspace sections:

1. **Overview** – Introduction and shortcuts into the sandbox.
2. **Playground** – Compose a `POST /v1/evaluate`-style payload, toggle fraud simulations, **Run Evaluation**, and read the JSON response (including `riskScore`, `decision`, `fraudSignals`, and `explainability`).
3. **Analytics** – Aggregated metrics from evaluation **logs** (session-local): totals, averages, charts, and signal frequency.
4. **API Keys** – Demo key management (stored locally for the sandbox narrative).
5. **Logs** – Tabular history of evaluations with copy-to-clipboard responses.

### Compound demo scenario

With **SIM swap**, **high-value transaction**, and **new device login** simulations enabled together, the playground returns a fixed **review** outcome with **`riskScore`: 82** and fraud signals such as **`device_mismatch`** and **`sim_swap_detected`**, plus structured explainability for stakeholder demos.

### User journey mapping and secure trust flow

1. User submits transaction or onboarding data through the sandbox UI.
2. ShieldGuard orchestrates CAMARA signal checks in parallel: SIM Swap, Device Status, Number Verification, and optional KYC/Location verification.
3. The evaluation engine weights each signal and produces a normalized trust score with a decision of `approve`, `review`, or `block`.
4. The response includes explainability details so analysts and regulators can see why a transaction was flagged.

Combined API benefits:

- **Better fraud detection** by correlating SIM lifecycle, device trust, and identity signals.
- **Higher trust** for mobile money transactions and SME onboarding.
- **Scalable edge** via programmable Open Gateway logic that works across 4G/5G networks.
- **Transparent security** by returning network-backed evidence instead of opaque rules.

---

## ShieldGuard SDK

The **`shieldguard-sdk`** package provides a typed client for integration tests and application code:

- **`evaluateTransaction`** (or equivalent surface exported from `shieldguard-sdk/src`)
- **`demo` / mock** mode for deterministic responses without network access
- Configurable **`baseUrl`**, timeouts, and retries

Refer to `shieldguard-sdk/src/types.ts` for the canonical **`EvaluateTransactionResponse`** shape (`riskScore`, `decision`, `reasons`, `fraudSignals`, `timestamp`, etc.).

---

## Scripts

| Script | Command | Purpose |
|--------|---------|---------|
| Develop | `npm run dev` | Start Vite dev server |
| Build | `npm run build` | Production bundle |
| Preview | `npm run preview` | Serve `dist/` locally |
| Typecheck | `npm run lint` | `tsc --noEmit` |
| Clean | `npm run clean` | Remove `dist/` (Unix-oriented; adjust on Windows if needed) |

---

## Security & Compliance (production)

This repo is optimized for **demos and integration prototyping**. Before production use:

- Replace localStorage-backed logs with a **secure audit pipeline** and access-controlled analytics.
- Protect **API keys** (never commit `.env.local`).
- Align decisions and scores with your **legal / risk** policy and regional telecom regulations.

---

## Contributing

Issues and pull requests are welcome. Please keep changes focused, match existing code style, and run `npm run lint` before submitting.

---

## License

Unless otherwise noted in a top-level `LICENSE` file, treat usage terms as specified by the repository owner. Add or update a `LICENSE` file for explicit open-source terms if you intend public distribution.
