import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { cn, estimateTokens, formatTokenCount } from '../lib/utils';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Save, FileText } from 'lucide-react';
import { SessionReportModal } from './SessionReportModal';

export function Workspace() {
  const { issues, activeIssueId, updateStepContent, toggleStepCompletion, updateIssue } = useAppContext();
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const activeIssue = issues.find(i => i.id === activeIssueId);

  if (!activeIssue) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="text-center text-[#888888]">
          <p>No active issue selected.</p>
          <p className="text-sm mt-2">Go to the Dashboard to select or create one.</p>
        </div>
      </div>
    );
  }

  const issueTokens = activeIssue.steps.reduce((acc, step) => acc + estimateTokens(step.content), 0);
  
  return (
    <div className="max-w-4xl mx-auto p-6 flex flex-col h-full">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider",
              activeIssue.type === 'bug' ? "bg-[#ffeeee] text-[#cc0000]" : "bg-[#eeeeff] text-[#0000cc]"
            )}>
              {activeIssue.type}
            </span>
            <h2 className="text-2xl font-semibold text-[#1a1a1a]">{activeIssue.title}</h2>
          </div>
          <p className="text-[#666666] text-sm">Work through the steps below to capture Claude's context and execute the fix.</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] uppercase tracking-widest text-[#999999] font-bold mb-1">Context Load</div>
          <div className="text-sm font-mono text-[#1a1a1a] bg-white px-3 py-1 rounded-full border border-[#eeeeee] shadow-sm">
            ~{formatTokenCount(issueTokens)} tokens
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pb-20 pr-2">
        {activeIssue.steps.map((step, index) => {
          const isExpanded = expandedStep === step.id;
          const stepTokens = estimateTokens(step.content);
          
          return (
            <div 
              key={step.id} 
              className={cn(
                "rounded-xl border transition-colors shadow-sm",
                step.isCompleted ? "bg-[#fcfcfc] border-[#eeeeee] opacity-70" : "bg-white border-[#e5e5e5]"
              )}
            >
              <div 
                className="p-4 flex items-center gap-4 cursor-pointer select-none"
                onClick={() => setExpandedStep(isExpanded ? null : step.id)}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStepCompletion(activeIssue.id, step.id);
                  }}
                  className="text-[#999999] hover:text-[#1a1a1a] transition-colors shrink-0"
                >
                  {step.isCompleted ? <CheckCircle2 className="text-blue-600" size={24} /> : <Circle size={24} />}
                </button>
                
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#999999] mr-3">Step {index + 1}</span>
                    <span className={cn(
                      "font-medium transition-colors",
                      step.isCompleted ? "text-[#999999] line-through" : "text-[#1a1a1a]"
                    )}>
                      {step.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {stepTokens > 0 && (
                      <span className="text-xs text-[#888888] font-mono bg-[#f0f0f0] px-2 py-0.5 rounded">{formatTokenCount(stepTokens)} t</span>
                    )}
                    {isExpanded ? <ChevronDown size={18} className="text-[#999999]" /> : <ChevronRight size={18} className="text-[#999999]" />}
                  </div>
                </div>
              </div>
              
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-[#eeeeee]">
                  <textarea
                    value={step.content}
                    onChange={(e) => updateStepContent(activeIssue.id, step.id, e.target.value)}
                    placeholder={`Paste context, logs, or Claude's responses for: ${step.title}...`}
                    className="w-full h-48 bg-[#f9f9f9] border border-[#eeeeee] rounded-lg p-3 text-sm text-[#1a1a1a] font-mono focus:outline-none focus:border-[#ccc] resize-y"
                  />
                </div>
              )}
            </div>
          );
        })}
        
        <div className="mt-8 bg-white border border-[#eeeeee] p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Final Context Summary</h3>
              <p className="text-sm text-[#666666]">
                Distill the essential information here. When this issue is closed, this summary will be saved to your VME for future reference.
              </p>
            </div>
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
            >
              <FileText size={16} /> Generate Report
            </button>
          </div>
          <textarea
            value={activeIssue.contextSummary}
            onChange={(e) => updateIssue(activeIssue.id, { contextSummary: e.target.value })}
            placeholder="Write a concise summary of the bug, root cause, and the fix..."
            className="w-full h-32 bg-[#f9f9f9] border border-[#eeeeee] rounded-lg p-4 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
          />
        </div>
      </div>
      
      {showReportModal && (
        <SessionReportModal issue={activeIssue} onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}
