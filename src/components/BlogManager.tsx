import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Plus, Trash2, Save, Search, Tag, Edit3, Code, LayoutTemplate } from 'lucide-react';
import { BlogPost } from '../types';
import Markdown from 'react-markdown';

const ARCHITECTURE_DOC = `# Virtual Me (VME) Architecture & Implementation Details

The Virtual Me (VME) application is a lightweight full-stack Single Page Application (SPA) built using React, Vite, Tailwind CSS, Node.js, Express, and SQLite. It serves as a personal developer workspace to manage issues, skills, daily standups, queued jobs (qsub), and session reports.

## Core Architecture

### 1. State Management & Persistence
- **Context API**: The entire application state is managed via React Context (AppContext.tsx).
- **Local SQLite Database**: The application uses a local SQLite database (vme.db) run via an Express backend to persist workspace data. This allows 100% local operation on your machine without relying on external cloud databases, which is ideal for enterprise environments with strict cloud access rules.
- **Local Storage Fallback**: The app continues to sync to localStorage as an offline-friendly fallback during development.
- **GitHub Sync**: The application can additionally sync its state to a private GitHub repository by authenticating via a Personal Access Token. This acts as a remote backup and version control for the workspace data.

### 2. Frontend Routing & Layout
- A simple tab-based routing system is implemented in App.tsx, avoiding the need for heavy routing libraries.
- The layout features a persistent left sidebar (Sidebar.tsx) for navigation, and a main content area that renders the selected manager/dashboard component.

### 3. Styling
- **Tailwind CSS**: Used extensively for utility-first styling. 
- **Lucide React**: Provides consistent vector icons across the UI.

## Modules & Features

- **Dashboard**: Displays a high-level overview of active issues, skills, and pending jobs.
- **Workspace (Issues)**: Manages tasks/issues, workflow steps, and context summaries. Allows generating a "Session Report" when a task is completed.
- **Job Queue (qsub)**: Simulates a job submission system where tasks can be queued, reordered, cancelled, and run with a specific timeout.
- **Skills & Context**: A repository of acquired skills and reference materials.
- **Daily Standups**: Tracks daily achievements, tomorrow's plans, and current blockers.
- **Blog / Lessons Learned**: A space to document architectural decisions, insights, and session reports.

## Areas for Expansion

### 1. Job Queue Execution (qsub)
- **Current State (Mocked)**: The job queue execution is simulated using a setInterval loop in AppContext.tsx. It automatically transitions jobs from queued to running, and fakes a completed or failed state based on a timeout. The execution logs are hardcoded mock strings.
- **TODO / Real Implementation**: 
  - Enhance the local Express backend to spawn actual shell processes (via child_process).
  - Stream real stdout and stderr back to the client via WebSockets or Server-Sent Events.

### 2. Database Refinement
- **Current State**: Uses a single JSON blob inside a local SQLite database row.
- **TODO**: Normalize the SQLite schema into individual tables for Issues, Skills, Jobs, Standups, and Blogs to allow for more complex querying and partial updates.

### 3. Authentication
- **Current State**: The app runs locally on a dev machine and assumes a single-user environment without any login barrier.
- **TODO**: Optional integration of a real authentication provider or local token-based auth to support multi-device syncing and secure remote access.`;

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
                  <Markdown>{p.content}</Markdown>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
