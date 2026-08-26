import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Play, X, Trash2, ArrowUp, ArrowDown, Clock, Activity, CheckCircle2, XCircle } from 'lucide-react';

export function QueueManager() {
  const { jobs, submitJob, cancelJob, reorderJob, deleteJob, clearJobs, approveJob } = useAppContext();
  const [command, setCommand] = useState('');
  const [timeoutMs, setTimeoutMs] = useState(5000);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isOrchestrated, setIsOrchestrated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    const finalCommand = isOrchestrated ? `orchestrate ${command}` : command;
    submitJob(finalCommand, timeoutMs);
    setCommand('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued': return <Clock size={16} className="text-[#999999]" />;
      case 'running': return <Activity size={16} className="text-blue-600 animate-pulse" />;
      case 'completed': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'failed': return <XCircle size={16} className="text-red-500" />;
      case 'cancelled': return <XCircle size={16} className="text-[#999999]" />;
      case 'awaiting_approval': return <Clock size={16} className="text-amber-500 animate-pulse" />;
      default: return null;
    }
  };

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="max-w-5xl mx-auto p-6 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-[#1a1a1a]">Job Queue (qsub)</h2>
        <p className="text-[#666666] mt-1">Manage small tasks with timeout configuration.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left Column: Submit & Queue */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
          {/* Submit Form */}
          <div className="bg-white border border-[#eeeeee] rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-4">Submit New Job</h3>
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Command / Task</label>
                <input
                  type="text"
                  value={command}
                  onChange={e => setCommand(e.target.value)}
                  placeholder="e.g. npm run build"
                  className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Timeout (ms)</label>
                <input
                  type="number"
                  value={timeoutMs}
                  onChange={e => setTimeoutMs(Number(e.target.value))}
                  min="1000"
                  step="1000"
                  className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                />
              </div>
              <div className="flex flex-col mb-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-[#1a1a1a]">
                  <input
                    type="checkbox"
                    checked={isOrchestrated}
                    onChange={(e) => setIsOrchestrated(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Use Multi-Agent Orchestration
                </label>
              </div>
              <button
                type="submit"
                disabled={!command.trim()}
                className="flex items-center justify-center h-[38px] px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md text-xs font-semibold transition-colors"
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
                  {jobs.map((job, index) => (
                    <div 
                      key={job.id} 
                      onClick={() => setSelectedJobId(job.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center gap-4 ${selectedJobId === job.id ? 'border-blue-500 bg-blue-50' : 'border-[#eeeeee] hover:bg-[#f9f9f9]'}`}
                    >
                      <div className="flex items-center justify-center w-6 h-6">
                        {getStatusIcon(job.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm text-[#1a1a1a] truncate">{job.command}</div>
                        <div className="text-xs text-[#999999] mt-1">
                          Timeout: {job.timeoutMs}ms | Status: {job.status}
                          {job.startedAt && ` | Started: ${new Date(job.startedAt).toLocaleTimeString()}`}
                          {job.completedAt && ` | Finished: ${new Date(job.completedAt).toLocaleTimeString()}`}
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
                            className="p-1 text-emerald-500 hover:text-emerald-600 font-bold ml-2"
                            title="Approve Plan"
                          >
                            Approve
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
                    </div>
                  ))}
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
