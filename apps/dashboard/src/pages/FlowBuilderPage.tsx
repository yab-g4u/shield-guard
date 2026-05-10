
import React from 'react';
import { FlowToolbar, FlowDeploymentState } from '../components/flow-builder/FlowToolbar';
import { NodeSidebar } from '../components/flow-builder/NodeSidebar';
import { FlowCanvas } from '../components/flow-builder/FlowCanvas';
import { PropertiesPanel } from '../components/flow-builder/PropertiesPanel';
import { BottomDock } from '../components/flow-builder/BottomDock';
import { Toaster } from 'sonner';
import { useFlowStore } from '../store/useFlowStore';
import { validateFlow } from '../lib/flowValidation';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Activity, AlertCircle, Clock3, Shield, Webhook, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export default function FlowBuilderPage({ onBack }: { onBack: () => void }) {
  const { undo, redo, nodes, edges } = useFlowStore();
  const [deploymentState, setDeploymentState] = React.useState<FlowDeploymentState>('draft');
  const [runtimeTick, setRuntimeTick] = React.useState(0);
  const [runtimeMetrics, setRuntimeMetrics] = React.useState({
    executionsPerMinute: 0,
    blockedAttacks: 0,
    triggeredRules: 0,
    avgLatency: 0,
    activeWebhooks: 0,
    decisionMix: { approve: 0, review: 0, block: 0 },
  });

  React.useEffect(() => {
    if (deploymentState !== 'active' && deploymentState !== 'testing') return;
    const t = setInterval(() => {
      setRuntimeTick((p) => p + 1);
      setRuntimeMetrics((m) => ({
        executionsPerMinute: deploymentState === 'active' ? 80 + Math.floor(Math.random() * 60) : 10 + Math.floor(Math.random() * 15),
        blockedAttacks: m.blockedAttacks + (deploymentState === 'active' ? Math.floor(Math.random() * 4) : Math.floor(Math.random() * 2)),
        triggeredRules: m.triggeredRules + 1 + Math.floor(Math.random() * 3),
        avgLatency: 90 + Math.floor(Math.random() * 80),
        activeWebhooks: 1 + Math.floor(Math.random() * 6),
        decisionMix: {
          approve: 30 + Math.floor(Math.random() * 30),
          review: 10 + Math.floor(Math.random() * 20),
          block: 8 + Math.floor(Math.random() * 15),
        },
      }));
    }, 3000);
    return () => clearInterval(t);
  }, [deploymentState]);

  const handleValidateFlow = React.useCallback(() => {
    const result = validateFlow(nodes, edges);
    if (!result.isValid) {
      setDeploymentState('failed');
      return false;
    }
    return true;
  }, [nodes, edges]);

  const handleDeployFlow = React.useCallback(() => {
    if (!handleValidateFlow()) return;
    setDeploymentState('active');
  }, [handleValidateFlow]);

  const handleTesting = React.useCallback(() => {
    if (!handleValidateFlow()) return;
    setDeploymentState('testing');
  }, [handleValidateFlow]);

  const injectSimulatedAttack = React.useCallback(() => {
    if (deploymentState === 'draft') return;
    setRuntimeMetrics((m) => ({
      ...m,
      blockedAttacks: m.blockedAttacks + 1,
      triggeredRules: m.triggeredRules + 2,
      decisionMix: {
        ...m.decisionMix,
        block: m.decisionMix.block + 1,
      },
    }));
  }, [deploymentState]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex flex-col h-screen bg-[#0A0F1E] text-white overflow-hidden selection:bg-blue-500/30">
      <Toaster position="top-right" theme="dark" />
      
      {/* Re-using Toolbar with a back button integration if needed */}
      <FlowToolbar
        deploymentState={deploymentState}
        onValidateFlow={handleValidateFlow}
        onDeployFlow={handleDeployFlow}
        onStartTesting={handleTesting}
      />
      
      <div className="flex flex-1 overflow-hidden relative pb-[100px]">
        <NodeSidebar />
        
        <main className="flex-1 overflow-hidden relative">
          <FlowCanvas />
        </main>
        
        <PropertiesPanel />
        <aside className="w-[320px] border-l border-white/10 bg-[#0D111B] p-5 space-y-5 overflow-y-auto">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-black tracking-widest text-white uppercase">Deployment Runtime</h3>
              <Badge
                className={cn(
                  "text-[9px] uppercase",
                  deploymentState === 'active' && "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  deploymentState === 'testing' && "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  deploymentState === 'draft' && "bg-slate-500/20 text-slate-300 border-slate-500/30",
                  deploymentState === 'failed' && "bg-red-500/10 text-red-400 border-red-500/20",
                  deploymentState === 'archived' && "bg-slate-800 text-slate-400 border-slate-700"
                )}
              >
                {deploymentState}
              </Badge>
            </div>
            <p className="text-[11px] text-white/50 mt-2 leading-relaxed">
              Deploying flow validates logic, generates executable fraud policy, and activates real-time enforcement.
            </p>
            <div className="mt-4 flex gap-2">
              <Button size="sm" className="h-8 text-[10px]" onClick={injectSimulatedAttack}>
                Inject Simulated Attack
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[10px] border-white/10"
                onClick={() => setDeploymentState('archived')}
              >
                Archive
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <RuntimeCard icon={<Activity className="w-4 h-4 text-blue-300" />} label="Executions/min" value={runtimeMetrics.executionsPerMinute} />
            <RuntimeCard icon={<Shield className="w-4 h-4 text-red-400" />} label="Blocked attacks" value={runtimeMetrics.blockedAttacks} />
            <RuntimeCard icon={<Zap className="w-4 h-4 text-amber-300" />} label="Triggered rules" value={runtimeMetrics.triggeredRules} />
            <RuntimeCard icon={<Clock3 className="w-4 h-4 text-slate-300" />} label="Avg latency" value={`${runtimeMetrics.avgLatency}ms`} />
            <RuntimeCard icon={<Webhook className="w-4 h-4 text-slate-300" />} label="Active webhooks" value={runtimeMetrics.activeWebhooks} />
            <RuntimeCard icon={<AlertCircle className="w-4 h-4 text-slate-300" />} label="Runtime tick" value={runtimeTick} />
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-white/70 mb-3">Decision distribution</h4>
            <div className="space-y-2 text-[11px]">
              <FlowMetricRow label="Approve" value={runtimeMetrics.decisionMix.approve} />
              <FlowMetricRow label="Review" value={runtimeMetrics.decisionMix.review} />
              <FlowMetricRow label="Block" value={runtimeMetrics.decisionMix.block} />
            </div>
          </div>
        </aside>
      </div>

      <BottomDock />

      {/* Global CSS for flow styling */}
      <style>{`
        .react-flow__handle {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          width: 8px !important;
          height: 8px !important;
          background: #3b82f6 !important;
        }
        .react-flow__handle:hover {
          transform: scale(1.5);
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        .react-flow__edge-path {
          transition: stroke-dashoffset 0.5s ease;
        }
        .react-flow__node {
          cursor: default !important;
        }
        .react-flow__node.selected {
           z-index: 1000 !important;
        }
      `}</style>
    </div>
  );
}

const RuntimeCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="rounded-xl border border-white/10 bg-black/30 p-3">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] uppercase tracking-widest text-white/40">{label}</span>
      {icon}
    </div>
    <div className="text-lg font-black text-white tabular-nums">{value}</div>
  </div>
);

const FlowMetricRow = ({ label, value }: { label: string; value: number }) => (
  <div className="flex items-center justify-between border border-white/5 rounded-lg px-3 py-2 bg-white/[0.02]">
    <span className="text-white/70">{label}</span>
    <span className="font-black text-white tabular-nums">{value}</span>
  </div>
);

