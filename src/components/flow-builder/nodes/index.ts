
import { TriggerNode } from './TriggerNode';
import { CamaraNode } from './CamaraNode';
import { ConditionNode } from './ConditionNode';
import { DecisionNode } from './DecisionNode';

export const nodeTypes = {
  trigger: TriggerNode,
  telecom_signal: CamaraNode,
  condition: ConditionNode,
  decision: DecisionNode,
};
