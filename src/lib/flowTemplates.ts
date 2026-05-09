
import React from 'react';
import { ShieldNode, TrustFlow } from '../types/flow.types';
import { Edge } from '@xyflow/react';

export const FLOW_TEMPLATES: Partial<TrustFlow>[] = [
  {
    id: 'tpl-1',
    name: 'Basic SIM Swap Guard',
    description: 'A simple check for recent SIM swaps before allowing a transaction.',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 50, y: 200 },
        data: {
          label: 'Transaction Initiated',
          category: 'trigger',
          description: 'Real-time entry point for transaction requests.',
          icon: 'Zap',
          config: {},
          validationState: 'valid',
        }
      },
      {
        id: 'sim-1',
        type: 'telecom_signal',
        position: { x: 350, y: 200 },
        data: {
          label: 'SIM Swap Detection',
          category: 'telecom_signal',
          camaraApi: 'sim_swap',
          description: 'Check if the SIM card was recently replaced.',
          icon: 'Shield',
          config: { threshold: 24 },
          validationState: 'valid',
        }
      },
      {
        id: 'cond-1',
        type: 'condition',
        position: { x: 650, y: 200 },
        data: {
          label: 'Condition Branch',
          category: 'condition',
          description: 'Route flow based on specific criteria.',
          icon: 'GitBranch',
          config: { field: 'sim_swap_age', op: '<', val: '24' },
          validationState: 'valid',
        }
      },
      {
        id: 'block-1',
        type: 'decision',
        position: { x: 950, y: 100 },
        data: {
          label: 'Block Transaction',
          category: 'decision',
          decisionType: 'BLOCK',
          description: 'Reject the transaction immediately.',
          icon: 'XCircle',
          config: { reason: 'Recent SIM swap detected (< 24h)' },
          validationState: 'valid',
        }
      },
      {
        id: 'allow-1',
        type: 'decision',
        position: { x: 950, y: 300 },
        data: {
          label: 'Allow Transaction',
          category: 'decision',
          decisionType: 'ALLOW',
          description: 'Approve the transaction and proceed.',
          icon: 'CheckCircle',
          config: { reason: 'No recent SIM swaps found.' },
          validationState: 'valid',
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'sim-1', animated: true, type: 'trust' },
      { id: 'e2', source: 'sim-1', target: 'cond-1', animated: true, type: 'trust' },
      { id: 'e3', source: 'cond-1', target: 'block-1', sourceHandle: 'true', animated: true, type: 'trust', label: 'TRUE' },
      { id: 'e4', source: 'cond-1', target: 'allow-1', sourceHandle: 'false', animated: true, type: 'trust', label: 'FALSE' },
    ]
  },
  {
    id: 'tpl-2',
    name: 'High-Value Verification',
    description: 'Requires device and location checks for transactions over 50k.',
    nodes: [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 20, y: 250 },
        data: {
          label: 'Transaction Initiated',
          category: 'trigger',
          description: 'Entry point.',
          icon: 'Zap',
          config: { amount: 50000 },
          validationState: 'valid',
        }
      },
      {
        id: 'cond-1',
        type: 'condition',
        position: { x: 300, y: 250 },
        data: {
          label: 'Is High Value?',
          category: 'condition',
          icon: 'GitBranch',
          description: 'Check if amount > 50k',
          config: { field: 'transaction_amount', op: '>', val: '50000' },
          validationState: 'valid',
        }
      },
      {
        id: 'allow-quick',
        type: 'decision',
        position: { x: 600, y: 400 },
        data: {
          label: 'Allow (Low Value)',
          category: 'decision',
          decisionType: 'ALLOW',
          icon: 'CheckCircle',
          description: 'Proceed.',
          config: { reason: 'Transaction below threshold.' },
          validationState: 'valid',
        }
      },
      {
        id: 'dev-1',
        type: 'telecom_signal',
        position: { x: 600, y: 150 },
        data: {
          label: 'Device Status',
          category: 'telecom_signal',
          camaraApi: 'device_status',
          icon: 'Smartphone',
          description: 'Check device health.',
          config: {},
          validationState: 'valid',
        }
      },
      {
        id: 'loc-1',
        type: 'telecom_signal',
        position: { x: 850, y: 150 },
        data: {
          label: 'Location Verify',
          category: 'telecom_signal',
          camaraApi: 'location_verify',
          icon: 'MapPin',
          description: 'Verify location.',
          config: { radius: '100km' },
          validationState: 'valid',
        }
      },
      {
        id: 'verify-final',
        type: 'decision',
        position: { x: 1100, y: 150 },
        data: {
          label: 'Step-up Verify',
          category: 'decision',
          decisionType: 'VERIFY',
          icon: 'AlertTriangle',
          description: 'Require MFA.',
          config: { reason: 'High-value transaction requires device/location validation.' },
          validationState: 'valid',
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'trigger-1', target: 'cond-1', animated: true, type: 'trust' },
      { id: 'e2', source: 'cond-1', target: 'dev-1', sourceHandle: 'true', animated: true, type: 'trust', label: 'TRUE' },
      { id: 'e3', source: 'cond-1', target: 'allow-quick', sourceHandle: 'false', animated: true, type: 'trust', label: 'FALSE' },
      { id: 'e4', source: 'dev-1', target: 'loc-1', animated: true, type: 'trust' },
      { id: 'e5', source: 'loc-1', target: 'verify-final', animated: true, type: 'trust' },
    ]
  }
];
