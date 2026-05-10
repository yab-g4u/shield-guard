import { ArrowLeft, ArrowUpRight, Shield } from 'lucide-react';

const PALETTE = {
  clouded: '#d1d1d1',
  greasy: '#828383',
  suede: '#434343',
  wax: '#2b2b2b',
  sooty: '#141414',
  armor: '#030303',
};

const BLOGS = [
  {
    date: 'May 10, 2026',
    title: 'From Demo to Runtime: Designing ShieldGuard as Fraud Infrastructure',
    excerpt:
      'How we transformed the Developer Playground and Flow Builder from static demos into operational fraud consoles with deployable policy logic, telemetry loops, and explainable outcomes.',
    href: 'https://stripe.com/radar',
  },
  {
    date: 'May 10, 2026',
    title: 'Building Telecom-Native Risk Decisions: SIM Swap, Device Mismatch, and Explainability',
    excerpt:
      'A practical walkthrough of fusing telecom signals into risk scoring pipelines, with mitigation workflows, webhook responses, and operator-friendly incident traces.',
    href: 'https://www.gsma.com/solutions-and-impact/technologies/networks/',
  },
];

export const BlogPage = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="min-h-screen text-white relative overflow-hidden" style={{ backgroundColor: PALETTE.armor }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(67,67,67,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(67,67,67,0.32) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 20%, rgba(209,209,209,0.08), transparent 55%)' }} />

      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-6 flex items-center justify-between">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-sm" style={{ color: PALETTE.greasy }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="inline-flex items-center gap-2 rounded-full border h-10 px-4 text-sm" style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.sooty }}>
          <Shield className="w-4 h-4" style={{ color: PALETTE.clouded }} />
          ShieldGuard Blog
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight max-w-4xl leading-[1.1]">
          Writing on fraud infrastructure, orchestration runtime, and developer-grade security operations.
        </h1>
        <p className="mt-5 text-base max-w-3xl" style={{ color: PALETTE.clouded }}>
          Long-form engineering notes from ShieldGuard product architecture, fraud telemetry design, and production integration systems.
        </p>

        <div className="mt-14 space-y-4">
          {BLOGS.map((post) => (
            <article key={post.title} className="rounded-2xl border p-6 transition-all hover:-translate-y-0.5" style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.sooty }}>
              <p className="text-xs uppercase tracking-[0.2em] mb-2" style={{ color: PALETTE.greasy }}>{post.date}</p>
              <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: PALETTE.clouded }}>{post.excerpt}</p>
              <a
                href={post.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold"
                style={{ color: PALETTE.clouded }}
              >
                Related reference
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};
