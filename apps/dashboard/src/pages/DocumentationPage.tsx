import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Copy, Github, Search, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

type DocPage = {
  id: string;
  title: string;
  group: string;
  description: string;
};

const PALETTE = {
  clouded: '#d1d1d1',
  greasy: '#828383',
  suede: '#434343',
  wax: '#2b2b2b',
  sooty: '#141414',
  armor: '#030303',
};

const DOC_PAGES: DocPage[] = [
  { id: 'getting-started', title: 'Getting Started', group: 'Core Docs', description: 'Introduction, quick start, decisions, keys, architecture.' },
  { id: 'sdk-reference', title: 'SDK Reference', group: 'SDK + Concepts', description: 'Initialization, evaluateTransaction, retries, and errors.' },
  { id: 'fraud-intelligence', title: 'Fraud Intelligence Concepts', group: 'SDK + Concepts', description: 'SIM swap, device mismatch, anomalies, scoring, explainability.' },
  { id: 'runtime-architecture', title: 'Runtime Architecture', group: 'SDK + Concepts', description: 'Execution model and low-latency fraud orchestration path.' },
  { id: 'flow-builder-runtime', title: 'Flow Builder Runtime', group: 'Runtime + Ops', description: 'Visual flow logic, lifecycle, testing, and production execution.' },
  { id: 'webhooks', title: 'Webhooks', group: 'Runtime + Ops', description: 'Events, retry system, signatures, replay, and guarantees.' },
  { id: 'api-reference', title: 'API Reference', group: 'Runtime + Ops', description: 'POST /v1/evaluate request and response reference.' },
  { id: 'operational-monitoring', title: 'Operational Monitoring', group: 'Runtime + Ops', description: 'Telemetry, threat response, analytics, and incident workflow.' },
  { id: 'infrastructure-philosophy', title: 'Infrastructure Philosophy', group: 'Core Docs', description: 'Fraud prevention treated as programmable infrastructure.' },
];

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className="text-2xl font-black mb-3 mt-8 pb-2 border-b" style={{ borderColor: PALETTE.suede }}>
    {children}
  </h2>
);

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
  const copy = () => {
    navigator.clipboard.writeText(code);
    toast.success('Copied');
  };

  return (
    <div className="rounded-xl border overflow-hidden my-4" style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.sooty }}>
      <div className="h-9 px-3 border-b flex items-center justify-between" style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.wax }}>
        <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: PALETTE.greasy }}>
          {language}
        </span>
        <button onClick={copy} className="text-xs flex items-center gap-1.5" style={{ color: PALETTE.clouded }}>
          <Copy className="w-3.5 h-3.5" />
          Copy
        </button>
      </div>
      <pre className="p-4 text-xs font-mono overflow-x-auto ops-scroll" style={{ color: PALETTE.clouded }}>
        {code}
      </pre>
    </div>
  );
};

const BulletList = ({ items }: { items: string[] }) => (
  <ul className="space-y-2 mb-4">
    {items.map((item) => (
      <li key={item} className="text-sm leading-relaxed" style={{ color: PALETTE.clouded }}>
        - {item}
      </li>
    ))}
  </ul>
);

const renderPage = (pageId: string) => {
  if (pageId === 'getting-started') {
    return (
      <>
        <h1 className="text-4xl font-black mb-3">Getting Started</h1>
        <p className="text-base leading-relaxed mb-3" style={{ color: PALETTE.clouded }}>
          ShieldGuard is a telecom-powered fraud intelligence infrastructure platform designed for modern digital applications.
        </p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: PALETTE.clouded }}>
          Instead of building custom fraud systems from scratch, developers can integrate ShieldGuard directly into their applications using APIs, SDKs, orchestration flows, and real-time fraud intelligence services.
        </p>
        <p className="text-sm mb-2 font-semibold">ShieldGuard helps platforms:</p>
        <BulletList
          items={[
            'detect suspicious transactions',
            'identify SIM swap attacks',
            'analyze device risk',
            'orchestrate fraud response workflows',
            'monitor transaction threats globally',
            'automate mitigation actions in real time',
          ]}
        />
        <p className="text-sm mb-2 font-semibold">The platform is built for:</p>
        <BulletList
          items={[
            'fintech applications',
            'digital wallets',
            'marketplaces',
            'telecom services',
            'lending platforms',
            'identity verification systems',
            'enterprise transaction infrastructure',
          ]}
        />
        <p className="text-sm mb-2 leading-relaxed" style={{ color: PALETTE.clouded }}>
          ShieldGuard operates as infrastructure - not as a standalone consumer application.
        </p>
        <p className="text-sm mb-2 font-semibold">The goal is to make fraud prevention:</p>
        <BulletList items={['invisible to users', 'accessible to developers', 'scalable for businesses']} />

        <SectionTitle>Quick Start</SectionTitle>
        <h3 className="text-lg font-bold">1. Install the SDK</h3>
        <CodeBlock language="bash" code="npm install @shieldguard/sdk" />
        <h3 className="text-lg font-bold">2. Initialize ShieldGuard</h3>
        <CodeBlock
          language="ts"
          code={`import { ShieldGuard } from "@shieldguard/sdk"

const shield = new ShieldGuard({
  apiKey: process.env.SHIELDGUARD_KEY
})`}
        />
        <h3 className="text-lg font-bold">3. Evaluate a Transaction</h3>
        <CodeBlock
          language="ts"
          code={`const result = await shield.evaluateTransaction({
  phoneNumber: "+251911223344",
  amount: 500,
  deviceId: "device_123"
})`}
        />
        <h3 className="text-lg font-bold">4. Example Response</h3>
        <CodeBlock
          language="json"
          code={`{
  "riskScore": 82,
  "decision": "review",
  "reasons": [
    "SIM swap detected",
    "new device login"
  ],
  "fraudSignals": [
    "device_mismatch",
    "sim_swap_detected"
  ],
  "latencyMs": 142
}`}
        />

        <SectionTitle>Understanding Risk Decisions</SectionTitle>
        <p className="text-sm mb-2" style={{ color: PALETTE.clouded }}>
          ShieldGuard evaluates transaction risk using multiple fraud intelligence signals.
        </p>
        <CodeBlock language="text" code={`0-30   -> APPROVE\n31-60  -> REVIEW\n61-100 -> BLOCK`} />

        <SectionTitle>API Keys</SectionTitle>
        <p className="text-sm mb-2">Developers can generate:</p>
        <BulletList items={['test keys', 'live production keys', 'restricted environment keys']} />
        <p className="text-sm mb-2">Keys can be:</p>
        <BulletList items={['rotated', 'revoked', 'monitored']} />
        <p className="text-sm mb-2 font-semibold">Never expose production keys publicly.</p>

        <SectionTitle>Playground Overview</SectionTitle>
        <p className="text-sm mb-2">The Developer Playground allows teams to:</p>
        <BulletList
          items={[
            'test fraud scenarios',
            'simulate attacks',
            'inspect requests/responses',
            'monitor threat telemetry',
            'debug integrations',
            'visualize transaction flows globally',
          ]}
        />
        <p className="text-sm mb-2" style={{ color: PALETTE.clouded }}>
          The playground acts as a live operational environment for integration testing.
        </p>

        <SectionTitle>Core Features</SectionTitle>
        <h3 className="text-lg font-bold mb-1">Fraud Intelligence</h3>
        <BulletList
          items={[
            'SIM swap detection',
            'device mismatch analysis',
            'transaction anomaly detection',
            'geo-risk evaluation',
            'behavioral risk scoring',
          ]}
        />
        <h3 className="text-lg font-bold mb-1">Flow Builder</h3>
        <BulletList items={['visual fraud orchestration', 'runtime deployment', 'mitigation workflows', 'policy automation']} />
        <h3 className="text-lg font-bold mb-1">Operational Monitoring</h3>
        <BulletList items={['live threat telemetry', 'real-time fraud analytics', 'global transaction monitoring', 'webhook event tracking']} />
        <h3 className="text-lg font-bold mb-1">SDK + APIs</h3>
        <BulletList items={['TypeScript SDK', 'REST APIs', 'webhook infrastructure', 'retry handling', 'typed responses']} />

        <SectionTitle>Architecture Overview</SectionTitle>
        <p className="text-sm mb-2">ShieldGuard consists of:</p>
        <BulletList
          items={[
            'SDK layer',
            'fraud evaluation engine',
            'orchestration runtime',
            'telemetry infrastructure',
            'webhook system',
            'monitoring layer',
          ]}
        />
        <p className="text-sm mb-2" style={{ color: PALETTE.clouded }}>
          Applications send transaction data to ShieldGuard. ShieldGuard analyzes fraud signals in real time and returns a risk decision.
        </p>

        <SectionTitle>Production Readiness</SectionTitle>
        <p className="text-sm mb-2">ShieldGuard is designed for:</p>
        <BulletList
          items={[
            'low-latency evaluation',
            'scalable transaction processing',
            'real-time telemetry',
            'developer-first integration',
            'infrastructure-grade reliability',
          ]}
        />

        <SectionTitle>Next Steps</SectionTitle>
        <BulletList
          items={[
            'SDK Reference',
            'Fraud Intelligence Concepts',
            'Flow Builder Runtime',
            'Webhook System',
            'API Reference',
            'Operational Monitoring',
          ]}
        />
      </>
    );
  }

  if (pageId === 'sdk-reference') {
    return (
      <>
        <h1 className="text-4xl font-black mb-3">SDK Reference</h1>
        <SectionTitle>Overview</SectionTitle>
        <p className="text-sm mb-2">The ShieldGuard SDK provides a developer-friendly interface for interacting with the ShieldGuard fraud intelligence infrastructure.</p>
        <p className="text-sm mb-2">The SDK abstracts:</p>
        <BulletList items={['API communication', 'retries', 'error handling', 'typed responses', 'authentication', 'request validation']} />
        <SectionTitle>Initialization</SectionTitle>
        <CodeBlock
          language="ts"
          code={`import { ShieldGuard } from "@shieldguard/sdk"

const shield = new ShieldGuard({
  apiKey: process.env.SHIELDGUARD_KEY
})`}
        />
        <SectionTitle>evaluateTransaction()</SectionTitle>
        <p className="text-sm mb-2">Evaluates a transaction and returns a fraud risk decision.</p>
        <CodeBlock
          language="ts"
          code={`const result = await shield.evaluateTransaction({
  phoneNumber: "+251911223344",
  amount: 500,
  deviceId: "device_123"
})`}
        />
        <SectionTitle>Request Parameters</SectionTitle>
        <div className="rounded-xl border overflow-hidden mb-4" style={{ borderColor: PALETTE.suede }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: PALETTE.wax }}>
              <tr>
                <th className="text-left px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>Parameter</th>
                <th className="text-left px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>Type</th>
                <th className="text-left px-3 py-2">Description</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: PALETTE.sooty }}>
              <tr className="border-t" style={{ borderColor: PALETTE.suede }}>
                <td className="px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>phoneNumber</td>
                <td className="px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>string</td>
                <td className="px-3 py-2">User phone number</td>
              </tr>
              <tr className="border-t" style={{ borderColor: PALETTE.suede }}>
                <td className="px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>amount</td>
                <td className="px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>number</td>
                <td className="px-3 py-2">Transaction amount</td>
              </tr>
              <tr className="border-t" style={{ borderColor: PALETTE.suede }}>
                <td className="px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>deviceId</td>
                <td className="px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>string</td>
                <td className="px-3 py-2">Device fingerprint identifier</td>
              </tr>
            </tbody>
          </table>
        </div>
        <SectionTitle>Response Structure</SectionTitle>
        <CodeBlock
          language="json"
          code={`{
  "riskScore": 82,
  "decision": "review",
  "reasons": [],
  "fraudSignals": [],
  "latencyMs": 142
}`}
        />
        <SectionTitle>Retry System</SectionTitle>
        <p className="text-sm mb-2">The SDK automatically retries failed requests.</p>
        <BulletList items={['exponential backoff', 'timeout handling', 'transient network recovery']} />
        <SectionTitle>Error Handling</SectionTitle>
        <CodeBlock language="ts" code={`try {\n  await shield.evaluateTransaction(...)\n} catch (err) {\n  console.error(err)\n}`} />
        <p className="text-sm mb-2">Error types:</p>
        <BulletList items={['ShieldNetworkError', 'ShieldValidationError', 'ShieldAuthenticationError']} />
      </>
    );
  }

  if (pageId === 'fraud-intelligence') {
    return (
      <>
        <h1 className="text-4xl font-black mb-3">Fraud Intelligence Concepts</h1>
        <SectionTitle>SIM Swap Detection</SectionTitle>
        <p className="text-sm mb-3">SIM swap attacks occur when attackers transfer a victim's phone number to another SIM card.</p>
        <p className="text-sm mb-3">ShieldGuard analyzes telecom intelligence signals to identify suspicious SIM activity.</p>
        <SectionTitle>Device Mismatch</SectionTitle>
        <p className="text-sm mb-2">Device mismatch occurs when:</p>
        <BulletList
          items={[
            'login behavior changes unexpectedly',
            'a new device appears suddenly',
            'device fingerprints differ from historical patterns',
          ]}
        />
        <SectionTitle>Transaction Anomalies</SectionTitle>
        <p className="text-sm mb-2">ShieldGuard evaluates:</p>
        <BulletList
          items={[
            'unusually high transaction values',
            'abnormal velocity patterns',
            'suspicious timing behavior',
            'location inconsistencies',
          ]}
        />
        <SectionTitle>Risk Scoring</SectionTitle>
        <p className="text-sm mb-2">ShieldGuard aggregates multiple fraud signals into a unified risk score.</p>
        <CodeBlock language="text" code={`SIM Swap         -> +30\nDevice Mismatch  -> +25\nGeo Risk         -> +15\nHigh Amount      -> +20`} />
        <p className="text-sm mb-2">Final risk score determines:</p>
        <BulletList items={['approve', 'review', 'block']} />
        <SectionTitle>Explainable Intelligence</SectionTitle>
        <p className="text-sm mb-2">ShieldGuard returns explainable fraud reasoning instead of black-box decisions.</p>
        <p className="text-sm mb-2">Developers can inspect:</p>
        <BulletList items={['triggered signals', 'severity', 'mitigation recommendations', 'telemetry metadata']} />
      </>
    );
  }

  if (pageId === 'runtime-architecture') {
    return (
      <>
        <h1 className="text-4xl font-black mb-3">Runtime Architecture</h1>
        <p className="text-sm mb-2">Fraud evaluation executes in real time through:</p>
        <BulletList
          items={[
            'transaction ingestion',
            'signal enrichment',
            'scoring engine',
            'orchestration runtime',
            'mitigation pipeline',
          ]}
        />
        <p className="text-sm mb-2">All evaluations are optimized for low-latency execution.</p>
      </>
    );
  }

  if (pageId === 'flow-builder-runtime') {
    return (
      <>
        <h1 className="text-4xl font-black mb-3">Flow Builder Runtime</h1>
        <SectionTitle>Overview</SectionTitle>
        <p className="text-sm mb-2">The Flow Builder allows developers to create programmable fraud mitigation workflows visually.</p>
        <p className="text-sm mb-2">Flows are deployed as executable fraud policies inside the ShieldGuard runtime engine.</p>
        <SectionTitle>Building Flows</SectionTitle>
        <p className="text-sm mb-2">Developers create flows using:</p>
        <BulletList items={['condition nodes', 'signal evaluators', 'mitigation actions', 'webhook triggers']} />
        <CodeBlock
          language="text"
          code={`IF:\nSIM swap detected\nAND amount > $1000\n\nTHEN:\nRequire step-up authentication\nTrigger webhook\nQuarantine transaction`}
        />
        <SectionTitle>Deployment Lifecycle</SectionTitle>
        <p className="text-sm mb-2">Flows move through:</p>
        <BulletList items={['Draft', 'Testing', 'Active', 'Archived']} />
        <p className="text-sm mb-2">Deploying a flow:</p>
        <BulletList
          items={[
            'validates logic',
            'generates runtime policy',
            'attaches to transaction pipeline',
            'activates live monitoring',
          ]}
        />
        <SectionTitle>Runtime Execution</SectionTitle>
        <BulletList
          items={[
            'incoming transactions pass through the runtime',
            'fraud rules execute in real time',
            'mitigation actions trigger automatically',
          ]}
        />
        <p className="text-sm mb-2">Execution metrics include:</p>
        <BulletList
          items={['evaluations/sec', 'blocked fraud attempts', 'latency', 'triggered policies', 'webhook deliveries']}
        />
        <SectionTitle>Flow Testing</SectionTitle>
        <BulletList
          items={[
            'replay requests',
            'simulate fraud',
            'debug execution paths',
            'inspect node behavior',
            'validate mitigation logic',
          ]}
        />
      </>
    );
  }

  if (pageId === 'webhooks') {
    return (
      <>
        <h1 className="text-4xl font-black mb-3">Webhooks</h1>
        <SectionTitle>Overview</SectionTitle>
        <p className="text-sm mb-2">Webhooks allow ShieldGuard to notify external systems when fraud events occur.</p>
        <SectionTitle>Example Events</SectionTitle>
        <CodeBlock
          language="json"
          code={`{
  "event": "transaction.reviewed",
  "data": {
    "riskScore": 82,
    "decision": "review"
  }
}`}
        />
        <SectionTitle>Supported Events</SectionTitle>
        <div className="rounded-xl border overflow-hidden mb-4" style={{ borderColor: PALETTE.suede }}>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: PALETTE.wax }}>
              <tr>
                <th className="text-left px-3 py-2 border-r" style={{ borderColor: PALETTE.suede }}>Event</th>
                <th className="text-left px-3 py-2">Description</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: PALETTE.sooty }}>
              {[
                ['transaction.approved', 'Safe transaction'],
                ['transaction.reviewed', 'Suspicious transaction'],
                ['transaction.blocked', 'Fraud blocked'],
                ['flow.triggered', 'Runtime flow executed'],
              ].map(([event, description]) => (
                <tr key={event} className="border-t" style={{ borderColor: PALETTE.suede }}>
                  <td className="px-3 py-2 border-r font-mono" style={{ borderColor: PALETTE.suede }}>{event}</td>
                  <td className="px-3 py-2">{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SectionTitle>Delivery System</SectionTitle>
        <p className="text-sm mb-2">ShieldGuard webhooks support:</p>
        <BulletList items={['retries', 'signature validation', 'delivery monitoring', 'event replay', 'failure recovery']} />
      </>
    );
  }

  if (pageId === 'api-reference') {
    return (
      <>
        <h1 className="text-4xl font-black mb-3">API Reference</h1>
        <SectionTitle>POST /v1/evaluate</SectionTitle>
        <p className="text-sm mb-2">Evaluates transaction fraud risk.</p>
        <h3 className="text-lg font-bold mt-4">Request</h3>
        <CodeBlock
          language="json"
          code={`{
  "phoneNumber": "+251911223344",
  "amount": 500,
  "deviceId": "device_123"
}`}
        />
        <h3 className="text-lg font-bold mt-4">Response</h3>
        <CodeBlock language="json" code={`{\n  "riskScore": 82,\n  "decision": "review"\n}`} />
        <SectionTitle>Authentication</SectionTitle>
        <CodeBlock language="http" code={`Authorization: Bearer YOUR_API_KEY`} />
      </>
    );
  }

  if (pageId === 'operational-monitoring') {
    return (
      <>
        <h1 className="text-4xl font-black mb-3">Operational Monitoring</h1>
        <SectionTitle>Overview</SectionTitle>
        <p className="text-sm mb-2">Operational Monitoring provides real-time fraud telemetry and infrastructure visibility.</p>
        <p className="text-sm mb-2">The monitoring system allows developers to:</p>
        <BulletList
          items={[
            'inspect live traffic',
            'monitor fraud trends',
            'analyze attack behavior',
            'track mitigation actions',
          ]}
        />
        <SectionTitle>Global Threat Intelligence</SectionTitle>
        <BulletList
          items={[
            'real-time 3D transaction globe',
            'fraud hotspot detection',
            'cross-border attack visualization',
            'transaction throughput monitoring',
          ]}
        />
        <SectionTitle>Threat Response Center</SectionTitle>
        <p className="text-sm mb-2">When suspicious activity is detected:</p>
        <BulletList
          items={[
            'incidents are logged',
            'transactions quarantined',
            'mitigation flows triggered',
            'alerts dispatched',
          ]}
        />
        <p className="text-sm mb-2">Developers can:</p>
        <BulletList
          items={[
            'replay incidents',
            'inspect affected traffic',
            'review fraud reasoning',
            'analyze attack patterns',
          ]}
        />
        <SectionTitle>Analytics & Telemetry</SectionTitle>
        <BulletList
          items={[
            'fraud detection rate',
            'API latency',
            'active mitigation flows',
            'webhook activity',
            'threat severity distribution',
            'request throughput',
            'attack clusters',
          ]}
        />
        <SectionTitle>Incident Workflow</SectionTitle>
        <BulletList items={['Detection', 'Risk evaluation', 'Mitigation execution', 'Incident logging', 'Alert delivery', 'Developer response']} />
      </>
    );
  }

  return (
    <>
      <h1 className="text-4xl font-black mb-3">Infrastructure Philosophy</h1>
      <p className="text-sm mb-3">ShieldGuard treats fraud prevention as infrastructure.</p>
      <p className="text-sm mb-2">The platform is designed to:</p>
      <BulletList
        items={[
          'integrate invisibly',
          'scale operationally',
          'automate mitigation',
          'provide explainable intelligence',
          'enable developer-first fraud operations',
        ]}
      />
    </>
  );
};

export const DocumentationPage = ({ onBack }: { onBack: () => void }) => {
  const [activePage, setActivePage] = useState('getting-started');
  const [query, setQuery] = useState('');

  const filteredPages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOC_PAGES;
    return DOC_PAGES.filter((page) => `${page.title} ${page.description} ${page.group}`.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    return filteredPages.reduce<Record<string, DocPage[]>>((acc, page) => {
      acc[page.group] ||= [];
      acc[page.group].push(page);
      return acc;
    }, {});
  }, [filteredPages]);

  const groupedEntries = useMemo(() => Object.entries(grouped) as [string, DocPage[]][], [grouped]);
  const pageMeta = DOC_PAGES.find((page) => page.id === activePage);
  const activeIndex = DOC_PAGES.findIndex((page) => page.id === activePage);
  const nextPage = activeIndex >= 0 && activeIndex < DOC_PAGES.length - 1 ? DOC_PAGES[activeIndex + 1] : null;

  return (
    <div className="min-h-screen flex text-white" style={{ backgroundColor: PALETTE.armor }}>
      <aside className="w-[300px] h-screen sticky top-0 border-r flex flex-col" style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.sooty }}>
        <div className="p-4 border-b" style={{ borderColor: PALETTE.suede }}>
          <button onClick={onBack} className="text-sm inline-flex items-center gap-2 mb-4" style={{ color: PALETTE.greasy }}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center" style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.wax }}>
              <Shield className="w-4 h-4" style={{ color: PALETTE.clouded }} />
            </div>
            <div>
              <p className="font-black leading-none text-lg">ShieldGuard Docs</p>
              <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: PALETTE.greasy }}>Enterprise Console</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: PALETTE.greasy }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="w-full h-9 rounded-lg border pl-9 pr-3 text-sm outline-none"
              style={{ backgroundColor: PALETTE.armor, borderColor: PALETTE.suede, color: PALETTE.clouded }}
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto ops-scroll p-3 space-y-4">
          {groupedEntries.map(([group, pages]) => (
            <div key={group}>
              <p className="text-[10px] uppercase tracking-[0.2em] px-2 mb-2" style={{ color: PALETTE.greasy }}>
                {group}
              </p>
              <div className="space-y-1">
                {pages.map((page) => (
                  <button
                    key={page.id}
                    onClick={() => setActivePage(page.id)}
                    className={cn(
                      'w-full text-left rounded-lg border px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)]',
                      activePage === page.id ? 'font-semibold' : ''
                    )}
                    style={{
                      borderColor: activePage === page.id ? PALETTE.clouded : 'transparent',
                      backgroundColor: activePage === page.id ? PALETTE.wax : 'transparent',
                      color: activePage === page.id ? PALETTE.clouded : PALETTE.greasy,
                    }}
                  >
                    <p className="text-sm">{page.title}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto ops-scroll px-8 py-8">
        <div className="max-w-5xl">
          <div className="mb-8 rounded-xl border p-4 flex items-start justify-between gap-4" style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.sooty }}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-1" style={{ color: PALETTE.greasy }}>
                {pageMeta?.group}
              </p>
              <h3 className="text-lg font-bold mb-1">{pageMeta?.title}</h3>
              <p className="text-sm" style={{ color: PALETTE.clouded }}>{pageMeta?.description}</p>
            </div>
            <button
              onClick={() => window.open('https://github.com/yab-g4u/shield-guard.git', '_blank', 'noopener,noreferrer')}
              className="inline-flex items-center gap-2 rounded-lg border px-3 h-9 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
              style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.wax, color: PALETTE.clouded }}
            >
              <Github className="w-3.5 h-3.5" />
              GitHub
            </button>
          </div>
          {renderPage(activePage)}
          {nextPage && (
            <div className="mt-10 pt-6 border-t" style={{ borderColor: PALETTE.suede }}>
              <button
                onClick={() => setActivePage(nextPage.id)}
                className="inline-flex items-center gap-2 rounded-xl border px-5 h-11 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
                style={{ borderColor: PALETTE.clouded, backgroundColor: PALETTE.clouded, color: PALETTE.armor }}
              >
                Next: {nextPage.title}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
