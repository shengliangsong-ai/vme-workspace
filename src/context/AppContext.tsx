import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Issue, Skill, Settings, WorkflowStep, DEFAULT_BUG_STEPS } from '../types';
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
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('vme-state');
    return saved ? JSON.parse(saved) : initialState;
  });
  
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem('vme-state', JSON.stringify(state));
  }, [state]);

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

  const syncToGitHub = async () => {
    if (!state.settings.githubToken || !state.settings.githubRepo) return;
    setIsSyncing(true);
    try {
      const github = new GitHubService(state.settings.githubToken, state.settings.githubRepo);
      await github.syncState({
        issues: state.issues,
        skills: state.skills
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
        setState(s => ({ ...s, issues: remoteState.issues || [], skills: remoteState.skills || [] }));
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
      isSyncing
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
