
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Settings, Info, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useFlowStore } from '../../store/useFlowStore';
import { COLORS } from '../../lib/constants';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';

export const PropertiesPanel = () => {
  const { nodes, selectedNodeId, updateNodeData, deleteNode, setSelectedNode } = useFlowStore();
  
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  if (!selectedNodeId) return null;

  const data = selectedNode?.data;
  if (!data) return null;

  const categoryColor = COLORS[data.category as keyof typeof COLORS] || '#fff';
  const borderColor = typeof categoryColor === 'string' ? categoryColor : '#fff';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="w-[340px] h-full bg-[#131929] border-l border-[#00D4FF]/10 flex flex-col flex-shrink-0 z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
      >
        <div className="p-6 border-b border-white/5 bg-[#0D1424] flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-xl bg-white/5 border border-white/5">
                <Settings className="w-4 h-4 text-white/40" />
             </div>
             <h2 className="text-sm font-black tracking-widest text-white uppercase">Node Config</h2>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/20 hover:text-white" onClick={() => setSelectedNode(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {/* Header */}
          <div className="space-y-4">
             <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white truncate">{data.label}</h3>
                    <Badge variant="outline" className="text-[8px] bg-white/5 text-white/40 border-white/10 px-1 py-0">{data.category}</Badge>
                  </div>
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    {data.description}
                  </p>
                </div>
             </div>
             <Button 
               variant="outline" 
               className="w-full h-9 bg-red-500/5 hover:bg-red-500/10 border-red-500/20 text-red-400 text-[11px] font-bold rounded-xl"
               onClick={() => deleteNode(selectedNodeId)}
             >
                <Trash2 className="w-3.5 h-3.5 mr-2" />
                REMOVE NODE
             </Button>
          </div>

          <Separator className="bg-white/5" />

          {/* Dynamic Forms */}
          <div className="space-y-6">
            {data.camaraApi && (
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black text-white/30 tracking-[0.1em] uppercase">CAMARA API</Label>
                    <div className="flex items-center gap-1.5 text-blue-400 font-mono text-[10px]">
                      <code className="bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{data.camaraApi}</code>
                    </div>
                  </div>
               </div>
            )}

            {data.category === 'telecom_signal' && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold text-white/60">Target Identifier</Label>
                  <Select defaultValue="msisdn">
                    <SelectTrigger className="bg-black/40 border-white/10 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131929] border-white/10 text-white">
                      <SelectItem value="msisdn">MSISDN (Phone)</SelectItem>
                      <SelectItem value="ipv4">IPv4 Address</SelectItem>
                      <SelectItem value="imei">IMEI (Device)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-bold text-white/60">Risk Threshold (Max Age Hours)</Label>
                  <Input 
                    type="number"
                    value={data.config?.threshold || 24}
                    onChange={(e) => updateNodeData(selectedNodeId, { config: { ...data.config, threshold: e.target.value } })}
                    className="bg-black/40 border-white/10 text-xs h-10"
                  />
                  <p className="text-[9px] text-white/20 italic font-medium">Flag if network event occurred within this window.</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-bold text-white/60">Pre-check Carrier Status</Label>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                    <div className="space-y-0.5">
                        <Label className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Roaming Guard</Label>
                        <p className="text-[9px] text-white/20">Reject if roaming detected</p>
                    </div>
                    <Switch 
                      checked={!!data.config?.roamingGuard} 
                      onCheckedChange={(val) => updateNodeData(selectedNodeId, { config: { ...data.config, roamingGuard: val } })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[11px] font-bold text-white/60">Preferred MNO Selection</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger className="bg-black/40 border-white/10 text-xs h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131929] border-white/10 text-white">
                      <SelectItem value="auto">Auto-detect (Network Loopback)</SelectItem>
                      <SelectItem value="safaricom">Safaricom</SelectItem>
                      <SelectItem value="mtn">MTN Africa</SelectItem>
                      <SelectItem value="ethio">Ethio Telecom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}


            {data.category === 'condition' && (
              <div className="space-y-5">
                <div className="space-y-3">
                  <Label className="text-[11px] font-bold text-white/60">Evaluation Field</Label>
                  <Select 
                    value={data.config?.field || 'amount'} 
                    onValueChange={(val) => updateNodeData(selectedNodeId, { config: { ...data.config, field: val } })}
                  >
                    <SelectTrigger className="bg-black/40 border-white/10 text-xs h-10">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#131929] border-white/10 text-white">
                      <SelectItem value="transaction_amount">Transaction Amount</SelectItem>
                      <SelectItem value="sim_swap_age">SIM Swap Age</SelectItem>
                      <SelectItem value="device_trust_score">Device Trust Score</SelectItem>
                      <SelectItem value="location_match">Location Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-white/60">Operator</Label>
                    <Select 
                      value={data.config?.op || '>'} 
                      onValueChange={(val) => updateNodeData(selectedNodeId, { config: { ...data.config, op: val } })}
                    >
                      <SelectTrigger className="bg-black/40 border-white/10 text-xs h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#131929] border-white/10 text-white px-2">
                        {['>', '<', '==', '!=', '>=', '<='].map(op => (
                          <SelectItem key={op} value={op}>{op}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-white/60">Value</Label>
                    <Input 
                      value={data.config?.val || ''}
                      onChange={(e) => updateNodeData(selectedNodeId, { config: { ...data.config, val: e.target.value } })}
                      className="bg-black/40 border-white/10 text-xs h-10"
                      placeholder="e.g. 50000"
                    />
                  </div>
                </div>
              </div>
            )}

            {data.category === 'decision' && (
               <div className="space-y-5">
                  <div className="p-4 rounded-2xl border bg-black/20" style={{ borderColor: `${borderColor}30` }}>
                    <div className="flex items-center gap-3 mb-2">
                       <CheckCircle className="w-4 h-4" style={{ color: borderColor }} />
                       <span className="text-[11px] font-black tracking-widest uppercase" style={{ color: borderColor }}>Decision: {data.decisionType}</span>
                    </div>
                    <p className="text-[10px] text-white/40 font-medium">This node terminates the flow with an authoritative trust decision.</p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-white/60">Outcome Message</Label>
                    <textarea 
                      value={data.config?.reason || ''}
                      onChange={(e) => updateNodeData(selectedNodeId, { config: { ...data.config, reason: e.target.value } })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white min-h-[100px] focus:outline-none focus:border-blue-500/50"
                      placeholder="Explain this decision to ops team..."
                    />
                  </div>
               </div>
            )}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
             <div className="flex items-center gap-2 text-blue-400">
               <Info className="w-3.5 h-3.5" />
               <span className="text-[10px] font-bold uppercase tracking-wider">Node Intelligence</span>
             </div>
             <p className="text-[10px] text-white/40 leading-relaxed">
               This configuration is deployed to the ShieldGuard orchestration engine. Changes take effect immediately upon deployment.
             </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
