export interface Trigger {
  label: string;
  value: string;
  problem_type: string;
  default_script: string;
}

export interface Stage {
  id: string;
  name: string;
  goal: string;
  triggers: Trigger[];
}

export interface Config {
  stages: Stage[];
}

export interface Script {
  type: 'soft' | 'challenger' | 'direct';
  content: string;
}

export interface Attachment {
  name: string;
  url: string;
}

export interface TacticalCardData {
  diagnosis: string;
  tags: string[];
  scripts: Script[];
  warning: string;
  files: Attachment[];
}

// API Request/Response types
export interface CombatRequest {
  industry: string;
  productName: string;
  role: string;
  stage: string;
  triggerValue: string;
  problemType: string;
  query?: string;
  conversationId?: string;
  userId?: string;
}

export interface CombatResponse extends TacticalCardData {
  // It basically matches the TacticalCardData structure from Dify
}
