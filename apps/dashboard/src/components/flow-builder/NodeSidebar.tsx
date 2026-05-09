
import React, { useState } from 'react';
import { Search, Shield, Zap, Smartphone, Phone, UserCheck, MapPin, Globe, GitBranch, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { NODE_DEFINITIONS } from '../../lib/constants';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';

const ICON_MAP: Record<string, any> = {
  Zap,
  Shield,
  Smartphone,
  Phone,
  UserCheck,
  MapPin,
  Globe,
  GitBranch,
  CheckCircle,
  AlertTriangle,
  XCircle,
};

export const NodeSidebar = () => {
  const [search, setSearch] = useState('');

  const filteredNodes = NODE_DEFINITIONS.filter(node => 
    node.label.toLowerCase().includes(search.toLowerCase()) ||
    node.category.toLowerCase().includes(search.toLowerCase())
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    const nodeDef = NODE_DEFINITIONS.find(n => n.type === nodeType || n.category === nodeType);
    event.dataTransfer.setData('application/shieldguard-node', JSON.stringify(nodeDef));
    event.dataTransfer.effectAllowed = 'move';
  };

  const categories = [
    { id: 'trigger', label: 'TRIGGERS', color: '#FF8C00' },
    { id: 'telecom_signal', label: 'TELECOM SIGNALS', color: '#00D4FF' },
    { id: 'condition', label: 'LOGIC', color: '#FFB800' },
    { id: 'decision', label: 'DECISIONS', color: '#00FF88' },
  ];

  return (
    <div className="w-[280px] h-full bg-[#131929] border-r border-[#00D4FF]/10 flex flex-col flex-shrink-0 z-10 transition-all duration-300">
      <div className="p-6 border-b border-white/5 bg-[#0D1424]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-sm font-black tracking-widest text-white uppercase">Trust Nodes</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <Input 
            placeholder="Search nodes..." 
            className="pl-9 bg-black/40 border-white/10 text-xs h-9 focus-visible:ring-blue-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar">
        {categories.map(cat => {
          const nodes = filteredNodes.filter(n => 
            n.category === cat.id || 
            (cat.id === 'decision' && n.category === 'decision') ||
            (cat.id === 'condition' && n.category === 'condition') ||
            (cat.id === 'trigger' && n.category === 'trigger')
          );
          
          if (nodes.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase pl-1">
                {cat.label}
              </h3>
              <div className="space-y-2">
                {nodes.map((node, i) => {
                  const Icon = ICON_MAP[node.icon || 'Shield'];
                  return (
                    <motion.div
                      key={node.label + i}
                      draggable
                      onDragStart={(e) => onDragStart(e, node.type || node.category)}
                      whileHover={{ x: 4, borderColor: `${cat.color}60` }}
                      className="group cursor-grab active:cursor-grabbing p-3 rounded-xl bg-[#0A0F1E] border border-white/5 hover:bg-white/[0.03] transition-all flex items-start gap-4"
                      style={{ borderLeft: `3px solid ${cat.color}` }}
                    >
                      <div className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-colors">
                        {Icon && <Icon className="w-4 h-4" style={{ color: cat.color }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] font-bold text-white mb-0.5">{node.label}</div>
                        <div className="text-[9px] text-white/30 leading-tight line-clamp-2">
                          {node.description}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      
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
