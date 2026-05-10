/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { 
  Shield, 
  Github, 
  ChevronDown, 
  ArrowRight, 
  Terminal as TerminalIcon, 
  CheckCircle2, 
  Smartphone, 
  Database, 
  Activity, 
  Cpu, 
  Globe, 
  Search, 
  MessageSquare,
  Network,
  Users,
  Code2,
  Lock,
  Layers,
  Zap,
  MousePointer2,
  AlertCircle,
  Menu,
  X,
  RefreshCw,
  ExternalLink,
  MapPin,
  ScanFace,
  RadioTower,
  Fingerprint,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';
import { DeveloperExperiencePage } from './pages/DeveloperExperiencePage';
import { QuickstartExperiencePage } from './pages/QuickstartExperiencePage';
import { DeveloperPlaygroundPage } from './pages/DeveloperPlaygroundPage';
import { DocumentationPage } from './pages/DocumentationPage';
import { LogicPhoto } from './components/LogicPhoto';
import { Badge } from './components/ui/badge';
import { supabase } from './lib/supabase';
import { GlobeComponent } from './components/GlobeComponent';
import { Toaster } from 'sonner';
import LineWaves from './components/LineWaves';
import { cn } from './lib/utils';

// --- Types ---
interface NavItem {
  label: string;
  items?: { title: string; desc: string; icon: any }[];
}

// --- Components ---

const Navbar = ({ onOpenFlowBuilder, onOpenDocs, gateAuth, onSignIn }: { 
    onOpenFlowBuilder: () => void, 
    onOpenDocs: () => void,
    gateAuth: (target: any) => void,
    onSignIn: () => void
  }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: NavItem[] = [
    {
      label: 'Products',
      items: [
        { title: 'ShieldGuard API', desc: 'Real-time transaction trust orchestration', icon: Shield },
        { title: 'Flow Builder', desc: 'Visual telecom verification workflows', icon: Layers },
        { title: 'Trust Dashboard', desc: 'Operational fraud intelligence', icon: Activity },
        { title: 'AI Copilot', desc: 'Natural language fraud investigation', icon: MessageSquare },
        { title: 'CAMARA Gateway', desc: 'Unified telecom network integrations', icon: Network },
      ]
    },
    {
      label: 'Developers',
      items: [
        { title: 'Docs', desc: 'Comprehensive guides and APIs', icon: Code2 },
        { title: 'SDKs', desc: 'Ready-to-use client libraries', icon: Zap },
        { title: 'API Reference', desc: 'Detailed endpoint documentation', icon: Database },
        { title: 'Quickstart', desc: 'Get up and running in minutes', icon: ArrowRight },
      ]
    },
    {
      label: 'Resources',
      items: [
        { title: 'Blog', desc: 'Insights and tech deep dives', icon: MessageSquare },
        { title: 'Changelog', desc: 'Latest updates and features', icon: Activity },
        { title: 'Architecture', desc: 'System design and security', icon: Layers },
        { title: 'Case Studies', desc: 'Real-world fraud reduction', icon: Users },
      ]
    },
    {
      label: 'Company',
      items: [
        { title: 'Vision', desc: 'The future of telecom trust', icon: Globe },
        { title: 'About', desc: 'Our mission and the team', icon: Users },
        { title: 'Contact', desc: 'Talk to our infra experts', icon: MessageSquare },
      ]
    }
  ];

  const openGithubRepo = () => {
    window.open('https://github.com/yab-g4u/shield-guard.git', '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick = (sub: any) => {
    setIsOpen(false);
    if (sub.title === 'Flow Builder') onOpenFlowBuilder();
    else if (sub.title === 'Docs' || sub.title === 'Documentation' || sub.title === 'API Reference') onOpenDocs();
    else if (sub.title === 'Quickstart') gateAuth('quickstart');
    else if (sub.title === 'Trust Dashboard') gateAuth('playground');
    else if (sub.title === 'AI Copilot') {
      const el = document.getElementById('copilot');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (sub.title === 'ShieldGuard API' || sub.title === 'CAMARA Gateway' || sub.title === 'SDKs') {
      onOpenDocs();
    }
    else if (sub.title === 'Architecture') {
      const el = document.getElementById('architecture');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (sub.title === 'Vision' || sub.title === 'About') {
      const el = document.getElementById('vision');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    else if (sub.title === 'GitHub') {
      openGithubRepo();
    }
    else if (sub.title === 'Research' || sub.title === 'Careers' || sub.title === 'Pricing' || sub.title === 'API Status') {
       toast.info(`${sub.title} module is coming soon!`);
    }
    else if (sub.title === 'Blog' || sub.title === 'Changelog' || sub.title === 'Case Studies' || sub.title === 'Contact') {
      toast.info(`${sub.title} module is coming soon!`, {
        description: "We are currently finalizing this section of the platform."
      });
    }
  };

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-[60] transition-all duration-500 border-b",
          scrolled 
            ? "h-14 bg-charcoal/90 backdrop-blur-xl border-white/10" 
            : "h-20 bg-transparent border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center transition-transform group-hover:scale-110 duration-500">
                <Shield className="w-5 h-5 text-charcoal" />
              </div>
              <span className="font-semibold text-lg tracking-tight text-white">ShieldGuard</span>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              {navItems.map((item) => (
                <div 
                  key={item.label}
                  className="relative group h-full flex items-center"
                  onMouseEnter={() => setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors duration-300">
                    {item.label} 
                    <ChevronDown className="w-3.5 h-3.5 opacity-40 group-hover:rotate-180 transition-transform duration-300" />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === item.label && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[520px] pt-4"
                      >
                        <div className="p-6 bg-charcoal/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            {item.items?.map((sub) => (
                              <div 
                                key={sub.title} 
                                className="group/item flex gap-4 cursor-pointer"
                                onClick={() => handleLinkClick(sub)}
                              >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/item:bg-white/10 transition-all duration-300">
                                  <sub.icon className="w-5 h-5 text-white/40 group-hover/item:text-white transition-colors" />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-sm font-semibold text-white/90 group-hover/item:text-blue-400 transition-colors">{sub.title}</span>
                                  <span className="text-xs text-white/30 leading-tight group-hover/item:text-white/50">{sub.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={openGithubRepo}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors duration-300"
            >
              <Github className="w-4 h-4" /> GitHub
            </button>
            <button 
              onClick={onOpenDocs}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/50 hover:text-white transition-colors duration-300"
            >
              Docs
            </button>
            <button 
              onClick={onOpenFlowBuilder}
              className="px-5 py-2.5 text-sm font-semibold bg-white text-charcoal rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-lg shadow-white/5"
            >
              Live Demo
            </button>
            <button 
              className="lg:hidden p-2 text-white/60 hover:text-white transition-colors" 
              onClick={() => setIsOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-charcoal flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6" />
                <span className="font-bold text-lg">ShieldGuard</span>
              </div>
              <button 
                className="p-2 text-white/60" 
                onClick={() => setIsOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {navItems.map((item) => (
                <div key={item.label} className="space-y-4">
                  <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em]">{item.label}</h3>
                  <div className="grid grid-cols-1 gap-6">
                    {item.items?.map((sub) => (
                      <div key={sub.title} className="flex gap-4 cursor-pointer" onClick={() => handleLinkClick(sub)}>
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <sub.icon className="w-5 h-5 text-white/40" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-semibold">{sub.title}</span>
                          <span className="text-sm text-white/40 leading-snug">{sub.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-white/5 space-y-4 bg-white/5 backdrop-blur-xl">
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onSignIn();
                }}
                className="w-full py-4 bg-white text-charcoal rounded-xl font-bold text-lg active:scale-[0.98] transition-transform"
              >
                Sign In
              </button>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onOpenDocs();
                }}
                className="w-full py-4 bg-white/5 text-white rounded-xl font-bold text-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-2 border border-white/10"
              >
                Documentation <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Hero = ({ onOpenFlowBuilder }: { onOpenFlowBuilder: () => void }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LineWaves 
          speed={0.1}
          brightness={0.1}
          color1="#ffffff"
          color2="#3b82f6"
          color3="#10b981"
          mouseInfluence={2}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/20 via-transparent to-charcoal" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-blue-400 tracking-[0.2em] uppercase"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Telecom Network Intelligence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-display font-black tracking-tight mb-8 leading-[0.95] text-white"
        >
          Programmable Trust. <br className="hidden lg:block" /> Built for Telecom.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
        >
          Deploy CAMARA-powered fraud prevention in minutes. Secure your infrastructure with real-time network intelligence.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
        >
          <button 
            onClick={onOpenFlowBuilder}
            className="w-full sm:w-auto px-10 py-5 bg-white text-charcoal rounded-full font-bold text-lg hover:bg-neutral-200 transition-all active:scale-95 shadow-xl shadow-white/10 group"
          >
            <span className="flex items-center gap-2">Start Building <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
          </button>
          <button 
            onClick={onOpenFlowBuilder}
            className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            Live Demo <ExternalLink className="w-4 h-4 opacity-40" />
          </button>
          <a
            href="https://youtu.be/lMdtj3tQHsc?si=bBLd4YNLo_OPmJ0j"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-10 py-5 bg-slate-900/80 border border-white/10 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            Watch Demo <ExternalLink className="w-4 h-4 opacity-40" />
          </a>
        </motion.div>

        {/* Terminal Code Block */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          className="max-w-2xl mx-auto rounded-2xl border border-white/10 bg-black/60 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden text-left relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
            <div className="flex gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em]">ShieldGuard.ts</span>
              <TerminalIcon className="w-3 h-3 text-white/20" />
            </div>
          </div>
          <div className="p-8 font-mono text-sm leading-relaxed relative z-10">
            <div className="flex gap-5">
              <span className="text-white/10 select-none w-4">01</span>
              <span><span className="text-blue-400">const</span> shield = <span className="text-blue-400">new</span> <span className="text-emerald-400">ShieldGuard</span>({`{`}</span>
            </div>
            <div className="flex gap-5">
              <span className="text-white/10 select-none w-4">02</span>
              <span className="pl-4">apiKey: process.env.<span className="text-orange-400">SHIELDGUARD_KEY</span></span>
            </div>
            <div className="flex gap-5">
              <span className="text-white/10 select-none w-4">03</span>
              <span>{`})`}</span>
            </div>
            <div className="flex gap-5 mt-4">
              <span className="text-white/10 select-none w-4">04</span>
              <span><span className="text-blue-400">const</span> result = <span className="text-blue-400">await</span> shield.<span className="text-emerald-400">evaluateTransaction</span>({`{`}</span>
            </div>
            <div className="flex gap-5">
              <span className="text-white/10 select-none w-4">05</span>
              <span className="pl-4">phoneNumber: <span className="text-emerald-300">"+254712345678"</span>,</span>
            </div>
            <div className="flex gap-5">
              <span className="text-white/10 select-none w-4">06</span>
              <span className="pl-4">amount: <span className="text-emerald-300">"50000.00"</span>,</span>
            </div>
            <div className="flex gap-5">
              <span className="text-white/10 select-none w-4">07</span>
              <span className="pl-4">signals: [<span className="text-emerald-300">"sim_swap"</span>, <span className="text-emerald-300">"device_trust"</span>]</span>
            </div>
            <div className="flex gap-5">
              <span className="text-white/10 select-none w-4">08</span>
              <span>{`})`}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Power strip */}
      <div className="absolute bottom-12 left-0 right-0 overflow-hidden">
        <div className="flex items-center justify-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700 whitespace-nowrap px-6">
          {/* ... existing content ... */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"><Network className="w-4 h-4" /> CAMARA APIs</div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"><Database className="w-4 h-4" /> Nokia Network as Code</div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"><Activity className="w-4 h-4" /> SIM Swap</div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"><Smartphone className="w-4 h-4" /> Device Status</div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"><CheckCircle2 className="w-4 h-4" /> Number Verification</div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"><Globe className="w-4 h-4" /> Location Verification</div>
          <div className="flex items-center gap-2 text-xs font-medium tracking-widest uppercase"><Zap className="w-4 h-4" /> QoS on Demand</div>
        </div>
      </div>
    </section>
  );
};

interface SignalCardProps {
  title: string;
  desc: string;
  snippet: string;
  icon: any;
}

const SignalCard = ({ title, desc, snippet, icon: Icon }: SignalCardProps) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col gap-6"
  >
    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center">
      <Icon className="w-6 h-6 text-white/80" />
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed mb-6">{desc}</p>
    </div>
    <div className="mt-auto p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] text-white/30 truncate">
      {snippet}
    </div>
  </motion.div>
);

const TrustedSignalsSection = () => {
  const signals = [
    { title: "SIM Swap Detection", desc: "Real-time detection of unauthorized SIM replacement within second of occurrence.", icon: RefreshCw },
    { title: "Location Intelligence", desc: "Verify transaction location against device network presence with cell-site precision.", icon: MapPin },
    { title: "Device Integrity", desc: "Assess hardware health, rooting status, and OS-level vulnerability scoring.", icon: ScanFace },
    { title: "Network Presence", desc: "Confirm legitimate carrier connectivity and routing paths to prevent VPN spoofing.", icon: RadioTower },
    { title: "Velocity Check", desc: "Analyze cross-carrier transaction frequency to identify high-speed bot attacks.", icon: Activity },
    { title: "KYC Persistence", desc: "Maintain persistent trust scores linked to network identity beyond single transactions.", icon: Fingerprint },
  ];

  return (
    <section id="signals" className="py-40 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase mb-4 block font-bold"
          >
            Network Primitives
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-6"
          >
            Network Trust Signals
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/40 max-w-2xl mx-auto font-medium"
          >
            Direct access to first-party carrier intelligence via CAMARA-compliant APIs.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {signals.map((signal, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-10 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-500 group relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <signal.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors">{signal.title}</h3>
              <p className="text-white/30 text-sm leading-relaxed font-medium">{signal.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

interface ArchitectureNodeProps {
  title: string;
  icon: any;
  active?: boolean;
}

const ArchitectureNode = ({ title, icon: Icon, active = false }: ArchitectureNodeProps) => (
  <div className={cn(
    "relative flex flex-col items-center gap-4 p-6 rounded-2xl border transition-all duration-500",
    active ? "bg-white/5 border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]" : "bg-transparent border-white/5 opacity-50"
  )}>
    <div className={cn(
      "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
      active ? "bg-white text-charcoal" : "bg-white/5 text-white/40"
    )}>
      <Icon className="w-6 h-6" />
    </div>
    <span className="text-sm font-medium text-center whitespace-nowrap">{title}</span>
    {active && (
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
    )}
  </div>
);

const ArchitectureSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { title: "Transaction Trigger", icon: ArrowRight },
    { title: "Signal Orchestration", icon: Network },
    { title: "AI Risk Engine", icon: Cpu },
    { title: "Policy Decision", icon: Lock },
    { title: "Enforcement", icon: Shield },
  ];

  return (
    <section id="architecture" className="py-40 px-6 border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-32">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[10px] font-mono text-emerald-400/80 tracking-[0.25em] uppercase mb-5 block font-bold"
          >
            Orchestration Workflow
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            System Architecture
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/40 max-w-2xl mx-auto"
          >
            A unified low-latency pipeline for multi-carrier telecom intelligence orchestration.
          </motion.p>
        </div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="absolute top-12 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent hidden lg:block -z-10" />
          
          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative"
              >
                <ArchitectureNode 
                  title={step.title}
                  icon={step.icon}
                  active={isActive} 
                />
                {isActive && (
                  <motion.div
                    layoutId="active-pulse"
                    className="absolute inset-0 rounded-2xl bg-blue-500/5 border border-blue-500/20 z-[-5]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                {idx < steps.length - 1 && (
                  <motion.div 
                    animate={isActive ? { opacity: [0, 1, 0], x: [0, 40, 80] } : { opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute top-1/2 -right-4 w-2 h-2 rounded-full bg-blue-400 hidden lg:block"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const FlowBuilderSection = ({ onOpenFlowBuilder }: { onOpenFlowBuilder: () => void }) => {
  return (
    <section className="py-40 px-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-2/5"
        >
          <div className="mb-10">
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase mb-4 block font-bold">Logic Orchestration</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">
              Build trust flows <br /> with <span className="text-blue-500">visual logic.</span>
            </h2>
            <p className="text-lg text-white/50 mb-12 leading-relaxed">
              ShieldGuard's Flow Builder empowers operations teams to compose complex telecom verification sequences without writing a single line of backend code.
            </p>
            
            <div className="space-y-6 mb-12">
              {[
                { title: "Node-based Orchestration", desc: "Connect triggers, signals, and decisions visually." },
                { title: "Real-time Validation", desc: "Instantly test and dry-run network network logic." },
                { title: "Carrier Neutrality", desc: "One cloud interface for every major global carrier." },
              ].map((item, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1 border border-blue-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white/90 mb-1">{item.title}</h4>
                    <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onOpenFlowBuilder}
              className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-3 active:scale-95"
            >
              Open Flow Builder <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="lg:w-3/5 relative"
        >
          <div className="p-1.5 rounded-3xl bg-gradient-to-br from-white/15 via-white/5 to-transparent shadow-[0_40px_100px_rgba(0,0,0,0.6)] relative z-10">
            <div className="relative rounded-[22px] overflow-hidden border border-white/10 bg-black/40 aspect-[16/10] group">
              <LogicPhoto />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const LiveDemoSection = () => {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const stages = [
    { title: "Carrier Ping", status: "Completed", icon: RadioTower, msg: "Handshaking with MT-Saf-Nairobi..." },
    { title: "SIM Integrity", status: "Verified", icon: RefreshCw, msg: "Last swap: 247 days ago. Safe." },
    { title: "Device Trust", status: "Secure", icon: Smartphone, msg: "Attestation: Hardware-backed keystore." },
    { title: "AI Consensus", status: "Approved", icon: Cpu, msg: "Risk Score: 0.02 (Confidence: High)" },
  ];

  return (
    <section id="demo" className="py-40 px-6 relative bg-charcoal/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase mb-6 block font-bold">Latency: 142ms</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">Observe trust <br /> in <span className="text-blue-500">real-time.</span></h2>
            <p className="text-lg text-white/50 mb-12 leading-relaxed">
              Every ShieldGuard verification event is a symphony of sub-second network handshakes. Watch our risk engine orchestrate carrier signals as they happen.
            </p>
            
            <div className="space-y-4">
              {stages.map((stage, idx) => (
                <div 
                  key={idx} 
                  className={`p-6 rounded-2xl border transition-all duration-700 ${
                    idx === activeStage 
                    ? "bg-blue-500/10 border-blue-500/30 translate-x-3" 
                    : idx < activeStage 
                    ? "bg-emerald-500/5 border-emerald-500/10 opacity-70"
                    : "bg-white/[0.02] border-white/5 opacity-40 translate-x-0"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <stage.icon className={`w-4 h-4 ${idx === activeStage ? "text-blue-400" : "text-white/40"}`} />
                      <span className="font-bold text-sm">{stage.title}</span>
                    </div>
                    <span className={`text-[10px] font-mono ${idx <= activeStage ? "text-emerald-400" : "text-white/20"}`}>
                      {idx <= activeStage ? stage.status : "Waiting..."}
                    </span>
                  </div>
                  {idx === activeStage && (
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-white/60 font-mono"
                    >
                      {stage.msg}
                    </motion.p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 flex items-center justify-center relative"
          >
            {/* Visual Phone Model */}
            <div className="w-[340px] h-[700px] border-[12px] border-white/5 rounded-[50px] relative bg-charcoal shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-charcoal rounded-b-2xl z-50 px-4 flex items-center justify-center">
                <div className="w-12 h-1 rounded-full bg-white/5" />
              </div>
              
              <div className="p-8 h-full flex flex-col pt-12">
                <div className="flex justify-between items-center mb-12">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <ArrowLeft className="w-4 h-4 text-white/40" />
                  </div>
                  <span className="font-bold text-lg">Verification</span>
                  <div className="w-10 h-10 rounded-full bg-white/5" />
                </div>

                <div className="text-center mb-12">
                  <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-6 relative">
                     <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-blue-500 rounded-full blur-xl"
                     />
                     <ShieldCheck className="w-12 h-12 text-blue-400 relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Analyzing Intent</h3>
                  <p className="text-white/40 text-sm">Processing 12 network signals...</p>
                </div>

                <div className="space-y-4 mb-auto">
                   {stages.slice(0, activeStage + 1).map((s, i) => (
                     <motion.div 
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-4"
                     >
                        <s.icon className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-semibold">{s.title} Passed</span>
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     </motion.div>
                   ))}
                </div>

                <div className="mt-8">
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
                    <motion.div 
                      animate={{ width: `${(activeStage + 1) * 25}%` }}
                      className="h-full bg-blue-500"
                    />
                  </div>
                  <button className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold active:scale-95 transition-transform shadow-xl shadow-blue-500/20">
                    {activeStage === 3 ? "Transaction Secured" : "Verifying Securely..."}
                  </button>
                </div>
              </div>
            </div>

            {/* Background decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[150px] -z-10 rounded-full" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const GlobalIntelligence = () => {
  return (
    <section id="global" className="py-40 px-6 relative overflow-hidden bg-charcoal">
       <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase mb-6 block font-bold">Global Presence</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-[1.1]">Zero-trust <br /> for the <span className="text-blue-500">global south.</span></h2>
            <p className="text-lg text-white/50 mb-12 leading-relaxed font-medium">
              We are building the first unified trust layer across 140+ carriers. From Lagos to Nairobi, ShieldGuard provides a singular interface for network identity.
            </p>
            
            <div className="flex gap-10">
               <div>
                  <div className="text-3xl font-bold mb-2">142</div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Connected Carriers</div>
               </div>
               <div>
                  <div className="text-3xl font-bold mb-2">8.4B</div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Monthly Signals</div>
               </div>
               <div>
                  <div className="text-3xl font-bold mb-2">&lt;140ms</div>
                  <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Avg Latency</div>
               </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-1/2 flex items-center justify-center relative min-h-[500px]"
          >
             <div className="relative w-full h-full">
                <GlobeComponent />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const AICopilotSection = () => {
  const [activeSignal, setActiveSignal] = useState(0);
  const signals = [
    { type: 'SIM_SWAP', status: 'Blocked', icon: <RefreshCw className="w-4 h-4 text-red-400" />, message: "Unauthorized SIM swap detected in Addis Ababa (MNO: Ethio Telecom)" },
    { type: 'GEO_FENCE', status: 'Review', icon: <MapPin className="w-4 h-4 text-amber-400" />, message: "Location mismatch: Transaction initiated from Nairobi, expected Lagos" },
    { type: 'DEVICE_ID', status: 'Allowed', icon: <Smartphone className="w-4 h-4 text-emerald-400" />, message: "Device hardware signature verified. Trust score: 98/100" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSignal((prev) => (prev + 1) % signals.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="copilot" className="py-40 px-6 relative overflow-hidden bg-charcoal/30">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2 relative"
          >
             <div className="relative z-10 p-1.5 rounded-[40px] bg-gradient-to-br from-blue-500/20 via-white/5 to-transparent">
              <div className="bg-charcoal rounded-[34px] p-10 border border-white/10 relative overflow-hidden h-[600px] flex flex-col">
                <div className="flex items-center gap-3 mb-10 pb-6 border-b border-white/5">
                   <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Cpu className="w-5 h-5 text-blue-400" />
                   </div>
                   <div>
                    <h3 className="font-bold text-sm">ShieldGuard Copilot</h3>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">neural-trust-v4</p>
                   </div>
                </div>

                <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pt-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0" />
                    <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-sm text-white/60 leading-relaxed border border-white/5">
                      Identify root cause for transaction tx_9a82b failing in Nigeria cluster.
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                      <Shield className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="bg-blue-500/5 p-5 rounded-2xl rounded-tl-none text-sm text-white/80 leading-relaxed border border-blue-500/10">
                      <p className="mb-4">Analysis complete. The failure was triggered by a <span className="text-blue-400 font-bold">Location-Inconsistency</span> signal from MT-NGA-Lagos.</p>
                      
                      <div className="p-4 rounded-xl bg-charcoal border border-blue-500/20 relative overflow-hidden mb-4">
                         <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{signals[activeSignal].type} Analysis</span>
                            <Badge className={cn(
                              "text-[8px] px-1.5 py-0",
                              signals[activeSignal].status === 'Blocked' ? "bg-red-500/10 text-red-400" :
                              signals[activeSignal].status === 'Review' ? "bg-amber-500/10 text-amber-400" :
                              "bg-emerald-500/10 text-emerald-400"
                            )}>
                              {signals[activeSignal].status}
                            </Badge>
                         </div>
                         <p className="text-xs text-white/80 leading-relaxed">
                            {signals[activeSignal].message}
                         </p>
                         <motion.div 
                            key={activeSignal}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 4, ease: "linear" }}
                            className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-blue-500 origin-left"
                         />
                      </div>

                      <p className="mt-4 text-white/40">Recommendation: Automated quarantine initiated.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-4">
                  <div className="flex-1 bg-white/5 h-12 rounded-full px-5 flex items-center transition-all border border-white/5 hover:border-white/10 group cursor-text">
                    <div className="flex items-center gap-2">
                       <div className="w-1 h-3 bg-blue-500 animate-pulse" />
                       <span className="text-white/20 text-sm">Analyze next batch...</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                    <ArrowRight className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase mb-6 block font-bold">AI Orchestration</span>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-8 leading-[1.1]">
              Investigate fraud <br /> at <span className="text-blue-500 text-glow">active speeds.</span>
            </h2>
            <p className="text-lg text-white/50 mb-12 leading-relaxed font-medium">
              ShieldGuard Copilot connects the dots between raw carrier signals and operational intent. It doesn't just surface data—it makes decisions alongside you.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              {[
                { title: "Smart Forensics", desc: "Instantly trace signal origin." },
                { title: "Natural Policies", desc: "Write risk logic in English." },
                { title: "Root Cause AI", desc: "Automated anomaly detection." },
                { title: "Global Sync", desc: "Cross-border pattern matching." },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <h4 className="font-bold text-white/90">{item.title}</h4>
                  <p className="text-sm text-white/30 leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <button className="px-10 py-5 bg-white text-charcoal rounded-full font-bold text-lg hover:bg-neutral-200 transition-all active:scale-95 flex items-center gap-3 shadow-xl shadow-white/5">
              Meet your Copilot <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const DeveloperExperienceSection = () => {
  const [activeTab, setActiveTab] = useState('TypeScript');

  const snippets: Record<string, string> = {
    TypeScript: `import { ShieldGuard } from '@shieldguard/sdk';\n\nconst client = new ShieldGuard(process.env.KEY);\n\n// Evaluate transaction risk\nconst risk = await client.verify({\n  phone: '+234 812 345 6789',\n  context: 'CASH_OUT'\n});\n\nif (risk.isSafe) {\n  processPayment();\n}`,
    Python: `from shieldguard import ShieldGuard\n\nclient = ShieldGuard(api_key="sk_live_...")\n\n# Check network signals\nrisk = client.verify_transaction(\n    phone="+254 712 345 678",\n    amount=5000\n)\n\nprint(f"Trust Score: {risk.score}")`,
    REST: `curl -X POST https://api.shieldguard.io/v1/verify \\\n  -H "Authorization: Bearer sk_live_..." \\\n  -d phone="+233 24 123 4567" \\\n  -d amount="100.00"`
  };

  return (
    <section id="sdk" className="py-40 px-6 relative overflow-hidden bg-black/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3"
          >
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.3em] uppercase mb-6 block font-bold">SDKs & Tooling</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Designed for engineers.</h2>
            <p className="text-white/40 mb-10 leading-relaxed font-medium">Infrastructure-grade SDKs and APIs that prioritize reliability, speed, and DX above all else.</p>
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between mb-10 group hover:border-white/20 transition-colors">
              <code className="text-sm text-white/80 font-mono">npm install @shieldguard/sdk</code>
              <TerminalIcon className="w-4 h-4 text-white/20 group-hover:text-blue-400 transition-colors" />
            </div>
            <button className="text-blue-400 text-sm font-bold hover:text-blue-300 transition-colors flex items-center gap-2 group">
              Read full documentation <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-2/3"
          >
             <div className="rounded-[32px] border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl">
               <div className="flex border-b border-white/5 bg-white/5 px-6">
                  {['TypeScript', 'Python', 'REST API'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "px-6 py-5 text-[10px] font-bold font-mono tracking-[0.2em] transition-all relative uppercase",
                        activeTab === tab ? "text-white" : "text-white/30 hover:text-white/50"
                      )}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500" />
                      )}
                    </button>
                  ))}
               </div>
               <div className="p-10 font-mono text-sm leading-loose overflow-x-auto bg-black/40 h-[400px]">
                  <pre className="text-white/60">
                    <code className="block">
                      {snippets[activeTab === 'REST API' ? 'REST' : activeTab]}
                    </code>
                  </pre>
               </div>
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const WhyShieldGuard = () => {
  return (
    <section id="vision" className="py-32 px-6 bg-charcoal">
       <div className="max-w-7xl mx-auto text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Programmable trust for the next billion.</h2>
          <p className="text-lg text-white/40 max-w-2xl mx-auto">Solving African mobile money trust infrastructure with carrier-grade intelligence.</p>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-6xl mx-auto text-left">
          {[
            { title: "Mobile Money Focus", desc: "Built specifically for the nuances of mobile-first economies where the SIM card is the identity anchor." },
            { title: "Reducing Operational Fraud", desc: "Aggressive reduction of account takeovers and transaction fraud using real-time network signals." },
            { title: "Scalable Verification", desc: "Uniform access to multi-carrier APIs across more than 20 African markets via a single integration." },
            { title: "Telecom Intelligence", desc: "Go beyond IP and browser fingerprinting. Access carrier-verified identity data directly." },
            { title: "Dev-First Infra", desc: "No complex enterprise sales 18-month lead times. Get an API key and start building today." },
            { title: "Regional Sovereignty", desc: "Data residency and compliance built-in for key African jurisdictions out of the box." },
          ].map(item => (
            <div key={item.title} className="space-y-4">
              <h3 className="text-lg font-semibold text-white/80">{item.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
            </div>
          ))}
       </div>
    </section>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          <div className="col-span-2 space-y-6">
             <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Shield className="w-5 h-5" />
                <span className="font-bold tracking-tight text-lg">ShieldGuard</span>
             </div>
             <p className="text-sm text-white/30 max-w-xs leading-relaxed">
               Programmable telecom trust infrastructure for the world's fastest growing financial ecosystems.
             </p>
          </div>
          
          {[
            { label: 'Product', links: ['ShieldGuard API', 'Flow Builder', 'Trust Dashboard', 'Pricing'] },
            { label: 'Developers', links: ['Documentation', 'API Status', 'GitHub', 'SDKs'] },
            { label: 'Resources', links: ['Blog', 'Changelog', 'Case Studies', 'Research'] },
            { label: 'Company', links: ['About', 'Vision', 'Careers', 'Contact'] },
          ].map(col => (
             <div key={col.label} className="space-y-4">
               <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest">{col.label}</h4>
               <ul className="space-y-2">
                 {col.links.map(link => (
                    <li key={link}>
                      <button 
                        onClick={() => onNavigate(link)}
                        className="text-sm text-white/30 hover:text-white transition-colors text-left"
                      >
                        {link}
                      </button>
                    </li>
                 ))}
               </ul>
             </div>
          ))}
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/5 text-[11px] text-white/20 uppercase font-mono tracking-widest">
           <div className="flex items-center gap-6">
             <span>&copy; 2026 SHIELDGUARD INC.</span>
             <button onClick={() => toast.info("Privacy Policy coming soon")} className="hover:text-white">PRIVACY POLICY</button>
             <button onClick={() => toast.info("Terms of Service coming soon")} className="hover:text-white">TERMS OF SERVICE</button>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span>SYSTEMS OPERATIONAL</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

import FlowBuilderPage from './pages/FlowBuilderPage';

export default function App() {
  type AppView = 'landing' | 'experience-choice' | 'quickstart' | 'flow-builder' | 'playground' | 'auth' | 'docs';
  const [navigation, setNavigation] = useState<{ history: AppView[]; index: number }>({ history: ['landing'], index: 0 });
  const view = navigation.history[navigation.index];
  const canGoBack = navigation.index > 0;
  const canGoForward = navigation.index < navigation.history.length - 1;
  const [session, setSession] = useState<any>(null);
  const [pendingView, setPendingView] = useState<AppView | null>(null);

  const pushView = (nextView: AppView) => {
    setNavigation((prev) => {
      if (prev.history[prev.index] === nextView) return prev;
      const nextHistory = [...prev.history.slice(0, prev.index + 1), nextView];
      return { history: nextHistory, index: nextHistory.length - 1 };
    });
  };

  const goBack = () => {
    setNavigation((prev) => {
      if (prev.index === 0) return prev;
      return { ...prev, index: prev.index - 1 };
    });
  };

  const goForward = () => {
    setNavigation((prev) => {
      if (prev.index >= prev.history.length - 1) return prev;
      return { ...prev, index: prev.index + 1 };
    });
  };

  useEffect(() => {
    // Check local session for simulation
    const localSession = localStorage.getItem('shieldguard_session');
    if (localSession) {
      setSession(JSON.parse(localSession));
    }
    
    // Original listener logic could still be here but we prioritize local for demo
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      // Only set session if it's real, otherwise rely on local for demo
      if (session) setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [pendingView]);

  const gateAuth = (target: AppView) => {
    const localSession = localStorage.getItem('shieldguard_session');
    if (session || localSession) {
      if (localSession && !session) setSession(JSON.parse(localSession));
      pushView(target);
    } else {
      setPendingView(target);
      onJoinDemo();
    }
  };

  const goToFlowBuilder = () => gateAuth('flow-builder');
  const goToQuickstart = () => gateAuth('quickstart');
  const goToPlayground = () => gateAuth('playground');
  const goToDocs = () => pushView('docs');
  
  const goToExperienceChoice = () => {
    pushView('experience-choice');
  };

  const onJoinDemo = () => {
    const mockSession = {
      user: {
        id: 'demo-user-123',
        email: 'developer@example.com',
        user_metadata: { full_name: 'Demo Architect' }
      },
      access_token: 'mock-token-' + Math.random().toString(36).substring(7),
    };
    localStorage.setItem('shieldguard_session', JSON.stringify(mockSession));
    setSession(mockSession as any);
    
    if (pendingView) {
      pushView(pendingView);
      setPendingView(null);
    } else {
      pushView('experience-choice');
    }
    toast.success('Entering ShieldGuard Demo Environment');
  };

  if (view === 'auth') {
    // Skip auth page, go straight to demo session
    onJoinDemo();
    return null;
  }

  if (view === 'docs') {
    return <DocumentationPage onBack={goBack} />;
  }

  if (view === 'experience-choice') {
    return (
      <DeveloperExperiencePage 
        onSelectFlowBuilder={goToFlowBuilder}
        onSelectQuickstart={goToQuickstart}
        onSelectPlayground={goToPlayground} 
      />
    );
  }

  if (view === 'quickstart') {
    return <QuickstartExperiencePage onOpenFlowBuilder={goToFlowBuilder} />;
  }

  if (view === 'flow-builder') {
    return <FlowBuilderPage onBack={goBack} />;
  }

  if (view === 'playground') {
    return <DeveloperPlaygroundPage onBack={goBack} />;
  }

  return (
    <div className="min-h-screen bg-charcoal text-white font-sans selection:bg-white selection:text-charcoal cursor-default overflow-x-hidden">
      <Toaster position="top-right" theme="dark" />
      <Navbar 
        onOpenFlowBuilder={goToExperienceChoice} 
        onOpenDocs={goToDocs} 
        gateAuth={gateAuth}
        onSignIn={() => setView('auth')}
      />
      <div className="relative">
        <Hero onOpenFlowBuilder={goToExperienceChoice} />
        {view !== 'landing' && (
          <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3">
            <button
              onClick={goBack}
              disabled={!canGoBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={goForward}
              disabled={!canGoForward}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40 hover:bg-white/10"
            >
              Forward <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
        
        {/* Transitional background elements */}
        <div className="absolute top-[80vh] left-0 w-full h-[200vh] bg-gradient-to-b from-transparent via-accent/[0.03] to-transparent pointer-events-none -z-10" />
        <div className="absolute top-[300vh] right-0 w-full h-[200vh] bg-gradient-to-b from-transparent via-emerald-400/[0.02] to-transparent pointer-events-none -z-10" />

        <div className="relative z-10">
          <TrustedSignalsSection />
          <ArchitectureSection />
          <FlowBuilderSection onOpenFlowBuilder={goToExperienceChoice} />
          <LiveDemoSection />
          <GlobalIntelligence />
          <AICopilotSection />
          <DeveloperExperienceSection />
          <WhyShieldGuard />
          
          {/* Final CTA */}
          <section className="py-60 px-6 text-center border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-5 grayscale pointer-events-none scale-150">
              <LineWaves speed={0.02} />
            </div>
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="text-5xl md:text-7xl font-bold tracking-tight mb-12"
              >
                Build the future of <br /> transaction trust.
              </motion.h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                  onClick={goToExperienceChoice}
                  className="w-full sm:w-auto px-12 py-6 bg-white text-charcoal rounded-full font-bold text-xl hover:bg-neutral-200 transition-all hover:scale-105 active:scale-95"
                >
                  Start Building
                </button>
                <button 
                  onClick={goToDocs}
                  className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 text-white rounded-full font-bold text-xl hover:bg-white/10 transition-all"
                >
                  Documentation
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer onNavigate={(link) => {
        if (link === 'Flow Builder') goToExperienceChoice();
        else if (link === 'Documentation' || link === 'Docs' || link === 'ShieldGuard API' || link === 'SDKs') goToDocs();
        else if (link === 'Trust Dashboard') goToPlayground();
        else if (link === 'Vision' || link === 'About') {
          document.getElementById('vision')?.scrollIntoView({ behavior: 'smooth' });
        }
        else if (link === 'Case Studies') {
           toast.info("Case Studies module is coming soon!");
        }
        else if (link === 'Contact') {
           toast.info("Contact support module is coming soon!");
        }
        else if (link === 'Blog' || link === 'Changelog' || link === 'Research' || link === 'Careers' || link === 'Pricing' || link === 'API Status') {
           toast.info(`${link} is coming soon!`);
        }
        else if (link === 'GitHub') {
           window.open('https://github.com/yab-g4u/shield-guard.git', '_blank', 'noopener,noreferrer');
        }
      }} />
    </div>
  );
}
