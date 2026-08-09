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
