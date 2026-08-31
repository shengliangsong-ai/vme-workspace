import React, { useState } from 'react';
import Markdown from 'react-markdown';

import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, Edit2, Save, X, Eye } from 'lucide-react';
import { formatTokenCount, estimateTokens } from '../lib/utils';

export function SkillsManager() {
  const { skills, addSkill, updateSkill, deleteSkill } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', content: '', tags: '' });
  const [isCreating, setIsCreating] = useState(false);
  const [viewingSkill, setViewingSkill] = useState<any>(null);

  const handleStartCreate = () => {
    setIsCreating(true);
    setEditForm({ name: '', description: '', content: '', tags: '' });
  };

  const handleSave = () => {
    const skillData = {
      name: editForm.name,
      description: editForm.description,
      content: editForm.content,
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    if (editingId) {
      updateSkill(editingId, skillData);
      setEditingId(null);
    } else {
      addSkill(skillData);
      setIsCreating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">Skills & Global Context</h2>
          <p className="text-[#666666] mt-1">Manage reusable prompts, rules, and memory injected into agents.</p>
        </div>
        <button
          onClick={handleStartCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white border border-[#eeeeee] rounded-xl p-6 mb-8 space-y-4 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium text-[#1a1a1a]">{editingId ? 'Edit Skill' : 'Create New Skill'}</h3>
            <button onClick={() => { setIsCreating(false); setEditingId(null); }} className="text-[#999999] hover:text-[#1a1a1a]">
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                placeholder="e.g. React Best Practices"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={editForm.tags}
                onChange={e => setEditForm({ ...editForm, tags: e.target.value })}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                placeholder="react, frontend, rules"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Description</label>
            <input
              type="text"
              value={editForm.description}
              onChange={e => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
              placeholder="Brief description of when to use this skill..."
            />
          </div>

          <div>
            <div className="flex justify-between items-end mb-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999]">Skill Content (Prompt/Rules)</label>
              <span className="text-xs text-[#888888] font-mono">~{formatTokenCount(estimateTokens(editForm.content))} tokens</span>
            </div>
            <textarea
              value={editForm.content}
              onChange={e => setEditForm({ ...editForm, content: e.target.value })}
              className="w-full h-64 bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-sm text-[#1a1a1a] font-mono focus:outline-none focus:border-[#ccc]"
              placeholder="Enter the detailed context, rules, or system instructions..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!editForm.name.trim() || !editForm.content.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
            >
              <Save size={16} /> Save Skill
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
      {viewingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-[#eeeeee]">
              <div>
                <h3 className="text-xl font-semibold text-[#1a1a1a]">{viewingSkill.name}</h3>
                <div className="flex gap-2 mt-2">
                  {viewingSkill.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-[#f0f0f0] text-[#666666] px-2 py-0.5 rounded border border-[#e5e5e5]">{tag}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setViewingSkill(null)} className="text-[#999999] hover:text-[#1a1a1a]">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 prose prose-sm max-w-none prose-headings:text-[#1a1a1a] prose-a:text-blue-600">
              <Markdown >{viewingSkill.content}</Markdown>
            </div>
          </div>
        </div>
      )}

        {skills.map(skill => (
          <div key={skill.id} className="bg-white border border-[#eeeeee] rounded-xl p-6 hover:border-[#ccc] transition-colors flex flex-col h-full shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-[#1a1a1a] font-semibold text-lg">{skill.name}</h3>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setViewingSkill(skill)}
                  className="text-[#999999] hover:text-green-600 p-1"
                  title="View Skill"
                >
                  <Eye size={16} />
                </button>
                <button 
                  onClick={() => {
                    setEditingId(skill.id);
                    setEditForm({
                      name: skill.name,
                      description: skill.description,
                      content: skill.content,
                      tags: skill.tags.join(', ')
                    });
                    setIsCreating(false);
                  }}
                  className="text-[#999999] hover:text-blue-600 p-1"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => deleteSkill(skill.id)}
                  className="text-[#999999] hover:text-red-600 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-[#666666] mb-4 flex-1">{skill.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-[#eeeeee]">
              <div className="flex gap-2">
                {skill.tags.map(tag => (
                  <span key={tag} className="text-[10px] uppercase font-bold tracking-wider bg-[#f0f0f0] text-[#666666] px-2 py-0.5 rounded border border-[#e5e5e5]">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs font-mono text-[#1a1a1a] bg-[#f9f9f9] px-2 py-1 rounded border border-[#eeeeee]">
                ~{formatTokenCount(estimateTokens(skill.content))} tokens
              </span>
            </div>
          </div>
        ))}
        {skills.length === 0 && !isCreating && (
          <div className="col-span-2 text-center py-12 bg-white rounded-xl border border-[#eeeeee] border-dashed">
            <p className="text-[#888888]">No skills defined yet. Add a skill to store your AI rules and prompts.</p>
          </div>
        )}
      </div>
    </div>
  );
}
