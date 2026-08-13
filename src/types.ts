export interface WorkflowStep {
  id: string;
  title: string;
  isCompleted: boolean;
  content: string;
}

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled' | 'awaiting_approval';

export interface Job {
  id: string;
  command: string;
  timeoutMs: number;
  status: JobStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  log: string;
  plan?: string;
}

export interface Standup {
  id: string;
  date: string;
  today: string;
  tomorrow: string;
  blockers: string;
  createdAt: number;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  labels: string[];
  createdAt: number;
}

export interface SessionReport {
  id: string;
  issueId: string;
  initialGoal: string;
  completionSummary: string;
  readyForProdReason: string;
  codeStandardPassed: boolean;
  testsPassed: boolean;
  approved: boolean;
  codeReviewScore: number;
  riskScore: number;
  valueScore: number;
  tokensUsed: number;
  cost: number;
  createdAt: number;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  status: 'open' | 'closed';
  type: 'bug' | 'feature';
  steps: WorkflowStep[];
  linkedSkills: string[];
  contextSummary: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface Settings {
  githubToken: string;
  githubRepo: string;
  claudeApiKey: string;
}

export interface DebugEvent {
  id: string;
  timestamp: number;
  type: 'cli' | 'ai_prompt' | 'system' | 'token_usage';
  message: string;
  meta?: any;
}

export interface AppState {
  issues: Issue[];
  skills: Skill[];
  settings: Settings;
  activeIssueId: string | null;
  jobs: Job[];
  standups: Standup[];
  blogPosts: BlogPost[];
  sessionReports: SessionReport[];
  debugEvents: DebugEvent[];
  apiMode: 'mock' | 'live' | 'unknown';
  totalTokensUsed: number;
}

export const DEFAULT_BUG_STEPS = [
  "Read failure logs",
  "Generate fingerprint from failure log",
  "Create issue ticket",
  "Read source code repo",
  "Create plan to fix the issue",
  "Finish/work on checkpoint one by one",
  "Verify fix run tests",
  "Code review",
  "Land PR",
  "Close issue"
];
