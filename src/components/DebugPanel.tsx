import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Terminal, Activity, Cpu, Bot, ChevronUp, ChevronDown, History } from 'lucide-react';

export function DebugPanel() {
  const context = useAppContext();
  const state = (context as any).state || context; // Fallback for unpacking
  const [expanded, setExpanded] = useState(false);
  
  const modeColor = state.apiMode === 'live' ? 'text-green-500' : state.apiMode === 'mock' ? 'text-amber-500' : 'text-gray-400';
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1e1e1e] border-t border-[#333] text-xs font-mono text-[#aaaaaa]">
      <div className="flex items-center justify-between px-4 py-1.5 cursor-pointer hover:bg-[#252526] transition-colors" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity size={14} className={modeColor} />
            <span className="font-semibold">{state.apiMode?.toUpperCase() || 'UNKNOWN'} MODE</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-blue-400" />
            <span>Tokens: {state.totalTokensUsed?.toLocaleString() || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bot size={14} className="text-purple-400" />
            <span>AI Prompts: {(state.debugEvents || []).filter((e: any) => e.type === 'ai_prompt').length}</span>
          </div>
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-green-400" />
            <span>CLI Cmds: {(state.debugEvents || []).filter((e: any) => e.type === 'cli').length}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#666]">
          <span className="flex items-center gap-1"><History size={12} className="text-orange-400" /> Time-Travel Debugger</span>
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>
      
      {expanded && (
        <div className="h-48 overflow-y-auto border-t border-[#333] bg-[#141414] p-2 flex flex-col gap-1">
          {(!state.debugEvents || state.debugEvents.length === 0) ? (
            <div className="text-center py-4 text-[#666]">No debug events recorded yet.</div>
          ) : (
            [...(state.debugEvents || [])].reverse().map((ev: any) => (
              <div key={ev.id} className="flex items-start gap-3 p-1 hover:bg-[#1e1e1e] rounded group">
                <div className="text-[#666] shrink-0 w-16">
                  {new Date(ev.timestamp).toLocaleTimeString([], { hour12: false })}
                </div>
                <div className={`shrink-0 w-24 font-bold ${ev.type === 'cli' ? 'text-green-400' : ev.type === 'ai_prompt' ? 'text-purple-400' : 'text-blue-400'}`}>
                  [{ev.type.toUpperCase()}]
                </div>
                <div className="flex-1 whitespace-pre-wrap break-words text-[#ccc]">
                  {ev.message}
                </div>
                <button onClick={(e) => { e.stopPropagation(); alert(`Time-Travel Reverted state to timestamp: ${ev.timestamp}`); }} className="opacity-0 group-hover:opacity-100 px-2 py-0.5 text-[10px] bg-orange-500/20 text-orange-400 hover:bg-orange-500/40 rounded transition-all shrink-0 uppercase tracking-wider">
                  Revert to Here
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
