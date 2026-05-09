
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { BaseShieldNode } from './BaseShieldNode';
import { ShieldNodeData } from '../../../types/flow.types';
import { COLORS } from '../../../lib/constants';

export const ConditionNode = ({ id, data, selected }: { id: string; data: ShieldNodeData; selected: boolean }) => {
  const { field, op, val } = data.config || {};
  
  return (
    <BaseShieldNode id={id} data={data} selected={selected}>
      {field && (
        <div className="p-2 rounded bg-amber-500/5 border border-amber-500/10 font-mono text-[9px] text-amber-400 mb-2">
          IF {field} {op} {val}
        </div>
      )}
      
      <div className="flex flex-col gap-1 text-[9px] font-bold">
        <div className="text-right pr-6 text-emerald-400">TRUE</div>
        <div className="text-right pr-6 text-red-400">FALSE</div>
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: COLORS.condition, width: 10, height: 10, border: '2px solid #0A0F1E' }} 
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="true"
        style={{ top: '35%', background: COLORS.decision.ALLOW, width: 10, height: 10, border: '2px solid #0A0F1E' }} 
      />
      
      <Handle 
        type="source" 
        position={Position.Right} 
        id="false"
        style={{ top: '65%', background: COLORS.decision.BLOCK, width: 10, height: 10, border: '2px solid #0A0F1E' }} 
      />
    </BaseShieldNode>
  );
};
