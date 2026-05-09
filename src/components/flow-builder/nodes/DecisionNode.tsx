
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { BaseShieldNode } from './BaseShieldNode';
import { ShieldNodeData } from '../../../types/flow.types';
import { COLORS } from '../../../lib/constants';
import { cn } from '../../../lib/utils';

export const DecisionNode = ({ id, data, selected }: { id: string; data: ShieldNodeData; selected: boolean }) => {
  const decisionType = data.decisionType || 'ALLOW';
  const color = COLORS.decision[decisionType];

  return (
    <BaseShieldNode id={id} data={data} selected={selected}>
      <div className="flex flex-col items-center justify-center p-4">
        <div 
          className={cn(
            "text-lg font-black tracking-tighter pulse-slow",
          )}
          style={{ color }}
        >
          {decisionType}
        </div>
        {data.config?.reason && (
          <p className="text-[8px] text-white/30 text-center mt-2 italic leading-tight">
            "{data.config.reason}"
          </p>
        )}
      </div>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: color, width: 10, height: 10, border: '2px solid #0A0F1E' }} 
      />
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 10px ${color}40); }
          50% { opacity: 0.7; filter: drop-shadow(0 0 5px ${color}20); }
        }
        .pulse-slow {
          animation: pulse 3s infinite ease-in-out;
        }
      `}</style>
    </BaseShieldNode>
  );
};
