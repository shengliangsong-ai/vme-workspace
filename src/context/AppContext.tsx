import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { AppState, Issue, Skill, Settings, Job, Standup, BlogPost, SessionReport, WorkflowStep, DEFAULT_BUG_STEPS, DebugEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { GitHubService } from '../lib/github';

interface AppContextType extends AppState {
  updateSettings: (settings: Settings) => void;
  createIssue: (title: string, type: 'bug' | 'feature') => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  setActiveIssue: (id: string | null) => void;
  addSkill: (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSkill: (id: string, updates: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;
  updateStepContent: (issueId: string, stepId: string, content: string) => void;
  toggleStepCompletion: (issueId: string, stepId: string) => void;
  syncToGitHub: () => Promise<void>;
  pullFromGitHub: () => Promise<void>;
  submitJob: (command: string, timeoutMs: number) => void;
  cancelJob: (id: string) => void;
  reorderJob: (id: string, newIndex: number) => void;
  deleteJob: (id: string) => void;
  clearJobs: () => void;
  approveJob: (id: string) => void;
  
  addStandup: (standup: Omit<Standup, 'id' | 'createdAt'>) => void;
  updateStandup: (id: string, updates: Partial<Standup>) => void;
  deleteStandup: (id: string) => void;
  
  addBlogPost: (post: Omit<BlogPost, 'id' | 'createdAt'>) => void;
  updateBlogPost: (id: string, updates: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  
  addSessionReport: (report: Omit<SessionReport, 'id' | 'createdAt'>) => void;
  
  addDebugEvent: (event: Omit<DebugEvent, 'id' | 'timestamp'>) => void;
  updateApiMode: (mode: 'mock' | 'live' | 'unknown') => void;
  addTokenUsage: (tokens: number) => void;
  
  isSyncing: boolean;
}

const defaultSettings: Settings = {
  githubToken: '',
  githubRepo: 'shengliangsong-ai/vme',
  claudeApiKey: ''
};

const initialState: AppState = {
  issues: [],
  skills: [],
  settings: defaultSettings,
  activeIssueId: null,
  jobs: [],
  standups: [],
  blogPosts: [],
  sessionReports: [],
  debugEvents: [],
  apiMode: 'unknown',
  totalTokensUsed: 0,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const processingRef = useRef(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const res = await fetch('/api/state');
        if (res.ok) {
          const parsed = await res.json();
          const recoveredJobs = (parsed.jobs || []).map((j: Job) => {
            if (j.status === 'running') {
              return { ...j, status: 'failed', log: j.log + '\n\n[System] Job failed due to unexpected shutdown or crash.' };
            }
            return j;
          });
          setState({ 
            ...initialState, 
            ...parsed, 
            jobs: recoveredJobs,
            standups: parsed.standups || [],
            blogPosts: parsed.blogPosts || [],
            sessionReports: parsed.sessionReports || []
          });
          setIsLoaded(true);
          return;
        }
      } catch (e) {
        console.warn("Could not load from API, falling back to localStorage", e);
      }
      
      const saved = localStorage.getItem('vme-state');
      if (saved) {
        const parsed = JSON.parse(saved);
        const recoveredJobs = (parsed.jobs || []).map((j: Job) => {
          if (j.status === 'running') {
            return { ...j, status: 'failed', log: j.log + '\n\n[System] Job failed due to unexpected shutdown or crash.' };
          }
          return j;
        });
        setState({ 
          ...initialState, 
          ...parsed, 
          jobs: recoveredJobs,
          standups: parsed.standups || [],
          blogPosts: parsed.blogPosts || [],
          sessionReports: parsed.sessionReports || []
        });
      }
      setIsLoaded(true);
    };
    loadState();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('vme-state', JSON.stringify(state));
    
    // Attempt to sync to local Firestore DB via Express backend
    fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    }).catch(e => console.warn("Failed to sync state to backend DB", e));
  }, [state, isLoaded]);

  const eventSourceRef = useRef<EventSource | null>(null);

  // Real Job Execution Loop
  useEffect(() => {
    const queuedJob = state.jobs.find(j => j.status === 'queued');
    const runningJob = state.jobs.find(j => j.status === 'running');
    
    if (!queuedJob || runningJob || processingRef.current) return;
    
    processingRef.current = true;

    setState(s => ({
      ...s,
      jobs: s.jobs.map(j => j.id === queuedJob.id 
        ? { ...j, status: 'running', startedAt: Date.now(), log: '> ' + j.command + '\nStarting execution...\n' }
        : j)
    }));

    let endpoint = `/api/jobs/stream?command=${encodeURIComponent(queuedJob.command)}`;
    if (queuedJob.command.toLowerCase().startsWith('orchestrate ')) {
      const actualCommand = queuedJob.command.substring(12).trim();
      endpoint = `/api/jobs/orchestrate?command=${encodeURIComponent(actualCommand)}`;
    } else if (queuedJob.command.toLowerCase().startsWith('execute_plan ')) {
      const plan = queuedJob.command.substring(13).trim();
      endpoint = `/api/jobs/execute?plan=${encodeURIComponent(plan)}`;
    } else if (queuedJob.command.toLowerCase() === 'self_improve') {
      endpoint = `/api/jobs/self_improve`;
    }

    const eventSource = new EventSource(endpoint);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'delta') {
          setState(s => ({
            ...s,
            jobs: s.jobs.map(j => j.id === queuedJob.id 
              ? { ...j, log: j.log + data.text }
              : j)
          }));
        } else if (data.type === 'completed') {
          setState(s => ({
            ...s,
            jobs: s.jobs.map(j => j.id === queuedJob.id 
              ? { ...j, status: 'completed', completedAt: Date.now(), log: j.log + '\n\nExecution completed successfully.' }
              : j)
          }));
          eventSource.close();
          eventSourceRef.current = null;
          processingRef.current = false;
        } else if (data.type === 'awaiting_approval') {
          setState(s => ({
            ...s,
            jobs: s.jobs.map(j => j.id === queuedJob.id 
              ? { ...j, status: 'awaiting_approval', plan: data.plan, log: j.log + '\n\n[System] Awaiting your approval to proceed.' }
              : j)
          }));
          eventSource.close();
          eventSourceRef.current = null;
          processingRef.current = false;
        } else if (data.type === 'error') {
          setState(s => ({
            ...s,
            jobs: s.jobs.map(j => j.id === queuedJob.id 
              ? { ...j, status: 'failed', completedAt: Date.now(), log: j.log + '\n\nError: ' + data.message }
              : j)
          }));
          eventSource.close();
          eventSourceRef.current = null;
          processingRef.current = false;
        }
      } catch (e) {
        console.error("Failed to parse SSE message", e);
      }
    };

    eventSource.onerror = () => {
      setState(s => ({
        ...s,
        jobs: s.jobs.map(j => j.id === queuedJob.id && j.status === 'running'
          ? { ...j, status: 'failed', completedAt: Date.now(), log: j.log + '\n\nConnection to server lost.' }
          : j)
      }));
      eventSource.close();
      eventSourceRef.current = null;
      processingRef.current = false;
    };
  }, [state.jobs]);

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const submitJob = (command: string, timeoutMs: number) => {
    const newJob: Job = {
      id: uuidv4(),
      command,
      timeoutMs,
      status: 'queued',
      createdAt: Date.now(),
      log: ''
    };
    setState(s => ({ ...s, jobs: [...s.jobs, newJob] }));
  };

  const cancelJob = (id: string) => {
    setState(s => ({
      ...s,
      jobs: s.jobs.map(j => (j.id === id && (j.status === 'queued' || j.status === 'running')) 
        ? { ...j, status: 'cancelled', log: j.log + '\nJob cancelled.', completedAt: Date.now() } 
        : j)
    }));
  };

  const reorderJob = (id: string, newIndex: number) => {
    setState(s => {
      const jobIndex = s.jobs.findIndex(j => j.id === id);
      if (jobIndex === -1 || s.jobs[jobIndex].status !== 'queued') return s;
      const newJobs = [...s.jobs];
      const [removed] = newJobs.splice(jobIndex, 1);
      newJobs.splice(newIndex, 0, removed);
      return { ...s, jobs: newJobs };
    });
  };

  const deleteJob = (id: string) => {
    setState(s => ({ ...s, jobs: s.jobs.filter(j => j.id !== id) }));
  };

  const clearJobs = () => {
    setState(s => ({ ...s, jobs: s.jobs.filter(j => j.status === 'running' || j.status === 'awaiting_approval') }));
  };

  const approveJob = (id: string) => {
    setState(s => ({
      ...s,
      jobs: s.jobs.map(j => {
        if (j.id === id && j.status === 'awaiting_approval' && j.plan) {
          return {
            ...j,
            status: 'queued',
            command: `execute_plan ${j.plan}`
          };
        }
        return j;
      })
    }));
  };

  const updateSettings = (settings: Settings) => {
    setState(s => ({ ...s, settings }));
  };

  const createIssue = (title: string, type: 'bug' | 'feature') => {
    const newIssue: Issue = {
      id: uuidv4(),
      title,
      description: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'open',
      type,
      steps: DEFAULT_BUG_STEPS.map(title => ({
        id: uuidv4(),
        title,
        isCompleted: false,
        content: ''
      })),
      linkedSkills: [],
      contextSummary: ''
    };
    setState(s => ({ ...s, issues: [newIssue, ...s.issues], activeIssueId: newIssue.id }));
  };

  const updateIssue = (id: string, updates: Partial<Issue>) => {
    setState(s => ({
      ...s,
      issues: s.issues.map(i => i.id === id ? { ...i, ...updates, updatedAt: Date.now() } : i)
    }));
  };

  const deleteIssue = (id: string) => {
    setState(s => ({
      ...s,
      issues: s.issues.filter(i => i.id !== id),
      activeIssueId: s.activeIssueId === id ? null : s.activeIssueId
    }));
  };

  const setActiveIssue = (id: string | null) => {
    setState(s => ({ ...s, activeIssueId: id }));
  };

  const addSkill = (skill: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSkill: Skill = {
      ...skill,
      id: uuidv4(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setState(s => ({ ...s, skills: [...s.skills, newSkill] }));
  };

  const updateSkill = (id: string, updates: Partial<Skill>) => {
    setState(s => ({
      ...s,
      skills: s.skills.map(skill => skill.id === id ? { ...skill, ...updates, updatedAt: Date.now() } : skill)
    }));
  };

  const deleteSkill = (id: string) => {
    setState(s => ({
      ...s,
      skills: s.skills.filter(skill => skill.id !== id)
    }));
  };

  const updateStepContent = (issueId: string, stepId: string, content: string) => {
    setState(s => ({
      ...s,
      issues: s.issues.map(i => {
        if (i.id !== issueId) return i;
        return {
          ...i,
          updatedAt: Date.now(),
          steps: i.steps.map(step => step.id === stepId ? { ...step, content } : step)
        };
      })
    }));
  };

  const toggleStepCompletion = (issueId: string, stepId: string) => {
    setState(s => ({
      ...s,
      issues: s.issues.map(i => {
        if (i.id !== issueId) return i;
        return {
          ...i,
          updatedAt: Date.now(),
          steps: i.steps.map(step => step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step)
        };
      })
    }));
  };

  const addStandup = (standup: Omit<Standup, 'id' | 'createdAt'>) => {
    const newStandup: Standup = { ...standup, id: uuidv4(), createdAt: Date.now() };
    setState(s => ({ ...s, standups: [newStandup, ...s.standups] }));
  };

  const updateStandup = (id: string, updates: Partial<Standup>) => {
    setState(s => ({ ...s, standups: s.standups.map(st => st.id === id ? { ...st, ...updates } : st) }));
  };

  const deleteStandup = (id: string) => {
    setState(s => ({ ...s, standups: s.standups.filter(st => st.id !== id) }));
  };

  const addBlogPost = (post: Omit<BlogPost, 'id' | 'createdAt'>) => {
    const newPost: BlogPost = { ...post, id: uuidv4(), createdAt: Date.now() };
    setState(s => ({ ...s, blogPosts: [newPost, ...s.blogPosts] }));
  };

  const updateBlogPost = (id: string, updates: Partial<BlogPost>) => {
    setState(s => ({ ...s, blogPosts: s.blogPosts.map(bp => bp.id === id ? { ...bp, ...updates } : bp) }));
  };

  const deleteBlogPost = (id: string) => {
    setState(s => ({ ...s, blogPosts: s.blogPosts.filter(bp => bp.id !== id) }));
  };

  const addSessionReport = (report: Omit<SessionReport, 'id' | 'createdAt'>) => {
    const newReport: SessionReport = { ...report, id: uuidv4(), createdAt: Date.now() };
    setState(s => ({ ...s, sessionReports: [newReport, ...s.sessionReports] }));
  };

  const addDebugEvent = (event: Omit<DebugEvent, 'id' | 'timestamp'>) => {
    const newEvent: DebugEvent = { ...event, id: uuidv4(), timestamp: Date.now() };
    setState(s => ({ ...s, debugEvents: [...(s.debugEvents || []), newEvent] }));
  };

  const updateApiMode = (mode: 'mock' | 'live' | 'unknown') => {
    setState(s => ({ ...s, apiMode: mode }));
  };

  const addTokenUsage = (tokens: number) => {
    setState(s => ({ ...s, totalTokensUsed: (s.totalTokensUsed || 0) + tokens }));
  };

  const syncToGitHub = async () => {
    if (!state.settings.githubToken || !state.settings.githubRepo) return;
    setIsSyncing(true);
    try {
      const github = new GitHubService(state.settings.githubToken, state.settings.githubRepo);
      await github.syncState({
        issues: state.issues,
        skills: state.skills,
        jobs: state.jobs,
        standups: state.standups,
        blogPosts: state.blogPosts,
        sessionReports: state.sessionReports,
        debugEvents: state.debugEvents,
        apiMode: state.apiMode,
        totalTokensUsed: state.totalTokensUsed
      });
      alert('Successfully synced to GitHub!');
    } catch (e: any) {
      console.error(e);
      alert('Failed to sync to GitHub: ' + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const pullFromGitHub = async () => {
    if (!state.settings.githubToken || !state.settings.githubRepo) return;
    setIsSyncing(true);
    try {
      const github = new GitHubService(state.settings.githubToken, state.settings.githubRepo);
      const remoteState = await github.fetchState();
      if (remoteState) {
        setState(s => ({ 
          ...s, 
          issues: remoteState.issues || [], 
          skills: remoteState.skills || [],
          jobs: remoteState.jobs || [],
          standups: remoteState.standups || [],
          blogPosts: remoteState.blogPosts || [],
          sessionReports: remoteState.sessionReports || []
        }));
        alert('Successfully pulled from GitHub!');
      } else {
        alert('No remote state found to pull.');
      }
    } catch (e: any) {
      console.error(e);
      alert('Failed to pull from GitHub: ' + e.message);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <AppContext.Provider value={{
      ...state,
      updateSettings,
      createIssue,
      updateIssue,
      deleteIssue,
      setActiveIssue,
      addSkill,
      updateSkill,
      deleteSkill,
      updateStepContent,
      toggleStepCompletion,
      syncToGitHub,
      pullFromGitHub,
      submitJob,
      cancelJob,
      reorderJob,
      deleteJob,
      clearJobs,
      approveJob,
      addStandup,
      updateStandup,
      deleteStandup,
      addBlogPost,
      updateBlogPost,
      deleteBlogPost,
      addSessionReport,
      addDebugEvent,
      updateApiMode,
      addTokenUsage,
      isSyncing
    }}>
      {isLoaded ? children : <div className="h-screen w-screen flex items-center justify-center text-[#999999]">Loading workspace...</div>}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
