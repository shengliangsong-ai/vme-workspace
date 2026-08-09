import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Plus, Trash2, Save, X } from 'lucide-react';
import { Standup } from '../types';

export function StandupManager() {
  const { standups, addStandup, updateStandup, deleteStandup } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], today: '', tomorrow: '', blockers: '' });

  const handleSave = () => {
    if (editingId) {
      updateStandup(editingId, form);
      setEditingId(null);
    } else {
      addStandup(form);
      setIsCreating(false);
    }
    setForm({ date: new Date().toISOString().split('T')[0], today: '', tomorrow: '', blockers: '' });
  };

  const handleEdit = (s: Standup) => {
    setForm({ date: s.date, today: s.today, tomorrow: s.tomorrow, blockers: s.blockers });
    setEditingId(s.id);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm({ date: new Date().toISOString().split('T')[0], today: '', tomorrow: '', blockers: '' });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">Daily Standups</h2>
          <p className="text-[#666666] mt-1">Track what you did today, plan for tomorrow, and log blockers.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus size={16} /> New Standup
          </button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-white border border-[#eeeeee] p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-sm font-semibold mb-4 text-[#1a1a1a]">
            {editingId ? 'Edit Standup' : 'Create New Standup'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">What I did today</label>
              <textarea
                value={form.today}
                onChange={e => setForm({ ...form, today: e.target.value })}
                rows={3}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                placeholder="Tasks completed today..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Plan for tomorrow</label>
              <textarea
                value={form.tomorrow}
                onChange={e => setForm({ ...form, tomorrow: e.target.value })}
                rows={3}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                placeholder="Priorities for tomorrow..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Blockers / Need Help</label>
              <textarea
                value={form.blockers}
                onChange={e => setForm({ ...form, blockers: e.target.value })}
                rows={2}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                placeholder="Any blockers or help needed..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={handleCancel} className="px-5 py-2.5 text-xs font-semibold text-[#666666] hover:text-[#1a1a1a] transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={!form.date} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm">
              <Save size={16} /> Save
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {standups.length === 0 && !isCreating ? (
          <div className="text-center text-[#999999] py-12 border-2 border-dashed border-[#eeeeee] rounded-xl">
            <Calendar className="mx-auto mb-3 opacity-20" size={48} />
            <p>No standups recorded yet.</p>
          </div>
        ) : (
          standups.map(s => (
            <div key={s.id} className="bg-white border border-[#eeeeee] p-5 rounded-xl shadow-sm hover:border-[#ccc] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#f0f0f0] flex items-center justify-center text-[#1a1a1a]">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#1a1a1a] text-sm">{s.date}</h4>
                    <p className="text-xs text-[#888888]">{new Date(s.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(s)} className="p-2 text-[#999999] hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => deleteStandup(s.id)} className="p-2 text-[#999999] hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Today</h5>
                  <p className="text-sm text-[#333333] whitespace-pre-wrap">{s.today || '-'}</p>
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Tomorrow</h5>
                  <p className="text-sm text-[#333333] whitespace-pre-wrap">{s.tomorrow || '-'}</p>
                </div>
                <div>
                  <h5 className="text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Blockers</h5>
                  <p className="text-sm text-red-600 whitespace-pre-wrap">{s.blockers || 'None'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
