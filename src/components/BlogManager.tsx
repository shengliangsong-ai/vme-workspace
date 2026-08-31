import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Plus, Trash2, Save, Search, Tag, Edit3, Code, LayoutTemplate, FileText } from 'lucide-react';
import { BlogPost } from '../types';
import Markdown from 'react-markdown';
import { Mermaid } from './Mermaid';

// @ts-ignore
import ARCHITECTURE_DOC from "../../ARCHITECTURE.md?raw";
// @ts-ignore
import WHITE_PAPER_DOC from "../../WHITE_PAPER.md?raw";
// @ts-ignore
import README_DOC from "../../README.md?raw";

export function BlogManager() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useAppContext();
  
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', content: '', labels: '' });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModes, setViewModes] = useState<Record<string, 'rendered' | 'raw'>>({});
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

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

    const duplicateReadme = blogPosts.filter(p => p.title === 'Welcome Judges: Virtual Me Overview (4-min read)');
    if (duplicateReadme.length > 1) {
      for (let i = 1; i < duplicateReadme.length; i++) {
        deleteBlogPost(duplicateReadme[i].id);
      }
    } else if (duplicateReadme.length === 0) {
      addBlogPost({
        title: 'Welcome Judges: Virtual Me Overview (4-min read)',
        content: README_DOC,
        labels: ['welcome', 'readme', 'hackathon']
      });
    } else if (duplicateReadme[0].content !== README_DOC) {
      updateBlogPost(duplicateReadme[0].id, {
        title: duplicateReadme[0].title,
        content: README_DOC,
        labels: duplicateReadme[0].labels
      });
    }
  }, [blogPosts, addBlogPost, deleteBlogPost, updateBlogPost]);

  const handleSave = () => {
    if (!form.title.trim()) return;
    const labels = form.labels.split(',').map(l => l.trim()).filter(l => l);
    
    if (editingId) {
      updateBlogPost(editingId, {
        title: form.title,
        content: form.content,
        labels
      });
    } else {
      addBlogPost({
        title: form.title,
        content: form.content,
        labels
      });
    }
    
    setIsCreating(false);
    setEditingId(null);
    setForm({ title: '', content: '', labels: '' });
  };

  const handleEdit = (post: BlogPost) => {
    setForm({
      title: post.title,
      content: post.content,
      labels: (post.labels || []).join(', ')
    });
    setEditingId(post.id);
    setIsCreating(false);
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
        (p.labels || []).some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [blogPosts, searchQuery]);

  // Auto-select first post if none selected
  useEffect(() => {
    if (!selectedPostId && filteredPosts.length > 0 && !isCreating && !editingId) {
      setSelectedPostId(filteredPosts[0].id);
    }
  }, [filteredPosts, selectedPostId, isCreating, editingId]);

  const selectedPost = useMemo(() => {
    return blogPosts.find(p => p.id === selectedPostId) || null;
  }, [blogPosts, selectedPostId]);

  return (
    <div className="max-w-7xl mx-auto p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-[#1a1a1a]">Blog & Lessons Learned</h2>
          <p className="text-[#666666] mt-1">Document insights from AI sessions.</p>
        </div>
        {!isCreating && !editingId && (
          <button
            onClick={() => { setIsCreating(true); setSelectedPostId(null); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-colors shadow-sm"
          >
            <Plus size={16} /> New Post
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden gap-6">
        {/* Left Sidebar - Index */}
        {!isCreating && !editingId && (
          <div className="w-1/3 flex flex-col border border-[#eeeeee] rounded-xl bg-white shadow-sm overflow-hidden shrink-0">
            <div className="p-4 border-b border-[#eeeeee] relative">
              <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-[#999999]" size={16} />
              <input
                type="text"
                placeholder="Search index..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#f9f9f9] border border-[#eeeeee] rounded-full pl-10 pr-4 py-2 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#ccc] transition-colors"
              />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredPosts.length === 0 ? (
                <div className="text-center text-[#999999] py-12 flex flex-col items-center">
                  <FileText className="opacity-20 mb-3" size={32} />
                  <p className="text-sm">No posts found.</p>
                </div>
              ) : (
                filteredPosts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPostId(p.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedPostId === p.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-[#f5f5f5] border border-transparent'
                    }`}
                  >
                    <h4 className={`text-sm font-semibold truncate ${selectedPostId === p.id ? 'text-blue-800' : 'text-[#1a1a1a]'}`}>
                      {p.title}
                    </h4>
                    <div className="flex justify-between items-center mt-1">
                      <p className={`text-xs ${selectedPostId === p.id ? 'text-blue-600' : 'text-[#888888]'} truncate`}>
                        {new Date(p.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      {(p.labels || []).length > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedPostId === p.id ? 'bg-blue-100 text-blue-700' : 'bg-[#e0e0e0] text-[#666]'}`}>
                          {(p.labels || []).length} tag{(p.labels || []).length !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Right Content Area */}
        <div className={`${isCreating || editingId ? 'w-full max-w-4xl mx-auto' : 'w-2/3'} flex flex-col bg-white border border-[#eeeeee] rounded-xl shadow-sm overflow-hidden`}>
          {(isCreating || editingId) ? (
            <div className="p-8 overflow-y-auto">
              <h3 className="text-lg font-bold mb-6 text-[#1a1a1a]">
                {editingId ? 'Edit Post' : 'Create New Post'}
              </h3>
              <div className="space-y-5">
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
                <div className="flex-1 flex flex-col min-h-[400px]">
                  <label className="block text-xs font-bold uppercase tracking-widest text-[#999999] mb-2">Content / Lessons Learned</label>
                  <textarea
                    value={form.content}
                    onChange={e => setForm({ ...form, content: e.target.value })}
                    className="w-full flex-1 bg-[#f9f9f9] border border-[#eeeeee] rounded-md px-3 py-3 text-[#1a1a1a] focus:outline-none focus:border-[#ccc] font-mono text-sm"
                    placeholder="Write your insights here..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={handleCancel} className="px-5 py-2.5 text-sm font-semibold text-[#666666] hover:text-[#1a1a1a] transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={!form.title.trim()} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm">
                  <Save size={16} /> Save Post
                </button>
              </div>
            </div>
          ) : selectedPost ? (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="p-8 pb-6 border-b border-[#eeeeee] shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-3xl text-[#1a1a1a] mb-3">{selectedPost.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#888888]">
                      <span>{new Date(selectedPost.createdAt).toLocaleString(undefined, { dateStyle: 'long', timeStyle: 'short' })}</span>
                      {(selectedPost.labels || []).length > 0 && (
                        <div className="flex gap-2">
                          {(selectedPost.labels || []).map((l, i) => (
                            <span key={i} className="flex items-center gap-1 bg-[#f0f0f0] px-2 py-0.5 rounded-md text-[#666] text-xs font-medium">
                              <Tag size={12} /> {l}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button 
                      onClick={() => toggleViewMode(selectedPost.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-[#f5f5f5] text-[#444] hover:bg-[#e0e0e0] hover:text-[#1a1a1a] rounded-lg transition-colors"
                    >
                      {viewModes[selectedPost.id] === 'raw' ? (
                        <><LayoutTemplate size={14} /> Rendered</>
                      ) : (
                        <><Code size={14} /> Raw</>
                      )}
                    </button>
                    <button 
                      onClick={() => handleEdit(selectedPost)} 
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => {
                        deleteBlogPost(selectedPost.id);
                        setSelectedPostId(null);
                      }} 
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Delete Post"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                {viewModes[selectedPost.id] === 'raw' ? (
                  <div className="text-sm text-[#333333] whitespace-pre-wrap font-mono bg-[#f9f9f9] p-6 rounded-xl border border-[#eeeeee]">
                    {selectedPost.content}
                  </div>
                ) : (
                  <div className="prose prose-slate prose-sm sm:prose-base max-w-none text-[#333333]">
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
                      {selectedPost.content}
                    </Markdown>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-[#999999] p-8 text-center">
              <BookOpen className="opacity-20 mb-4" size={64} />
              <p className="text-lg font-medium text-[#444] mb-1">No Post Selected</p>
              <p className="text-sm">Select a post from the index on the left to view it here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
