import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

import { useAppContext } from '../context/AppContext';
import { estimateTokens, formatTokenCount, cn } from '../lib/utils';
import { Plus, Clock, Play } from 'lucide-react';

interface DashboardProps {
  setCurrentTab: (tab: string) => void;
}


const tokenData = [
  { time: '10:00', tokens: 1200 },
  { time: '11:00', tokens: 3500 },
  { time: '12:00', tokens: 2800 },
  { time: '13:00', tokens: 8400 },
  { time: '14:00', tokens: 5100 },
  { time: '15:00', tokens: 10200 },
  { time: '16:00', tokens: 7500 },
];
const jobData = [
  { name: 'Success', value: 45, color: '#22c55e' },
  { name: 'Failed', value: 3, color: '#ef4444' },
  { name: 'Cancelled', value: 12, color: '#94a3b8' }
];

export function Dashboard({ setCurrentTab }: DashboardProps) {
  const { issues, activeIssueId, createIssue, setActiveIssue, skills } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'bug' | 'feature'>('bug');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      createIssue(newTitle, newType);
      setIsCreating(false);
      setNewTitle('');
      setCurrentTab('workspace');
    }
  };

  const activeIssue = issues.find(i => i.id === activeIssueId);
  const totalContextSize = issues.reduce((acc, issue) => acc + estimateTokens(issue.contextSummary), 0) + 
                           skills.reduce((acc, skill) => acc + estimateTokens(skill.content), 0);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">Dashboard</h2>
          <p className="text-[#666666]">Manage your virtual memory and context switching</p>
        </div>
        <div className="bg-white border border-[#eeeeee] rounded-xl px-6 py-4 shadow-sm flex flex-col items-end">
          <span className="text-xs text-[#999999] font-bold uppercase tracking-widest mb-1">Total VME Context</span>
          <span className="text-[#1a1a1a] font-medium text-lg">{formatTokenCount(totalContextSize)} / 1.0M tokens</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#1a1a1a]">Recent Issues</h3>
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
            >
              <Plus size={16} /> New Issue
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreate} className="bg-white p-4 rounded-xl border border-[#eeeeee] flex flex-col gap-4 shadow-sm">
              <input
                autoFocus
                type="text"
                placeholder="Issue title..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
              />
              <div className="flex items-center justify-between">
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as 'bug' | 'feature')}
                  className="bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                >
                  <option value="bug">Bug Fix</option>
                  <option value="feature">New Feature</option>
                </select>
                <div className="flex gap-2 items-center">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-xs font-semibold text-[#666666] hover:text-[#1a1a1a] transition-colors">Cancel</button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm">Create</button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {issues.length === 0 && !isCreating && (
              <div className="text-center py-12 bg-white rounded-xl border border-[#eeeeee] border-dashed">
                <p className="text-[#888888]">No issues yet. Create one to get started.</p>
              </div>
            )}
            {issues.map(issue => (
              <div 
                key={issue.id} 
                className={cn(
                  "p-4 rounded-xl border flex items-center justify-between transition-colors shadow-sm",
                  issue.id === activeIssueId 
                    ? "bg-white border-black" 
                    : "bg-[#fcfcfc] border-[#eeeeee] hover:border-[#ccc]"
                )}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider",
                      issue.type === 'bug' ? "bg-[#ffeeee] text-[#cc0000]" : "bg-[#eeeeff] text-[#0000cc]"
                    )}>
                      {issue.type}
                    </span>
                    <h4 className="text-[#1a1a1a] font-semibold">{issue.title}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#888888]">
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(issue.updatedAt).toLocaleDateString()}</span>
                    <span>{issue.steps.filter(s => s.isCompleted).length} / {issue.steps.length} steps</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setActiveIssue(issue.id);
                    setCurrentTab('workspace');
                  }}
                  className={cn(
                    "px-4 py-2 rounded-full transition-colors flex items-center gap-2 text-xs font-semibold",
                    issue.id === activeIssueId
                      ? "bg-blue-600 text-white"
                      : "bg-[#f0f0f0] text-[#1a1a1a] hover:bg-[#e5e5e5]"
                  )}
                >
                  {issue.id === activeIssueId ? 'Active' : 'Resume'} <Play size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
           <div className="bg-white border border-[#eeeeee] p-6 rounded-xl shadow-sm">
             <h4 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-4">Active Context</h4>
           {activeIssue ? (
             <div className="space-y-4">
               <div>
                 <h4 className="text-xs font-semibold text-[#666666] mb-1">Working On</h4>
                 <p className="text-[#1a1a1a] text-sm font-medium">{activeIssue.title}</p>
               </div>
               
               <div>
                 <div className="flex justify-between text-[11px] mb-2">
                   <span className="font-medium text-[#1a1a1a]">Workflow Progress</span>
                   <span className="text-[#666666]">{activeIssue.steps.filter(s => s.isCompleted).length} / {activeIssue.steps.length}</span>
                 </div>
                 <div className="h-2 w-full bg-[#f0f0f0] rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-blue-600" 
                    style={{width: `${(activeIssue.steps.filter(s => s.isCompleted).length / activeIssue.steps.length) * 100}%`}}
                   ></div>
                 </div>
               </div>
               
               <button 
                 onClick={() => setCurrentTab('workspace')}
                 className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full text-xs font-semibold transition-colors mt-2"
               >
                 Go to Workspace
               </button>
             </div>
           ) : (
             <div className="text-center py-6">
               <p className="text-xs text-[#999999]">No active issue selected.</p>
             </div>
           )}
           </div>
           
           <div className="bg-white border border-[#eeeeee] p-6 rounded-xl shadow-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-4">Virtual Me Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1a1a1a]">Skills Synchronized</span>
                  <span className="text-[10px] px-2 py-1 bg-[#f0f0f0] text-[#1a1a1a] rounded font-semibold">{skills.length} Active</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#eeeeee]">
                  {skills.slice(0, 5).map(skill => (
                    <span key={skill.id} className="text-[10px] bg-[#f0f0f0] text-[#666666] border border-[#e5e5e5] px-2 py-1 rounded">
                      {skill.name}
                    </span>
                  ))}
                  {skills.length > 5 && (
                    <span className="text-[10px] text-[#999999] px-2 py-1">+{skills.length - 5} more</span>
                  )}
                </div>
              </div>
           </div>

           {/* Job Queue Status */}
           <div className="bg-white border border-[#eeeeee] p-6 rounded-xl shadow-sm cursor-pointer hover:border-[#ccc] transition-colors" onClick={() => setCurrentTab('queue')}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-4">Job Queue</h4>
              <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1a1a1a]">Active Jobs</span>
                  <span className="text-[10px] px-2 py-1 bg-[#f0f0f0] text-[#1a1a1a] rounded font-semibold">
                    {useAppContext().jobs.filter(j => j.status === 'running' || j.status === 'queued').length} pending
                  </span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
