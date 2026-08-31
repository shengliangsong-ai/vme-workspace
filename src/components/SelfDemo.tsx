import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, Square, User, MonitorPlay, ChevronLeft, ChevronRight, ListMusic, Maximize, Minimize } from 'lucide-react';
import { cn } from '../lib/utils';

declare global {
  interface Window {
    utterances: SpeechSynthesisUtterance[];
  }
}

const PITCHES = [
  {
    id: 'pitch1',
    name: 'Pitch A: Collaborative Developer',
    script: [
      {
        title: "1. The AI-Human Team",
        text: "Welcome to Virtual Me. Software engineering is evolving. The future isn't about AI replacing humans; it's about AI collaborating with humans as a unified team. We've built an environment where developers and AI agents work side-by-side, sharing the same goals and the same workspace.",
        image: "/3 Human vs Virtual Me, Team.jpg"
      },
      {
        title: "2. Persistent Memory",
        text: "But to be a true team member, AI needs persistent memory. The challenge is giving AI that memory cheaply and effectively. We solved this by creating a durable memory layer that ensures your virtual assistant remembers your past decisions without constantly overwhelming expensive context windows.",
        image: "/2 How to give AI persistent memory cheaply.jpg"
      },
      {
        title: "3. Autonomous Coding",
        text: "This fundamentally changes the nature of coding. While you focus on high-level architecture and complex problem-solving, your Virtual Me acts autonomously in the background. It writes code, runs tests, and debugs issues, allowing you to orchestrate rather than just type.",
        image: "/15 How is really coding when AI acts autonomously.jpg"
      },
      {
        title: "4. Human Control",
        text: "The core of our platform offers unlimited memory combined with complete human control. You are always the director. The AI suggests, plans, and executes, but it never overrides your authority. It's the perfect balance of automation and oversight.",
        image: "/S1 Unlimited memory, but human control.jpg"
      },
      {
        title: "5. Long-Term Memory",
        text: "Our Virtual Memory Engine archives this long-term memory by automatically generating issues and discrete skills from your daily workflows. Every project milestone, every bug fix, and every architectural decision becomes a reusable skill in your AI's memory bank.",
        image: "/S2  VME long-term memory via issues and skills.jpg"
      },
      {
        title: "6. Analysis & Planning",
        text: "When a new task arrives, the workflow begins. The system deeply analyzes the codebase, fetches relevant context from its memory bank, and drafts a comprehensive execution plan. It understands what needs to be done before writing a single line of code.",
        image: "/S3 Analyze, Ftech, Plan.jpg"
      },
      {
        title: "7. Execution & Logs",
        text: "You remain entirely in the driver's seat. You review and approve the plan. Once approved, the executor agents generate the code, streaming their execution logs directly to your workspace in real-time so you can monitor progress.",
        image: "/S4 Approve, Receive plan, generate code, stream logs.jpg"
      },
      {
        title: "8. Evolving Skills",
        text: "Behind the scenes, our multi-agent system constantly evolves. It breaks down complex tasks into manageable steps and dynamically acquires new skills. As it encounters new challenges, it learns how to handle them, becoming more capable with every sprint.",
        image: "/S5 multi-agent system, Steps, New Skills.jpg"
      },
      {
        title: "9. Continuous Evaluation",
        text: "Every action is continuously evaluated. The Evaluator agent monitors output quality, tests the code, and automatically refines the AI's strategies. This feedback loop ensures that your Virtual Me gets smarter and more reliable over time.",
        image: "/S6 Evaluator Outputs.jpg"
      },
      {
        title: "10. Massive Searchable Context",
        text: "This level of intelligence requires massive context. By converting 10 Gigabytes of storage into 2.5 Billion searchable tokens, we achieve unparalleled context retrieval. It's a vast reservoir of knowledge, instantly accessible exactly when the AI needs it.",
        image: "/S7 10GB storage, 2.5B searchable token.jpg"
      },
      {
        title: "11. Unlimited Smart Context",
        text: "The result is a virtually unlimited, highly cost-effective smart context engine that scales with your most ambitious projects. You get the benefits of a massive context window without the exorbitant costs, making enterprise-grade AI collaboration accessible to everyone.",
        image: "/S8 virtually unlimied, cost-effective smart context.jpg"
      },
      {
        title: "12. The Future",
        text: "We are redefining what it means to build software. With an autonomous, intelligent partner that remembers everything and learns continuously, the only question left is: What will your Virtual Me build next?",
        image: "/S9 What will your virtual me build next.jpg"
      }
    ]
  },
  {
    id: 'pitch2',
    name: 'Pitch B: Virtual Me Agentic Workflow',
    script: [
      {
        title: "1. Agentic Workflow",
        text: "Welcome to the deep dive into the Virtual Me Agentic Workflow. Today, we're going to explore the technical architecture that powers our collaborative AI environment, showing you exactly how our multi-agent system manages complex software development lifecycles.",
        image: "/PA/1 Virtual Me Agentic Workflow.jpg"
      },
      {
        title: "2. Active vs Searchable Tokens",
        text: "The foundation of our system is how we handle context. Traditional models struggle with large context windows due to cost and latency. We solve this by bridging a 200K hot active token window with a massive 2.5 Billion searchable token database, giving the AI exactly what it needs, when it needs it.",
        image: "/PA/4 200K hot active token vs 2.5B searchable token.jpg"
      },
      {
        title: "3. Orchestration Engine",
        text: "This data flow is managed by the Virtual Memory Engine Orchestration Engine. It acts as the brain of the operation, coordinating between long-term storage, active context, and the various specialized agents that perform the actual development work.",
        image: "/PA/5 VME Orchestration Engine.jpg"
      },
      {
        title: "4. Real-Time Streaming",
        text: "Communication between the AI and the developer happens in real-time. We use Server-Sent Events to stream logs, code generation progress, and system updates directly to the client interface. You never have to wonder what the AI is doing; you see it happening live.",
        image: "/PA/6 Server-Sent Events.jpg"
      },
      {
        title: "5. Execution Loop",
        text: "Our core execution loop follows four distinct phases: Plan, Approve, Execute, and Evaluate. This structured approach ensures that the AI doesn't just blindly write code, but follows a rigorous software engineering methodology.",
        image: "/PA/7 Plan, Approve, Execute, Evaluate.jpg"
      },
      {
        title: "6. Planning Phase",
        text: "During the planning phase, the system formulates detailed execution plans. It breaks down high-level feature requests into discrete, actionable steps, analyzing dependencies and determining the optimal sequence of operations.",
        image: "/PA/8 Formulates plans.jpg"
      },
      {
        title: "7. Human-in-the-Loop",
        text: "Notice this crucial step: this is our Human-in-the-loop safety mechanism. The AI proposes the plan, but it cannot proceed until a human developer reviews it. This guarantees that architectural decisions always align with your vision.",
        image: "/PA/9 Notice this is our Human in-the-loop safety mechanism.jpg"
      },
      {
        title: "8. Approved & Signed",
        text: "Once the plan is approved and signed off by you, the execution phase begins. The orchestration engine dispatches tasks to specialized coding agents, securely passing along the approved context and instructions.",
        image: "/PA/10 Approved and Signed.jpg"
      },
      {
        title: "9. QA & Validation",
        text: "As code is written, our QA Agent steps in. It performs continuous code review and validation, running tests and checking for edge cases. If it detects an issue, it immediately flags it or automatically implements a fix before the code is merged.",
        image: "/PA/11 QA Agent, code review and validation.jpg"
      },
      {
        title: "10. Day-Dreaming",
        text: "But what happens after the work is done? During idle time, the system enters a Day-Dream state. It reviews the lessons learned from recent tasks, optimizes its approaches, and saves successful patterns as reusable skills for future projects.",
        image: "/PA/12 Day-Dream, Lesson learned, Save as reusable skills.jpg"
      },
      {
        title: "11. Active Context Dashboard",
        text: "This means your workspace is always up-to-date. The system maintains a dynamic dashboard of active context, open issues, newly acquired skills, and even provides daily standup summaries of what your virtual team has accomplished.",
        image: "/PA/13 Context, active issues, skills, daily standups.jpg"
      },
      {
        title: "12. Workspace Vision",
        text: "Our ultimate workspace vision goes beyond simple automation. We are building an environment that supports time-travel debugging and the instantiation of entirely virtual teams. Virtual Me isn't just an assistant; it's the future of collaborative software engineering.",
        image: "/PA/14 Workspace Vision, Time-Travel Debugging and Virtual Teams.jpg"
      }
    ]
  },
  {
    id: 'pitch3',
    name: 'Pitch C: Virtual Me Workspace',
    script: [
      {
        title: "1. The Workspace Bridge",
        text: "Welcome to the Virtual Me Workspace. In this presentation, we'll focus on how our platform serves as the ultimate bridge between human cognition and artificial intelligence, creating a seamless environment for modern software development.",
        image: "/PT/T1 Virttual Me Workspace.jpg"
      },
      {
        title: "2. The Cognitive Disconnect",
        text: "The core problem we are solving is the disconnect between human memory and AI context. Developers carry immense project knowledge in their heads, while AI models start fresh every session. Our system bridges this gap permanently.",
        image: "/PT/T2 bridge human memory and context.jpg"
      },
      {
        title: "3. Aligning Memory & Skills",
        text: "This memory bridge aligns human memory with AI context windows. By capturing your decisions, preferences, and project history, the AI understands your unique coding style and architectural goals, streamlining your daily tasks automatically.",
        image: "/PT/T3 memory bridge, Aligns Human memory with AI contxt windows and skills to streamline daily tasks.jpg"
      },
      {
        title: "4. Dual-Storage Architecture",
        text: "To achieve this securely and efficiently, we utilize a dual-storage approach. We leverage Local SQLite for lightning-fast, on-device caching of immediate tasks, synced perfectly with a scalable Firestore NoSQL memory bank for global, long-term persistence.",
        image: "/PT/T4 Local SQLite vs Firestore NoSQL memory bank.jpg"
      },
      {
        title: "5. Time-Travel Debugging",
        text: "When traditional AI forgets context, productivity halts. Our platform doesn't just remember; it allows you to instantiate entire virtual teams with specific memory contexts. You can even perform time-travel debugging, rolling back the AI's state to understand exactly why a decision was made.",
        image: "/PT/T5 Forgets context, Instantiate virtual teams, memory context, and perform time-travel debugging.jpg"
      },
      {
        title: "6. Amplifying Capabilities",
        text: "These capabilities power our core workspace features. From intelligent issue tracking to automated code reviews and proactive architectural suggestions, the workspace is designed to amplify your capabilities, not just automate your keystrokes.",
        image: "/PT/T6 Core workspace features.jpg"
      },
      {
        title: "7. Specialized Agents",
        text: "The heavy lifting is distributed among specialized agents: the Planner, the Executor, and the General Assistant. Working in concert, they analyze requirements, draft code, and handle mundane tasks, allowing you to focus on the big picture.",
        image: "/PT/T7 Planner, Executor, GA.jpg"
      },
      {
        title: "8. RAG Context Assembly",
        text: "All of this is fueled by our advanced RAG Context Assembly. We dynamically retrieve only the most relevant snippets from your vast project history, ensuring the AI's context window is filled with highly targeted, actionable information.",
        image: "/PT/T8 RAG Context Assembly.jpg"
      },
      {
        title: "9. Your Digital Twin",
        text: "Ultimately, Virtual Me acts as an active, collaborative digital twin. It learns from you, works with you, and scales your output exponentially. It's not just a tool; it's your dedicated engineering partner for the future.",
        image: "/PT/T9 Virtual Me acts as an active collaborative digital twin.jpg"
      }
    ]
  }
];

window.utterances = [];

export function SelfDemo() {
  const [activePitchIndex, setActivePitchIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(-1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  const isPlayingRef = useRef(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const keepAliveInterval = useRef<any>(null);
  
  const currentPitch = PITCHES[activePitchIndex];
  const DEMO_SCRIPT = currentPitch.script;

  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    keepAliveInterval.current = setInterval(() => {
      if (synthRef.current?.speaking && !synthRef.current?.paused) {
        synthRef.current.resume();
      }
    }, 10000);
    
    return () => {
      if (keepAliveInterval.current) clearInterval(keepAliveInterval.current);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const playSegment = (index: number) => {
    if (!synthRef.current) return;
    
    if (utteranceRef.current) {
      utteranceRef.current.onend = null;
      utteranceRef.current.onboundary = null;
    }
    synthRef.current.cancel();
    setCharIndex(-1);
    
    if (index >= DEMO_SCRIPT.length || index < 0) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentIndex(0);
      return;
    }
    
    setCurrentIndex(index);
    const text = DEMO_SCRIPT[index].text;
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en-'));
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.05;
    
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCharIndex(event.charIndex);
      }
    };

    utterance.onend = () => {
      setCharIndex(-1);
      if (isPlayingRef.current) {
        playSegment(index + 1);
      }
    };
    
    utteranceRef.current = utterance;
    window.utterances.push(utterance); // Prevent GC
    synthRef.current.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (utteranceRef.current) {
        utteranceRef.current.onend = null;
        utteranceRef.current.onboundary = null;
      }
      synthRef.current?.cancel();
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCharIndex(-1);
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      playSegment(currentIndex);
    }
  };

  const nextSlide = () => {
    playSegment(currentIndex + 1);
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      playSegment(currentIndex - 1);
    }
  };

  const changePitch = (index: number) => {
    if (isPlaying) {
      togglePlay();
    }
    setActivePitchIndex(index);
    setCurrentIndex(0);
    setCharIndex(-1);
  };

  const currentSegment = DEMO_SCRIPT[currentIndex];

  const renderHighlightedText = () => {
    const text = currentSegment.text;
    if (charIndex === -1 || !isPlaying) return text;
    
    // Find the end of the current word
    let nextSpace = text.indexOf(' ', charIndex);
    if (nextSpace === -1) nextSpace = text.length;
    
    // Include any trailing punctuation in the word for smoother highlighting
    while (nextSpace < text.length && /[^a-zA-Z0-9\s]/.test(text[nextSpace])) {
        nextSpace++;
    }

    const before = text.substring(0, charIndex);
    const word = text.substring(charIndex, nextSpace);
    const after = text.substring(nextSpace);

    return (
      <>
        <span className="text-gray-400">{before}</span>
        <span className="bg-yellow-200 text-gray-900 rounded px-1 transition-all shadow-sm">{word}</span>
        <span className="text-gray-400">{after}</span>
      </>
    );
  };

  return (
    <div className={cn(
      "transition-all duration-300 flex flex-col gap-4",
      isFullScreen 
        ? "fixed inset-0 z-50 bg-neutral-950 p-2 md:p-4 w-full h-full" 
        : "p-4 md:p-8 w-full max-w-7xl mx-auto h-[90vh]"
    )}>
      {/* Header & Controls */}
      <div className={cn(
        "flex flex-col md:flex-row justify-between items-center p-4 rounded-xl shadow-sm border gap-4 shrink-0 transition-colors",
        isFullScreen ? "bg-slate-900 border-slate-800" : "bg-white border-gray-200"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn("p-3 rounded-xl", isFullScreen ? "bg-slate-800 text-blue-400" : "bg-blue-100 text-blue-600")}>
            <ListMusic size={24} />
          </div>
          <div>
            <h2 className={cn("text-xl font-bold", isFullScreen ? "text-slate-100" : "text-gray-900")}>Auto-Pitch Player</h2>
            <div className="flex gap-2 mt-1">
              {PITCHES.map((pitch, idx) => (
                <button
                  key={pitch.id}
                  onClick={() => changePitch(idx)}
                  className={cn(
                    "text-xs px-3 py-1 rounded-full font-medium transition-colors border",
                    activePitchIndex === idx 
                      ? (isFullScreen ? "bg-blue-600 text-white border-blue-600" : "bg-slate-900 text-white border-slate-900")
                      : (isFullScreen ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100")
                  )}
                >
                  {pitch.name}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className={cn("flex items-center gap-3 p-2 rounded-full border", isFullScreen ? "bg-slate-800 border-slate-700" : "bg-gray-50 border-gray-200")}>
          <button 
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={cn("p-3 rounded-full hover:shadow-sm disabled:opacity-50 transition-all", isFullScreen ? "text-slate-300 hover:bg-slate-700 hover:text-white" : "text-gray-700 hover:bg-white")}
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold transition-all shadow-md w-[160px] justify-center",
              isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isPlaying ? (
              <>
                <Square size={20} fill="currentColor" /> Stop
              </>
            ) : (
              <>
                <PlayCircle size={20} /> Play Pitch
              </>
            )}
          </button>
          
          <button 
            onClick={nextSlide}
            disabled={currentIndex === DEMO_SCRIPT.length - 1}
            className={cn("p-3 rounded-full hover:shadow-sm disabled:opacity-50 transition-all", isFullScreen ? "text-slate-300 hover:bg-slate-700 hover:text-white" : "text-gray-700 hover:bg-white")}
          >
            <ChevronRight size={20} />
          </button>

          <div className={cn("w-[1px] h-8 mx-1", isFullScreen ? "bg-slate-600" : "bg-gray-300")}></div>
          
          <button 
            onClick={() => setIsFullScreen(!isFullScreen)}
            title="Toggle Fullscreen"
            className={cn("p-3 rounded-full hover:shadow-sm transition-all", isFullScreen ? "text-blue-400 hover:bg-slate-700 hover:text-blue-300" : "text-gray-600 hover:bg-white hover:text-gray-900")}
          >
            {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      {/* Main Presentation Area */}
      <div className="flex-1 bg-black rounded-2xl shadow-xl overflow-hidden flex flex-col relative min-h-0">
        
        {/* Slide Image - Maximized */}
        <div className="flex-1 w-full h-full p-4 md:p-8 flex items-center justify-center relative z-10 overflow-hidden">
          {isPlaying && (
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-black animate-pulse"></div>
            </div>
          )}
          
          {currentSegment.image ? (
            <img 
              src={currentSegment.image} 
              alt={currentSegment.title} 
              className="w-full h-full object-contain rounded-lg shadow-2xl z-10"
            />
          ) : (
            <div className="flex flex-col items-center justify-center z-10">
              <MonitorPlay size={64} className={cn("text-slate-700 mb-6 transition-transform", isPlaying && "scale-110 text-blue-500")} />
              <h3 className="text-4xl font-bold text-white mb-4">{currentSegment.title}</h3>
            </div>
          )}
        </div>

        {/* Teleprompter Subtitles Overlay */}
        <div className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-6 md:p-8 shrink-0 z-20">
          <div className="max-w-4xl mx-auto flex items-start gap-6">
            <div className="bg-blue-500/20 text-blue-400 p-3 rounded-full shrink-0">
              <User size={28} />
            </div>
            <div>
              <div className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-3 flex items-center gap-2">
                <span>Auto-Transcript</span>
                {isPlaying && (
                  <span className="flex gap-1 h-3 items-end">
                    <span className="w-1 h-1/3 bg-blue-400 rounded-full animate-[bounce_1s_infinite]"></span>
                    <span className="w-1 h-full bg-blue-400 rounded-full animate-[bounce_1s_infinite_100ms]"></span>
                    <span className="w-1 h-2/3 bg-blue-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                  </span>
                )}
              </div>
              <p className={cn(
                "text-2xl md:text-3xl font-medium leading-relaxed transition-all",
                isPlaying ? "text-gray-200" : "text-gray-500"
              )}>
                {isPlaying ? renderHighlightedText() : `"${currentSegment.text}"`}
              </p>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Progress Indicators */}
      <div className="flex gap-2 shrink-0">
        {DEMO_SCRIPT.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => playSegment(idx)}
            className={cn(
              "flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer border border-transparent",
              idx === currentIndex && isPlaying ? "bg-blue-500 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]" : 
              idx === currentIndex ? "bg-blue-400" :
              idx < currentIndex ? "bg-blue-200" : "bg-gray-200 hover:bg-gray-300"
            )}
          />
        ))}
      </div>
    </div>
  );
}
