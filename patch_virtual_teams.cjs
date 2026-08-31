const fs = require('fs');

const code = `import React, { useState } from 'react';
import { Bot, Plus, Trash2, Cpu, Zap, Activity, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const INITIAL_AGENTS = [
  { id: '1', name: 'vme-planner-agent', role: 'Planner', status: 'idle', description: 'Analyzes user input and codebase to generate step-by-step execution plans.', contextSize: 32 },
  { id: '2', name: 'vme-executor-agent', role: 'Executor', status: 'idle', description: 'Writes code, implements steps, and runs standard tasks.', contextSize: 64 },
  { id: '3', name: 'vme-qa-agent', role: 'QA Reviewer', status: 'active', description: 'Reviews code execution, runs validation tests, and suggests fixes.', contextSize: 128 },
  { id: '4', name: 'vme-evaluator-agent', role: 'Evaluator (Self-Improve)', status: 'sleeping', description: 'During idle time (Day-Dream state), reviews lessons learned and creates reusable skills.', contextSize: 200 }
];

export function VirtualTeams() {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [showModal, setShowModal] = useState(false);
  
  const [newAgent, setNewAgent] = useState({
    name: 'vme-custom-agent',
    role: 'Security Auditor',
    description: 'Scans new commits for vulnerabilities.',
    contextSize: 32
  });

  const handleCreateAgent = (e) => {
    e.preventDefault();
    setAgents([...agents, {
      id: uuidv4(),
      name: newAgent.name,
      role: newAgent.role,
      description: newAgent.description,
      contextSize: newAgent.contextSize,
      status: 'idle'
    }]);
    setShowModal(false);
  };

  const deleteAgent = (id) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto h-full flex flex-col gap-6 relative">
      <div className="flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-semibold text-[#1a1a1a] flex items-center gap-2">
            <Cpu className="text-blue-600" /> Virtual Teams
          </h1>
          <p className="text-[#666] text-sm mt-1">Manage and instantiate specialized agent teams with distinct cognitive contexts.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
          <Plus size={16} /> Instantiate New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white border border-[#eeeeee] p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={\`p-2 rounded-lg \${agent.status === 'active' ? 'bg-green-100 text-green-600' : agent.status === 'sleeping' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}\`}>
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">{agent.name}</h3>
                  <p className="text-xs font-medium uppercase tracking-wider text-blue-600">{agent.role}</p>
                </div>
              </div>
              <div className={\`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider \${
                agent.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' :
                agent.status === 'sleeping' ? 'bg-purple-50 text-purple-600 border border-purple-200' :
                'bg-gray-50 text-gray-600 border border-gray-200'
              }\`}>
                {agent.status}
              </div>
            </div>
            
            <p className="text-sm text-[#555] mb-4 min-h-[40px]">
              {agent.description}
            </p>

            <div className="flex gap-2">
              <div className="flex-1 bg-gray-50 border border-gray-100 rounded p-2 flex items-center gap-2">
                <Activity size={14} className="text-gray-400" />
                <span className="text-xs text-gray-500">Context Window: {agent.contextSize}K tokens</span>
              </div>
              <button onClick={() => deleteAgent(agent.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors" title="Decommission Agent">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mt-auto shrink-0 flex items-start gap-3">
        <Zap className="text-blue-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-semibold text-blue-800">Time-Travel Context Isolation</h4>
          <p className="text-xs text-blue-600/80 mt-1">
            Agents operate with isolated context frames. If an execution path fails, you can roll back the entire team's memory to a previous state using the Time-Travel debugger below.
          </p>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-[#eeeeee]">
              <h3 className="text-lg font-semibold text-[#1a1a1a]">Instantiate New Agent</h3>
              <button onClick={() => setShowModal(false)} className="text-[#999999] hover:text-[#1a1a1a]">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateAgent} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Agent Name</label>
                <input required type="text" value={newAgent.name} onChange={e => setNewAgent({...newAgent, name: e.target.value})} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#ccc]" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Role</label>
                <input required type="text" value={newAgent.role} onChange={e => setNewAgent({...newAgent, role: e.target.value})} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#ccc]" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Description / Directives</label>
                <textarea required value={newAgent.description} onChange={e => setNewAgent({...newAgent, description: e.target.value})} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#ccc] h-20" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Context Window (K Tokens)</label>
                <input type="number" min="8" max="1000" value={newAgent.contextSize} onChange={e => setNewAgent({...newAgent, contextSize: parseInt(e.target.value)})} className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#ccc]" />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-semibold text-[#666666] hover:text-[#1a1a1a] transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">Instantiate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync('src/components/VirtualTeams.tsx', code);
