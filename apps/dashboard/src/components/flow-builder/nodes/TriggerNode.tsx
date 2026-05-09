
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { BaseShieldNode } from './BaseShieldNode';
import { ShieldNodeData } from '../../../types/flow.types';
import { COLORS } from '../../../lib/constants';

export const TriggerNode = ({ id, data, selected }: { id: string; data: ShieldNodeData; selected: boolean }) => {
  return (
    <BaseShieldNode id={id} data={data} selected={selected}>
      <p className="text-[10px] text-white/40 leading-relaxed italic">
        {data.description}
      </p>
      {data.config?.amount && (
        <div className="px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/20 text-[9px] text-orange-400 w-fit">
          &gt; ${data.config.amount}
        </div>
      )}
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: COLORS.trigger, width: 10, height: 10, border: '2px solid #0A0F1E' }} 
      />
    </BaseShieldNode>
  );
};
