import { ArrowLeft, ArrowUpRight, Shield } from 'lucide-react';

const PALETTE = {
  clouded: '#d1d1d1',
  greasy: '#828383',
  suede: '#434343',
  wax: '#2b2b2b',
  sooty: '#141414',
  armor: '#030303',
};

type CaseStudy = {
  title: string;
  problem: string;
  solution: string[];
  impact: string[];
  references: { label: string; href: string }[];
};

const CASE_STUDIES: CaseStudy[] = [
  {
    title: 'Fintech App Preventing Account Takeover',
    problem:
      'PayFlow faced large ATO losses from SIM swap attacks bypassing standard behavior rules.',
    solution: [
      'Real-time SIM swap detection for every login',
      'Device identity mapping for spoofing detection',
      'Carrier-backed location anomaly detection',
      'Explainable risk decisions for review teams',
    ],
    impact: [
      'ATO incidents reduced by 90%',
      'Fraud losses reduced by 90%',
      'False positives improved by 73%',
      'Customer satisfaction improved from 3.2/5 to 4.6/5',
    ],
    references: [
      { label: 'GSMA Mobile Identity: Fraud & Authentication', href: 'https://www.gsma.com/solutions-and-impact/connectivity-for-good/mobile-for-development/programme/mobile-identity/' },
      { label: 'CFPB Guidance on Account Takeover Risks', href: 'https://www.consumerfinance.gov/about-us/blog/' },
    ],
  },
  {
    title: 'Marketplace Stopping Fake Seller Fraud',
    problem:
      'MarketHub saw coordinated fake seller rings creating chargebacks and trust erosion.',
    solution: [
      'Phone intelligence for seller identity confidence',
      'Device consistency checks across account lifecycle',
      'Velocity analysis for ring behavior detection',
      'Risk-based listing and payout decisioning',
    ],
    impact: [
      'Fake seller creation reduced by 85%',
      'Chargeback losses reduced by 80%',
      'Manual review rate reduced by 70%',
      'Buyer trust score improved from 2.8/5 to 4.3/5',
    ],
    references: [
      { label: 'Sift: Q-Commerce and Marketplace Fraud Trends', href: 'https://sift.com/resources/' },
      { label: 'Stripe Radar Fraud Prevention Guide', href: 'https://stripe.com/guides/guide-to-fraud-prevention' },
    ],
  },
  {
    title: 'Lending Platform Reducing Loan Default Fraud',
    problem:
      'LoanFast faced synthetic identity attacks creating high default losses and regulatory pressure.',
    solution: [
      'Carrier-backed identity validation in underwriting',
      'Application velocity and network pattern scoring',
      'Parallel fraud + document + credit checks',
      'Risk-weighted automated decision policy',
    ],
    impact: [
      'Fraudulent approvals reduced by 90%',
      'Default losses reduced by 84%',
      'Manual review reduced by 77%',
      'Low-risk approvals shortened from days to minutes',
    ],
    references: [
      { label: 'Federal Reserve on Synthetic Identity Fraud', href: 'https://www.federalreserve.gov/supervisionreg/topics/fraud.htm' },
      { label: 'TransUnion: Synthetic Identity Fraud Report', href: 'https://www.transunion.com/industry/fraud' },
    ],
  },
];

export const CaseStudiesPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: PALETTE.armor }}>
      <header className="sticky top-0 z-20 border-b backdrop-blur-xl" style={{ borderColor: PALETTE.suede, backgroundColor: 'rgba(3,3,3,0.9)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-sm" style={{ color: PALETTE.greasy }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="inline-flex items-center gap-2 text-sm font-semibold">
            <Shield className="w-4 h-4" style={{ color: PALETTE.clouded }} />
            Case Studies
          </div>
        </div>
      </header>

      <main id="case-studies" className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-black mb-3">ShieldGuard Case Studies</h1>
        <p className="text-sm mb-8 max-w-3xl" style={{ color: PALETTE.clouded }}>
          Based on `docs/case-studies.md`: measurable outcomes across fintech, marketplaces, and digital lending with telecom fraud intelligence.
        </p>

        <div className="space-y-5">
          {CASE_STUDIES.map((study) => (
            <article key={study.title} className="rounded-2xl border p-6" style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.sooty }}>
              <h2 className="text-2xl font-bold mb-3">{study.title}</h2>
              <p className="text-sm mb-4" style={{ color: PALETTE.clouded }}>
                <span className="font-semibold text-white">Problem: </span>
                {study.problem}
              </p>

              <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: PALETTE.greasy }}>Solution Highlights</p>
              <ul className="mb-4 space-y-1">
                {study.solution.map((line) => (
                  <li key={line} className="text-sm" style={{ color: PALETTE.clouded }}>- {line}</li>
                ))}
              </ul>

              <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: PALETTE.greasy }}>Measured Impact</p>
              <ul className="mb-4 space-y-1">
                {study.impact.map((line) => (
                  <li key={line} className="text-sm" style={{ color: PALETTE.clouded }}>- {line}</li>
                ))}
              </ul>

              <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: PALETTE.greasy }}>Reference Links</p>
              <div className="flex flex-wrap gap-2">
                {study.references.map((ref) => (
                  <a
                    key={ref.href}
                    href={ref.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border h-8 px-3 text-xs transition-all hover:-translate-y-0.5"
                    style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.wax, color: PALETTE.clouded }}
                  >
                    {ref.label}
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};
