import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, 
  Activity, 
  BarChart3, 
  Plug, 
  Key, 
  ChevronUp, 
  X,
  History,
  Terminal,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

type Tab = 'flows' | 'executions' | 'analytics' | 'integrations' | 'api-keys';

export const BottomDock = () => {
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  const tabs = [
    { id: 'flows', label: 'Flows', icon: GitBranch },
    { id: 'executions', label: 'Executions', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'integrations', label: 'Integrations', icon: Plug },
    { id: 'api-keys', label: 'API Keys', icon: Key },
  ] as const;

  return (
    <>
      <AnimatePresence>
        {activeTab && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-[100px] left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-[#05070B]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-50 overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
              <div className="flex items-center gap-4">
                 <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-white">
                    {(() => {
                      const Icon = tabs.find(t => t.id === activeTab)?.icon || GitBranch;
                      return <Icon className="w-5 h-5" />;
                    })()}
                 </div>
                 <div>
                    <h2 className="text-sm font-black tracking-widest text-white uppercase">{activeTab.replace('-', ' ')}</h2>
                    <p className="text-[10px] text-white/30 font-mono tracking-tighter">ENVIRONMENT: PRODUCTION_WEST_1</p>
                 </div>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-white/20 hover:text-white" onClick={() => setActiveTab(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {activeTab === 'executions' && <ExecutionsView />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'integrations' && <IntegrationsView />}
              {activeTab === 'api-keys' && <ApiKeysView />}
              {activeTab === 'flows' && <FlowsListView />}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-1.5 p-2 bg-[#131929]/80 backdrop-blur-2xl border border-white/10 rounded-[28px] shadow-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(isActive ? null : tab.id)}
                className={cn(
                  "relative flex items-center gap-3 px-5 py-3 rounded-[20px] transition-all duration-300 group",
                  isActive ? "bg-white text-black shadow-lg shadow-white/20" : "text-white/40 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "animate-pulse" : "")} />
                <span className="text-[11px] font-black tracking-widest uppercase">{tab.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-tab"
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

const ExecutionsView = () => (
  <div className="space-y-4">
    {[
      { id: 'ex-942', flow: 'High-Value Transfer', time: '2m ago', result: 'BLOCK', score: 32, latency: '420ms' },
      { id: 'ex-941', flow: 'Basic SIM Swap Guard', time: '12m ago', result: 'ALLOW', score: 98, latency: '150ms' },
      { id: 'ex-940', flow: 'Fraud Prevention V2', time: '45m ago', result: 'VERIFY', score: 64, latency: '310ms' },
    ].map((ex) => (
      <div key={ex.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
        <div className="flex items-center gap-6">
           <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center border border-white/5 text-white/20">
              <Terminal className="w-4 h-4" />
           </div>
           <div>
              <div className="flex items-center gap-3">
                <h4 className="text-sm font-bold text-white">{ex.flow}</h4>
                <code className="text-[10px] text-white/20 font-mono">{ex.id}</code>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] text-white/30">{ex.time}</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[10px] text-white/30 font-mono">LATENCY: {ex.latency}</span>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
              <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">Trust Score</div>
              <div className={cn("text-sm font-black", ex.score > 80 ? "text-emerald-400" : ex.score > 50 ? "text-amber-400" : "text-red-400")}>
                {ex.score}%
              </div>
           </div>
           <Badge className={cn(
             "h-8 px-4 rounded-xl font-black text-[10px] border-0",
             ex.result === 'ALLOW' ? "bg-emerald-500/10 text-emerald-400" :
             ex.result === 'BLOCK' ? "bg-red-500/10 text-red-400" :
             "bg-amber-500/10 text-amber-400"
           )}>
             {ex.result}
           </Badge>
        </div>
      </div>
    ))}
  </div>
);

const AnalyticsView = () => (
  <div className="grid grid-cols-3 gap-6">
    {[
      { label: 'Total Scans', value: '1.2M', sub: '+12% from last month', icon: Zap, color: 'text-blue-400' },
      { label: 'High Risk', value: '2.4%', sub: 'Avg risk per transaction', icon: AlertTriangle, color: 'text-amber-400' },
      { label: 'API Health', value: '99.98%', sub: 'Carrier uptime (3 providers)', icon: ShieldCheck, color: 'text-emerald-400' },
    ].map((stat) => (
      <div key={stat.label} className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-6">
        <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/5 w-fit", stat.color)}>
           <stat.icon className="w-6 h-6" />
        </div>
        <div>
           <div className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-2">{stat.label}</div>
           <div className="text-4xl font-black text-white tracking-tight">{stat.value}</div>
           <div className="text-[11px] text-white/20 mt-3 font-medium">{stat.sub}</div>
        </div>
      </div>
    ))}
  </div>
);

const IntegrationsView = () => (
   <div className="grid grid-cols-2 gap-4">
      {[
        { name: 'Nokia Network as Code', status: 'Connected', apis: '12 APIs Active', latency: '45ms' },
        { name: 'MTN Kenya', status: 'Connected', apis: 'SIM Swap, Location', latency: '120ms' },
        { name: 'Safaricom', status: 'Connected', apis: 'Full CAMARA Stack', latency: '85ms' },
        { name: 'Ethio Telecom', status: 'Provisioning', apis: 'Verification suite', latency: '--' },
      ].map((api) => (
        <div key={api.name} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex items-start justify-between">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center border border-white/5">
                 <Plug className="w-6 h-6 text-white/20" />
              </div>
              <div>
                 <h4 className="text-sm font-bold text-white">{api.name}</h4>
                 <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-white/30">{api.apis}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className={cn("text-[10px] font-bold uppercase", api.status === 'Connected' ? "text-emerald-400" : "text-amber-400")}>{api.status}</span>
                 </div>
              </div>
           </div>
           <Badge variant="outline" className="bg-white/5 border-white/5 text-[9px] font-mono text-white/30">LAT: {api.latency}</Badge>
        </div>
      ))}
   </div>
);

const ApiKeysView = () => (
  <div className="space-y-6">
    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-8">
       <div>
          <h3 className="text-lg font-bold text-white mb-2">Production Keys</h3>
          <p className="text-[11px] text-white/30 leading-relaxed max-w-lg">Manage access for your production environments. Rotated keys will remain active for 24 hours to prevent downtime.</p>
       </div>
       
       <div className="space-y-4">
          {[
            { label: 'Public Key', value: 'pk_live_********************8t2a', env: 'PROD' },
            { label: 'Secret Key', value: 'sk_live_********************k9z1', env: 'PROD' },
          ].map(k => (
            <div key={k.label} className="p-5 rounded-2xl bg-black border border-white/5 flex items-center justify-between">
               <div>
                  <div className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">{k.label}</div>
                  <code className="text-xs font-mono text-white/60">{k.value}</code>
               </div>
               <Button variant="ghost" size="sm" className="h-8 text-[10px] font-bold text-blue-400 hover:text-blue-300">REVEAL</Button>
            </div>
          ))}
       </div>

       <div className="flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-500 rounded-xl h-12 px-8 text-xs font-bold text-white">GENERATE NEW KEY</Button>
          <Button variant="outline" className="border-white/10 rounded-xl h-12 px-8 text-xs font-bold text-white/40">VIEW AUDIT LOGS</Button>
       </div>
    </div>
  </div>
);

const FlowsListView = () => (
  <div className="grid grid-cols-2 gap-4">
    {[
      { name: 'Standard Transfer Guard', version: 'V1.0.4', status: 'ACTIVE', executions: '45.2K', drift: '0.02%' },
      { name: 'High-Value Sweep', version: 'V2.1.0', status: 'ACTIVE', executions: '128', drift: '--' },
      { name: 'SIM Swap Detection', version: 'V3.4.2', status: 'STAGING', executions: '2.1K', drift: '1.2%' },
    ].map(flow => (
      <div key={flow.name} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all cursor-pointer">
         <div className="flex items-center justify-between mb-4">
           <h4 className="text-sm font-bold text-white">{flow.name}</h4>
           <Badge className={cn("text-[8px] font-black px-1.5 py-0", flow.status === 'ACTIVE' ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400")}>{flow.status}</Badge>
         </div>
         <div className="grid grid-cols-3 gap-8">
            <div>
               <div className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mb-1">Version</div>
               <div className="text-[11px] font-mono text-white/60">{flow.version}</div>
            </div>
            <div>
               <div className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mb-1">Executions</div>
               <div className="text-[11px] font-mono text-white/60">{flow.executions}</div>
            </div>
            <div>
               <div className="text-[9px] font-bold text-white/20 uppercase tracking-tighter mb-1">Drift Rate</div>
               <div className="text-[11px] font-mono text-white/60">{flow.drift}</div>
            </div>
         </div>
      </div>
    ))}
  </div>
);
