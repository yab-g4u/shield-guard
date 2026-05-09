
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '../../../lib/utils';
import { NodeCategory } from '../../../types/flow.types';
import { COLORS } from '../../../lib/constants';
import * as LucideIcons from 'lucide-react';

interface BaseShieldNodeProps {
  id: string;
  data: {
    label: string;
    category: NodeCategory;
    icon?: keyof typeof LucideIcons;
    validationState?: 'valid' | 'warning' | 'error' | 'unconfigured';
    description?: string;
  };
  selected?: boolean;
  children?: React.ReactNode;
}

export const BaseShieldNode: React.FC<BaseShieldNodeProps> = ({ id, data, selected, children }) => {
  const IconComponent = data.icon ? (LucideIcons[data.icon] as any) : null;
  const categoryColor = COLORS[data.category as keyof typeof COLORS] || '#fff';
  
  // For decision category, it might be an object
  const borderColor = typeof categoryColor === 'string' ? categoryColor : '#fff';

  return (
    <div className={cn(
      "w-[220px] bg-[#131929] rounded-xl border transition-all duration-300",
      selected ? "border-[#00D4FF]/60 shadow-[0_0_20px_rgba(0,212,255,0.15)] scale-[1.02]" : "border-[#1a2540]"
    )}>
      <div className="flex items-stretch h-full overflow-hidden rounded-xl">
        {/* Category Accent Bar */}
        <div 
          className="w-1" 
          style={{ backgroundColor: borderColor }} 
        />
        
        <div className="flex-1 p-3">
          <div className="flex items-center gap-2 mb-2">
            {IconComponent && (
              <div className="p-1.5 rounded-lg bg-white/5 border border-white/5">
                <IconComponent className="w-4 h-4" style={{ color: borderColor }} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-[12px] font-bold text-white truncate leading-none mb-0.5">
                {data.label}
              </h3>
              <p className="text-[10px] text-white/40 truncate">
                {data.category.replace('_', ' ').toUpperCase()}
              </p>
            </div>
          </div>
          
          <div className="space-y-1.5 min-h-[40px]">
            {children}
          </div>
          
          <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
             <div className="flex items-center gap-1.5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  data.validationState === 'valid' ? "bg-emerald-500" :
                  data.validationState === 'error' ? "bg-red-500" :
                  data.validationState === 'warning' ? "bg-amber-500" : "bg-white/20"
                )} />
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">
                  {data.validationState || 'READY'}
                </span>
             </div>
             <div className="text-[9px] font-mono text-white/20">
                {id.split('-')[0]}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
