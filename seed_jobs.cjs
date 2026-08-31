const fs = require('fs');

const dbPath = '.local-db.json';
let db = { "workspaces/default": {} };
try {
  if (fs.existsSync(dbPath)) {
    db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
} catch (e) {}

const state = db["workspaces/default"] || {};

if (!state.jobs) state.jobs = [];

const now = Date.now();

const newJobs = [
  {
    id: "job-run-1",
    command: "RAG_index --target=./src --mode=deep",
    timeoutMs: 300000,
    status: "running",
    createdAt: now - 15000,
    startedAt: now - 10000,
    log: "> RAG_index --target=./src --mode=deep\n[System] Initializing RAG Context Assembly...\n[System] Connecting to Firestore NoSQL global memory bank...\n[System] Found 142 files in ./src\n[Index] Chunking markdown and TSX files...\n[Index] Generating vector embeddings (Progress: 45%)...\n"
  },
  {
    id: "job-comp-1",
    command: "evaluate_skill --name=\"Publish Payload Asset Optimization\"",
    timeoutMs: 60000,
    status: "completed",
    createdAt: now - 3600000,
    startedAt: now - 3590000,
    completedAt: now - 3580000,
    log: "> evaluate_skill --name=\"Publish Payload Asset Optimization\"\n[Evaluator Agent] Day-dream state activated.\n[Evaluator Agent] Reviewing skill instructions...\n[Evaluator Agent] Skill format is strictly valid (Human/AI split detected).\n[System] Evaluation passed. Skill successfully cached into active memory."
  },
  {
    id: "job-fail-1",
    command: "rollback_state --timestamp=\"2026-08-28T12:00:00Z\"",
    timeoutMs: 120000,
    status: "failed",
    createdAt: now - 86400000,
    startedAt: now - 86395000,
    completedAt: now - 86390000,
    log: "> rollback_state --timestamp=\"2026-08-28T12:00:00Z\"\n[Time-Travel Debugger] Initiating context rollback...\n[Error] Snapshot not found for timestamp 2026-08-28T12:00:00Z.\n[System] Fatal Error: Cannot restore team context from non-existent state hash."
  },
  {
    id: "job-queue-1",
    command: "QA_Agent --run_validation --target=\"VirtualTeams.tsx\"",
    timeoutMs: 60000,
    status: "queued",
    createdAt: now - 5000,
    log: ""
  },
  {
    id: "job-queue-2",
    command: "Planner_Agent --generate_sprint_plan --issue_id=\"issue-1\"",
    timeoutMs: 120000,
    status: "queued",
    createdAt: now - 2000,
    log: ""
  },
  {
    id: "job-cancel-1",
    command: "sync_github --force",
    timeoutMs: 30000,
    status: "cancelled",
    createdAt: now - 7200000,
    startedAt: now - 7195000,
    completedAt: now - 7190000,
    log: "> sync_github --force\n[System] Connecting to remote repository...\nJob cancelled by user."
  }
];

// Insert the new jobs at the beginning of the list to show up at the top
state.jobs = [...newJobs, ...state.jobs];
db["workspaces/default"] = state;

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
