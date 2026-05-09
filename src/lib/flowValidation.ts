
import { ShieldNode, ValidationResult } from '../types/flow.types';
import { Edge } from '@xyflow/react';

export function validateFlow(nodes: ShieldNode[], edges: Edge[]): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  };

  // 1. Must have exactly one Trigger node
  const triggerNodes = nodes.filter(n => n.data.category === 'trigger');
  if (triggerNodes.length === 0) {
    result.errors.push({ nodeId: '', message: 'Flow must have a Trigger node' });
  } else if (triggerNodes.length > 1) {
    result.errors.push({ nodeId: '', message: 'Flow cannot have multiple Trigger nodes' });
  }

  // 2. Must have at least one Decision node
  const decisionNodes = nodes.filter(n => n.data.category === 'decision');
  if (decisionNodes.length === 0) {
    result.errors.push({ nodeId: '', message: 'Flow must have at least one Decision node' });
  }

  // 3. Connectivity checks
  nodes.forEach(node => {
    const hasIncoming = edges.some(e => e.target === node.id);
    const hasOutgoing = edges.some(e => e.source === node.id);

    if (node.data.category !== 'trigger' && !hasIncoming) {
      result.warnings.push({ nodeId: node.id, message: 'Node is disconnected (no input)' });
    }

    if (node.data.category !== 'decision' && !hasOutgoing) {
      result.warnings.push({ nodeId: node.id, message: 'Node has no path to a decision' });
    }

    // 5. ConditionNode must have exactly 2 outgoing edges (true/false paths)
    if (node.data.category === 'condition') {
      const outgoing = edges.filter(e => e.source === node.id);
      if (outgoing.length !== 2) {
        result.errors.push({ nodeId: node.id, message: 'Condition branches must have both True and False paths' });
      }
    }
  });

  // 6. Check for cycles (Simplified)
  // TODO: Implement DFS for cycle detection if needed

  result.isValid = result.errors.length === 0;
  return result;
}
