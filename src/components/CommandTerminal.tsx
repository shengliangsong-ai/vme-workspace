import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, ChevronRight } from 'lucide-react';

export function CommandTerminal({ currentTab, setCurrentTab }: { currentTab: string, setCurrentTab: (tab: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: string; text: string }[]>([
    { type: 'system', text: 'Terminal initialized. Type "help" for a list of commands.' }
  ]);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const context = useAppContext();
  const state = (context as any).state || context;
  const { 
    submitJob, cancelJob, deleteJob, clearJobs, approveJob, 
    createIssue, deleteIssue, setActiveIssue,
    addSkill, deleteSkill,
    addStandup, deleteStandup,
    addBlogPost, deleteBlogPost,
    updateSettings,
    addDebugEvent
  } = context;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle terminal on Ctrl + ` or Cmd + `
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsOpen(prev => {
          if (!prev) setTimeout(() => inputRef.current?.focus(), 100);
          return !prev;
        });
      }
    };
    const handleCustomToggle = () => {
      setIsOpen(prev => {
        if (!prev) setTimeout(() => inputRef.current?.focus(), 100);
        return !prev;
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('toggle-terminal', handleCustomToggle);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('toggle-terminal', handleCustomToggle);
    };
  }, []);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const print = (text: string, type: 'system' | 'user' | 'error' | 'success' = 'system') => {
    setHistory(prev => [...prev, { text, type }]);
  };

  const parseArgs = (str: string) => {
    const matches = str.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g);
    if (!matches) return [];
    return matches.map(match => {
      if (match.startsWith('"') && match.endsWith('"')) return match.slice(1, -1);
      if (match.startsWith("'") && match.endsWith("'")) return match.slice(1, -1);
      return match;
    });
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    print(`> ${input}`, 'user');
    const args = parseArgs(input.trim());
    const cmd = args[0].toLowerCase();
    
    state.debugEvents && addDebugEvent({
      type: 'cli',
      message: `Executed: ${input}`
    });
    
    try {
      executeCommand(cmd, args.slice(1));
    } catch (err) {
      if (err instanceof Error) {
        print(`Error: ${err.message}`, 'error');
      } else {
        print(`Error: ${String(err)}`, 'error');
      }
    }
    
    setInput('');
  };

  const executeCommand = (cmd: string, args: string[]) => {
    switch (cmd) {
      case 'help':
        print(`Available commands:
  nav [dashboard|workspace|skills|standups|blog|settings|queue]
  issue [ls|add|rm|active]
  skill [ls|add|rm]
  job [ls|submit|rm|clear|approve]
  standup [ls|add|rm]
  blog [ls|add|rm]
  config [ls|set]
  clear
Type "help <command>" for more details.`, 'system');
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'nav':
        if (!args[0]) {
          print('Usage: nav <tab>', 'error');
        } else {
          setCurrentTab(args[0]);
          print(`Navigated to ${args[0]}`, 'success');
        }
        break;
      case 'issue':
        handleIssueCommand(args);
        break;
      case 'skill':
        handleSkillCommand(args);
        break;
      case 'job':
        handleJobCommand(args);
        break;
      case 'standup':
        handleStandupCommand(args);
        break;
      case 'blog':
        handleBlogCommand(args);
        break;
      case 'config':
        handleConfigCommand(args);
        break;
      default:
        print(`Command not found: ${cmd}. Type "help" for a list of commands.`, 'error');
    }
  };

  const handleIssueCommand = (args: string[]) => {
    const sub = args[0];
    if (sub === 'ls') {
      if (state.issues.length === 0) print('No issues found.', 'system');
      else {
        print(state.issues.map(i => `[${i.id}] ${i.title} (${i.status}) - ${i.type}${state.activeIssueId === i.id ? ' (ACTIVE)' : ''}`).join('\n'), 'system');
      }
    } else if (sub === 'add') {
      if (!args[1]) throw new Error('Usage: issue add "<title>" [bug|feature]');
      createIssue(args[1], (args[2] as 'bug' | 'feature') || 'feature');
      print(`Issue created: ${args[1]}`, 'success');
    } else if (sub === 'rm') {
      if (!args[1]) throw new Error('Usage: issue rm <id>');
      deleteIssue(args[1]);
      print(`Issue ${args[1]} deleted`, 'success');
    } else if (sub === 'active') {
      if (!args[1]) throw new Error('Usage: issue active <id>');
      setActiveIssue(args[1]);
      print(`Active issue set to ${args[1]}`, 'success');
    } else {
      print('Usage: issue [ls|add|rm|active]', 'error');
    }
  };

  const handleSkillCommand = (args: string[]) => {
    const sub = args[0];
    if (sub === 'ls') {
      if (state.skills.length === 0) print('No skills found.', 'system');
      else print(state.skills.map(s => `[${s.id}] ${s.name}`).join('\n'), 'system');
    } else if (sub === 'add') {
      if (!args[1]) throw new Error('Usage: skill add "<name>" "<description>"');
      addSkill({ name: args[1], description: args[2] || '', content: '', tags: [] });
      print(`Skill added: ${args[1]}`, 'success');
    } else if (sub === 'rm') {
      if (!args[1]) throw new Error('Usage: skill rm <id>');
      deleteSkill(args[1]);
      print(`Skill ${args[1]} deleted`, 'success');
    } else {
      print('Usage: skill [ls|add|rm]', 'error');
    }
  };

  const handleJobCommand = (args: string[]) => {
    const sub = args[0];
    if (sub === 'ls') {
      if (state.jobs.length === 0) print('No jobs found.', 'system');
      else print(state.jobs.map(j => `[${j.id}] ${j.command} - ${j.status}`).join('\n'), 'system');
    } else if (sub === 'submit') {
      if (!args[1]) throw new Error('Usage: job submit "<command>" [timeoutMs]');
      submitJob(args[1], parseInt(args[2]) || 60000);
      print(`Job submitted: ${args[1]}`, 'success');
    } else if (sub === 'rm') {
      if (!args[1]) throw new Error('Usage: job rm <id>');
      deleteJob(args[1]);
      print(`Job ${args[1]} deleted`, 'success');
    } else if (sub === 'cancel') {
      if (!args[1]) throw new Error('Usage: job cancel <id>');
      cancelJob(args[1]);
      print(`Job ${args[1]} cancelled`, 'success');
    } else if (sub === 'clear') {
      clearJobs();
      print('Old jobs cleared', 'success');
    } else if (sub === 'approve') {
      if (!args[1]) throw new Error('Usage: job approve <id>');
      approveJob(args[1]);
      print(`Job ${args[1]} approved`, 'success');
    } else {
      print('Usage: job [ls|submit|rm|cancel|clear|approve]', 'error');
    }
  };

  const handleStandupCommand = (args: string[]) => {
    const sub = args[0];
    if (sub === 'ls') {
      if (state.standups.length === 0) print('No standups found.', 'system');
      else print(state.standups.map(s => `[${s.id}] ${s.date}`).join('\n'), 'system');
    } else if (sub === 'add') {
      if (!args[1]) throw new Error('Usage: standup add "<yesterday>" "<today>" "<blockers>"');
      addStandup({
        date: new Date().toISOString().split('T')[0],
        today: args[1] || '',
        tomorrow: args[2] || '',
        blockers: args[3] || ''
      });
      print('Standup added', 'success');
    } else if (sub === 'rm') {
      if (!args[1]) throw new Error('Usage: standup rm <id>');
      deleteStandup(args[1]);
      print(`Standup ${args[1]} deleted`, 'success');
    } else {
      print('Usage: standup [ls|add|rm]', 'error');
    }
  };

  const handleBlogCommand = (args: string[]) => {
    const sub = args[0];
    if (sub === 'ls') {
      if (state.blogPosts.length === 0) print('No blog posts found.', 'system');
      else print(state.blogPosts.map(b => `[${b.id}] ${b.title}`).join('\n'), 'system');
    } else if (sub === 'add') {
      if (!args[1]) throw new Error('Usage: blog add "<title>" "<content>"');
      addBlogPost({ title: args[1], content: args[2] || '', labels: [] });
      print('Blog post added', 'success');
    } else if (sub === 'rm') {
      if (!args[1]) throw new Error('Usage: blog rm <id>');
      deleteBlogPost(args[1]);
      print(`Blog post ${args[1]} deleted`, 'success');
    } else {
      print('Usage: blog [ls|add|rm]', 'error');
    }
  };

  const handleConfigCommand = (args: string[]) => {
    const sub = args[0];
    if (sub === 'ls') {
      print(Object.entries(state.settings).map(([k, v]) => `${k}: ${v}`).join('\n') || 'Settings empty', 'system');
    } else if (sub === 'set') {
      if (!args[1] || args[2] === undefined) throw new Error('Usage: config set <key> "<value>"');
      updateSettings({ ...state.settings, [args[1]]: args[2] });
      print(`Setting ${args[1]} updated`, 'success');
    } else {
      print('Usage: config [ls|set]', 'error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-[#1e1e1e] text-[#cccccc] font-mono text-sm z-50 shadow-2xl transition-all duration-200 border-t border-[#333333] flex flex-col ${isMaximized ? 'h-[80vh]' : 'h-[40vh]'}`}>
      <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333333]">
        <div className="flex items-center gap-2">
          <TerminalIcon size={16} className="text-blue-400" />
          <span className="font-semibold text-xs tracking-wider uppercase text-[#cccccc]">Command Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMaximized(!isMaximized)} className="text-[#999999] hover:text-white transition-colors">
            {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="text-[#999999] hover:text-red-400 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {history.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap ${line.type === 'error' ? 'text-red-400' : line.type === 'success' ? 'text-green-400' : line.type === 'user' ? 'text-white' : 'text-[#aaaaaa]'}`}>
            {line.text}
          </div>
        ))}
        <div ref={endOfMessagesRef} />
      </div>
      
      <div className="p-2 border-t border-[#333333] bg-[#1e1e1e]">
        <form onSubmit={handleCommand} className="flex items-center gap-2">
          <ChevronRight size={16} className="text-blue-400" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-white font-mono"
            placeholder="Type a command or 'help'..."
            autoFocus
          />
        </form>
      </div>
    </div>
  );
}
