# Demo flow (judges & evaluators)

1. **Install & run**
   - From repo root: `npm install` then `npm run dev`.
   - Open the app URL (default **http://localhost:3000**).

2. **Developer Playground**
   - Navigate to the playground from the main site.
   - Confirm simulation toggles: **SIM swap**, **high-value**, **new device** (or click **Full demo (3 signals)**).
   - Click **Run Evaluation**.

3. **Expected outcome**
   - Response includes `riskScore: 82`, `decision: "review"`, `fraudSignals` containing `device_mismatch` and `sim_swap_detected`, plus **explainability** blocks.

4. **Analytics**
   - Open the **Analytics** tab in the playground workspace.
   - Verify charts populate from the evaluation log (decision mix, risk trend, latency, fraud signals).

5. **Optional CLI**
   - `npx tsx scripts/simulate-fraud.ts` prints the canonical JSON scenario under `apps/playground/scenarios/`.

6. **SDK (optional)**
   - `cd tests/integration/sdk-harness && npm install && node index.js` (adjust per harness README).
