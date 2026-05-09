/**
 * Demo helper: print the canonical compound fraud scenario (matches playground JSON).
 * Run: npx tsx scripts/simulate-fraud.ts
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const scenarioPath = resolve(__dirname, '../apps/playground/scenarios/compound-review-demo.json');
const raw = readFileSync(scenarioPath, 'utf8');
const scenario = JSON.parse(raw) as {
  id: string;
  expected?: { riskScore: number; decision: string; fraudSignals: string[] };
};

console.log('ShieldGuard — simulate fraud (demo scenario)\n');
console.log(JSON.stringify(scenario, null, 2));
if (scenario.expected) {
  console.log('\n→ Expected decision:', scenario.expected.decision, 'risk:', scenario.expected.riskScore);
  console.log('→ Open apps/dashboard, enable matching simulation toggles, Run Evaluation.\n');
}
