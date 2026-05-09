
import React, { useCallback, useRef, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  BackgroundVariant,
  XYPosition,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '../../store/useFlowStore';
import { nodeTypes } from './nodes';
import { TrustEdge } from './edges/TrustEdge';
import { ShieldNode, ShieldNodeData } from '../../types/flow.types';
import { COLORS } from '../../lib/constants';
import { Shield, Layout, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

const edgeTypes = {
  trust: TrustEdge,
};

import { TemplatesModal } from './TemplatesModal';

export const FlowCanvasContent = () => {
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    addNode, 
    setSelectedNode 
  } = useFlowStore();
  
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const canvasRef = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeDataJSON = event.dataTransfer.getData('application/shieldguard-node');
      if (!nodeDataJSON) return;

      const nodeDef = JSON.parse(nodeDataJSON);
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: ShieldNode = {
        id: `${nodeDef.type}-${Date.now()}`,
        type: nodeDef.category,
        position,
        data: {
          ...nodeDef,
          config: {},
          validationState: 'unconfigured',
        },
      };

      addNode(newNode);
    },
    [addNode, screenToFlowPosition]
  );

  const onNodeClick = useCallback((_: any, node: any) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  return (
    <div className="flex-1 relative h-full bg-[#0A0F1E]" ref={canvasRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="bg-[#0A0F1E]"
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background 
          color="#1a2540" 
          gap={25} 
          size={1} 
          variant={BackgroundVariant.Dots} 
        />
        
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="max-w-md w-full p-12 rounded-[40px] border-2 border-dashed border-blue-500/10 bg-blue-500/5 flex flex-col items-center text-center">
               <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-8 pulse-glow">
                  <Shield className="w-10 h-10 text-blue-400" />
               </div>
               <h3 className="text-xl font-bold text-white mb-4">Start your Trust Flow</h3>
               <p className="text-sm text-white/30 mb-8 leading-relaxed">
                 Drag CAMARA network nodes from the sidebar to build your programmable telecom trust orchestration.
               </p>
               <div className="flex gap-4">
                 <Button 
                   onClick={() => setTemplatesOpen(true)}
                   variant="outline" 
                   className="bg-white/5 border-white/10 text-white rounded-2xl h-11 px-6 text-xs font-bold pointer-events-auto"
                 >
                    <Layout className="w-4 h-4 mr-2" />
                    LOAD TEMPLATE
                 </Button>
               </div>
            </div>
          </div>
        )}

        <TemplatesModal open={templatesOpen} onOpenChange={setTemplatesOpen} />

        <Controls 
          className="bg-[#131929] border border-white/10 rounded-xl overflow-hidden fill-white"
          showInteractive={false}
        />
        
        <MiniMap 
          nodeColor={(node: any) => {
            const cat = node.data?.category;
            return COLORS[cat as keyof typeof COLORS] as string || '#333';
          }}
          className="bg-[#131929] border border-white/10 rounded-xl !bottom-8 !right-8 shadow-2xl"
          maskColor="rgba(10, 15, 30, 0.7)"
          style={{ width: 150, height: 100 }}
        />
        
        <Panel position="bottom-left" className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 mb-8 ml-4">
           <div className="flex items-center gap-3">
              <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-white/40 tracking-widest uppercase">Connection Mode: Active</span>
           </div>
        </Panel>
      </ReactFlow>

      <style>{`
        .react-flow__controls button {
          background: #131929;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          color: white;
        }
        .react-flow__controls button:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .react-flow__controls button svg {
          fill: currentColor;
        }
        .react-flow__minimap {
           border: 1px solid rgba(0, 212, 255, 0.1) !important;
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.1); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.3); }
        }
        .pulse-glow {
          animation: pulse-glow 4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export const FlowCanvas = () => (
  <ReactFlowProvider>
    <FlowCanvasContent />
  </ReactFlowProvider>
);
