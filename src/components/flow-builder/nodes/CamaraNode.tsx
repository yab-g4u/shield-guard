
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { BaseShieldNode } from './BaseShieldNode';
import { ShieldNodeData } from '../../../types/flow.types';
import { COLORS } from '../../../lib/constants';
import { Badge } from '../../ui/badge';

export const CamaraNode = ({ id, data, selected }: { id: string; data: ShieldNodeData; selected: boolean }) => {
  return (
    <BaseShieldNode id={id} data={data} selected={selected}>
      <div className="flex flex-col gap-1.5">
        <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 text-[9px] w-fit font-mono">
          CAMARA: {data.camaraApi}
        </Badge>
        {data.config?.threshold && (
          <div className="text-[10px] text-white/60">
            Threshold: <span className="text-blue-400">&lt; {data.config.threshold}h</span>
          </div>
        )}
      </div>
      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: COLORS.telecom_signal, width: 10, height: 10, border: '2px solid #0A0F1E' }} 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: COLORS.telecom_signal, width: 10, height: 10, border: '2px solid #0A0F1E' }} 
      />
    </BaseShieldNode>
  );
};
