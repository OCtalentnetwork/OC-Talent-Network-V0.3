export enum AgentType {
  INTERVIEWER = 'INTERVIEWER',
  ADVISOR = 'ADVISOR'
}

export interface AgentConfig {
  id: AgentType;
  name: string;
  role: string;
  description: string;
  color: string; // Tailwind class partial
  systemInstruction: string;
}

export interface TranscriptionLog {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: number;
}
