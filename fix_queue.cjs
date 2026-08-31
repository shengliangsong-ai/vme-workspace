const fs = require('fs');

let code = `import React, { useState } from 'react';
import { Play, Activity, Trash2, ArrowUp, ArrowDown, X, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'motion/react';

export function QueueManager() {
  const { jobs, submitJob, cancelJob, deleteJob, clearJobs, approveJob, reorderJob } = useAppContext();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [newCommand, setNewCommand] = useState('');
  const [newTimeout, setNewTimeout] = useState('60000');

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <Activity size={16} className="text-blue-500 animate-pulse" />;
      case 'completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'failed': return <X size={16} className="text-red-500" />;
      case 'cancelled': return <Trash2 size={16} className="text-[#999999]" />;
      case 'awaiting_approval': return <CheckCircle2 size={16} className="text-amber-500 animate-pulse" />;
      default: return <div className="w-2 h-2 rounded-full bg-[#cccccc]" />; // queued
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommand.trim()) return;
    submitJob(newCommand, parseInt(newTimeout) || 60000);
    setNewCommand('');
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto h-full flex flex-col gap-6">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a]">Job Queue</h1>
          <p className="text-[#666] text-sm mt-1">Monitor and orchestrate background execution tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col gap-6 h-full">
          {/* Manual Submit Form */}
          <div className="bg-white border border-[#eeeeee] p-5 rounded-xl shadow-sm shrink-0">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-4">Manual Execution</h3>
            <form onSubmit={handleManualSubmit} className="flex gap-3">
              <input
                type="text"
                value={newCommand}
                onChange={(e) => setNewCommand(e.target.value)}
                placeholder="Enter command (e.g. self_improve)"
                className="flex-1 bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-blue-500 font-mono"
              />
              <input
                type="number"
                value={newTimeout}
                onChange={(e) => setNewTimeout(e.target.value)}
                placeholder="Timeout ms"
                className="w-24 bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-blue-500"
              />
              <button 
                type="submit"
                disabled={!newCommand.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 flex items-center justify-center rounded-md text-xs font-semibold transition-colors"
              >
                <Play size={16} className="mr-2" /> Submit
              </button>
            </form>
          </div>

          {/* Queue List */}
          <div className="flex-1 bg-white border border-[#eeeeee] rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#eeeeee] flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#999999]">Job Queue ({jobs.length})</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    submitJob('orchestrate Review our current architecture and propose a new SQLite schema design for issues and skills.', 60000);
                  }}
                  className="text-xs font-semibold text-purple-600 hover:text-purple-700 flex items-center bg-purple-50 px-2 py-1 rounded"
                >
                  <Play size={14} className="mr-1" />
                  Demo: Orchestrate
                </button>
                <button
                  onClick={() => submitJob('self_improve', 120000)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center bg-blue-50 px-2 py-1 rounded"
                >
                  <Activity size={14} className="mr-1" />
                  Run Self-Improvement
                </button>
                <button
                  onClick={() => {
                    clearJobs();
                    if (selectedJob && !['running', 'awaiting_approval'].includes(selectedJob.status)) {
                      setSelectedJobId(null);
                    }
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center bg-red-50 px-2 py-1 rounded"
                  title="Clear all queued, completed, cancelled, or failed jobs"
                >
                  <Trash2 size={14} className="mr-1" />
                  Clear Old Jobs
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {jobs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[#999999] text-sm">
                  No jobs in queue
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {jobs.map((job, index) => (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={job.id}
                        onClick={() => setSelectedJobId(job.id)}
                        className={\`p-3 rounded-lg border cursor-pointer transition-colors flex items-center gap-4 \${selectedJobId === job.id ? 'border-blue-500 bg-blue-50' : 'border-[#eeeeee] hover:bg-[#f9f9f9]'}\`}
                      >
                        <div className="flex items-center justify-center w-6 h-6">
                          {getStatusIcon(job.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm text-[#1a1a1a] truncate">{job.command}</div>
                          <div className="text-xs text-[#999999] mt-1">
                            Timeout: {job.timeoutMs}ms | Status: {job.status}
                            {job.startedAt && \` | Started: \${new Date(job.startedAt).toLocaleTimeString()}\`}
                            {job.completedAt && \` | Finished: \${new Date(job.completedAt).toLocaleTimeString()}\`}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                          {job.status === 'queued' && (
                            <>
                              <button 
                                onClick={(e) => { e.stopPropagation(); reorderJob(job.id, Math.max(0, index - 1)); }}
                                disabled={index === 0 || jobs[index - 1]?.status !== 'queued'}
                                className="p-1 text-[#999999] hover:text-[#1a1a1a] disabled:opacity-30"
                              >
                                <ArrowUp size={16} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); reorderJob(job.id, index + 1); }}
                                disabled={index === jobs.length - 1 || jobs[index + 1]?.status !== 'queued'}
                                className="p-1 text-[#999999] hover:text-[#1a1a1a] disabled:opacity-30"
                              >
                                <ArrowDown size={16} />
                              </button>
                            </>
                          )}
                          {(job.status === 'queued' || job.status === 'running' || job.status === 'awaiting_approval') && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); cancelJob(job.id); }}
                              className="p-1 text-[#999999] hover:text-red-500"
                              title="Cancel Job"
                            >
                              <X size={16} />
                            </button>
                          )}
                          {job.status === 'awaiting_approval' && (
                            <button
                              onClick={(e) => { e.stopPropagation(); approveJob(job.id); }}
                              className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 hover:text-emerald-800 rounded font-bold ml-2 text-[10px] uppercase tracking-wider transition-colors shadow-sm"
                              title="Human in the loop safety mechanism"
                            >
                              <CheckCircle2 size={14} />
                              Approve & Sign
                            </button>
                          )}
                          {(job.status !== 'queued' && job.status !== 'running' && job.status !== 'awaiting_approval') && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); deleteJob(job.id); if (selectedJobId === job.id) setSelectedJobId(null); }}
                              className="p-1 text-[#999999] hover:text-red-500"
                              title="Delete Job"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Log Viewer */}
        <div className="bg-[#f9f9f9] border border-[#eeeeee] rounded-xl shadow-sm flex flex-col overflow-hidden text-[#1a1a1a]">
          <div className="p-4 border-b border-[#eeeeee] flex justify-between items-center bg-white">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#999999]">Run Logs</h3>
            {selectedJob && (
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-[#666666]">{selectedJob.status}</span>
                {!['queued', 'running', 'awaiting_approval'].includes(selectedJob.status) && (
                  <button
                    onClick={() => {
                      deleteJob(selectedJob.id);
                      setSelectedJobId(null);
                    }}
                    className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center bg-red-50 px-2 py-1 rounded transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs whitespace-pre-wrap">
            {selectedJob ? (
              selectedJob.log || 'No output yet...'
            ) : (
              <div className="h-full flex items-center justify-center text-[#999999]">
                Select a job to view logs
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/QueueManager.tsx', code);
