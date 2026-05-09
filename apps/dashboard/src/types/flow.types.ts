
import { Node, Edge } from '@xyflow/react';

export type NodeCategory = 'trigger' | 'telecom_signal' | 'condition' | 'decision';
export type DecisionType = 'ALLOW' | 'VERIFY' | 'BLOCK';
export type CamaraAPI = 'sim_swap' | 'device_status' | 'device_swap' | 'number_verify' | 'kyc_match' | 'location_verify' | 'roaming_status';

export interface ShieldNodeData {
  label: string;
  category: NodeCategory;
  camaraApi?: CamaraAPI;
  config: Record<string, any>;
  validationState: 'valid' | 'warning' | 'error' | 'unconfigured';
  description: string;
  icon?: string;
  decisionType?: DecisionType;
  [key: string]: unknown;
}

export type ShieldNode = Node<ShieldNodeData>;

export interface TrustFlow {
  id: string;
  name: string;
  description: string;
  nodes: ShieldNode[];
  edges: Edge[];
  createdAt: string;
  isValid: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: { nodeId: string; message: string }[];
  warnings: { nodeId: string; message: string }[];
}
