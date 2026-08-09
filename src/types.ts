export interface WorkflowStep {
  id: string;
  title: string;
  isCompleted: boolean;
  content: string;
}

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  command: string;
  timeoutMs: number;
  status: JobStatus;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
  log: string;
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

export interface AppState {
  issues: Issue[];
  skills: Skill[];
  settings: Settings;
  activeIssueId: string | null;
  jobs: Job[];
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
