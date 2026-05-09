import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Search, 
  ChevronRight, 
  Copy, 
  Terminal, 
  Layers, 
  Lock, 
  Zap, 
  Code2, 
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  Github,
  Activity,
  Cpu,
  Smartphone,
  MapPin,
  RefreshCw,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

/**
 * Professional Documentation Page reflecting ShieldGuard's Telecom Trust Infrastructure.
 * Follows the high-fidelity design provided.
 */
export const DocumentationPage = ({ onBack }: { onBack: () => void }) => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Sync scroll with sidebar active state
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setActiveSection(e.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(s => observer.observe(s));

    return () => sections.forEach(s => observer.unobserve(s));
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const navSections = [
    {
      title: 'Getting Started',
      items: [
        { id: 'introduction', title: 'Introduction' },
        { id: 'quickstart', title: 'Quickstart' },
        { id: 'architecture', title: 'Architecture Overview' },
        { id: 'authentication', title: 'Authentication' },
      ]
    },
    {
      title: 'SDK',
      items: [
        { id: 'sdk-install', title: 'Installation' },
        { id: 'sdk-init', title: 'Initialization' },
        { id: 'sdk-evaluate', title: 'evaluateTransaction()' },
        { id: 'sdk-policy', title: 'setPolicy()' },
        { id: 'sdk-webhooks', title: 'Webhooks', badge: 'Beta' },
      ]
    },
    {
      title: 'CAMARA Signals',
      items: [
        { id: 'camara-overview', title: 'Signal Orchestration' },
        { id: 'sim-swap', title: 'SIM Swap Detection' },
        { id: 'device-status', title: 'Device Status' },
        { id: 'location-verify', title: 'Location Verification' },
        { id: 'kyc-match', title: 'KYC Match' },
      ]
    },
    {
      title: 'Trust Engine',
      items: [
        { id: 'trust-engine', title: 'Evaluation Engine' },
        { id: 'trust-scoring', title: 'Trust Scoring' },
        { id: 'decision-thresholds', title: 'Decision Thresholds' },
        { id: 'explainability', title: 'Explainability' },
      ]
    },
    {
      title: 'Reference',
      items: [
        { id: 'error-codes', title: 'Error Codes' },
        { id: 'rate-limits', title: 'Rate Limits' },
        { id: 'changelog', title: 'Changelog' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0] flex font-sans selection:bg-[#38bdf8]/30">
      {/* ─── SIDEBAR ─────────────────────────────────────── */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-[268px] bg-[#0d1320] border-r border-[#1e3250]/80 z-50 flex flex-col transition-transform duration-300 transform lg:translate-x-0",
        !isSidebarOpen && "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-5 pb-4 border-b border-[#1e3250]/80">
          <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={onBack}>
            <div className="w-[30px] h-[30px] bg-gradient-to-br from-[#38bdf8] to-[#a78bfa] rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-tight">ShieldGuard</div>
              <div className="font-mono text-[9px] text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/20 px-1 rounded inline-block tracking-widest mt-0.5">DOCS v1.0</div>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-[13px] h-[13px] text-[#475569] group-focus-within:text-[#38bdf8] transition-colors" />
            <input 
              type="text" 
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111827] border border-[#1e3250] rounded-lg py-2 pl-9 pr-10 text-[12.5px] outline-none focus:border-[#38bdf8]/50 transition-all font-sans"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[9px] text-[#475569] bg-[#1a2234] border border-[#1e3250] px-1 rounded">⌘K</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h3 className="text-[10.5px] font-bold text-[#475569] uppercase tracking-[0.07em] px-2.5 py-2">{section.title}</h3>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] transition-all group relative",
                      activeSection === item.id 
                        ? "text-[#38bdf8] bg-[#38bdf8]/10 font-medium" 
                        : "text-[#94a3b8] hover:text-[#e2e8f0] hover:bg-[#1a2234]"
                    )}
                  >
                    {activeSection === item.id && (
                      <div className="absolute left-0 top-[20%] bottom-[20%] w-[2px] bg-[#38bdf8] rounded-r-sm" />
                    )}
                    <div className={cn(
                      "w-[5px] h-[5px] rounded-full flex-shrink-0 transition-colors",
                      activeSection === item.id ? "bg-[#38bdf8]" : "bg-[#475569] group-hover:bg-[#38bdf8]"
                    )} />
                    {item.title}
                    {item.badge && (
                      <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#fbbf24]/10 text-[#fbbf24] border border-[#fbbf24]/20 uppercase tracking-widest leading-none">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-[#1e3250]/80">
          <div className="flex items-center gap-2 text-[11px] text-[#475569] px-3">
             <div className="w-[5px] h-[5px] rounded-full bg-[#34d399]" />
             <span className="font-mono">@shieldguard/sdk@1.0.0</span>
          </div>
        </div>
      </aside>

      {/* ─── MAIN ─────────────────────────────────────── */}
      <div className="flex-1 lg:ml-[268px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 h-[52px] bg-[#080c14]/85 backdrop-blur-xl border-b border-[#1e3250]/80 z-40 flex items-center px-6 lg:px-8">
           <div className="flex items-center gap-1.5 text-[12.5px] text-[#475569]">
              <button 
                onClick={onBack}
                className="hover:text-[#38bdf8] transition-colors"
              >
                Docs
              </button>
              <span>/</span>
              <span className="text-[#94a3b8]">Documentation</span>
           </div>
           
           <div className="ml-auto flex items-center gap-3">
              <a 
                href="https://github.com/ShieldGuard/sdk" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1e3250] text-[12px] font-medium text-[#94a3b8] hover:border-[#38bdf8]/20 hover:text-[#e2e8f0] transition-all"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
              <div className="font-mono text-[10.5px] text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/20 px-2 py-0.5 rounded-full">v1.0.0</div>
           </div>
        </header>

        <div className="flex flex-1">
          {/* Doc Content */}
          <main className="flex-1 px-6 lg:px-10 py-12 max-w-[860px] min-w-0" ref={contentRef}>
            
            {/* Introduction */}
            <section id="introduction" className="mb-16">
              <div className="flex items-center gap-2 text-[#38bdf8] font-mono text-[11px] uppercase tracking-[.1em] mb-2">
                <div className="w-[20px] h-[1px] bg-[#38bdf8]" />
                Documentation
              </div>
              <h1 className="text-4xl font-display font-extrabold tracking-tight text-[#e2e8f0] mb-4 leading-tight">
                ShieldGuard<br />
                <span className="text-[#38bdf8]">Trust Infrastructure</span>
              </h1>
              <p className="text-[16.5px] text-[#94a3b8] leading-relaxed mb-8 max-w-[620px]">
                Programmable telecom-native fraud prevention for African fintechs. Orchestrate CAMARA Open Gateway APIs into real-time trust decisions via a unified SDK.
              </p>

              <div className="bg-gradient-to-br from-[#38bdf8]/5 to-[#a78bfa]/5 border border-[#38bdf8]/15 rounded-xl p-7 mb-10 relative overflow-hidden">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4 relative z-10">
                   <div>
                      <div className="font-mono text-[10px] text-[#475569] uppercase tracking-widest mb-1">Avg Latency</div>
                      <div className="text-[22px] font-extrabold text-[#38bdf8]">420ms</div>
                   </div>
                   <div>
                      <div className="font-mono text-[10px] text-[#475569] uppercase tracking-widest mb-1">CAMARA Signals</div>
                      <div className="text-[22px] font-extrabold text-[#a78bfa]">5 APIs</div>
                   </div>
                   <div>
                      <div className="font-mono text-[10px] text-[#475569] uppercase tracking-widest mb-1">Decision Types</div>
                      <div className="text-[22px] font-extrabold text-[#34d399]">3 Modes</div>
                   </div>
                   <div>
                      <div className="font-mono text-[10px] text-[#475569] uppercase tracking-widest mb-1">Uptime SLA</div>
                      <div className="text-[22px] font-extrabold text-[#fbbf24]">99.9%</div>
                   </div>
                </div>
                <p className="text-[13.5px] text-[#94a3b8] leading-relaxed max-w-[580px] relative z-10">
                  ShieldGuard sits between your transaction layer and your execution logic. When a user initiates a transaction, ShieldGuard orchestrates multiple Nokia Network as Code CAMARA APIs <strong className="text-[#e2e8f0]">in parallel</strong>, fuses the resulting signals into a weighted trust score, and returns an explainable decision.
                </p>
                <div className="absolute right-[-10px] bottom-[-20px] text-[88px] font-black text-[#38bdf8]/5 pointer-events-none select-none">
                  CAMARA
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-12">
                 <button onClick={() => scrollToSection('quickstart')} className="group flex flex-col p-4.5 bg-[#111827] border border-[#1e3250] rounded-xl text-left hover:border-[#38bdf8]/30 transition-all">
                    <span className="text-xl mb-2 group-hover:scale-110 transition-transform block">⚡</span>
                    <span className="text-[14px] font-bold text-[#e2e8f0] mb-1">Quickstart</span>
                    <span className="text-[12.5px] text-[#475569] leading-tight">Up and running in 5 minutes with the SDK</span>
                 </button>
                 <button onClick={() => scrollToSection('sdk-evaluate')} className="group flex flex-col p-4.5 bg-[#111827] border border-[#1e3250] rounded-xl text-left hover:border-[#38bdf8]/30 transition-all">
                    <span className="text-xl mb-2 group-hover:scale-110 transition-transform block">🔌</span>
                    <span className="text-[14px] font-bold text-[#e2e8f0] mb-1">SDK Reference</span>
                    <span className="text-[12.5px] text-[#475569] leading-tight">Complete type definitions for the SDK</span>
                 </button>
                 <button onClick={() => scrollToSection('camara-overview')} className="group flex flex-col p-4.5 bg-[#111827] border border-[#1e3250] rounded-xl text-left hover:border-[#38bdf8]/30 transition-all">
                    <span className="text-xl mb-2 group-hover:scale-110 transition-transform block">📡</span>
                    <span className="text-[14px] font-bold text-[#e2e8f0] mb-1">CAMARA Signals</span>
                    <span className="text-[12.5px] text-[#475569] leading-tight">Understand what each telecom API returns</span>
                 </button>
              </div>
            </section>

            {/* Quickstart */}
            <section id="quickstart" className="mb-20">
              <h2 className="text-[22px] font-display font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Quickstart
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">Learn how to install ShieldGuard and start evaluating transactions immediately.</p>

              <div className="space-y-8">
                <div>
                  <h3 className="text-[16px] font-bold text-[#e2e8f0] mb-3">1. Install the SDK</h3>
                  <div className="bg-[#0d1320] border border-[#1e3250] rounded-lg overflow-hidden my-4">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-[#1e3250]">
                       <span className="font-mono text-[11px] uppercase tracking-wider text-[#475569]">bash</span>
                       <button onClick={() => copyToClipboard('npm install @shieldguard/sdk')} className="text-[#475569] hover:text-[#38bdf8] transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="p-4.5 font-mono text-[13px] leading-relaxed">
                      <div className="text-[#475569] italic"># install via npm</div>
                      <div><span className="text-[#38bdf8] font-bold">npm</span> install @shieldguard/sdk</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[16px] font-bold text-[#e2e8f0] mb-3">2. Initialize and Evaluate</h3>
                  <div className="bg-[#0d1320] border border-[#1e3250] rounded-lg overflow-hidden my-4">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#111827] border-b border-[#1e3250]">
                       <span className="font-mono text-[11px] uppercase tracking-wider text-[#475569]">typescript</span>
                       <button onClick={() => copyToClipboard('const shield = new ShieldGuard({ apiKey: process.env.SHIELDGUARD_KEY });')} className="text-[#475569] hover:text-[#38bdf8] transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="p-4.5 font-mono text-[13px] leading-relaxed overflow-x-auto whitespace-pre">
                      <span className="text-[#c084fc]">import</span> <span className="text-[#e2e8f0]">{`{ ShieldGuard }`}</span> <span className="text-[#c084fc]">from</span> <span className="text-[#86efac]">"@shieldguard/sdk"</span>;{'\n\n'}
                      <span className="text-[#c084fc]">const</span> <span className="text-[#e2e8f0]">shield</span> <span className="text-[#94a3b8]">=</span> <span className="text-[#c084fc]">new</span> <span className="text-[#38bdf8]">ShieldGuard</span>({`{`}{'\n'}
                      {'  '}<span className="text-[#fbbf24]">apiKey</span><span className="text-[#94a3b8]">:</span> <span className="text-[#e2e8f0]">process</span><span className="text-[#94a3b8]">.</span><span className="text-[#e2e8f0]">env</span><span className="text-[#94a3b8]">.</span><span className="text-[#e2e8f0]">SHIELDGUARD_KEY</span>{'\n'}
                      {`})`};{'\n\n'}
                      <span className="text-[#c084fc]">const</span> <span className="text-[#e2e8f0]">result</span> <span className="text-[#94a3b8]">=</span> <span className="text-[#c084fc]">await</span> <span className="text-[#e2e8f0]">shield</span><span className="text-[#94a3b8]">.</span><span className="text-[#38bdf8]">evaluateTransaction</span>({`{`}{'\n'}
                      {'  '}<span className="text-[#fbbf24]">phoneNumber</span><span className="text-[#94a3b8]">:</span> <span className="text-[#86efac]">"+251911223344"</span>,{'\n'}
                      {'  '}<span className="text-[#fbbf24]">amount</span><span className="text-[#94a3b8]">:</span> <span className="text-[#fb923c]">500</span>,{'\n'}
                      {'  '}<span className="text-[#fbbf24]">deviceId</span><span className="text-[#94a3b8]">:</span> <span className="text-[#86efac]">"device_123"</span>{'\n'}
                      {`})`};
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-[#38bdf8]/10 border border-[#38bdf8]/20 rounded-lg p-4 flex gap-3 text-[13.5px]">
                 <Info className="w-4 h-4 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                 <div>
                    <strong className="text-[#38bdf8] block mb-1">Environment Variables</strong>
                    <span className="text-[#94a3b8]">Add <code>SHIELDGUARD_KEY</code> to your environment. Never expose your secret key in frontend code.</span>
                 </div>
              </div>
            </section>

            {/* Architecture Overview */}
            <section id="architecture" className="mb-20">
              <h2 className="text-[22px] font-display font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Architecture Overview
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                ShieldGuard is a layered trust infrastructure platform. Every evaluation passes through 5 distinct orchestration stages.
              </p>

              <div className="bg-[#0d1320] border border-[#1e3250] rounded-xl p-8 text-center my-6">
                <div className="flex flex-col items-center gap-0">
                  <div className="bg-[#111827] border border-[#38bdf8]/30 text-[#38bdf8] px-6 py-3 rounded-lg font-bold text-sm min-w-[240px]">
                    Client Request
                    <div className="font-mono text-[10px] text-[#475569] font-normal mt-1">SDK Call / HTTP Post</div>
                  </div>
                  <div className="w-[1px] h-[30px] bg-[#1e3250] relative flex items-center justify-center">
                    <div className="absolute bottom-[-1px] border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#1e3250]" />
                  </div>
                  <div className="bg-[#111827] border border-[#1e3250] text-[#e2e8f0] px-6 py-3 rounded-lg font-bold text-sm min-w-[240px]">
                    API Gateway
                    <div className="font-mono text-[10px] text-[#475569] font-normal mt-1">POST /v1/evaluate</div>
                  </div>
                  <div className="w-[1px] h-[30px] bg-[#1e3250] relative flex items-center justify-center">
                    <div className="absolute bottom-[-1px] border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#1e3250]" />
                  </div>
                  <div className="bg-[#111827] border border-[#a78bfa]/30 text-[#a78bfa] px-6 py-3 rounded-lg font-bold text-sm min-w-[240px]">
                    CAMARA Signal Orchestrator
                    <div className="font-mono text-[10px] text-[#475569] font-normal mt-1">SIM Swap · Device · Location · KYC</div>
                  </div>
                  <div className="w-[1px] h-[30px] bg-[#1e3250] relative flex items-center justify-center">
                    <div className="absolute bottom-[-1px] border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#1e3250]" />
                  </div>
                  <div className="bg-[#111827] border border-[#34d399]/30 text-[#34d399] px-6 py-3 rounded-lg font-bold text-sm min-w-[240px]">
                    Trust Evaluation Engine
                    <div className="font-mono text-[10px] text-[#475569] font-normal mt-1">ALLOW · VERIFY · BLOCK</div>
                  </div>
                  <div className="w-[1px] h-[30px] bg-[#1e3250] relative flex items-center justify-center">
                    <div className="absolute bottom-[-1px] border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] border-t-[#1e3250]" />
                  </div>
                  <div className="bg-[#111827] border border-[#1e3250] text-[#e2e8f0] px-6 py-3 rounded-lg font-bold text-sm min-w-[240px]">
                    Decision Response & Explainer
                    <div className="font-mono text-[10px] text-[#475569] font-normal mt-1">Human-readable Reasons</div>
                  </div>
                </div>
              </div>
            </section>

             {/* Authentication */}
             <section id="authentication" className="mb-20">
              <h2 className="text-[22px] font-display font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Authentication
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                All API requests must be authenticated using a Bearer token in the Authorization header.
              </p>
              <div className="bg-[#0d1320] border border-[#1e3250] rounded-lg overflow-hidden my-4 p-5 font-mono text-[13px] leading-relaxed">
                 <div className="flex gap-4"><span className="text-[#475569]">Authorization:</span> <span className="text-[#38bdf8]">Bearer sg_live_...</span></div>
              </div>
            </section>

            {/* SDK Installation */}
            <section id="sdk-install" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                SDK Installation
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                The ShieldGuard SDK is available as a scoped npm package. It requires Node.js 18.x or later.
              </p>

              <div className="bg-[#0d1320] border border-[#1e3250] rounded-lg overflow-hidden my-4 font-mono text-[13px] p-5 leading-relaxed">
                 <div className="text-[#475569]"># via npm</div>
                 <div>npm install @shieldguard/sdk</div>
                 <div className="mt-2 text-[#475569]"># via yarn</div>
                 <div>yarn add @shieldguard/sdk</div>
              </div>
            </section>

             {/* SDK Initialization */}
             <section id="sdk-init" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Initialization
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                Initialize the SDK with your API key and optional configuration.
              </p>

              <div className="bg-[#0d1320] border border-[#1e3250] rounded-lg overflow-hidden my-4 font-mono text-[13px] p-5 leading-relaxed whitespace-pre overflow-x-auto">
<span className="text-[#c084fc]">const</span> <span className="text-[#e2e8f0]">shield</span> <span className="text-[#94a3b8]">=</span> <span className="text-[#c084fc]">new</span> <span className="text-[#38bdf8]">ShieldGuard</span>({`{`}{'\n'}
{'  '}<span className="text-[#fbbf24]">apiKey</span><span className="text-[#94a3b8]">:</span> <span className="text-[#86efac]">"sg_live_..."</span>,{'\n'}
{'  '}<span className="text-[#fbbf24]">baseUrl</span><span className="text-[#94a3b8]">:</span> <span className="text-[#86efac]">"https://api.shieldguard.com"</span>,{'\n'}
{'  '}<span className="text-[#fbbf24]">timeout</span><span className="text-[#94a3b8]">:</span> <span className="text-[#fb923c]">5000</span>,{'\n'}
{'  '}<span className="text-[#fbbf24]">maxRetries</span><span className="text-[#94a3b8]">:</span> <span className="text-[#fb923c]">3</span>{'\n'}
{`}`});
              </div>
            </section>

            {/* SDK evaluateTransaction */}
            <section id="sdk-evaluate" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                evaluateTransaction()
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                The core logic engine. It probes telecom network signals and returns a comprehensive trust decision.
              </p>

              <div className="bg-[#0d1320] border border-[#1e3250] rounded-lg overflow-hidden my-4 font-mono text-[13px] p-5 leading-relaxed whitespace-pre overflow-x-auto">
<span className="text-[#c084fc]">const</span> <span className="text-[#e2e8f0]">result</span> <span className="text-[#94a3b8]">=</span> <span className="text-[#c084fc]">await</span> <span className="text-[#e2e8f0]">shield</span><span className="text-[#94a3b8]">.</span><span className="text-[#38bdf8]">evaluateTransaction</span>({`{`}{'\n'}
{'  '}<span className="text-[#fbbf24]">phoneNumber</span><span className="text-[#94a3b8]">:</span> <span className="text-[#86efac]">"+251911223344"</span>,{'\n'}
{'  '}<span className="text-[#fbbf24]">amount</span><span className="text-[#94a3b8]">:</span> <span className="text-[#fb923c]">12500</span>,{'\n'}
{'  '}<span className="text-[#fbbf24]">deviceId</span><span className="text-[#94a3b8]">:</span> <span className="text-[#86efac]">"hw_998x2"</span>{'\n'}
{`}`});
              </div>
            </section>

            {/* SDK setPolicy */}
            <section id="sdk-policy" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                setPolicy()
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                Dynamically update risk thresholds and policy flags for the current session.
              </p>

              <div className="bg-[#0d1320] border border-[#1e3250] rounded-lg overflow-hidden my-4 font-mono text-[13px] p-5 leading-relaxed whitespace-pre overflow-x-auto">
<span className="text-[#e2e8f0]">shield</span><span className="text-[#94a3b8]">.</span><span className="text-[#38bdf8]">setPolicy</span>({`{`}{'\n'}
{'  '}<span className="text-[#fbbf24]">blockIfRiskAbove</span><span className="text-[#94a3b8]">:</span> <span className="text-[#fb923c]">80</span>,{'\n'}
{'  '}<span className="text-[#fbbf24]">requireSimSwapClearance</span><span className="text-[#94a3b8]">:</span> <span className="bool text-[#f472b6]">true</span>{'\n'}
{`}`});
              </div>
            </section>

             {/* SDK Webhooks */}
             <section id="sdk-webhooks" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Webhooks
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                Handle asynchronous evaluation updates and verify webhook signatures.
              </p>

              <div className="bg-[#0d1320] border border-[#1e3250] rounded-lg overflow-hidden my-4 font-mono text-[13px] p-5 leading-relaxed whitespace-pre overflow-x-auto">
<span className="text-[#c084fc]">const</span> <span className="text-[#e2e8f0]">isValid</span> <span className="text-[#94a3b8]">=</span> <span className="text-[#e2e8f0]">shield</span><span className="text-[#94a3b8]">.</span><span className="text-[#38bdf8]">verifyWebhook</span><span className="text-[#e2e8f0]">(payload, signature)</span>;
              </div>
            </section>

            {/* CAMARA Signals */}
            <section id="camara-overview" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Signal Orchestration
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-8">
                ShieldGuard orchestrates five telecom-grade signals in parallel via Nokia's Network as Code platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[
                   { name: 'SIM Swap Detection', api: 'sim-swap', icon: RefreshCw, color: 'text-[#38bdf8]', bg: 'bg-[#38bdf8]/10' },
                   { name: 'Device Status', api: 'device-status', icon: Smartphone, color: 'text-[#a78bfa]', bg: 'bg-[#a78bfa]/10' },
                   { name: 'Location Verify', api: 'location-verify', icon: MapPin, color: 'text-[#f87171]', bg: 'bg-[#f87171]/10' },
                   { name: 'KYC Match', api: 'kyc-match', icon: CheckCircle2, color: 'text-[#34d399]', bg: 'bg-[#34d399]/10' },
                 ].map(s => (
                   <div key={s.name} className="p-5 rounded-xl bg-[#111827] border border-[#1e3250] hover:border-[#38bdf8]/30 transition-all">
                      <div className="flex items-center gap-3 mb-3">
                         <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.bg)}>
                            <s.icon className={cn("w-4 h-4", s.color)} />
                         </div>
                         <h4 className="text-[14px] font-bold text-[#e2e8f0]">{s.name}</h4>
                      </div>
                      <div className="font-mono text-[10px] text-[#475569] uppercase tracking-widest mb-3">API · {s.api}</div>
                      <div className="space-y-1.5 border-t border-[#1e3250]/40 pt-3">
                         <div className="flex justify-between text-[12px]"><span className="text-[#475569]">Latency</span><span className="text-[#94a3b8] font-mono">~200ms</span></div>
                         <div className="flex justify-between text-[12px]"><span className="text-[#475569]">Accuracy</span><span className="text-[#94a3b8] font-mono">Carrier-grade</span></div>
                      </div>
                   </div>
                 ))}
              </div>
            </section>

            {/* SIM Swap Precision */}
            <section id="sim-swap" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                SIM Swap Detection
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                Queries the mobile operator's HLR/HSS to check if the SIM associated with a number was recently changed.
              </p>
              <div className="bg-[#fbbf24]/5 border border-[#fbbf24]/10 rounded-xl p-5 flex gap-4">
                 <AlertCircle className="w-5 h-5 text-[#fbbf24] flex-shrink-0 mt-0.5" />
                 <p className="text-[13.5px] text-[#94a3b8]">SIM swap events within the last 24-48 hours are high-probability indicators of Account Takeover (ATO) fraud.</p>
              </div>
            </section>

             {/* Trust Engine */}
             <section id="trust-engine" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Evaluation Engine
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                The evaluation engine converts raw CAMARA signals into a normalized 0–100 trust score.
              </p>
            </section>

             {/* Trust Scoring */}
             <section id="trust-scoring" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Trust Scoring
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <div className="bg-[#0d1320] border border-[#1e3250] rounded-xl p-6 font-mono text-[13px] leading-relaxed">
                 <div><span className="text-[#c084fc]">const</span> <span className="text-[#e2e8f0]">weightedScore</span> <span className="text-[#94a3b8]">=</span></div>
                 <div className="pl-4 mt-2">
                    (<span className="text-[#e2e8f0]">simSwapRisk</span> * <span className="text-[#fb923c]">0.35</span>) +{'\n'}
                    (<span className="text-[#e2e8f0]">deviceTrust</span> * <span className="text-[#fb923c]">0.25</span>) +{'\n'}
                    (<span className="text-[#e2e8f0]">locationMatch</span> * <span className="text-[#fb923c]">0.20</span>) +{'\n'}
                    (<span className="text-[#e2e8f0]">kycMatch</span> * <span className="text-[#fb923c]">0.20</span>)
                 </div>
              </div>
            </section>

            {/* Decision Thresholds */}
            <section id="decision-thresholds" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Decision Thresholds
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                 <div className="p-5 rounded-xl bg-[#34d399]/5 border border-[#34d399]/20 text-center">
                    <div className="text-[11px] font-bold text-[#34d399] uppercase tracking-widest mb-2">ALLOW</div>
                    <div className="text-[24px] font-black text-[#34d399] mb-1">80–100</div>
                    <p className="text-[11px] text-[#475569]">Proceed without friction</p>
                 </div>
                 <div className="p-5 rounded-xl bg-[#fbbf24]/5 border border-[#fbbf24]/20 text-center">
                    <div className="text-[11px] font-bold text-[#fbbf24] uppercase tracking-widest mb-2">REVIEW</div>
                    <div className="text-[24px] font-black text-[#fbbf24] mb-1">50–79</div>
                    <p className="text-[11px] text-[#475569]">Step-up verification required</p>
                 </div>
                 <div className="p-5 rounded-xl bg-[#f87171]/5 border border-[#f87171]/20 text-center">
                    <div className="text-[11px] font-bold text-[#f87171] uppercase tracking-widest mb-2">BLOCK</div>
                    <div className="text-[24px] font-black text-[#f87171] mb-1">0–49</div>
                    <p className="text-[11px] text-[#475569]">Automatic rejection</p>
                 </div>
              </div>
            </section>

            {/* Explainability */}
            <section id="explainability" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Explainability
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <p className="text-[14.5px] text-[#94a3b8] leading-relaxed mb-6">
                Every decision includes an array of human-readable reasons to help your support teams understand why a transaction was flagged.
              </p>
            </section>

             {/* Error Codes Reference */}
             <section id="error-codes" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Error Codes Reference
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <div className="bg-[#111827] border border-[#1e3250] rounded-xl overflow-hidden mt-6">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-[#1a2234] border-b border-[#1e3250]">
                          <th className="px-5 py-3 text-[11px] font-bold text-[#475569] uppercase tracking-wider">Error ID</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-[#475569] uppercase tracking-wider">Status</th>
                          <th className="px-5 py-3 text-[11px] font-bold text-[#475569] uppercase tracking-wider">Default Message</th>
                       </tr>
                    </thead>
                    <tbody className="text-[13px] text-[#94a3b8]">
                       <tr className="border-b border-[#1e3250]/40">
                          <td className="px-5 py-3 font-mono text-[#f87171]">sg_operator_timeout</td>
                          <td className="px-5 py-3">504</td>
                          <td className="px-5 py-3">Telecom network request exceeded 5000ms.</td>
                       </tr>
                       <tr className="border-b border-[#1e3250]/40">
                          <td className="px-5 py-3 font-mono text-[#f87171]">sg_mno_unsupported</td>
                          <td className="px-5 py-3">422</td>
                          <td className="px-5 py-3">MNO for this number is not connected to our gateway.</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
            </section>

            {/* Rate Limits */}
            <section id="rate-limits" className="mb-20">
               <h2 className="text-[22px] font-bold text-[#e2e8f0] flex items-center gap-2 mb-4 pb-2 border-b border-[#1e3250]">
                Rate Limits
                <button className="text-[#475569] font-normal hover:text-[#38bdf8]">#</button>
              </h2>
              <div className="bg-[#111827] border border-[#1e3250] rounded-xl p-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                       <h4 className="text-[14px] font-bold text-[#e2e8f0] mb-2">Sandbox Keys</h4>
                       <p className="text-[13px] text-[#475569]">5 requests / second</p>
                    </div>
                    <div>
                       <h4 className="text-[14px] font-bold text-[#e2e8f0] mb-2">Production (Default)</h4>
                       <p className="text-[13px] text-[#475569]">50 requests / second</p>
                    </div>
                 </div>
              </div>
            </section>

          </main>

          {/* Table of Contents - Right Sidebar */}
          <aside className="hidden xl:block w-[220px] flex-shrink-0 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto pt-12 pr-6">
             <h4 className="text-[10.5px] font-bold text-[#475569] uppercase tracking-[.07em] mb-4">On this page</h4>
             <nav className="flex flex-col gap-2">
                {navSections.find(s => s.items.some(i => i.id === activeSection))?.items.map(item => (
                   <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "text-[12px] text-left py-1.5 px-3 border-l transition-all truncate",
                      activeSection === item.id 
                        ? "text-[#38bdf8] border-[#38bdf8] bg-[#38bdf8]/5 font-medium" 
                        : "text-[#475569] border-[#1e3250] hover:text-[#94a3b8] hover:border-[#475569]"
                    )}
                   >
                    {item.title}
                   </button>
                ))}
             </nav>
          </aside>
        </div>
      </div>

      {/* Floating Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white text-slate-950 rounded-full shadow-2xl z-[100] flex items-center justify-center lg:hidden"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
    </div>
  );
};
