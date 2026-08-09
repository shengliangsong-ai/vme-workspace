# Virtual Me (vme) - Hackathon Execution Plan

**Objective:** Complete the "Virtual Me" agentic workspace for the *All Things Agentic Hackathon* in 14 days, reserving the final 7 days for testing, polishing, and submission preparation.

## Phase 1: Cloud Migration & Infrastructure (Days 1-3)
- **Day 1: Project Setup & Cloud Run Initialization**
  - Containerize the current Express + React application.
  - Set up CI/CD or manual deployment pipeline to Google Cloud Run.
  - Ensure scale-to-zero configuration is functional.
- **Day 2: Database Migration (Firestore)**
  - Replace local SQLite (`vme.db`) with Google Cloud Firestore.
  - Update data models in `src/types.ts` and Express backend for Issues, Skills, Standups, and Blogs to sync with Firestore.
- **Day 3: Base Genkit Integration**
  - Initialize Genkit in the Node.js backend.
  - Set up Gemini API routing through Genkit for basic chat/completion capabilities.

## Phase 2: Memory & Context (The Collaborative Partner) (Days 4-6)
- **Day 4: Memory Bank Architecture**
  - Implement Firestore as the agent's long-term Memory Bank.
  - Ensure session state persists across page reloads and agent invocations.
- **Day 5: Vector Search Integration**
  - Generate embeddings for Workspace data (Skills, architectural decisions, past issues).
  - Implement semantic recall so the agent can reference past context autonomously.
- **Day 6: Contextual Agent Actions**
  - Test the agent's ability to answer questions based on the developer's specific tech stack and past blog entries.

## Phase 3: Autonomous Workflows (The Taskmaster) (Days 7-10)
- **Day 7: ADK & Antigravity SDK Setup**
  - Integrate the Agent Development Kit (ADK) and Antigravity SDK.
  - Migrate the mocked `qsub` queue to a real event-driven queue triggering agent workflows.
- **Day 8: Long-Running Persistent Workflows**
  - Implement background execution for complex tasks (e.g., code analysis, log parsing).
  - Add crash recovery and idempotency guarantees for these workflows.
- **Day 9: Human-in-the-Loop & Streaming**
  - Add a human approval pause for sensitive actions (e.g., applying refactoring directly to the codebase).
  - Implement real-time terminal output streaming from the agent to the React frontend.
- **Day 10: Multi-Agent Orchestration Teams**
  - Refactor a complex workflow to use ADK 2 multi-agent patterns.
  - Implement a Planner Agent, Executor Agent, and QA Reviewer Agent.

## Phase 4: Self-Evolution & Polish (Days 11-14)
- **Day 11: Autonomous Self-Improvement**
  - Implement an agent feedback loop where the agent reviews its own execution logs.
  - Allow the agent to suggest updates to its own "Skills" or instructions in Firestore.
- **Day 12: UI/UX Refinement**
  - Polish the React & Tailwind UI.
  - Ensure the Job Queue dashboard clearly displays agent states, thinking processes, and memory retrieval events.
- **Day 13: Edge Case Handling & Security**
  - Add error handling for Cloud Run timeouts.
  - Ensure data security and user context isolation (if transitioning to multi-user, otherwise secure single-tenant).
- **Day 14: End-to-End Integration Testing**
  - Run full workflows: Queuing a job -> multi-agent execution -> context recall -> task completion -> human approval.

## Phase 5: Final Testing & Submission (Days 15-21)
- **Day 15: Alpha Testing**
  - Dogfood the application for daily tasks (use it to build itself).
- **Day 16-17: QA & Bug Fixing**
  - Address issues found during dogfooding.
  - Optimize prompt engineering and Genkit tracing.
- **Day 18: Demo Video Production**
  - Record a high-quality demo video highlighting The Collaborative Partner and Taskmaster track requirements.
- **Day 19: Documentation & Devpost Page**
  - Write a comprehensive Devpost submission, including architecture diagrams, tech stack overview, and setup instructions.
- **Day 20: Final Polish & Buffer**
  - Final code cleanup and deployment check.
- **Day 21: Submission**
  - Submit the project to Devpost ahead of the deadline!
