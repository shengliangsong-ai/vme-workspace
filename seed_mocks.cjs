const fs = require('fs');

const dbPath = '.local-db.json';
let db = { "workspaces/default": {} };
try {
  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
} catch (e) {}

const state = db["workspaces/default"] || {};

if (!state.standups) state.standups = [];
if (!state.issues) state.issues = [];

const standups = [
  {
    id: "standup-2",
    date: "2026-08-30",
    today: "Populated mock data for standups and active workspace to prepare for the final demo pitch.",
    tomorrow: "Record the demo video and finalize the Virtual Teams instantiation workflows.",
    blockers: "None. Memory bank sync is stable.",
    createdAt: Date.now()
  },
  {
    id: "standup-1",
    date: "2026-08-29",
    today: "Optimized payload assets by resizing PNGs and converting to JPGs to fix Cloud Run deployment issues.",
    tomorrow: "Integrate Human-in-the-loop safety approvals into the CI/CD pipeline.",
    blockers: "Cloud Run upload limit was hitting RESOURCE_EXHAUSTED.",
    createdAt: Date.now() - 86400000
  }
];

const issues = [
  {
    id: "issue-1",
    title: "Implement Multi-Agent Synchronization",
    description: "We need the Planner, Executor, and QA agents to share the same local SQLite context block during execution. Right now they are overwriting each other's state.",
    createdAt: Date.now() - 100000,
    updatedAt: Date.now(),
    status: 'open',
    type: 'feature',
    steps: [
      { id: "step-1-1", title: "Define agent roles and context boundaries", isCompleted: true, content: "Roles defined in `VirtualTeams.tsx`." },
      { id: "step-1-2", title: "Create shared memory bank schema", isCompleted: false, content: "" },
      { id: "step-1-3", title: "Implement pub/sub for agent communication", isCompleted: false, content: "" }
    ],
    linkedSkills: ["skill-1"],
    contextSummary: "The agents are instantiated correctly but lack a unified memory context."
  },
  {
    id: "issue-2",
    title: "Memory limit exceeded on RAG Context Assembly",
    description: "When generating the context summary for large workspaces (>2GB), the Evaluator Agent throws a memory heap error.",
    createdAt: Date.now() - 200000,
    updatedAt: Date.now(),
    status: 'open',
    type: 'bug',
    steps: [
      { id: "step-2-1", title: "Analyze Node.js heap dump", isCompleted: true, content: "Found a memory leak in the markdown parser." },
      { id: "step-2-2", title: "Implement chunking for markdown files", isCompleted: false, content: "" },
      { id: "step-2-3", title: "Test against 10GB dataset in Firestore NoSQL", isCompleted: false, content: "" }
    ],
    linkedSkills: ["Publish Payload Asset Optimization"],
    contextSummary: "We can probably use the same asset optimization strategy for RAG text chunks."
  }
];

state.standups = [...standups, ...state.standups];
state.issues = [...issues, ...state.issues];
db["workspaces/default"] = state;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
