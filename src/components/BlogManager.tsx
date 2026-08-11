import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Plus, Trash2, Save, Search, Tag, Edit3, Code, LayoutTemplate } from 'lucide-react';
import { BlogPost } from '../types';
import Markdown from 'react-markdown';
import { Mermaid } from './Mermaid';

// @ts-ignore
import ARCHITECTURE_DOC from "../../ARCHITECTURE.md?raw";
// @ts-ignore
import WHITE_PAPER_DOC from "../../WHITE_PAPER.md?raw";


export function BlogManager() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModes, setViewModes] = useState<Record<string, 'rendered' | 'raw'>>({});

  const hasSeeded = useRef(false);

  // Auto-seed the architecture doc safely
  useEffect(() => {
    if (hasSeeded.current) return;
    hasSeeded.current = true;
    
    // Check for duplicates first (due to previous strict mode bugs)
    const duplicateDocs = blogPosts.filter(p => p.title === 'Virtual Me (VME) Architecture');
    
    // Auto-clean up exact duplicates if they exist, leaving only one
    if (duplicateDocs.length > 1) {
      for (let i = 1; i < duplicateDocs.length; i++) {
        deleteBlogPost(duplicateDocs[i].id);
      }
    } else if (duplicateDocs.length === 0) {
      addBlogPost({
        title: 'Virtual Me (VME) Architecture',
        content: ARCHITECTURE_DOC,
        labels: ['system', 'architecture', 'docs']
      });
    }

    const duplicateWhitePapers = blogPosts.filter(p => p.title === 'Virtual Me (VME) White Paper');
    if (duplicateWhitePapers.length > 1) {
      for (let i = 1; i < duplicateWhitePapers.length; i++) {
        deleteBlogPost(duplicateWhitePapers[i].id);
      }
    } else if (duplicateWhitePapers.length === 0) {
      addBlogPost({
        title: 'Virtual Me (VME) White Paper',
        content: WHITE_PAPER_DOC,
        labels: ['system', 'white-paper', 'docs']
      });
    }

  }, [blogPosts, addBlogPost, deleteBlogPost]);

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

  const toggleViewMode = (id: string) => {
    setViewModes(prev => ({
      ...prev,
      [id]: prev[id] === 'raw' ? 'rendered' : 'raw'
    }));
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
            <div key={p.id} className="bg-white border border-[#eeeeee] p-6 rounded-xl shadow-sm transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-xl text-[#1a1a1a]">{p.title}</h4>
                  <p className="text-xs text-[#888888] mt-1">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleViewMode(p.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#f0f0f0] text-[#666666] hover:bg-[#e0e0e0] hover:text-[#1a1a1a] rounded-md transition-colors"
                  >
                    {viewModes[p.id] === 'raw' ? (
                      <><LayoutTemplate size={14} /> Rendered View</>
                    ) : (
                      <><Code size={14} /> Raw Markdown</>
                    )}
                  </button>
                  <button 
                    onClick={() => handleEdit(p)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => deleteBlogPost(p.id)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 size={14} /> Delete
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
              
              {viewModes[p.id] === 'raw' ? (
                <div className="text-sm text-[#333333] whitespace-pre-wrap font-mono bg-[#f9f9f9] p-4 rounded-lg border border-[#eeeeee]">
                  {p.content}
                </div>
              ) : (
                <div className="prose prose-sm max-w-none text-[#333333]">
                  <Markdown
                    components={{
                      code(props) {
                        const {children, className, node, ...rest} = props
                        const match = /language-(\w+)/.exec(className || '')
                        if (match && match[1] === 'mermaid') {
                          return <Mermaid chart={String(children).replace(/\n$/, '')} />
                        }
                        return (
                          <code {...rest} className={className}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {p.content}
                  </Markdown>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
