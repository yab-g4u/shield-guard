
import React, { useRef, useState } from 'react';
import { Shield, CheckCircle2, ChevronRight, Play, Server, Zap, Code, Save, Layout } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFlowStore } from '../../store/useFlowStore';
import { validateFlow } from '../../lib/flowValidation';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

import { TemplatesModal } from './TemplatesModal';

export const FlowToolbar = () => {
  const { currentFlowName, setFlowName, nodes, edges } = useFlowStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [valResult, setValResult] = useState(() => validateFlow(nodes, edges));

  const handleValidate = () => {
    const result = validateFlow(nodes, edges);
    setValResult(result);
    if (result.isValid && result.warnings.length === 0) {
      toast.success('Flow is valid and ready for deployment!');
    } else if (result.isValid) {
      toast.warning(`Flow is valid but has ${result.warnings.length} warnings.`);
    } else {
      toast.error(`Validation failed: ${result.errors.length} errors found.`);
    }
  };

  const handleSave = () => {
    toast.success('Flow saved to infrastructure!');
  };

  return (
    <div className="h-20 bg-[#131929]/80 backdrop-blur-xl border-b border-[#00D4FF]/10 flex items-center justify-between px-8 relative z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <Input
                  autoFocus
                  value={currentFlowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="h-7 bg-black/40 border-white/10 text-xs font-bold text-white w-48"
                />
              ) : (
                <h1 
                  onClick={() => setIsEditingName(true)}
                  className="text-sm font-black tracking-tight text-white cursor-pointer hover:text-blue-400 transition-colors"
                >
                  {currentFlowName}
                </h1>
              )}
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-mono font-bold px-1.5 py-0">LIVE</Badge>
            </div>
            <p className="text-[10px] text-white/30 font-mono tracking-widest mt-0.5">V3.4.2_STABLE</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-black/20 border border-white/5 mr-4">
           <Button 
             variant="ghost" 
             size="sm" 
             className="h-8 text-[11px] font-bold text-white/40 hover:text-white"
             onClick={handleValidate}
           >
             <CheckCircle2 className={cn("w-3.5 h-3.5 mr-2", valResult.isValid ? "text-emerald-500" : "text-red-500")} />
             VALIDATE
           </Button>
           <div className="w-px h-4 bg-white/5 mx-1" />
           <Button 
             variant="ghost" 
             size="sm" 
             className="h-8 text-[11px] font-bold text-white/40 hover:text-white"
             onClick={() => setTemplatesOpen(true)}
           >
             <Layout className="w-3.5 h-3.5 mr-2" />
             TEMPLATES
           </Button>
        </div>

        <TemplatesModal open={templatesOpen} onOpenChange={setTemplatesOpen} />

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-10 bg-black/40 border-white/10 text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-xl px-5">
            <Code className="w-4 h-4 mr-2" />
            PREVIEW JSON
          </Button>
          <Button 
            onClick={handleSave}
            className="h-10 bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.3)] rounded-xl px-6 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Save className="w-4 h-4 mr-2" />
            DEPLOY FLOW
          </Button>
        </div>
      </div>
    </div>
  );
};

import { cn } from '../../lib/utils';
