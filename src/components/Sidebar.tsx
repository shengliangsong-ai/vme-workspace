import React from 'react';
import { cn } from '../lib/utils';
import { Users, LayoutDashboard, CheckSquare, BrainCircuit, Settings, Github, RefreshCw, ListTodo, Calendar, BookOpen, Terminal, PlayCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  const { syncToGitHub, pullFromGitHub, isSyncing, settings } = useAppContext();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'queue', label: 'Job Queue', icon: ListTodo },
    { id: 'teams', label: 'Virtual Teams', icon: Users },
    { id: 'workspace', label: 'Active Workspace', icon: CheckSquare },
    { id: 'skills', label: 'Skills & Context', icon: BrainCircuit },
    { id: 'standups', label: 'Daily Standups', icon: Calendar },
    { id: 'blog', label: 'Blog / Lessons', icon: BookOpen },
    { id: 'demo', label: 'Auto Pitch Demo', icon: PlayCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white text-[#1a1a1a] flex flex-col border-r border-[#eeeeee]">
      <div className="p-4 border-b border-[#eeeeee] flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
          VM
        </div>
        <div>
          <h1 className="text-sm font-semibold text-[#1a1a1a] leading-tight">Virtual Me</h1>
          <p className="text-xs text-[#888888]">Claude Workflow</p>
        </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors w-full text-left",
                isActive 
                  ? "bg-[#f7f7f7] border border-[#e5e5e5] text-[#1a1a1a]" 
                  : "opacity-50 hover:opacity-100 text-[#1a1a1a]"
              )}
            >
              <Icon size={18} className={isActive ? "text-[#1a1a1a]" : "text-[#1a1a1a]"} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#eeeeee] flex flex-col gap-3">
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-terminal'))}
          className="text-xs text-center text-[#999999] hover:text-[#1a1a1a] mb-1 flex items-center justify-center gap-1 transition-colors"
        >
          <Terminal size={14} /> Cmd/Ctrl + ` to toggle CLI
        </button>
        <button
          onClick={syncToGitHub}
          disabled={isSyncing || !settings.githubToken}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xs font-semibold transition-colors text-white shadow-sm"
        >
          {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <Github size={16} />}
          Push to GitHub
        </button>
        <button
          onClick={pullFromGitHub}
          disabled={isSyncing || !settings.githubToken}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#f0f0f0] hover:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-xs font-semibold transition-colors text-[#1a1a1a]"
        >
          {isSyncing ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
          Pull State
        </button>
      </div>
    </div>
  );
}
