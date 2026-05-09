
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { FLOW_TEMPLATES } from '../../lib/flowTemplates';
import { useFlowStore } from '../../store/useFlowStore';
import { Layout, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';

export const TemplatesModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const { loadTemplate } = useFlowStore();

  const handleSelect = (template: any) => {
    loadTemplate(template);
    onOpenChange(false);
    toast.success(`${template.name} template loaded!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#131929] border-white/10 text-white rounded-[32px] p-0 overflow-hidden">
        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-1/3 bg-[#0D1424] p-8 border-r border-white/5 flex flex-col">
            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 w-fit mb-6">
              <Layout className="w-6 h-6 text-blue-400" />
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight mb-4">Flow Templates</DialogTitle>
            <DialogDescription className="text-white/40 leading-relaxed mb-8">
              Start with a professionally crafted telecom trust workflow. Each template follows carrier-grade best practices for risk orchestration.
            </DialogDescription>
            
            <div className="space-y-4 mt-auto">
               <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-bold text-white/60 uppercase">Verified Logic</span>
               </div>
               <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-[11px] font-bold text-white/60 uppercase">CAMARA Compliant</span>
               </div>
            </div>
          </div>

          {/* Grid */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 gap-4">
              {FLOW_TEMPLATES.map((tpl) => (
                <div 
                  key={tpl.id}
                  className="group p-6 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer flex flex-col gap-4 relative overflow-hidden"
                  onClick={() => handleSelect(tpl)}
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-blue-400" />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-wider text-xs">{tpl.name}</h4>
                      <p className="text-[10px] text-white/30 font-medium">Ready to deploy</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/50 leading-relaxed max-w-md">
                    {tpl.description}
                  </p>
                  
                  <div className="flex gap-2">
                    {['CAMARA', 'SECURE', 'AUTO-SCALE'].map(tag => (
                      <span key={tag} className="text-[8px] font-mono font-bold text-white/20 border border-white/5 px-1.5 py-0.5 rounded cursor-default uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
