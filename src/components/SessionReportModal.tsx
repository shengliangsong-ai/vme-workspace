import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Issue, SessionReport } from '../types';
import { X, Save, FileText } from 'lucide-react';

interface SessionReportModalProps {
  issue: Issue;
  onClose: () => void;
}

export function SessionReportModal({ issue, onClose }: SessionReportModalProps) {
  const { addSessionReport, addBlogPost } = useAppContext();
  const [form, setForm] = useState<Partial<SessionReport>>({
    issueId: issue.id,
    initialGoal: issue.title,
    completionSummary: issue.contextSummary || '',
    readyForProdReason: '',
    codeStandardPassed: false,
    testsPassed: false,
    approved: false,
    codeReviewScore: 10,
    riskScore: 1,
    valueScore: 5,
    tokensUsed: 0,
    cost: 0,
  });

  const [publishToBlog, setPublishToBlog] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reportData = form as Omit<SessionReport, 'id' | 'createdAt'>;
    addSessionReport(reportData);

    if (publishToBlog) {
      addBlogPost({
        title: `Session Report: ${issue.title}`,
        content: `**Goal:**\n${reportData.initialGoal}\n\n**Completion Summary:**\n${reportData.completionSummary}\n\n**Ready for Prod Reason:**\n${reportData.readyForProdReason}\n\n**Scores:**\nCode Review: ${reportData.codeReviewScore}/10 | Risk: ${reportData.riskScore}/10 | Value: ${reportData.valueScore}/10`,
        labels: ['session-report', issue.type]
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[#eeeeee]">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-600" />
            <h3 className="font-semibold text-[#1a1a1a]">Generate Session Report</h3>
          </div>
          <button onClick={onClose} className="p-1 text-[#999999] hover:text-[#1a1a1a]">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Initial Goal</label>
              <input required type="text" value={form.initialGoal} onChange={e => setForm({...form, initialGoal: e.target.value})} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ccc]" />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">How was it completed?</label>
              <textarea required value={form.completionSummary} onChange={e => setForm({...form, completionSummary: e.target.value})} rows={3} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ccc]" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Why is it ready for prod?</label>
              <textarea required value={form.readyForProdReason} onChange={e => setForm({...form, readyForProdReason: e.target.value})} rows={2} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ccc]" />
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999]">Checks & Approvals</label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.codeStandardPassed} onChange={e => setForm({...form, codeStandardPassed: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                Code Standard Check Passed
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.testsPassed} onChange={e => setForm({...form, testsPassed: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                Required Tests Passed
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.approved} onChange={e => setForm({...form, approved: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500" />
                Approved for Release
              </label>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999]">Scores (1-10)</label>
              <div className="flex items-center gap-2">
                <span className="text-sm w-24 text-[#666666]">Code Review</span>
                <input type="number" min="1" max="10" value={form.codeReviewScore} onChange={e => setForm({...form, codeReviewScore: Number(e.target.value)})} className="w-20 bg-[#f9f9f9] border border-[#eeeeee] rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-24 text-[#666666]">Risk Score</span>
                <input type="number" min="1" max="10" value={form.riskScore} onChange={e => setForm({...form, riskScore: Number(e.target.value)})} className="w-20 bg-[#f9f9f9] border border-[#eeeeee] rounded px-2 py-1 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-24 text-[#666666]">Value Score</span>
                <input type="number" min="1" max="10" value={form.valueScore} onChange={e => setForm({...form, valueScore: Number(e.target.value)})} className="w-20 bg-[#f9f9f9] border border-[#eeeeee] rounded px-2 py-1 text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Tokens Used</label>
              <input type="number" value={form.tokensUsed} onChange={e => setForm({...form, tokensUsed: Number(e.target.value)})} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ccc]" />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Cost ($)</label>
              <input type="number" step="0.01" value={form.cost} onChange={e => setForm({...form, cost: Number(e.target.value)})} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#ccc]" />
            </div>
          </div>
          
          <div className="pt-4 border-t border-[#eeeeee]">
             <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={publishToBlog} onChange={e => setPublishToBlog(e.target.checked)} className="rounded text-blue-600 focus:ring-blue-500" />
                Also publish to Blog / Lessons Learned
              </label>
          </div>
        </form>

        <div className="p-4 border-t border-[#eeeeee] flex justify-end gap-3 bg-[#f9f9f9]">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm font-semibold text-[#666666] hover:text-[#1a1a1a]">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm">
            <Save size={16} /> Save Session Report
          </button>
        </div>
      </div>
    </div>
  );
}
