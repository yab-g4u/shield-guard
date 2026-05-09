import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Play, 
  Save, 
  Copy, 
  ChevronRight, 
  Activity, 
  Shield, 
  MapPin, 
  Smartphone, 
  Key, 
  UserCheck, 
  RefreshCw, 
  Search,
  ExternalLink,
  Code,
  Layers,
  History,
  Settings,
  MoreVertical,
  ArrowRight,
  Database,
  BarChart3,
  Globe,
  Lock,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  ChevronDown,
  Fingerprint,
  ArrowUpRight
} from 'lucide-react';
import { Button, buttonVariants } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '../components/ui/tabs';
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from '../components/ui/resizable';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import Editor from '@monaco-editor/react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { gsap } from 'gsap';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

import { geminiService } from '../services/geminiService';

// --- Types ---

interface Scenario {
  id: string;
  name: string;
  description: string;
  payload: any;
  endpoint: string;
  expectedDecision: 'ALLOW' | 'BLOCK' | 'VERIFY';
}

interface ExecutionHistory {
  id: string;
  time: string;
  scenario: string;
  decision: 'ALLOW' | 'BLOCK' | 'VERIFY';
  score: number;
}

interface ExecutionStep {
  id: string;
  time: string;
  message: string;
  status: 'pending' | 'success' | 'warning' | 'error';
  latency?: string;
  details?: string;
}

interface EvaluationResult {
  decision: 'ALLOW' | 'VERIFY' | 'BLOCK';
  trustScore: number;
  confidence: number;
  reasons: string[];
  signals: {
    simSwap: number;
    deviceTrust: number;
    locationMatch: number;
    kycMatch: number;
  };
}

// --- Mock Data ---

const SCENARIOS: Scenario[] = [
  {
    id: 'safe',
    name: 'Standard Transaction',
    description: 'Low-risk profile, consistent device and location.',
    expectedDecision: 'ALLOW',
    endpoint: '/v1/evaluate',
    payload: {
      phoneNumber: "+254712345678",
      transaction: {
        amount: 850.50,
        currency: "KES",
        recipient: "nairobi_power_co"
      },
      device: {
        id: "dev_88219x",
        ip: "102.219.21.4"
      }
    }
  },
  {
    id: 'sim-swap',
    name: 'Critical SIM Swap',
    description: 'SIM replaced 14 mins ago. High-value transfer attempt.',
    expectedDecision: 'BLOCK',
    endpoint: '/v1/evaluate',
    payload: {
      phoneNumber: "+254712345678",
      transaction: {
        amount: 45000.00,
        currency: "KES",
        recipient: "unknown_crypto_wallet"
      },
      device: {
        id: "dev_new_iphone",
        ip: "192.168.1.10"
      }
    }
  },
  {
    id: 'roaming-risk',
    name: 'Roaming Anomaly',
    description: 'Device in roaming state. Mismatch between IP and Cell Site.',
    expectedDecision: 'VERIFY',
    endpoint: '/v1/evaluate',
    payload: {
      phoneNumber: "+254712345678",
      transaction: {
        amount: 1200.00,
        currency: "KES",
        recipient: "duty_free_jfk"
      },
      device: {
        id: "dev_88219x",
        ip: "157.240.241.35"
      }
    }
  }
];

const API_GROUPS = [
  {
    name: 'Workspace',
    items: [
      { id: 'overview', name: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
      { id: 'playground', name: 'Playground', icon: <Terminal className="w-4 h-4" /> },
      { id: 'keys', name: 'API Keys', icon: <Key className="w-4 h-4" /> },
      { id: 'logs', name: 'Logs', icon: <History className="w-4 h-4" /> },
    ]
  }
];

const UsageCard = () => (
  <div className="mx-4 mt-auto mb-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[10px] font-bold text-slate-400">Usage This Month</span>
      <span className="text-[10px] font-bold text-slate-400">12.5%</span>
    </div>
    <div className="flex items-baseline gap-1 mb-3">
      <span className="text-sm font-black text-white">12,458</span>
      <span className="text-[10px] text-slate-500 font-bold">/ 100,000</span>
    </div>
    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
      <div className="h-full bg-emerald-500 w-[12.5%] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
    </div>
    <Button className="w-full bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-[10px] font-black uppercase h-9 rounded-lg">
      Upgrade Plan
    </Button>
  </div>
);

// --- Sub-components ---

const TrustScoreGauge = ({ score }: { score: number }) => {
  const rotation = (score / 100) * 180 - 90;
  
  return (
    <div className="relative flex flex-col items-center">
      <div className="relative w-48 h-28 overflow-hidden">
        {/* Semi-circle segments */}
        <div className="absolute inset-0 border-[12px] border-slate-800 rounded-t-full" />
        
        {/* Color overlay based on score */}
        <svg className="absolute inset-0 w-full h-full -rotate-180 origin-center" viewBox="0 0 100 50">
          <path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="12" 
            strokeLinecap="round" 
          />
          <path 
            d="M 10 50 A 40 40 0 0 1 90 50" 
            fill="none" 
            stroke="url(#gauge-gradient)" 
            strokeWidth="12" 
            strokeLinecap="round" 
            strokeDasharray={`${(score / 100) * 125.6} 125.6`}
          />
          <defs>
            <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="50%" stopColor="#facc15" />
              <stop offset="100%" stopColor="#f87171" />
            </linearGradient>
          </defs>
        </svg>

        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-20 bg-white origin-bottom -translate-x-1/2 transition-transform duration-1000 ease-out"
          style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_white]" />
        </div>
      </div>
      
      {/* Gauge Labels */}
      <div className="flex justify-between w-48 mt-2 text-[8px] font-black uppercase tracking-widest text-slate-500">
        <span className="text-emerald-500">Low</span>
        <span className="text-yellow-500">Medium</span>
        <span className="text-red-500">High</span>
      </div>

      <div className="mt-4 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-black tracking-tighter text-white italic">{score}</span>
          <span className="text-xl font-bold text-slate-500">/ 100</span>
        </div>
        <Badge className={cn(
          "mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
          score > 70 ? "bg-red-500/20 text-red-500 border-red-500/20" :
          score > 40 ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/20" :
          "bg-emerald-500/20 text-emerald-500 border-emerald-500/20"
        )}>
          {score > 70 ? 'High Risk' : score > 40 ? 'Medium Risk' : 'Low Risk'}
        </Badge>
      </div>
    </div>
  );
};

const RiskBreakdown = ({ signals }: { signals: any }) => {
  const items = [
    { name: 'SIM swap detected', value: signals.simSwap === 10 ? 30 : 0, color: 'text-red-400' },
    { name: 'New device detected', value: signals.deviceTrust < 50 ? 25 : 0, color: 'text-red-400' },
    { name: 'High transaction amount', value: signals.kycMatch < 100 ? 27 : 0, color: 'text-orange-400' },
  ].filter(i => i.value > 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
          Risk Breakdown <AlertCircle className="w-3 h-3 opacity-50" />
        </h4>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("w-1.5 h-1.5 rounded-full bg-current", item.color)} />
              <span className="text-[11px] font-bold text-slate-300">{item.name}</span>
            </div>
            <span className={cn("text-[11px] font-black", item.color)}>+{item.value}</span>
          </div>
        ))}
        {items.length === 0 && <span className="text-[11px] font-medium text-slate-500 italic">No significant risks identified</span>}
      </div>
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] font-black text-white uppercase italic">Total Risk Score</span>
        <span className="text-sm font-black text-white">{100 - (signals.simSwap + signals.deviceTrust + signals.locationMatch + signals.kycMatch) / 4}</span>
      </div>
    </div>
  );
};

const FraudSignalTags = ({ signals }: { signals: any }) => {
  const tags = [];
  if (signals.simSwap === 10) tags.push({ id: 'sim_swap', label: 'sim_swap' });
  if (signals.deviceTrust < 50) tags.push({ id: 'device_mismatch', label: 'device_mismatch' });
  if (signals.kycMatch < 100) tags.push({ id: 'amount_anomaly', label: 'amount_anomaly' });

  return (
    <div className="space-y-3">
       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Fraud Signals</h4>
       <div className="flex flex-wrap gap-2">
         {tags.map(tag => (
           <Badge key={tag.id} className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] font-black uppercase py-1 px-2.5">
             {tag.label}
           </Badge>
         ))}
         {tags.length === 0 && <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase py-1 px-2.5">Healthy</Badge>}
       </div>
    </div>
  );
};

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  type: 'live' | 'test';
  usage: number;
}

interface SimulationState {
  simSwap: boolean;
  rootedDevice: boolean;
  highValue: boolean;
  locationMismatch: boolean;
  proxyDetected: boolean;
}

interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  status: number;
  payload: any;
  response: any;
  latency: number;
  score: number;
}

export const DeveloperPlaygroundPage = ({ onBack }: { onBack: () => void }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'playground' | 'keys' | 'logs'>('playground');
  const [activeEndpoint, setActiveEndpoint] = useState('POST /v1/evaluate');
  const [isExecuting, setIsExecuting] = useState(false);
  const [env, setEnv] = useState<'test' | 'live'>('test');
  
  const [simulator, setSimulator] = useState<SimulationState>({
    simSwap: false,
    rootedDevice: false,
    highValue: false,
    locationMismatch: false,
    proxyDetected: false
  });

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [logs, setLogs] = useState<RequestLog[]>([]);
  const [requestBody, setRequestBody] = useState(JSON.stringify({
    phoneNumber: "+254712345678",
    amount: 1500.00,
    deviceId: "dev_88219x",
    location: { city: "Nairobi", country: "KE" }
  }, null, 2));
  
  const [lastResult, setLastResult] = useState<EvaluationResult | null>(null);
  const [currentScenario, setCurrentScenario] = useState<Scenario>(SCENARIOS[0]);
  const [trace, setTrace] = useState<{id: string, time: string, message: string, status: 'success' | 'error' | 'info', latency?: string}[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  
  const traceEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKeys = localStorage.getItem('sg_api_keys');
    const savedLogs = localStorage.getItem('sg_logs');
    if (savedKeys) setApiKeys(JSON.parse(savedKeys));
    else {
      const initial = [
        { id: '1', name: 'Default Test Key', key: 'sg_test_48k29sjx01', created: '2024-11-01', type: 'test', usage: 124 },
        { id: '2', name: 'Production Main', key: 'sg_live_77x2kd991l', created: '2024-11-05', type: 'live', usage: 8902 }
      ];
      setApiKeys(initial as any);
      localStorage.setItem('sg_api_keys', JSON.stringify(initial));
    }
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  const calculateRisk = () => {
    let score = 5;
    if (simulator.simSwap) score += 45;
    if (simulator.rootedDevice) score += 30;
    if (simulator.locationMismatch) score += 20;
    if (simulator.proxyDetected) score += 15;
    if (simulator.highValue) score += 25;
    return Math.min(100, score);
  };

  const handleRunEvaluation = async () => {
    setIsExecuting(true);
    setLastResult(null);
    setAiInsight(null);
    setTrace([]);

    const addTrace = (message: string, status: 'success' | 'error' | 'info' = 'success', latency?: string) => {
      setTrace(prev => [...prev, {
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        message,
        status,
        latency
      }]);
    };

    addTrace("Initializing signal orchestration gateway...");
    await new Promise(r => setTimeout(r, 400));
    
    addTrace("Verifying API Key credentials (sg_test_***)...");
    await new Promise(r => setTimeout(r, 300));

    addTrace("Fetching KAMARA Network Signals via T-Mobile / Vodafone integration...", "success", "142ms");
    await new Promise(r => setTimeout(r, 600));

    if (simulator.simSwap) {
       addTrace("CAMARA Signal Alert: Recent SIM Swap detected (ref: CAM-402)", "error");
    }

    addTrace("Analyzing Device Integrity: Hardware Attestation Bloom Filter...", "success", "48ms");
    await new Promise(r => setTimeout(r, 400));

    if (simulator.rootedDevice) {
       addTrace("Security Violation: Device integrity compromise detected (Rooted/Jailbroken)", "error");
    }

    addTrace("Aggregating multi-source risk variables...");
    await new Promise(r => setTimeout(r, 300));

    const latency = 800 + Math.random() * 400;
    const finalScore = calculateRisk();
    const decision = finalScore > 70 ? 'BLOCK' : finalScore > 40 ? 'VERIFY' : 'ALLOW';
    
    const result: EvaluationResult = {
      decision,
      trustScore: 100 - finalScore,
      confidence: 0.98,
      reasons: [],
      signals: {
        simSwap: simulator.simSwap ? 10 : 100,
        deviceTrust: simulator.rootedDevice ? 20 : 95,
        locationMatch: simulator.locationMismatch ? 40 : 100,
        kycMatch: 100
      }
    };

    if (simulator.simSwap) result.reasons.push("CAMARA: Recent SIM swap detected (14m ago)");
    if (simulator.rootedDevice) result.reasons.push("Device Security: Hardware attestation failed (Rooted/Jailbroken)");
    if (simulator.locationMismatch) result.reasons.push("Geo: Mismatch between IP location and carrier tower data");
    if (result.reasons.length === 0) result.reasons.push("All carrier signals verified as trusted");

    setLastResult(result);
    setIsExecuting(false);

    let parsedBody = {};
    try { parsedBody = JSON.parse(requestBody); } catch (e) { parsedBody = { error: "Invalid JSON" }; }

    const newLog: RequestLog = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      method: 'POST',
      path: '/v1/evaluate',
      status: 200,
      payload: parsedBody,
      response: result,
      latency: Math.round(latency),
      score: 100 - finalScore
    };
    const updatedLogs = [newLog, ...logs].slice(0, 50);
    setLogs(updatedLogs);
    localStorage.setItem('sg_logs', JSON.stringify(updatedLogs));

    setIsAiLoading(true);
    const insight = await geminiService.analyzeSignal("Evaluation", decision, { score: 100 - finalScore, reasons: result.reasons });
    setAiInsight(insight);
    setIsAiLoading(false);
    
    toast.success(`Evaluation Complete: ${decision}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const generateNewKey = (type: 'live' | 'test') => {
    const newKey: ApiKey = {
      id: Math.random().toString(36).substring(7),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Key ${apiKeys.length + 1}`,
      key: `sg_${type}_` + Math.random().toString(36).substring(10),
      created: new Date().toLocaleDateString(),
      type: type,
      usage: 0
    };
    const updated = [...apiKeys, newKey];
    setApiKeys(updated);
    localStorage.setItem('sg_api_keys', JSON.stringify(updated));
    toast.success(`${type.toUpperCase()} Key generated`);
  };

  const deleteKey = (id: string) => {
    const updated = apiKeys.filter(k => k.id !== id);
    setApiKeys(updated);
    localStorage.setItem('sg_api_keys', JSON.stringify(updated));
    toast.error('API Key revoked');
  };

  const handleScenarioChange = (scenario: Scenario) => {
    setCurrentScenario(scenario);
    setRequestBody(JSON.stringify(scenario.payload, null, 2));
    toast.info(`Scenario: ${scenario.name}`);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] text-slate-200 overflow-hidden selection:bg-emerald-500/30 selection:text-white">
      {/* Top Header */}
      <header className="h-20 shrink-0 border-b border-slate-800/50 flex items-center justify-between px-8 bg-[#020617] z-30">
        <div className="flex items-center gap-12">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white uppercase tracking-tight italic">Developer Playground</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Test our fraud detection API in real-time</p>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
             <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase leading-none">API Status</span>
                <span className="text-[10px] font-bold text-white leading-tight">All systems operational</span>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col">
             <span className="text-[9px] font-black text-slate-500 uppercase mb-1 text-right">Environment</span>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="outline" size="sm" className="bg-slate-900 border-slate-800 text-[10px] font-black uppercase rounded-lg px-4 gap-4 h-9">
                      {env === 'test' ? 'Sandbox' : 'Production'}
                      <MoreVertical className="w-3 h-3 opacity-50 rotate-90" />
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-slate-900 border-slate-800 text-slate-200">
                   <DropdownMenuItem onClick={() => setEnv('test')}>Sandbox</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setEnv('live')}>Production</DropdownMenuItem>
                </DropdownMenuContent>
             </DropdownMenu>
          </div>
          <Button variant="outline" size="sm" className="h-9 rounded-full text-[10px] font-black uppercase tracking-[0.3em]" onClick={onBack}>
            Back to Home
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800/50 bg-[#020617] flex flex-col pt-6 overflow-hidden">
          <div className="px-6 mb-8">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 group cursor-pointer" onClick={onBack}>
               <Shield className="w-5 h-5 text-emerald-500" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">ShieldGuard</span>
            </div>
          </div>
          
          <ScrollArea className="flex-1">
             <div className="py-2">
              {API_GROUPS.map((group) => (
                <div key={group.name} className="mb-8 px-4">
                  <h4 className="px-3 text-[10px] font-black tracking-[0.2em] text-slate-600 uppercase mb-3">{group.name}</h4>
                  <div className="space-y-1">
                    {group.items.map((api) => (
                      <button
                        key={api.id}
                        onClick={() => setActiveTab(api.id as any)}
                        className={cn(
                          "w-full flex items-center gap-4 px-3 py-3 rounded-xl text-[11px] font-black uppercase transition-all tracking-tight",
                          activeTab === api.id 
                            ? "bg-emerald-500/10 text-emerald-500" 
                            : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                        )}
                      >
                        <div className={cn(
                          "w-1 h-4 rounded-full transition-all",
                          activeTab === api.id ? "bg-emerald-500" : "bg-transparent"
                        )} />
                        {api.icon}
                        {api.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
             </div>
          </ScrollArea>
          
          <UsageCard />
        </aside>

        {/* Main Dashboard Area */}
        <div className="flex-1 flex flex-col bg-[#020617] overflow-hidden">
           <div className="h-14 flex items-center justify-between px-8 border-b border-slate-800/40 bg-[#020617] shrink-0 z-20">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-black text-slate-500">
                 <span>{activeTab === 'overview' ? 'Overview' : activeTab === 'playground' ? 'API Playground' : activeTab === 'keys' ? 'API Keys' : 'Request Logs'}</span>
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Sandbox environment</div>
           </div>

           <ScrollArea className="flex-1">
              <div className="p-4 sm:p-6 md:p-8 pb-24 md:pb-32 min-w-0">

                <div className="space-y-10 sm:space-y-12">
                   {activeTab === 'overview' && (
                     <div className="w-full max-w-5xl mx-auto space-y-8 sm:space-y-10 min-w-0">
                        <div className="rounded-2xl sm:rounded-[2rem] lg:rounded-[2.5rem] bg-slate-900 border border-slate-800 p-6 sm:p-8 lg:p-10 shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
                           <div className="flex flex-col gap-6 lg:gap-8 min-w-0">
                              <div className="min-w-0 space-y-3 sm:space-y-4">
                                 <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">Developer Playground</p>
                                 <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-[1.15] tracking-tight">
                                    Build and test your fraud orchestration in a polished demo UI.
                                 </h2>
                                 <p className="text-slate-400 leading-relaxed text-sm sm:text-base max-w-3xl">
                                    Use the sandbox to execute realistic CAMARA signal evaluations, inspect results, and manage your demo API keys. Layout adapts from phone to desktop so you can demo anywhere.
                                 </p>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                 <div className="rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 min-h-[140px] flex flex-col justify-between">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2 sm:mb-3">Real API test</p>
                                    <p className="text-sm font-bold text-white leading-snug">Send live evaluation requests and verify trust decisions immediately.</p>
                                 </div>
                                 <div className="rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 min-h-[140px] flex flex-col justify-between">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2 sm:mb-3">Demo scenarios</p>
                                    <p className="text-sm font-bold text-white leading-snug">Switch between high-risk, SIM swap, and roaming cases to mirror real-world fraud flows.</p>
                                 </div>
                                 <div className="rounded-xl sm:rounded-2xl border border-slate-800 bg-slate-950 p-5 sm:p-6 min-h-[140px] flex flex-col justify-between sm:col-span-2 lg:col-span-1">
                                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black mb-2 sm:mb-3">Trust insights</p>
                                    <p className="text-sm font-bold text-white leading-snug">Inspect response decisions, signal reliability, and risk score outputs.</p>
                                 </div>
                              </div>
                              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-1">
                                 <Button onClick={() => setActiveTab('playground')} className="h-12 sm:h-14 w-full sm:w-auto min-h-[48px] rounded-xl sm:rounded-2xl bg-emerald-500 text-slate-950 font-black uppercase tracking-[0.2em] shrink-0">Open Playground</Button>
                                 <Button variant="outline" onClick={() => setActiveTab('keys')} className="h-12 sm:h-14 w-full sm:w-auto min-h-[48px] rounded-xl sm:rounded-2xl border-white/10 text-slate-200 uppercase tracking-[0.2em] shrink-0">Manage API Keys</Button>
                              </div>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'keys' && (
                     <div className="max-w-5xl mx-auto space-y-8">
                        <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 p-10 shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
                           <div className="flex items-center justify-between gap-4 mb-8">
                              <div>
                                 <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">API Keys</p>
                                 <h2 className="mt-3 text-3xl font-black text-white">Sandbox and production key management</h2>
                              </div>
                              <div className="flex flex-wrap gap-3">
                                 <Button onClick={() => generateNewKey('test')} className="h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black uppercase tracking-[0.2em]">New Test Key</Button>
                                 <Button variant="outline" onClick={() => generateNewKey('live')} className="h-12 rounded-2xl border-white/10 text-slate-200 uppercase tracking-[0.2em]">New Live Key</Button>
                              </div>
                           </div>
                           <div className="grid gap-4">
                              {apiKeys.map((key) => (
                                 <div key={key.id} className="rounded-[2rem] bg-slate-950 border border-slate-800 p-6 flex flex-col gap-4">
                                    <div className="flex items-center justify-between gap-4">
                                       <div>
                                          <p className="text-[9px] uppercase tracking-[0.3em] text-slate-500">{key.type === 'live' ? 'Live key' : 'Sandbox key'}</p>
                                          <p className="text-sm font-black text-white mt-1">{key.name}</p>
                                       </div>
                                       <Button variant="ghost" size="sm" onClick={() => deleteKey(key.id)} className="text-red-400 hover:text-red-300">Revoke</Button>
                                    </div>
                                    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 font-mono text-[11px] text-slate-200 overflow-x-auto">{key.key}</div>
                                    <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                                       <span>Created: {key.created}</span>
                                       <span>Usage: {key.usage} calls</span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'logs' && (
                     <div className="max-w-6xl mx-auto space-y-8">
                        <div className="rounded-[2.5rem] bg-slate-900 border border-slate-800 p-10 shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
                           <div className="flex items-center justify-between gap-4 mb-8">
                              <div>
                                 <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-black">Request Logs</p>
                                 <h2 className="mt-3 text-3xl font-black text-white">Recent evaluation traffic</h2>
                              </div>
                           </div>
                           <div className="rounded-[3rem] border border-slate-800 overflow-hidden bg-slate-950/80">
                              <table className="w-full border-collapse">
                                 <thead className="bg-slate-900/40 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    <tr>
                                       <th className="px-6 py-5 text-left">Time</th>
                                       <th className="px-6 py-5 text-left">Path</th>
                                       <th className="px-6 py-5 text-center">Decision</th>
                                       <th className="px-6 py-5 text-center">Latency</th>
                                       <th className="px-6 py-5 text-center">Risk</th>
                                       <th className="px-6 py-5"></th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-800/10">
                                    {logs.length > 0 ? logs.map((log) => (
                                      <tr key={log.id} className="hover:bg-slate-900/30 transition-all">
                                         <td className="px-6 py-5 text-[11px] font-mono text-slate-300">{log.timestamp}</td>
                                         <td className="px-6 py-5 text-[11px] text-slate-300">{log.path}</td>
                                         <td className="px-6 py-5 text-center">
                                            <Badge variant="outline" className={cn(
                                              "px-3 py-1 text-[9px] font-black uppercase rounded-full",
                                              log.response.decision === 'ALLOW' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-500/10' : log.response.decision === 'BLOCK' ? 'text-red-400 border-red-400/20 bg-red-500/10' : 'text-amber-400 border-amber-400/20 bg-amber-500/10'
                                            )}>
                                               {log.response.decision}
                                            </Badge>
                                         </td>
                                         <td className="px-6 py-5 text-center text-[11px] text-slate-400">{log.latency}ms</td>
                                         <td className="px-6 py-5 text-center text-[11px] text-slate-400">{log.score}</td>
                                         <td className="px-6 py-5 text-right">
                                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(JSON.stringify(log.response, null, 2))} className="text-slate-400 hover:text-white">
                                               <Copy className="w-4 h-4" />
                                            </Button>
                                         </td>
                                      </tr>
                                    )) : (
                                      <tr>
                                         <td colSpan={6} className="px-6 py-20 text-center text-slate-500">No logs available yet. Run an evaluation to begin.</td>
                                      </tr>
                                    )}
                                 </tbody>
                              </table>
                           </div>
                        </div>
                     </div>
                   )}

                   {activeTab === 'playground' && (
                     <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {/* API Command Bar */}
                  <div className="flex items-center gap-4">
                     <div className="flex-1 flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-2.5 gap-4 shadow-2xl">
                        <div className="flex items-center gap-3 pl-4 pr-6 border-r border-slate-800">
                           <span className="text-emerald-500 text-[11px] font-black uppercase tracking-widest">POST</span>
                           <div className="w-1 h-1 rounded-full bg-slate-700" />
                        </div>
                        <div className="flex-1 truncate">
                           <span className="text-slate-500 font-mono text-xs mr-2">https://api.shieldguard.ai</span>
                           <input 
                             value="/v1/evaluate"
                             readOnly
                             className="bg-transparent border-none text-sm font-mono text-white focus:outline-none w-1/2"
                           />
                        </div>
                        <div className="flex items-center gap-3">
                           <div className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[10px] font-black text-slate-400 uppercase gap-3 flex items-center">
                              Version: 1.2
                              <ChevronDown className="w-3 h-3 opacity-30" />
                           </div>
                           <Button 
                              onClick={handleRunEvaluation} 
                              disabled={isExecuting}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-10 rounded-xl h-11 gap-3 shadow-xl shadow-emerald-500/10 transition-all hover:scale-[1.02] active:scale-95"
                           >
                              {isExecuting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
                              Send Request
                           </Button>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-12 gap-10">
                     {/* Explorer Side */}
                     <div className="col-span-12 lg:col-span-8 space-y-14">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {/* Request Payload */}
                           <div className="space-y-4">
                              <div className="flex items-center justify-between px-2">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Request Payload</h3>
                                 <div className="flex gap-4">
                                    <button className="text-[10px] font-black text-slate-600 uppercase hover:text-white transition-colors">Beautify</button>
                                    <button className="text-[10px] font-black text-slate-600 uppercase hover:text-white transition-colors">Reset</button>
                                 </div>
                              </div>
                              <div className="h-[400px] rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden p-6 shadow-2xl relative group">
                                 <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50" />
                                 <Editor
                                   height="100%"
                                   defaultLanguage="json"
                                   theme="vs-dark"
                                   value={requestBody}
                                   onChange={(val) => setRequestBody(val || '')}
                                   options={{
                                     minimap: { enabled: false },
                                     fontSize: 13,
                                     fontFamily: 'JetBrains Mono',
                                     backgroundColor: 'transparent',
                                     lineNumbers: 'on',
                                     padding: { top: 10 },
                                     scrollbar: { vertical: 'hidden' },
                                     overviewRulerLanes: 0,
                                     hideCursorInOverviewRuler: true,
                                     renderLineHighlight: 'none',
                                     fontLigatures: true
                                   }}
                                 />
                              </div>
                           </div>

                           {/* Response Output */}
                           <div className="space-y-4">
                              <div className="flex items-center justify-between px-2">
                                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Response Object</h3>
                                 {lastResult && (
                                   <div className="flex items-center gap-4">
                                      <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 tracking-widest">200 OK</div>
                                      <span className="text-[9px] font-black text-slate-600 uppercase">142ms</span>
                                   </div>
                                 )}
                              </div>
                              <div className="h-[400px] rounded-[2.5rem] bg-slate-900 border border-slate-800 overflow-hidden p-8 font-mono text-[13px] text-blue-400/90 leading-relaxed overflow-y-auto shadow-2xl scrollbar-hide">
                                 {lastResult ? (
                                    <pre className="selection:bg-emerald-500/30">{JSON.stringify(lastResult, null, 2)}</pre>
                                 ) : (
                                    <div className="h-full flex items-center justify-center flex-col text-slate-700 gap-6 opacity-40">
                                       <div className="w-16 h-16 rounded-full bg-slate-800/10 border-2 border-dashed border-slate-800 flex items-center justify-center">
                                          <Activity className="w-8 h-8" />
                                       </div>
                                       <span className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Simulation Start</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>

                        {/* Simulation Preset Toggles */}
                        <div className="space-y-12">
                           <div className="space-y-6">
                              <div className="flex items-center justify-between px-2">
                                 <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Simulation Scenarios</h3>
                                 <button onClick={() => setSimulator({ simSwap: false, rootedDevice: false, highValue: false, locationMismatch: false, proxyDetected: false })} className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300">Clear All Overrides</button>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 {[
                                   { id: 'normal', name: 'Standard Transaction', risk: 'Low', color: '#10b981', action: () => setSimulator({ simSwap: false, rootedDevice: false, highValue: false, locationMismatch: false, proxyDetected: false }) },
                                   { id: 'sim-swap', name: 'Account Takeover', risk: 'Critical', color: '#ef4444', active: simulator.simSwap, action: () => setSimulator(p => ({ ...p, simSwap: !p.simSwap })) },
                                   { id: 'new-device', name: 'Fresh Enrollment', risk: 'Medium', color: '#eab308', active: simulator.rootedDevice, action: () => setSimulator(p => ({ ...p, rootedDevice: !p.rootedDevice })) },
                                   { id: 'high-amount', name: 'Velocity Spike', risk: 'High', color: '#ef4444', active: simulator.highValue, action: () => setSimulator(p => ({ ...p, highValue: !p.highValue })) },
                                 ].map((preset) => (
                                   <div 
                                     key={preset.id} 
                                     onClick={preset.action}
                                     className={cn(
                                        "p-6 rounded-[2rem] bg-slate-900 border transition-all cursor-pointer hover:bg-slate-800 group relative overflow-hidden",
                                        preset.active ? "border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)]" : "border-slate-800 hover:border-slate-700"
                                     )}
                                   >
                                        <div className="flex items-center justify-between mb-4 relative z-10">
                                           <div className="text-[13px] font-black text-white leading-tight uppercase italic tracking-tight">{preset.name}</div>
                                           {preset.active && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />}
                                        </div>
                                        <div className="text-[9px] font-black uppercase tracking-[0.2em] relative z-10" style={{ color: preset.color }}>{preset.risk} Impact</div>
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                   </div>
                                 ))}
                              </div>
                           </div>

                           <div className="space-y-8">
                              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Signal Injections</h3>
                              <div className="flex flex-wrap gap-10">
                                 {[
                                   { id: 'simSwap', label: 'SIM Shadowing', state: simulator.simSwap },
                                   { id: 'locationMismatch', label: 'Geo Velocity', state: simulator.locationMismatch },
                                   { id: 'rootedDevice', label: 'Compromised ENV', state: simulator.rootedDevice },
                                   { id: 'proxyDetected', label: 'Tor Exit Node', state: simulator.proxyDetected },
                                   { id: 'highValue', label: 'Limit Excess', state: simulator.highValue }
                                 ].map((toggle) => (
                                   <div key={toggle.id} className="flex items-stretch gap-4 group cursor-pointer" onClick={() => setSimulator(p => ({ ...p, [toggle.id]: !toggle.state }))}>
                                      <div className={cn(
                                         "w-12 h-6 rounded-full p-1 transition-all duration-300 relative border",
                                         toggle.state ? "bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-slate-900 border-slate-800"
                                      )}>
                                         <div className={cn(
                                            "w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow-sm",
                                            toggle.state ? "translate-x-6" : "translate-x-0"
                                         )} />
                                      </div>
                                      <div className="flex flex-col justify-center">
                                         <span className={cn(
                                            "text-[10px] font-black uppercase tracking-widest transition-colors",
                                            toggle.state ? "text-white" : "text-slate-500 group-hover:text-slate-400"
                                         )}>{toggle.label}</span>
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Decision Metrics Panel */}
                     <div className="col-span-12 lg:col-span-4">
                        <div className="p-10 rounded-[3.5rem] bg-slate-900 border border-slate-800 space-y-12 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden sticky top-8">
                           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] -mr-48 -mt-48 rounded-full pointer-events-none" />
                           
                           <div className="space-y-2 relative z-10">
                              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600">Signal Engine Output</h3>
                              <p className="text-[11px] text-slate-400 font-medium">Synthetic risk vectors analyzed</p>
                           </div>

                           <div className="relative z-10 flex flex-col items-center py-4">
                              <TrustScoreGauge score={lastResult ? 100 - lastResult.trustScore : 0} />
                              <div className="mt-8 flex flex-col items-center gap-4">
                                 <div className={cn(
                                    "text-[12px] font-black uppercase tracking-[0.3em] italic border-2 px-8 py-2.5 rounded-2xl shadow-lg transition-all",
                                    (lastResult?.decision === 'ALLOW') ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5 shadow-emerald-500/10" : 
                                    (lastResult?.decision === 'BLOCK') ? "text-red-500 border-red-500/20 bg-red-500/5 shadow-red-500/10" :
                                    "text-slate-600 border-slate-800 bg-slate-800/20"
                                 )}>
                                    {lastResult?.decision || 'No Decision'}
                                 </div>
                                 {lastResult && (
                                   <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-black tracking-widest text-slate-600 uppercase">Signal Reliability: 99.4%</span>
                                   </div>
                                 )}
                              </div>
                           </div>

                           <div className="pt-10 border-t border-slate-800/50 relative z-10">
                              <RiskBreakdown signals={lastResult ? lastResult.signals : { simSwap: 100, deviceTrust: 100, locationMatch: 100, kycMatch: 100 }} />
                           </div>

                           <div className="space-y-6 relative z-10">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Heuristic Signals</h4>
                              <FraudSignalTags signals={lastResult ? lastResult.signals : {}} />
                           </div>

                           <div className="pt-10 border-t border-slate-800/50 space-y-8 relative z-10">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Orchestration Steps</h4>
                              <div className="space-y-4">
                                 {[
                                   { label: 'Layer-3 Step-up Authentication', icon: <Lock className="w-4.5 h-4.5" /> },
                                   { label: 'Biometric Cross-Reference', icon: <Fingerprint className="w-4.5 h-4.5" /> },
                                   { label: 'Deep Carrier Verification', icon: <Database className="w-4.5 h-4.5" /> }
                                 ].map((step, i) => (
                                   <div key={i} className="flex items-center justify-between text-[11px] font-bold text-slate-400 group cursor-pointer hover:text-white transition-all">
                                      <div className="flex items-center gap-5">
                                         <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700/50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300">
                                            {step.icon}
                                         </div>
                                         <span className="leading-tight">{step.label}</span>
                                      </div>
                                      <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Log Stream Section */}
                  <div className="mt-20 space-y-8">
                     <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                           <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Traffic Stream</h3>
                           <div className="h-4 w-px bg-slate-800" />
                           <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest italic">Live Cluster</span>
                           </div>
                        </div>
                        <Button variant="link" className="text-[10px] font-black text-blue-400 uppercase gap-3 h-auto p-0 hover:text-blue-300" onClick={() => setActiveTab('logs')}>
                           View Logs <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                     </div>
                     <div className="rounded-[3rem] border border-slate-800 overflow-hidden bg-slate-950/80 shadow-[0_0_80px_rgba(0,0,0,0.5)] transition-all hover:bg-slate-950">
                        <table className="w-full border-collapse">
                           <thead className="bg-slate-900/40 border-b border-slate-800 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                              <tr>
                                 <th className="px-10 py-6 text-left font-black">Timestamp</th>
                                 <th className="px-10 py-6 text-left font-black">API Primitive</th>
                                 <th className="px-10 py-6 text-center font-black">Risk Vector</th>
                                 <th className="px-10 py-6 text-center font-black">Decision</th>
                                 <th className="px-10 py-6 text-center font-black">Latency</th>
                                 <th className="px-10 py-6 text-left font-black">Cluster Trace</th>
                                 <th className="px-10 py-6"></th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-slate-800/10">
                              {logs.length > 0 ? logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-900/30 transition-all group cursor-pointer border-l-2 border-l-transparent hover:border-l-emerald-500">
                                   <td className="px-10 py-6 text-[11px] font-bold text-slate-600 group-hover:text-slate-400 font-mono italic">{log.timestamp}</td>
                                   <td className="px-10 py-6 text-[11px] font-mono text-slate-300 font-bold group-hover:text-emerald-400 transition-colors">
                                      <span className="text-emerald-600/50 mr-4 font-black">POST</span>
                                      {log.path}
                                   </td>
                                   <td className="px-10 py-6 text-center">
                                      <span className="text-[14px] font-black text-white italic group-hover:scale-125 transition-transform inline-block drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">{log.score}</span>
                                   </td>
                                   <td className="px-10 py-6 text-center">
                                      <Badge variant="outline" className={cn(
                                        "px-4 py-1.5 text-[9px] font-black uppercase rounded-xl border-2 transition-all",
                                        log.response.decision === 'ALLOW' ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5 group-hover:bg-emerald-500/10" : 
                                        log.response.decision === 'BLOCK' ? "text-red-500 border-red-500/20 bg-red-500/5 group-hover:bg-red-500/10" : 
                                        "text-yellow-500 border-yellow-500/20 bg-yellow-500/5 group-hover:bg-yellow-500/10"
                                      )}>
                                         {log.response.decision}
                                      </Badge>
                                   </td>
                                   <td className="px-10 py-6 text-center text-[11px] font-black text-slate-500 tabular-nums">{log.latency}ms</td>
                                   <td className="px-10 py-6 text-[11px] font-mono text-slate-700 flex items-center gap-4">
                                      {log.id.substring(0, 16)}...
                                      <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all hover:text-white" />
                                   </td>
                                   <td className="px-10 py-6 text-right">
                                      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:border-emerald-500 hover:bg-emerald-500 group-hover:rotate-0 rotate-12">
                                         <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-950 transition-colors" />
                                      </div>
                                   </td>
                                </tr>
                              )) : (
                                <tr>
                                   <td colSpan={7} className="px-10 py-40 text-center">
                                      <div className="flex flex-col items-center gap-6 opacity-20 grayscale">
                                         <Terminal className="w-16 h-16 text-slate-500" />
                                         <span className="text-[11px] font-black uppercase tracking-[0.5em] italic">Awaiting Telemetry Data Stream</span>
                                      </div>
                                   </td>
                                </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  </div>
                     </div>
                   )}
                </div>
              </div>
           </ScrollArea>
        </div>
      </main>

      {/* Global Status Bar */}
      <footer className="h-12 bg-slate-950 border-t border-slate-800/40 flex items-center justify-between px-10 text-[10px] font-black text-slate-600 uppercase tracking-[0.4em] z-30 font-mono">
        <div className="flex items-center gap-14">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
            <span className="italic">Shield Engine: 1.2.0.4-STABLE</span>
          </div>
          <div className="flex items-center gap-3 group cursor-help transition-colors hover:text-slate-400">
            <Globe className="w-4 h-4 text-slate-700 group-hover:text-emerald-500 transition-colors" />
            <span>Region: EU-WEST-SHIELD8</span>
          </div>
        </div>
        <div className="flex items-center gap-14">
          <div className="flex items-center gap-5">
             <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
             <span className="tabular-nums">TPS: 12,492 Signal Units</span>
          </div>
          <div className="flex items-center gap-3 hover:text-white cursor-pointer transition-all group">
            <Code className="w-4 h-4 text-slate-700 group-hover:text-emerald-500" />
            <span className="group-hover:translate-x-1 transition-transform">Support Context ID: SG-9922</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
