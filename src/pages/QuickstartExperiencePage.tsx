import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Terminal, 
  Zap, 
  Code, 
  ChevronRight, 
  CheckCircle2, 
  Copy, 
  Play, 
  Activity,
  Cpu,
  Smartphone,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  ArrowRight, 
  Info, 
  Layers, 
  Search,
  GitBranch,
  Key
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast, Toaster } from 'sonner';
import { cn } from '../lib/utils';

// --- Components ---

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick 
}: { 
  icon: any; 
  label: string; 
  active?: boolean;
  onClick?: () => void;
}) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group",
      active ? "bg-blue-600/10 text-blue-400" : "text-white/40 hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-blue-400" : "text-white/20 group-hover:text-white/40")} />
    <span className="text-xs font-bold tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="sidebar-active"
        className="ml-auto w-1 h-4 bg-blue-500 rounded-full"
      />
    )}
  </button>
);

const CodeBlock = ({ code, label }: { code: string; label?: string }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-2xl border border-white/5 bg-black/40 overflow-hidden mb-8">
      {label && (
        <div className="px-4 py-2 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest font-bold">{label}</span>
          <button onClick={copy} className="text-white/20 hover:text-white transition-colors">
            {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
      <div className="p-6 overflow-x-auto custom-scrollbar font-mono text-sm text-blue-100/80 leading-relaxed">
        <pre><code>{code}</code></pre>
      </div>
    </div>
  );
};

interface ExecutionLog {
  time: string;
  message: string;
  status?: 'info' | 'success' | 'warning' | 'error';
}

export const QuickstartExperiencePage = ({ onOpenFlowBuilder }: { onOpenFlowBuilder: () => void }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [evaluationRunning, setEvaluationRunning] = useState(false);
  const [evaluationComplete, setEvaluationComplete] = useState(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [trustScore, setTrustScore] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const runEvaluation = async () => {
    setEvaluationRunning(true);
    setEvaluationComplete(false);
    setLogs([]);
    setTrustScore(0);

    const steps = [
      { t: 800, m: 'Initializing transaction evaluation...', s: 'info' },
      { t: 1600, m: 'Fetching CAMARA SIM Swap signal...', s: 'info' },
      { t: 2400, m: 'SIM Swap Detection → HIGH RISK (Swap detected 4h ago)', s: 'warning' },
      { t: 3200, m: 'Checking Device Status (Nokia NAC)...', s: 'info' },
      { t: 4000, m: 'Device Status → UNTRUSTED (New IMEI pairing)', s: 'error' },
      { t: 4800, m: 'Number Verification → VERIFIED', s: 'success' },
      { t: 5600, m: 'Location Verification → MATCHED (Addis Ababa)', s: 'success' },
      { t: 6400, m: 'Aggregating telecom signals...', s: 'info' },
      { t: 7200, m: 'Computing trust score via Shield Engine...', s: 'info' },
      { t: 8000, m: 'Final Decision: VERIFY', s: 'warning' },
    ];

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.t - (logs.length > 0 ? steps[logs.length-1].t : 0)));
      setLogs(prev => [...prev, { time: new Date().toLocaleTimeString([], { hour12: false }), message: step.m, status: step.s as any }]);
    }

    setEvaluationComplete(true);
    setEvaluationRunning(false);
    
    // Animate trust score
    let score = 0;
    const interval = setInterval(() => {
      score += 2;
      if (score >= 62) {
        setTrustScore(62);
        clearInterval(interval);
      } else {
        setTrustScore(score);
      }
    }, 30);
  };

  return (
    <div className="flex h-screen bg-[#0A0F1E] text-white overflow-hidden">
      <Toaster position="top-right" theme="dark" />
      
      {/* Sidebar */}
      <aside className="w-[280px] h-full bg-[#131929] border-r border-white/5 flex flex-col p-6 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <span className="text-xs font-black tracking-[0.3em] uppercase">ShieldGuard</span>
        </div>

        <div className="space-y-1 mb-10">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-4 pl-2">Onboarding</h3>
          <SidebarItem icon={Zap} label="Quickstart" active={activeStep === 1} onClick={() => setActiveStep(1)} />
          <SidebarItem icon={Layers} label="Architecture" active={activeStep === 2} onClick={() => setActiveStep(2)} />
        </div>

        <div className="space-y-1 mb-10">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-4 pl-2">Platform</h3>
          <SidebarItem icon={GitBranch} label="Flow Builder" onClick={onOpenFlowBuilder} />
          <SidebarItem icon={Activity} label="Executions" />
          <SidebarItem icon={Key} label="API Keys" />
        </div>

        <div className="space-y-1">
          <h3 className="text-[10px] font-black tracking-[0.2em] text-white/20 uppercase mb-4 pl-2">Resources</h3>
          <SidebarItem icon={Code} label="SDK Reference" />
          <SidebarItem icon={Search} label="Audit Logs" />
        </div>
        
        <div className="mt-auto pt-6 border-t border-white/5">
           <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-[10px] text-white/40 leading-relaxed">
                Connected to <span className="text-blue-400 font-bold">Nokia Network as Code</span> Sandbox environment.
              </p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar bg-[#0A0F1E] relative">
        <div className="max-w-4xl mx-auto py-20 px-12 pb-32">
          
          <div className="mb-16">
            <Badge variant="outline" className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20 px-2 py-0 font-mono text-[10px]">GUIDE</Badge>
            <h1 className="text-4xl font-black tracking-tight mb-6">Introduction to ShieldGuard</h1>
            <p className="text-lg text-white/40 leading-relaxed font-medium">
              ShieldGuard transforms CAMARA network APIs into real-time verification systems. In this guide, you'll install our SDK and run your first trust evaluation.
            </p>
          </div>

          <section className="space-y-16">
            <div id="step-1">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/40">1</div>
                <h2 className="text-2xl font-bold tracking-tight">Install the SDK</h2>
              </div>
              <p className="text-white/40 mb-6 leading-relaxed">
                Every ShieldGuard integration begins with our infrastructure-grade SDK.
              </p>
              <CodeBlock code="npm install @shieldguard/sdk" label="Terminal" />
            </div>

            <div id="step-2">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/40">2</div>
                <h2 className="text-2xl font-bold tracking-tight">Initialize the Client</h2>
              </div>
              <p className="text-white/40 mb-6 leading-relaxed">
                Initialize with your API key. In this sandbox environment, we've pre-configured a key for you.
              </p>
              <CodeBlock 
                label="TypeScript"
                code={`import { ShieldGuard } from "@shieldguard/sdk"\n\nconst shield = new ShieldGuard({\n  apiKey: process.env.SHIELDGUARD_API_KEY\n})`} 
              />
            </div>

            <div id="step-3">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/40">3</div>
                <h2 className="text-2xl font-bold tracking-tight">Run First Evaluation</h2>
              </div>
              <p className="text-white/40 mb-8 leading-relaxed">
                Now, let's trigger a high-risk transaction evaluation. Click the button below to see ShieldGuard orchestrate CAMARA signals in real-time.
              </p>

              <div className="p-8 rounded-[40px] bg-[#131929] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                  <Shield className="w-64 h-64 text-blue-400" />
                </div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase mb-6">Evaluation Input</h4>
                      <div className="space-y-4">
                        {[
                          { label: 'MSISDN', value: '+251 912 345 678', icon: Smartphone },
                          { label: 'Amount', value: '15,000.00 ETB', icon: Activity },
                          { label: 'Device ID', value: 'dev_shield_0x942', icon: Cpu },
                          { label: 'Region', value: 'Addis Ababa', icon: MapPin },
                        ].map(item => (
                          <div key={item.label} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                             <div className="flex items-center gap-3">
                               <item.icon className="w-4 h-4 text-white/20" />
                               <span className="text-[11px] font-bold text-white/40 uppercase tracking-wider">{item.label}</span>
                             </div>
                             <span className="text-xs font-mono text-white/80 font-bold">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={runEvaluation}
                      disabled={evaluationRunning}
                      className="w-full h-14 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                    >
                      {evaluationRunning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          ORCHESTRATING...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          RUN EVALUATION
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-8 flex flex-col h-full">
                    <h4 className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase mb-6">Live Orchestration</h4>
                    
                    <div 
                      ref={scrollRef}
                      className="flex-1 bg-black/60 rounded-3xl border border-white/10 p-6 font-mono text-[11px] h-[340px] overflow-y-auto custom-scrollbar flex flex-col gap-3"
                    >
                      <AnimatePresence>
                        {logs.length === 0 && !evaluationRunning && (
                          <div className="h-full flex flex-col items-center justify-center text-white/10 opacity-50">
                             <Terminal className="w-12 h-12 mb-4" />
                             <p className="text-center italic">Waiting for execution trigger...</p>
                          </div>
                        )}
                        {logs.map((log, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-4 leading-relaxed"
                          >
                            <span className="text-white/20 whitespace-nowrap">[{log.time}]</span>
                            <span className={cn(
                              "flex-1",
                              log.status === 'success' ? 'text-emerald-400' :
                              log.status === 'warning' ? 'text-amber-400' :
                              log.status === 'error' ? 'text-red-400' :
                              'text-blue-100/60'
                            )}>
                              {log.message}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    <AnimatePresence>
                      {evaluationComplete && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-6 rounded-[32px] bg-white text-charcoal shadow-2xl relative overflow-hidden"
                        >
                           <div className="flex items-center justify-between mb-4 relative z-10">
                              <div>
                                <h5 className="text-[10px] font-black tracking-widest text-charcoal/30 uppercase">Final Decision</h5>
                                <div className="text-3xl font-black text-amber-500 flex items-center gap-3">
                                  VERIFY
                                  <AlertTriangle className="w-8 h-8" />
                                </div>
                              </div>
                              <div className="text-right">
                                <h5 className="text-[10px] font-black tracking-widest text-charcoal/30 uppercase">Trust Score</h5>
                                <div className="text-4xl font-black text-charcoal tracking-tighter">{trustScore}%</div>
                              </div>
                           </div>
                           <p className="text-[11px] font-medium text-charcoal/60 leading-relaxed relative z-10 bg-black/5 p-4 rounded-2xl italic">
                            Recent SIM swap detected within 4 hours. Authenticated on Familiar Device ID but with high value transfer deviation from Addis Ababa region.
                           </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>

            {evaluationComplete && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="pt-20 space-y-12"
              >
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-bold tracking-tight mb-6">Build the Logic</h2>
                  <p className="text-white/40 leading-relaxed text-lg mb-8">
                    You've seen standard orchestration. Now, use our Flow Builder to customize the logic, add carrier-specific rules, and define your own risk policies.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={onOpenFlowBuilder}
                      className="h-16 rounded-2xl bg-white text-charcoal hover:bg-neutral-200 font-black text-sm tracking-widest flex items-center justify-center gap-3"
                    >
                      OPEN FLOW BUILDER
                      <GitBranch className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" className="h-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-sm tracking-widest flex items-center justify-center gap-3">
                      VIEW EXECUTION
                      <Activity className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
                      <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 w-fit">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Enterprise Trust Dashboard</h4>
                      <p className="text-[11px] text-white/30 leading-relaxed">
                        Monitor network signals and transaction drift across your entire application fleet in real-time.
                      </p>
                      <button className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-2 pt-2">
                        Inspect Dashboard <ArrowRight className="w-3 h-3" />
                      </button>
                   </div>

                   <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 space-y-4">
                      <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 w-fit">
                        <Code className="w-6 h-6 text-blue-400" />
                      </div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest">Generate SDK Snippet</h4>
                      <p className="text-[11px] text-white/30 leading-relaxed">
                        ShieldGuard dynamically generates type-safe implementation code based on your visual flow logic.
                      </p>
                      <button className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-300 transition-colors flex items-center gap-2 pt-2">
                        Get Snippet <ArrowRight className="w-3 h-3" />
                      </button>
                   </div>
                </div>
              </motion.div>
            )}
          </section>

        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
};
