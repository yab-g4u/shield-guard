
import React from 'react';
import { FlowToolbar } from '../components/flow-builder/FlowToolbar';
import { NodeSidebar } from '../components/flow-builder/NodeSidebar';
import { FlowCanvas } from '../components/flow-builder/FlowCanvas';
import { PropertiesPanel } from '../components/flow-builder/PropertiesPanel';
import { BottomDock } from '../components/flow-builder/BottomDock';
import { Toaster } from 'sonner';
import { useFlowStore } from '../store/useFlowStore';

export default function FlowBuilderPage({ onBack }: { onBack: () => void }) {
  const { undo, redo } = useFlowStore();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex flex-col h-screen bg-[#0A0F1E] text-white overflow-hidden selection:bg-blue-500/30">
      <Toaster position="top-right" theme="dark" />
      
      {/* Re-using Toolbar with a back button integration if needed */}
      <FlowToolbar />
      
      <div className="flex flex-1 overflow-hidden relative pb-[100px]">
        <NodeSidebar />
        
        <main className="flex-1 overflow-hidden relative">
          <FlowCanvas />
        </main>
        
        <PropertiesPanel />
      </div>

      <BottomDock />

      {/* Global CSS for flow styling */}
      <style>{`
        .react-flow__handle {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          width: 8px !important;
          height: 8px !important;
          background: #3b82f6 !important;
        }
        .react-flow__handle:hover {
          transform: scale(1.5);
          box-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
        }
        .react-flow__edge-path {
          transition: stroke-dashoffset 0.5s ease;
        }
        .react-flow__node {
          cursor: default !important;
        }
        .react-flow__node.selected {
           z-index: 1000 !important;
        }
      `}</style>
    </div>
  );
}

