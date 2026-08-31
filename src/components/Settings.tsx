import React from 'react';
import { useAppContext } from '../context/AppContext';

export function SettingsView() {
  const { settings, updateSettings } = useAppContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-[#1a1a1a] mb-6">Environment Settings</h2>
      
      <div className="space-y-6">

        <div className="bg-white p-6 rounded-xl border border-[#eeeeee] shadow-sm">
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">Dual-Storage Architecture (Memory Bank)</h3>
          <p className="text-sm text-[#666666] mb-6">
            Virtual Me employs a dual-storage bridge to align human memory with the AI context window.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-green-200 bg-green-50 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">Active</div>
              <h4 className="font-semibold text-green-900 mb-1">Local SQLite</h4>
              <p className="text-xs text-green-800/80">Hot active memory. Extremely fast localized context tailored for current standups and active planner tasks.</p>
            </div>
            
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">Connected</div>
              <h4 className="font-semibold text-blue-900 mb-1">Firestore NoSQL</h4>
              <p className="text-xs text-blue-800/80">Long-term global memory bank. Enables 10GB+ searchable tokens for RAG Context Assembly across sessions.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#eeeeee] shadow-sm">
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">GitHub Configuration</h3>
          <p className="text-sm text-[#666666] mb-6">
            Connect your Virtual Me (vme) repository to synchronize your contexts, skills, and issue states.
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">
                Repository (owner/repo)
              </label>
              <input
                type="text"
                name="githubRepo"
                value={settings.githubRepo}
                onChange={handleChange}
                placeholder="shengliangsong-ai/vme"
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">
                Personal Access Token
              </label>
              <input
                type="password"
                name="githubToken"
                value={settings.githubToken}
                onChange={handleChange}
                placeholder="ghp_..."
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
              />
              <p className="text-xs text-[#888888] mt-2">
                Requires 'repo' scope to read and write to your vme repository. Your token is stored locally in your browser.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-[#eeeeee] shadow-sm">
          <h3 className="text-lg font-medium text-[#1a1a1a] mb-4">LLM Configuration</h3>
          <p className="text-sm text-[#666666] mb-6">
            Configure your AI provider for context generation (optional).
          </p>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">
              Claude API Key (Anthropic)
            </label>
            <input
              type="password"
              name="claudeApiKey"
              value={settings.claudeApiKey}
              onChange={handleChange}
              placeholder="sk-ant-..."
              className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
