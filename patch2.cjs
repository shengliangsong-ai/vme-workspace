const fs = require('fs');
let code = fs.readFileSync('src/components/SelfDemo.tsx', 'utf8');

// I'll replace the entire DEMO_SCRIPT array.
const newScript = `const DEMO_SCRIPT = [
  {
    title: "1. Introduction",
    action: "Action: Start on the Dashboard tab.",
    text: "Welcome to Virtual Me (VME), an AI-powered personal developer workspace. VME is designed to act as your autonomous coding assistant, managing issues, tracking standups, and running background jobs. It uses a robust Multi-Agent architecture powered by Gemini to automate complex tasks while keeping you in complete control.",
    image: "/3 Human vs Virtual Me, Team.png"
  },
  {
    title: "2. Context & Issues",
    action: "Action: Click on the Workspace (Issues) tab. Show the current issues or create a quick mock issue. Click on the Skills tab briefly to show existing knowledge.",
    text: "Standard AI models have limited context windows. VME solves this by maintaining long-term memory through Issues, Skills, and persistent logs. This provides our agents with the rich, deep context they need to make intelligent decisions that align perfectly with our specific project's history.",
    image: "/2 How to give AI persistent memory cheaply.png"
  },
  {
    title: "3. Multi-Agent Orchestration: The Planner",
    action: "Action: Go to the Queue (qsub) tab. Click the \\"Demo: Orchestrate\\" button.",
    text: "Let's see the multi-agent system in action. I'm submitting an orchestration job to redesign our database schema. Instead of just blind execution, VME routes this to our Planner Agent. The Planner analyzes the request, fetches deep context from our workspace, and formulates a step-by-step execution plan.",
    image: "/S3 Analyze, Ftech, Plan.png"
  },
  {
    title: "3. Multi-Agent Orchestration: Human-in-the-Loop",
    action: "Action: Wait for the plan to stream in. Point out the 'Awaiting Approval' status.",
    text: "Notice that the job is now 'Awaiting Approval'. This is our Human-in-the-Loop safety mechanism. As developers, we review the agent's proposed plan before any destructive actions or complex code generation takes place.",
    image: "/S4 Approve, Receive plan, generate code, stream logs.png"
  },
  {
    title: "4. Execution",
    action: "Action: Click the green \\"Approve\\" button on the job.",
    text: "Once I approve the plan, the job is handed off to the Executor Agent. The Executor takes the exact approved plan and begins generating the code and performing the necessary steps. You can see the logs streaming back in real-time as the agent works autonomously.",
    image: "/15 How is really coding when AI acts autonomously.png"
  },
  {
    title: "5. Self-Improvement & Personalized Skills",
    action: "Action: Once the execution is complete, click the \\"Run Self-Improvement\\" button.",
    text: "What makes VME truly agentic is its ability to learn and fine-tune itself to you as an individual. Every day, the Evaluator Agent reviews your daily activity and execution logs, identifies what went right or wrong, and builds personalized skills.",
    image: "/S5 multi-agent system, Steps, New Skills.png"
  },
  {
    title: "5. Self-Improvement (Cont.)",
    action: "Action: Watch the Evaluator generate the JSON. Then navigate to the Skills tab.",
    text: "The Evaluator automatically saves these learned skills and memories to the database. Through this continuous self-evaluation, your Virtual Me gets smarter and better over time—creating a highly personalized, fine-tuned context for future execution.",
    image: "/S6 Evaluator Outputs.png"
  },
  {
    title: "6. Conclusion & Future Vision",
    action: "Action: Switch to the Blog & Lessons Learned tab, explicitly highlighting the 'Welcome Judges' post.",
    text: "In summary, Virtual Me automates development safely and continuously improves itself. But our long-term vision is much bigger. Virtual Me is designed to become the global standard for 'Smart Context'—an integral extension to top-tier AI models. Using a 2 Million token window is expensive. Virtual Me cuts costs by dynamically routing only relevant history into a cheaper 200K 'hot token' window. And because 1 Million tokens is just 4 Megabytes of data, attaching a simple 10-Gigabyte database gives our model 2.5 Billion tokens of persistent memory. We aren't just scaling up 1000x—we are providing virtually unlimited, cost-effective smart context. Thank you for watching!",
    image: "/S7 10GB storage, 2.5B searchable token.png"
  },
  {
    title: "7. What will you build?",
    action: "Action: Fade to black.",
    text: "Thank you for watching.",
    image: "/S9 What will your virtual me build next?.png"
  }
];`;

code = code.replace(/const DEMO_SCRIPT = \[[\s\S]*?\];/, newScript);
fs.writeFileSync('src/components/SelfDemo.tsx', code);
