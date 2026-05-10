/**
 * ShieldGuard Copilot / Dev Agent — optional remote LLM + always-available local reasoning.
 * User API key: localStorage `sg_user_llm_key` (set from Developer Playground).
 * Optional bundled dev key: import.meta.env.VITE_GEMINI_API_KEY (never shown in UI).
 */

export type ChatTurn = {
  role: 'user' | 'assistant';
  content: string;
};

export const USER_LLM_STORAGE_KEY = 'sg_user_llm_key';

export function saveUserLlmKey(key: string): void {
  try {
    const t = key.trim();
    if (!t) localStorage.removeItem(USER_LLM_STORAGE_KEY);
    else localStorage.setItem(USER_LLM_STORAGE_KEY, t);
  } catch {
    /* ignore */
  }
}

export function clearUserLlmKey(): void {
  try {
    localStorage.removeItem(USER_LLM_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

const RATE_WINDOW_MS = 60_000;
const REMOTE_MAX_PER_WINDOW = 15;
const RATE_STORAGE_KEY = 'sg_remote_llm_ts';

function getUserStoredKey(): string | undefined {
  try {
    const v = localStorage.getItem(USER_LLM_STORAGE_KEY);
    return v?.trim() || undefined;
  } catch {
    return undefined;
  }
}

function getBundledKey(): string | undefined {
  const k = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
  return k?.trim() || undefined;
}

/** Effective key for remote calls: user key wins over bundled env (for quota isolation). */
export function getEffectiveRemoteApiKey(): string | undefined {
  return getUserStoredKey() ?? getBundledKey();
}

/** True if any remote key exists (user or env). */
export function hasRemoteLlmKey(): boolean {
  return Boolean(getEffectiveRemoteApiKey());
}

function getModel(): string {
  const m = import.meta.env.VITE_GEMINI_MODEL as string | undefined;
  return (m && m.trim()) || 'gemini-2.0-flash';
}

type RateResult = { ok: true } | { ok: false; retryAfterMs: number };

function consumeRemoteRateLimit(): RateResult {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(RATE_STORAGE_KEY);
    let stamps: number[] = raw ? JSON.parse(raw) : [];
    stamps = stamps.filter((t) => now - t < RATE_WINDOW_MS);
    if (stamps.length >= REMOTE_MAX_PER_WINDOW) {
      const oldest = stamps[0]!;
      return { ok: false, retryAfterMs: RATE_WINDOW_MS - (now - oldest) };
    }
    stamps.push(now);
    sessionStorage.setItem(RATE_STORAGE_KEY, JSON.stringify(stamps));
    return { ok: true };
  } catch {
    return { ok: true };
  }
}

export function getRemoteRateLimitStatus(): { used: number; max: number; windowMs: number } {
  try {
    const now = Date.now();
    const raw = sessionStorage.getItem(RATE_STORAGE_KEY);
    let stamps: number[] = raw ? JSON.parse(raw) : [];
    stamps = stamps.filter((t) => now - t < RATE_WINDOW_MS);
    return { used: stamps.length, max: REMOTE_MAX_PER_WINDOW, windowMs: RATE_WINDOW_MS };
  } catch {
    return { used: 0, max: REMOTE_MAX_PER_WINDOW, windowMs: RATE_WINDOW_MS };
  }
}

async function generateContentRemote(params: {
  apiKey: string;
  systemInstruction?: string;
  contents: { role: 'user' | 'model'; parts: { text: string }[] }[];
}): Promise<string> {
  const model = getModel();
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(params.apiKey)}`;

  const body: Record<string, unknown> = {
    contents: params.contents,
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 2048,
    },
  };

  if (params.systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: params.systemInstruction }],
    };
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(raw || `HTTP ${res.status}`);
  }

  let data: {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    error?: { message?: string };
  };
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Invalid response from assistant service');
  }

  if (data.error?.message) {
    throw new Error(data.error.message);
  }

  const parts = data.candidates?.[0]?.content?.parts;
  const text = parts?.map((p) => p.text ?? '').join('').trim();
  return text || 'No response text returned.';
}

// --- Local (offline) reasoning — always available, ShieldGuard-contextual ---

function fmtDecision(d: string): string {
  const x = (d || '').toLowerCase();
  if (x === 'approve' || x === 'allow') return 'APPROVE';
  if (x === 'review' || x === 'verify') return 'REVIEW';
  if (x === 'block') return 'BLOCK';
  return d || 'UNKNOWN';
}

export function localAnalyzeSignal(scenarioName: string, decision: string, context: unknown): string {
  const ctx = context as Record<string, unknown>;
  const score = typeof ctx.riskScore === 'number' ? ctx.riskScore : undefined;
  const reasons = Array.isArray(ctx.reasons) ? (ctx.reasons as string[]) : [];
  const fraudSignals = Array.isArray(ctx.fraudSignals) ? (ctx.fraudSignals as string[]) : [];

  const band =
    score === undefined
      ? '—'
      : score <= 30
        ? 'APPROVE band (low risk)'
        : score <= 60
          ? 'REVIEW band (elevated)'
          : 'BLOCK band (high risk)';

  const mitigations: string[] = [];
  if (fraudSignals.some((s) => /sim/i.test(s))) mitigations.push('Hold high-value payouts until SIM tenure clears; trigger carrier SIM-swap confirmation.');
  if (fraudSignals.some((s) => /device/i.test(s))) mitigations.push('Step-up authentication (passkey / OTP to trusted device); refresh device binding.');
  if (fraudSignals.some((s) => /geo|velocity/i.test(s))) mitigations.push('Tighten geo rules or require in-app proof when tower vs IP diverges.');
  if (mitigations.length === 0) mitigations.push('Continue monitoring; tune thresholds using Flow Builder if review volume is high.');

  return [
    `Scenario: ${scenarioName}`,
    `Decision: ${fmtDecision(decision)} (${band}${score !== undefined ? `, score ${score}` : ''}).`,
    fraudSignals.length ? `Dominant signals: ${fraudSignals.join(', ')}.` : 'No fraudSignals array in context.',
    reasons.length ? `Reasons cited: ${reasons.slice(0, 4).join(' · ')}${reasons.length > 4 ? '…' : ''}` : '',
    `Mitigation: ${mitigations[0]}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function localAskCopilot(message: string, pageContext: unknown): string {
  const q = message.toLowerCase();
  const lines = [
    'ShieldGuard evaluates transactions with telecom-backed signals (SIM lifecycle, device trust, geo/velocity) and returns riskScore, decision, fraudSignals, and explainability.',
  ];

  if (/sim\s*swap|simswap/i.test(q)) {
    lines.push(
      '',
      'SIM swap: treat recent carrier-reported MSISDN reassignment as high severity. Combine with amount and device newness → often REVIEW or BLOCK; recommend step-up and account signals review.'
    );
  } else if (/review|block|approve|threshold/i.test(q)) {
    lines.push(
      '',
      'Typical bands in this demo: ~0–30 APPROVE, ~31–60 REVIEW, ~61–100 BLOCK (tune in Flow Builder / policy engine for production).'
    );
  } else if (/flow|builder|policy/i.test(q)) {
    lines.push(
      '',
      'Flow Builder encodes IF signal combinations THEN mitigations (step-up, webhook, quarantine). Deploy moves policy to the runtime that wraps POST /v1/evaluate.'
    );
  } else if (/webhook/i.test(q)) {
    lines.push(
      '',
      'Subscribe to decision events; verify signatures; handle retries idempotently. Use incidents from Threat Response for replay and audit.'
    );
  } else {
    lines.push(
      '',
      `Your question: "${message.slice(0, 200)}${message.length > 200 ? '…' : ''}"`,
      '',
      'Tip: Open the Developer Playground, run an evaluation, then ask the Dev Agent about fraudSignals and explainability for that exact payload.'
    );
  }

  lines.push('', `Context snapshot: ${JSON.stringify(pageContext).slice(0, 400)}…`);
  return lines.join('\n');
}

type PlaygroundCtx = {
  env?: string;
  simulator?: Record<string, boolean>;
  lastResult?: unknown;
  activeScenario?: string;
  requestBody?: string;
};

export function localPlaygroundAgent(lastUserMessage: string, history: ChatTurn[], ctx: unknown): string {
  const c = ctx as PlaygroundCtx;
  const sim = c.simulator || {};
  const lr = c.lastResult as Record<string, unknown> | undefined;

  const active = [
    sim.simSwap && 'SIM swap',
    sim.newDeviceLogin && 'New device',
    sim.highValue && 'High value',
    sim.locationMismatch && 'Geo mismatch',
    sim.proxyDetected && 'Proxy/VPN',
    sim.rootedDevice && 'Rooted device',
  ].filter(Boolean);

  let out = '';

  out += `Workspace: ${c.env ?? 'sandbox'} · Scenario: ${c.activeScenario ?? '—'}\n`;
  out += `Simulator toggles ON: ${active.length ? active.join(', ') : '(none — low-risk profile)'}\n\n`;

  if (lr && typeof lr === 'object') {
    const decision = fmtDecision(String(lr.decision ?? ''));
    const rs = lr.riskScore;
    const fs = Array.isArray(lr.fraudSignals) ? (lr.fraudSignals as string[]).join(', ') : '—';
    out += `Last evaluation: decision=${decision}, riskScore=${rs}\n`;
    out += `fraudSignals: ${fs}\n`;
    if (Array.isArray(lr.explainability) && lr.explainability.length) {
      const top = (lr.explainability as { signal?: string; contribution?: number }[])
        .slice(0, 3)
        .map((e) => `${e.signal} (${e.contribution ?? '?'})`)
        .join('; ');
      out += `Top explainability: ${top}\n`;
    }
    out += '\n';
  } else {
    out += `No evaluation yet — click **Run Evaluation** on the Playground tab, then return here.\n\n`;
  }

  const q = lastUserMessage.toLowerCase();
  if (/json|payload|request|body/i.test(q)) {
    out += `Request JSON tip: keep phoneNumber (MSISDN), transaction amount/currency, device.id and IP. Your editor already mirrors the active scenario.\n\n`;
    out += `Snippet to aim for high-risk demo:\n`;
    out += '{\n  "phoneNumber": "+254712345678",\n  "transaction": { "amount": 45000, "currency": "KES" },\n  "device": { "id": "dev_new_iphone_17pro", "ip": "102.219.21.99" }\n}\n\n';
  }
  if (/webhook/i.test(q)) {
    out += `Webhooks: listen for transaction.reviewed / transaction.blocked; verify signing secret; retry-safe handlers.\n\n`;
  }
  if (/explain|signal|fraud|why/i.test(q) && lr) {
    out += `Interpretation: combine fraudSignals with explainability[].contribution — highest contributors drove the score into ${fmtDecision(String(lr.decision ?? ''))}.\n\n`;
  }

  out += `You asked: "${lastUserMessage.slice(0, 500)}${lastUserMessage.length > 500 ? '…' : ''}"\n\n`;
  out += `Next steps: (1) Adjust simulator toggles on Playground → (2) Run Evaluation → (3) Compare fraudSignals to toggles.\n`;
  if (history.length > 4) {
    out += `\n(Long thread — earlier turns summarized in context.)`;
  }

  return out.trim();
}

async function remotePlaygroundAgentGenerate(
  history: ChatTurn[],
  playgroundContext: unknown,
  apiKey: string
): Promise<string> {
  const system = `You are ShieldGuard Dev Agent in the Developer Playground.
Help integrate POST /v1/evaluate and ShieldGuard SDK patterns; interpret fraudSignals and explainability.
Use markdown code fences only for JSON examples.
Playground context:
${JSON.stringify(playgroundContext, null, 2)}`;

  const contents: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  for (const turn of history) {
    if (!turn.content.trim()) continue;
    contents.push({
      role: turn.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: turn.content }],
    });
  }
  if (contents.length === 0) contents.push({ role: 'user', parts: [{ text: 'Hello' }] });

  return generateContentRemote({
    apiKey,
    systemInstruction: system,
    contents,
  });
}

async function tryRemoteAskCopilot(message: string, pageContext: unknown): Promise<string | null> {
  const apiKey = getEffectiveRemoteApiKey();
  if (!apiKey) return null;
  const rate = consumeRemoteRateLimit();
  if (!rate.ok) return null;

  const system = `You are ShieldGuard Copilot on the marketing site.
Explain telecom-backed fraud prevention (SIM swap, device trust, geo). Developer-focused, concise.
Context:
${JSON.stringify(pageContext, null, 2)}`;

  return generateContentRemote({
    apiKey,
    systemInstruction: system,
    contents: [{ role: 'user', parts: [{ text: message }] }],
  });
}

async function tryRemoteAnalyzeSignal(
  scenarioName: string,
  decision: string,
  context: unknown
): Promise<string | null> {
  const apiKey = getEffectiveRemoteApiKey();
  if (!apiKey) return null;
  const rate = consumeRemoteRateLimit();
  if (!rate.ok) return null;

  const prompt = `Analyze this ShieldGuard fraud evaluation (concise, infrastructure tone).
Scenario: ${scenarioName}
Decision: ${decision}
Context JSON:
${JSON.stringify(context, null, 2)}
Give root cause, decisive signals, one mitigation.`;

  return generateContentRemote({
    apiKey,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });
}

export const geminiService = {
  analyzeSignal: async (scenarioName: string, decision: string, context: unknown): Promise<string> => {
    try {
      const remote = await tryRemoteAnalyzeSignal(scenarioName, decision, context);
      if (remote) return remote;
    } catch (e) {
      console.warn('Remote analyzeSignal:', e);
    }
    return localAnalyzeSignal(scenarioName, decision, context);
  },

  askCopilot: async (message: string, pageContext: unknown): Promise<string> => {
    try {
      const remote = await tryRemoteAskCopilot(message, pageContext);
      if (remote) return remote;
    } catch (e) {
      console.warn('Remote askCopilot:', e);
    }
    return localAskCopilot(message, pageContext);
  },

  playgroundAgentChat: async (history: ChatTurn[], playgroundContext: unknown): Promise<string> => {
    const lastUser = [...history].reverse().find((t) => t.role === 'user');
    const local = localPlaygroundAgent(lastUser?.content ?? '', history, playgroundContext);

    const apiKey = getEffectiveRemoteApiKey();
    if (!apiKey) return local;

    const rate = consumeRemoteRateLimit();
    if (!rate.ok) {
      const retrySec = Math.ceil(rate.retryAfterMs / 1000);
        return (
        local +
        `\n\n—\n*(Remote assistant rate limit: ${REMOTE_MAX_PER_WINDOW} requests per minute. Retry in ~${retrySec}s — built-in reasoning is above.)*`
      );
    }

    try {
      return await remotePlaygroundAgentGenerate(history, playgroundContext, apiKey);
    } catch (e) {
      console.warn('Remote playgroundAgentChat:', e);
      return (
        local +
        `\n\n—\n*(Remote assistant unavailable — ${String(e)}. Built-in reasoning is above.)*`
      );
    }
  },
};
