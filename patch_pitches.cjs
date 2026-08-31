const fs = require('fs');
let code = fs.readFileSync('src/components/SelfDemo.tsx', 'utf8');

const newPitches = `const PITCHES = [
  {
    id: 'pitch1',
    name: 'Pitch A: Collaborative Developer',
    script: [
      {
        title: "1. The AI-Human Team",
        text: "Welcome to Virtual Me. Software engineering is evolving. The future isn't about AI replacing humans; it's about AI collaborating with humans as a unified team. We've built an environment where developers and AI agents work side-by-side, sharing the same goals and the same workspace.",
        image: "/3 Human vs Virtual Me, Team.png"
      },
      {
        title: "2. Persistent Memory",
        text: "But to be a true team member, AI needs persistent memory. The challenge is giving AI that memory cheaply and effectively. We solved this by creating a durable memory layer that ensures your virtual assistant remembers your past decisions without constantly overwhelming expensive context windows.",
        image: "/2 How to give AI persistent memory cheaply.png"
      },
      {
        title: "3. Autonomous Coding",
        text: "This fundamentally changes the nature of coding. While you focus on high-level architecture and complex problem-solving, your Virtual Me acts autonomously in the background. It writes code, runs tests, and debugs issues, allowing you to orchestrate rather than just type.",
        image: "/15 How is really coding when AI acts autonomously.png"
      },
      {
        title: "4. Human Control",
        text: "The core of our platform offers unlimited memory combined with complete human control. You are always the director. The AI suggests, plans, and executes, but it never overrides your authority. It's the perfect balance of automation and oversight.",
        image: "/S1 Unlimited memory, but human control.png"
      },
      {
        title: "5. Long-Term Memory",
        text: "Our Virtual Memory Engine archives this long-term memory by automatically generating issues and discrete skills from your daily workflows. Every project milestone, every bug fix, and every architectural decision becomes a reusable skill in your AI's memory bank.",
        image: "/S2  VME long-term memory via issues and skills.png"
      },
      {
        title: "6. Analysis & Planning",
        text: "When a new task arrives, the workflow begins. The system deeply analyzes the codebase, fetches relevant context from its memory bank, and drafts a comprehensive execution plan. It understands what needs to be done before writing a single line of code.",
        image: "/S3 Analyze, Ftech, Plan.png"
      },
      {
        title: "7. Execution & Logs",
        text: "You remain entirely in the driver's seat. You review and approve the plan. Once approved, the executor agents generate the code, streaming their execution logs directly to your workspace in real-time so you can monitor progress.",
        image: "/S4 Approve, Receive plan, generate code, stream logs.png"
      },
      {
        title: "8. Evolving Skills",
        text: "Behind the scenes, our multi-agent system constantly evolves. It breaks down complex tasks into manageable steps and dynamically acquires new skills. As it encounters new challenges, it learns how to handle them, becoming more capable with every sprint.",
        image: "/S5 multi-agent system, Steps, New Skills.png"
      },
      {
        title: "9. Continuous Evaluation",
        text: "Every action is continuously evaluated. The Evaluator agent monitors output quality, tests the code, and automatically refines the AI's strategies. This feedback loop ensures that your Virtual Me gets smarter and more reliable over time.",
        image: "/S6 Evaluator Outputs.png"
      },
      {
        title: "10. Massive Searchable Context",
        text: "This level of intelligence requires massive context. By converting 10 Gigabytes of storage into 2.5 Billion searchable tokens, we achieve unparalleled context retrieval. It's a vast reservoir of knowledge, instantly accessible exactly when the AI needs it.",
        image: "/S7 10GB storage, 2.5B searchable token.png"
      },
      {
        title: "11. Unlimited Smart Context",
        text: "The result is a virtually unlimited, highly cost-effective smart context engine that scales with your most ambitious projects. You get the benefits of a massive context window without the exorbitant costs, making enterprise-grade AI collaboration accessible to everyone.",
        image: "/S8 virtually unlimied, cost-effective smart context.png"
      },
      {
        title: "12. The Future",
        text: "We are redefining what it means to build software. With an autonomous, intelligent partner that remembers everything and learns continuously, the only question left is: What will your Virtual Me build next?",
        image: "/S9 What will your virtual me build next.png"
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
        image: "/PA/1 Virtual Me Agentic Workflow.png"
      },
      {
        title: "2. Active vs Searchable Tokens",
        text: "The foundation of our system is how we handle context. Traditional models struggle with large context windows due to cost and latency. We solve this by bridging a 200K hot active token window with a massive 2.5 Billion searchable token database, giving the AI exactly what it needs, when it needs it.",
        image: "/PA/4 200K hot active token vs 2.5B searchable token.png"
      },
      {
        title: "3. Orchestration Engine",
        text: "This data flow is managed by the Virtual Memory Engine Orchestration Engine. It acts as the brain of the operation, coordinating between long-term storage, active context, and the various specialized agents that perform the actual development work.",
        image: "/PA/5 VME Orchestration Engine.png"
      },
      {
        title: "4. Real-Time Streaming",
        text: "Communication between the AI and the developer happens in real-time. We use Server-Sent Events to stream logs, code generation progress, and system updates directly to the client interface. You never have to wonder what the AI is doing; you see it happening live.",
        image: "/PA/6 Server-Sent Events.png"
      },
      {
        title: "5. Execution Loop",
        text: "Our core execution loop follows four distinct phases: Plan, Approve, Execute, and Evaluate. This structured approach ensures that the AI doesn't just blindly write code, but follows a rigorous software engineering methodology.",
        image: "/PA/7 Plan, Approve, Execute, Evaluate.png"
      },
      {
        title: "6. Planning Phase",
        text: "During the planning phase, the system formulates detailed execution plans. It breaks down high-level feature requests into discrete, actionable steps, analyzing dependencies and determining the optimal sequence of operations.",
        image: "/PA/8 Formulates plans.png"
      },
      {
        title: "7. Human-in-the-Loop",
        text: "Notice this crucial step: this is our Human-in-the-loop safety mechanism. The AI proposes the plan, but it cannot proceed until a human developer reviews it. This guarantees that architectural decisions always align with your vision.",
        image: "/PA/9 Notice this is our Human in-the-loop safety mechanism.png"
      },
      {
        title: "8. Approved & Signed",
        text: "Once the plan is approved and signed off by you, the execution phase begins. The orchestration engine dispatches tasks to specialized coding agents, securely passing along the approved context and instructions.",
        image: "/PA/10 Approved and Signed.png"
      },
      {
        title: "9. QA & Validation",
        text: "As code is written, our QA Agent steps in. It performs continuous code review and validation, running tests and checking for edge cases. If it detects an issue, it immediately flags it or automatically implements a fix before the code is merged.",
        image: "/PA/11 QA Agent, code review and validation.png"
      },
      {
        title: "10. Day-Dreaming",
        text: "But what happens after the work is done? During idle time, the system enters a Day-Dream state. It reviews the lessons learned from recent tasks, optimizes its approaches, and saves successful patterns as reusable skills for future projects.",
        image: "/PA/12 Day-Dream, Lesson learned, Save as reusable skills.png"
      },
      {
        title: "11. Active Context Dashboard",
        text: "This means your workspace is always up-to-date. The system maintains a dynamic dashboard of active context, open issues, newly acquired skills, and even provides daily standup summaries of what your virtual team has accomplished.",
        image: "/PA/13 Context, active issues, skills, daily standups.png"
      },
      {
        title: "12. Workspace Vision",
        text: "Our ultimate workspace vision goes beyond simple automation. We are building an environment that supports time-travel debugging and the instantiation of entirely virtual teams. Virtual Me isn't just an assistant; it's the future of collaborative software engineering.",
        image: "/PA/14 Workspace Vision, Time-Travel Debugging and Virtual Teams.png"
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
        image: "/PT/T1 Virttual Me Workspace.png"
      },
      {
        title: "2. The Cognitive Disconnect",
        text: "The core problem we are solving is the disconnect between human memory and AI context. Developers carry immense project knowledge in their heads, while AI models start fresh every session. Our system bridges this gap permanently.",
        image: "/PT/T2 bridge human memory and context.png"
      },
      {
        title: "3. Aligning Memory & Skills",
        text: "This memory bridge aligns human memory with AI context windows. By capturing your decisions, preferences, and project history, the AI understands your unique coding style and architectural goals, streamlining your daily tasks automatically.",
        image: "/PT/T3 memory bridge, Aligns Human memory with AI contxt windows and skills to streamline daily tasks.png"
      },
      {
        title: "4. Dual-Storage Architecture",
        text: "To achieve this securely and efficiently, we utilize a dual-storage approach. We leverage Local SQLite for lightning-fast, on-device caching of immediate tasks, synced perfectly with a scalable Firestore NoSQL memory bank for global, long-term persistence.",
        image: "/PT/T4 Local SQLite vs Firestore NoSQL memory bank.png"
      },
      {
        title: "5. Time-Travel Debugging",
        text: "When traditional AI forgets context, productivity halts. Our platform doesn't just remember; it allows you to instantiate entire virtual teams with specific memory contexts. You can even perform time-travel debugging, rolling back the AI's state to understand exactly why a decision was made.",
        image: "/PT/T5 Forgets context, Instantiate virtual teams, memory context, and perform time-travel debugging.png"
      },
      {
        title: "6. Amplifying Capabilities",
        text: "These capabilities power our core workspace features. From intelligent issue tracking to automated code reviews and proactive architectural suggestions, the workspace is designed to amplify your capabilities, not just automate your keystrokes.",
        image: "/PT/T6 Core workspace features.png"
      },
      {
        title: "7. Specialized Agents",
        text: "The heavy lifting is distributed among specialized agents: the Planner, the Executor, and the General Assistant. Working in concert, they analyze requirements, draft code, and handle mundane tasks, allowing you to focus on the big picture.",
        image: "/PT/T7 Planner, Executor, GA.png"
      },
      {
        title: "8. RAG Context Assembly",
        text: "All of this is fueled by our advanced RAG Context Assembly. We dynamically retrieve only the most relevant snippets from your vast project history, ensuring the AI's context window is filled with highly targeted, actionable information.",
        image: "/PT/T8 RAG Context Assembly.png"
      },
      {
        title: "9. Your Digital Twin",
        text: "Ultimately, Virtual Me acts as an active, collaborative digital twin. It learns from you, works with you, and scales your output exponentially. It's not just a tool; it's your dedicated engineering partner for the future.",
        image: "/PT/T9 Virtual Me acts as an active collaborative digital twin.png"
      }
    ]
  }
];`

// Replace the old PITCHES array with the new one
const startIndex = code.indexOf('const PITCHES = [');
const endIndex = code.indexOf('];', startIndex) + 2;

code = code.substring(0, startIndex) + newPitches + code.substring(endIndex);

fs.writeFileSync('src/components/SelfDemo.tsx', code);
