
import { create } from 'zustand';
import { 
  Connection, 
  Edge, 
  EdgeChange, 
  NodeChange, 
  addEdge, 
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange
} from '@xyflow/react';
import { ShieldNode, ShieldNodeData, TrustFlow } from '../types/flow.types';

interface FlowState {
  nodes: ShieldNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  currentFlowName: string;
  isValidating: boolean;
  validationErrors: { nodeId: string; message: string }[];
  
  onNodesChange: (changes: NodeChange<ShieldNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  addNode: (node: ShieldNode) => void;
  updateNodeData: (nodeId: string, data: Partial<ShieldNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNode: (nodeId: string | null) => void;
  
  setFlowName: (name: string) => void;
  clearCanvas: () => void;
  loadTemplate: (flow: Partial<TrustFlow>) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

interface HistoryItem {
  nodes: ShieldNode[];
  edges: Edge[];
}

export const useFlowStore = create<FlowState>((set, get) => {
  const history: HistoryItem[] = [];
  let historyIndex = -1;

  const pushToHistory = () => {
    const { nodes, edges } = get();
    // Remove future history if we're in the middle of undoing
    history.splice(historyIndex + 1);
    history.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    historyIndex++;
  };

  return {
    nodes: [],
    edges: [],
    selectedNodeId: null,
    currentFlowName: 'Untitled Trust Flow',
    isValidating: false,
    validationErrors: [],
    
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    
    onConnect: (connection) => {
      pushToHistory();
      set({
        edges: addEdge({ ...connection, animated: true, type: 'trust' }, get().edges),
      });
    },
    
    addNode: (node) => {
      pushToHistory();
      set({
        nodes: [...get().nodes, node],
      });
    },
    
    updateNodeData: (nodeId, data) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            return { ...node, data: { ...node.data, ...data } };
          }
          return node;
        }),
      });
    },
    
    deleteNode: (nodeId) => {
      pushToHistory();
      set({
        nodes: get().nodes.filter((node) => node.id !== nodeId),
        edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
        selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
      });
    },
    
    setSelectedNode: (nodeId) => {
      set({ selectedNodeId: nodeId });
    },
    
    setFlowName: (name) => {
      set({ currentFlowName: name });
    },
    
    clearCanvas: () => {
      pushToHistory();
      set({ nodes: [], edges: [], selectedNodeId: null });
    },
    
    loadTemplate: (template) => {
      pushToHistory();
      set({
        nodes: template.nodes || [],
        edges: template.edges || [],
        currentFlowName: template.name || get().currentFlowName,
      });
    },

    undo: () => {
      if (historyIndex > 0) {
        historyIndex--;
        const { nodes, edges } = history[historyIndex];
        set({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
      }
    },

    redo: () => {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        const { nodes, edges } = history[historyIndex];
        set({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
      }
    },

    pushHistory: pushToHistory,
  };
});
