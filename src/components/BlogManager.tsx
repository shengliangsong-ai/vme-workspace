import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Plus, Trash2, Save, Search, Tag } from 'lucide-react';
import { BlogPost } from '../types';

export function BlogManager() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [form, setForm] = useState({ title: '', content: '', labels: '' });

  const handleSave = () => {
    const postData = {
      title: form.title,
      content: form.content,
      labels: form.labels.split(',').map(l => l.trim()).filter(Boolean)
    };

    if (editingId) {
      updateBlogPost(editingId, postData);
      setEditingId(null);
    } else {
      addBlogPost(postData);
      setIsCreating(false);
    }
    setForm({ title: '', content: '', labels: '' });
  };

  const handleEdit = (p: BlogPost) => {
    setForm({ title: p.title, content: p.content, labels: p.labels.join(', ') });
    setEditingId(p.id);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setForm({ title: '', content: '', labels: '' });
  };

  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter(p => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.labels.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [blogPosts, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">Blog & Lessons Learned</h2>
          <p className="text-[#666666] mt-1">Document insights from Claude sessions.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus size={16} /> New Post
          </button>
        )}
      </div>

      {!isCreating && !editingId && (
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" size={16} />
          <input
            type="text"
            placeholder="Search by keyword, title, or label..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#eeeeee] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#ccc] shadow-sm"
          />
        </div>
      )}

      {(isCreating || editingId) && (
        <div className="bg-white border border-[#eeeeee] p-6 rounded-xl shadow-sm mb-6">
          <h3 className="text-sm font-semibold mb-4 text-[#1a1a1a]">
            {editingId ? 'Edit Post' : 'Create New Post'}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                placeholder="e.g. Setting up Vite with Tailwind"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Labels (comma separated)</label>
              <input
                type="text"
                value={form.labels}
                onChange={e => setForm({ ...form, labels: e.target.value })}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc]"
                placeholder="e.g. react, setup, errors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Content / Lessons Learned</label>
              <textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                rows={8}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-2 text-[#1a1a1a] focus:outline-none focus:border-[#ccc] font-mono text-sm"
                placeholder="Write your insights here..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button onClick={handleCancel} className="px-5 py-2.5 text-xs font-semibold text-[#666666] hover:text-[#1a1a1a] transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={!form.title.trim()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm">
              <Save size={16} /> Save Post
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredPosts.length === 0 && !isCreating ? (
          <div className="text-center text-[#999999] py-12 border-2 border-dashed border-[#eeeeee] rounded-xl">
            <BookOpen className="mx-auto mb-3 opacity-20" size={48} />
            <p>No blog posts found.</p>
          </div>
        ) : (
          filteredPosts.map(p => (
            <div key={p.id} className="bg-white border border-[#eeeeee] p-6 rounded-xl shadow-sm hover:border-[#ccc] transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-lg text-[#1a1a1a]">{p.title}</h4>
                  <p className="text-xs text-[#888888] mt-1">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(p)} className="p-2 text-[#999999] hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                    Edit
                  </button>
                  <button onClick={() => deleteBlogPost(p.id)} className="p-2 text-[#999999] hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              {p.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {p.labels.map((l, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#f0f0f0] text-xs font-medium text-[#666666]">
                      <Tag size={12} /> {l}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="text-sm text-[#333333] whitespace-pre-wrap font-mono">
                {p.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
