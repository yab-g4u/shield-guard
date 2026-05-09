# @shieldguard/dashboard

Primary ShieldGuard **web application**: marketing / landing experience, developer onboarding, **flow builder**, **documentation** views, and the **Developer Playground** (fraud simulation, analytics, API keys, logs).

## Scripts

From the **repository root**:

```bash
npm run dev
```

Or from this directory (after root `npm install`):

```bash
npm run dev
```

Environment variables are loaded from the **monorepo root** (e.g. `.env.local` with `GEMINI_API_KEY`).

## Structure

- `src/pages/` — routed experiences (`DeveloperPlaygroundPage`, docs, quickstart, etc.)
- `src/components/` — UI and visuals
- `src/lib/` — app utilities (Supabase, helpers)
- `public/` — static assets
